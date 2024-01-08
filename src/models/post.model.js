// post.model.js
import { Schema, model } from "mongoose";
const { ObjectId } = Schema.Types;

function createSchema() {
   const postSchema = new Schema(
      {
         author: { type: ObjectId, ref: "User", required: true },
         title: { type: String, required: true },
         content: { type: String, required: true },
         views: { type: Number, default: 0 },
      },
      {
         timestamps: true,
      }
   );
   
   const Post = model("Post", postSchema);

   return Post
}


export default createSchema;
