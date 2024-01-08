// index.js
import { setGlobalConfig } from "./config/blog.config.js";
import * as blogController from "./controllers/blog.controller.js";

export const configureBlogDependency = (config) => {
   setGlobalConfig(config);
};

export { blogController };
