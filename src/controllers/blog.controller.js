import * as blogService from "../services/blog.service.js";

const capitalizeFirstLetter = (text) => {
   const lowerCaseText = text.toLowerCase();
   const capitalFirstLetter = lowerCaseText.charAt(0).toUpperCase();
   const formatedText = `${capitalFirstLetter}${lowerCaseText.slice(1)}`;

   return formatedText;
};

const allowedSearchTypes = ["All", "Last", "Trending", "One", "Search"];
const allowedActions = ["create", "update", "delete"];

export const getPosts = async ({ searchType = "Last", model, fieldsToPopulate, useLean, flag, quantity, id, searchStr }) => {
   try {
      const type = capitalizeFirstLetter(searchType);

      if (!allowedSearchTypes.includes(type)) {
         return { success: false, message: `Invalid search type. This dependency only accepts this search types at the moment: "${allowedSearchTypes.join(", ")}"`, code: 400 };
      }

      const { success, posts, post, code, message, newFlag } = await blogService[`get${type}Posts`]({ model, fieldsToPopulate, useLean, originalQuantity: quantity, flag, id, searchStr });

      if (success) {
         const returnObj = { success, code, ...(newFlag && { flag: newFlag }) };

         if (type === "One") {
            returnObj.post = post;
         } else {
            returnObj.posts = posts;
         }

         return returnObj;
      } else {
         return { success, code, message };
      }
   } catch (err) {
      return err;
   }
};

export const postManagement = async ({ action, model, fieldsToPopulate, newPost, updateData, id, useLean }) => {
   try {
      const formatedAction = action.toLowerCase();

      if (!allowedActions.includes(formatedAction)) {
         return { success: false, message: `Invalid action. This dependency only accepts this actions at the moment: ${allowedActions.join(", ")}`, code: 400 };
      }

      const { success, message, code, newPostID, oldPost, deletedPost } = await blogService[`${formatedAction}Post`]({ model, newPost, fieldsToPopulate, updateData, id, useLean });

      if (success) {
         const returnObj = { success, code };
         if (formatedAction === "create") {
            const createdPost = await blogService.getOnePost({model, fieldsToPopulate, useLean, id: newPostID});
            returnObj.createdPost = createdPost;
         } else if (formatedAction === "update") {
            const updatedPost = await blogService.getOnePost({model, fieldsToPopulate, useLean, id: oldPost._id});
            returnObj.updatedPost = updatedPost;
         } else {
            returnObj.deletedPost = deletedPost;
         }

         return returnObj;
      } else {
         return { success, code, message };
      }
   } catch (err) {
      return err;
   }
};
