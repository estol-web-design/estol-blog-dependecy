// blog.config.js
import mongoose from "mongoose";
import DefaultPost from "../models/post.model";

let globalConfig = {
   databaseURL: null,
   PostModel: null,
};

export const setGlobalConfig = (config) => {
   globalConfig.databaseURL = config.databaseURL;
   globalConfig.PostModel = config.databaseURL ? DefaultPost : config.model;
};

export const getGlobalConfig = () => globalConfig;

export const connectToDatabase = () => {
   const { databaseURL } = getGlobalConfig();

   if (!databaseURL) {
      console.log('Database URL not provided. Using estol-blog-dependency without database connection.');
      return;
   }

   mongoose
      .connect(databaseURL)
      .then(() => {
         console.log("estol-blog-dependency connected to database");
         return mongoose;
      })
      .catch((err) => console.error(`estol-blog-dependency failed to connect to database`, err));
};
