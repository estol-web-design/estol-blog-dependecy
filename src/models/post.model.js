import { Schema, model } from "mongoose";
const { ObjectId } = Schema.Types;

const defaultPostSchema = new Schema(
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

const DefaultPost = model("DefaultPost", defaultPostSchema);

export default DefaultPost;
