// validatePosts.js
export const validateNewPostData = (newPost) => {
   const { author, title, content } = newPost;
   const missingParameters = [];

   if (!author) missingParameters.push("author");
   if (!title) missingParameters.push("title");
   if (!content) missingParameters.push("content");

   if (missingParameters.length > 0) {
      return { success: false, message: `Missing required parameter(s): "${missingParameters.join(" ")}"` };
   }

   const paramsWithInvalidValue = [];

   if (typeof author !== "string") paramsWithInvalidValue.push("author");
   if (typeof title !== "string") paramsWithInvalidValue.push("title");
   if (typeof content !== "string") paramsWithInvalidValue.push("content");

   if (paramsWithInvalidValue.length > 0) {
      return { success: false, message: `Required parameter(s) with invalid value: "${paramsWithInvalidValue.join(" ")}".\n All parameters must be strings and have at least one character` };
   }

   return { success: true, message: `All parameters were validated.` };
};

export const validateUpdatePostData = (updatedData) => {
   const { author, title, content } = updatedData;

   const paramsWithInvalidValue = [];

   if (author?.length > 0 && typeof author !== "string") paramsWithInvalidValue.push("author");
   if (title?.length > 0 && typeof title !== "string") paramsWithInvalidValue.push("title");
   if (content?.length > 0 && typeof content !== "string") paramsWithInvalidValue.push("content");

   if (paramsWithInvalidValue.length > 0) {
      return { success: false, message: `Parameter(s) with invalid value: "${paramsWithInvalidValue.join(" ")}".\n All parameters must be strings and have at least one character` };
   }

   return { success: true, message: `All parameters were validated.` };
};
