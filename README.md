# estol-blog

`estol-blog` is a Node.js dependency for managing blog-related operations.

## Installation

To use `estol-blog` in your Node.js project, you can install it using npm:

```bash
npm install estol-blog
```

## Usage

### Importing and initializing

```javascript
import { configureBlogDependency, blogController } from "estol-blog";

// Configure the dependency with your database URL
configureBlogDependency({
   databaseURL: "your-database-url",
   model: YourPostModel, // Replace YourPostModel with your Mongoose model
});

// Access blogController for various blog management operations
const { getPosts, postManagement } = blogController;
```

### Usage example

#### Getting posts

```javascript
const posts = await getPosts({ searchType: "Last", fieldsToPopulate: ["author"], quantity: 5 });
console.log(posts);

// posts is going to have this structure

// if error
{
   success: false, 
   message: "", //error message
   code: 500, //error statusCode
   error: error, //sometimes will include a complete error object including errorStack
}

// if success
{
   success: true,
   posts: [], //an array with found posts
   message: "", //sometimes will include a message string 
   code: 200, // statusCode for more clarification
}
```

#### Post management

```javascript
const newPostData = {
  author: // Should be the ObjectId of the author in the User model,
  title: 'New Blog Post',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
};

const createPostResult = await postManagement({ action: 'create', newPost: newPostData });
console.log(createPostResult);

// createPostResult is going to have this structure

// if error
{
   success: false, 
   message: "", //error message
   code: 500, //error statusCode
   error: error, //sometimes will include a complete error object including errorStack
}

// if success
{
   success: true,
   createdPost: {}, //an object with the new post document data from de DB
   code: 201, // statusCode for more clarification
}

```

**Note**: Please replace `// Should be the ObjectId of the author in the User model` with the actual ObjectId of the author in your User model. This adjustment ensures that the "author" field is correctly represented as an ObjectId, maintaining the integrity of the data model.

## Configuration

estol-blog uses Mongoose for database interactions. Make sure to have Mongoose installed and configured in your project.

## API Reference

### `configureBlogDependency(config)`

Configures the `estol-blog` dependency with the provided configuration.

-  `config`: An object containing the configuration options. It should have either a `databaseURL` or a `model`, but not both.

   -  `databaseURL`: The URL of the database to connect to. If provided, the dependency will use its own default model for blog posts.

   -  `model`: The Mongoose model instance from the user's project. If provided, the dependency will use the user's Mongoose model for blog posts.

**Note**: The user must provide either `databaseURL` or `model`, not both. If `databaseURL` is provided, the dependency connects to the database using its default model. If `model` is provided, the dependency uses the user's Mongoose model. It's mandatory to provide one of the two options; providing both is not allowed.

**Important**: If the user decides to provide a model, it is important that this model has at least the same fields in the default model(author, title, content and views) to avoid dependency's malfunctions.

### Default Model

If the user chooses to use the default model provided by the `estol-blog` dependency, the model looks like this:

```javascript
// post.model.js
import { Schema, model } from "mongoose";
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

export default Post;
```

**Important**: If you opt to use the default model, it's crucial to ensure that your project includes a Mongoose model for "User" to prevent errors. The "author" field in the default blog post model references the "User" model. If the "User" model is not defined in your project, it may lead to reference errors. Please make sure that the "User" model is available in your project to maintain the integrity of the default blog post model.

## `blogController`

A set of functions for managing blog-related operations.

### `getPosts(options)`

Retrieve blog posts based on specified options.

#### Options

The `options` object can include several properties:

-  `searchType`: Should be a string referring to the type of search to be performed. The available options are:

   -  `"All"`: Retrieve all the posts stored in the blog.
   -  `"Last"`: Retrieve posts in chronological order from the newest to the oldest.
   -  `"Trending"`: Retrieve posts ordered by views, from most viewed to least viewed.
   -  `"One"`: Retrieve a specific post by providing a `postID`.
   -  `"Search"`: Search for posts by providing a search string (`searchStr`).

-  `fieldsToPopulate`: Should be an array of strings containing the names of all the fields of the model to be populated.

-  `useLean`: An optional boolean property. By default, this field is set to `true` unless the dependency user needs to receive the complete model instance. In that case, the user should set this property as `useLean: false`, and the dependency will return a complete model instance instead of a plain JavaScript object.

-  `flag`: An optional string property representing a date to facilitate pagination. When requesting the first page (e.g., using `"searchType: 'Last'"`), this property is not necessary to include. The dependency will include the flag for the next page in the returned object after the first page. The user only needs to include this flag in the next request.

-  `quantity`: An optional property determining the extent of each page. If not provided, by default, each call will return a maximum of 10 posts.

-  `id`: A mandatory property only in the case of requesting a specific post. This property is used by the dependency to perform a search in the database.

-  `searchStr`: A mandatory property only if `searchType` prop is set as `"Search"`. In this case, the dependency will search for all occurrences of that search string (`searchStr`) in the title and content of all blogs in the database.

### `postManagement(options)`

Perform blog post management actions like creating, updating, or deleting posts.

#### Options

The `options` object can include several properties:

-  `action`: A mandatory string property that can have a value of `"create"`, `"update"`, or `"delete"`, depending on the action to be carried out.

-  `fieldsToPopulate`: Should be an array of strings containing the names of all the fields of the model to be populated.

-  `newPost`: A mandatory property when the `action` property is set to `"create"`. The `newPost` property will be an object containing all the information for the new post (author, title, and content in case the dependency's default model is used).

-  `updateData`: A mandatory property in case the `action` property is set to `"update"`. The `updateData` property will be an object containing the information to be updated in the post. In this case, it is not necessary to provide all the fields, only those to be updated.

-  `id`: A mandatory property in case the `action` property is set to `"update"` or `"delete"`. This property is used by the dependency to identify the post in the database that needs to be updated or deleted.

-  `useLean`: An optional boolean property. By default, this field is set to `true` unless the dependency user needs to receive the complete model instance. In that case, the user should set this property as `useLean: false`, and the dependency will return a complete model instance instead of a plain JavaScript object.

**Note**: Ensure consistency in the naming convention of properties, using `camelCase` throughout the `options` object.

## Licence

This project is licensed under the MIT License - see the LICENSE.md file for details.

```vbnet

Make sure to replace placeholders like `'your-database-url'`, `YourPostModel`, and adjust the code snippets based on your actual implementation and use case.

```
