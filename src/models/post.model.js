// post.model.js

function createSchema(mongoose) {
   const { Schema, model } = mongoose;
   const { ObjectId } = Schema.Types;

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
