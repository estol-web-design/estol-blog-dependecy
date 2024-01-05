// index.js
import { connectToDatabase, getGlobalConfig, setGlobalConfig } from "./config/blog.config.js";
import * as blogController from "./controllers/blog.controller.js";

const { databaseURL } = getGlobalConfig();

if (databaseURL) {
   connectToDatabase();
}

export const configureBlogDependency = (config) => {
   setGlobalConfig(config);
};

export { blogController };
