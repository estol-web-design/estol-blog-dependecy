// index.js
import { setGlobalConfig } from "./config/blog.config.js";
import blogController from "./controllers/blog.controller.js";

export const configureBlogDependency = (config) => {
   setGlobalConfig(config);
};

export default blogController;
