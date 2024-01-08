// blog.service.js
import createDOMPurify from 'dompurify';
import { JSDOM } from "jsdom";
import { validateNewPostData, validateUpdatePostData } from "../utils/validatePosts.js";
import { configEmitter, getConfig } from 'estol-blog/src/config/blog.config.js';

let Post = getConfig().PostModel;
let defaultPostModel = false;

configEmitter.on("update", ({databaseURL, PostModel}) => {
   Post = PostModel;
   if (databaseURL) {
      defaultPostModel = true;
   }
});

export const getAllPosts = async ({ fieldsToPopulate = [], useLean = true }) => {
   try {
      // Initializing search query
      let query = Post.find();

      // Check if the user needs to populate any fields and perform population
      if (fieldsToPopulate.length > 0) {
         query.populate(fieldsToPopulate.join(" "));
      }

      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const posts = !useLean ? await query : await query.lean();

      if (posts.length < 1) {
         return { success: false, message: "No post found", code: 404 };
      }

      // Return the found posts to the user
      return { success: true, posts, code: 200 };
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const getLastPosts = async ({ fieldsToPopulate = [], originalQuantity = null, flag = null, useLean = true }) => {
   // Check if original quantity parameter is valid. If it's not valid assign default value
   const quantity = typeof originalQuantity === "number" && originalQuantity > 0 ? originalQuantity : 10;

   try {
      // Create DateFlag for search query
      const dateFlag = flag ? new Date(flag) : new Date();

      // Create an object with search parameters
      const searchParams = { createdAt: { $lt: dateFlag } };

      // Initialize search query with sort and limit methods
      let query = Post.find(searchParams).sort("-createdAt").limit(quantity);

      // Check if the user needs to populate any fields and perform population
      if (fieldsToPopulate.length > 0) {
         query = query.populate(fieldsToPopulate.join(" "));
      }

      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const posts = !useLean ? await query : await query.lean();

      // Send an error message if no posts were found
      if (posts.length < 1) {
         return { success: false, message: "No post found", code: 404 };
      }

      const newFlag = posts[posts.length - 1].createdAt;
      
      // Object to return
      const returnObj = { success: true, posts, code: 200, newFlag };
      
      // Check if quantity parameter provided by the user is an invalid number, and add a message to the object to return
      if (typeof originalQuantity === "number" && originalQuantity < 1) {
         returnObj.message = `Invalid value of ${originalQuantity} assigned to quantity parameter, returning 10 posts by default.`;
      }
      
      return returnObj;
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const getTrendingPosts = async ({  fieldsToPopulate = [], originalQuantity = null, useLean = true }) => {
   // Check if original quantity parameter is valid. If it's not valid assign default value
   const quantity = typeof originalQuantity === "number" && originalQuantity > 0 ? originalQuantity : 10;

   try {
      // Initialize search query with sort and limit methods
      let query = Post.find().sort("-views").limit(quantity);

      // Check if the user needs to populate any fields and perform population
      if (fieldsToPopulate.length > 0) {
         query = query.populate(fieldsToPopulate.join(" "));
      }

      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const posts = !useLean ? await query : await query.lean();

      // Send an error message if no posts were found
      if (posts.length < 1) {
         return { success: false, message: "No post found", code: 400 };
      }

      // Object to return
      const returnObj = { success: true, posts, code: 200 };

      // Check if quantity parameter provided by the user is an invalid number, and add a message to the object to return
      if (typeof originalQuantity === "number" && originalQuantity < 1) {
         returnObj.message = `Invalid value of ${originalQuantity} assigned to quantity parameter, returning 10 posts by default.`;
      }
      
      return returnObj;
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const searchPosts = async ({ fieldsToPopulate = [], originalQuantity = null, useLean = true, flag = null, searchStr = null }) => {
   // Check if original quantity parameter is valid. If it's not valid assign default value
   const quantity = typeof originalQuantity === "number" && originalQuantity > 0 ? originalQuantity : 10;

   try {
      // Check if search string was provided
      if (!searchStr) {
         return { success: false, message: `No search string ("searchStr" parameter) provided to perform posts search`, code: 400 };
      }

      // Create DateFlag for search query
      const dateFlag = flag ? new Date(flag) : new Date();

      // Create an object with search parameters
      const searchParams = { createdAt: { $lt: dateFlag }, $or: [{ title: { $regex: searchStr, options: "i" } }, { content: searchStr, options: "i" }] };

      // Initialize search query with sort and limit methods
      let query = Post.find(searchParams).sort("-createdAt").limit(quantity);

      // Check if the user needs to populate any fields and perform population
      if (fieldsToPopulate.length > 0) {
         query = query.populate(fieldsToPopulate.join(" "));
      }

      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const posts = !useLean ? await query : await query.lean();

      if (posts.length < 1) {
         return { success: false, message: "No post found", code: 404 };
      }

      // Object to return
      const returnObj = { success: true, posts, code: 200 };

      // Check if quantity parameter provided by the user is an invalid number, and add a message to the object to return
      if (typeof originalQuantity === "number" && originalQuantity < 1) {
         returnObj.message = `Invalid value of "${originalQuantity}" assigned to quantity parameter, returning 10 posts by default.`;
      }

      return returnObj;
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const getOnePost = async ({ fieldsToPopulate = [], useLean = true, id = null }) => {

   // Check if an id was provided to perform post search
   if (!id) {
      return { success: false, message: "No id provided to perform post search", code: 400 };
   }

   // Initialize post search query
   let query = Post.findById(id);

   // Check if the user needs to populate any fields and perform population
   if (fieldsToPopulate.length > 0) {
      query = query.populate(fieldsToPopulate.join(" "));
   }

   try {
      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const post = !useLean ? await query : await query.lean();

      // Check if post was successfully find
      if (!post) {
         return { success: false, message: "Post not found", code: 404 };
      }

      return { success: true, post, code: 200 };
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const createPost = async ({newPost = null }) => {
   try {
      // Check if new post parameters were provided, and if those parameters are valid
      if (!newPost) {
         return { success: false, message: `No post data ("newPost" parameter) provided to create the new post`, code: 400 };
      } else if (defaultPostModel) {
         const validPost = validateNewPostData(newPost);

         if (!validPost.success) {
            return { success: false, message: validPost.message, code: 400 };
         }
      }
      
      const window = new JSDOM('').window;
      const DOMPurify = createDOMPurify(window);

      // Sinitize HTML post's content
      const sanitizedHTML = DOMPurify.sanitize(newPost.content)
      newPost.content = sanitizedHTML;
      
      // Create post with validated parameters
      const createdPost = await Post.create(newPost);
      
      // Verify if post was successfully created
      if (!createdPost) {
         return { success: false, message: "Failed to create new post.", code: 500 };
      }
      
      return { success: true, newPostID: createdPost._id, code: 201 };
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const updatePost = async ({ fieldsToPopulate = [], useLean = true, id = null, updatedData = null }) => {
   try {
      // Check if an id was provided to perform post search
      if (!id) {
         return { success: false, message: "No post ID provided. Please provide a valid post ID to perform the update.", code: 400 };
      }
      
      // Check if update post parameters ("updateData") were provided, and if those parameters are valid
      if (!updatedData) {
         return { success: false, message: `No updeted post data ("updatedData" parameter) provided to update this post`, code: 400 };
      } else if (defaultPostModel) {
         const validData = validateUpdatePostData(updatedData);
         
         if (!validData.success) {
            return { success: false, message: validData.message, code: 400 };
         }
      }
      
      // Sanitize HTML post's content
      let sanitizedHTML;
      if (updatedData.content) {
         sanitizedHTML = DOMPurify.sanitize(updatedData.content);
         updatedData.content = sanitizedHTML;
      }
      
      // Initialize post update query
      let query = Post.findByIdAndUpdate(id, updatedData);
      
      // Check if the user needs to populate any fields and perform population
      if (fieldsToPopulate.length > 0) {
         query = query.populate(fieldsToPopulate.join(" "));
      }
      
      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const oldPost = !useLean ? await query : await query.lean();
      
      // Check if post was successfully updated
      if (!oldPost) {
         return { success: false, message: "Failed to update post", code: 500 };
      }
      
      return { success: true, oldPost, code: 200 };
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};

export const deletePost = async ({ useLean = true, id = null }) => {
   try {
      // Check if an id was provided to perform post search
      if (!id) {
         return { success: false, message: "No post ID provided. Please provide a valid post ID to perform post deletion.", code: 400 };
      }

      // Delete post
      let query = Post.findByIdAndDelete(id);

      // Check if the user needs a complete instance of the model; otherwise, send a plain JavaScript object
      const deletedPost = !useLean ? await query : await query.lean();

      // Check if post was successfully deleted
      if (!deletedPost) {
         return { success: false, message: "Failed to delete this post", code: 500 };
      }

      return { success: true, deletedPost, code: 200 };
   } catch (err) {
      return { success: false, message: err.message, code: 500, error: err };
   }
};
