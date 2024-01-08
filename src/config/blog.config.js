// blog.config.js
import mongoose from "mongoose";
import EventEmitter from "events";
import createSchema from "../models/post.model.js";

const configEmitter = new EventEmitter();

export let globalConfig = {
   databaseURL: undefined,
   PostModel: undefined,
};

export const setGlobalConfig = async ({databaseURL, model}) => {
   const config = {
      databaseURL: databaseURL || null,
      PostModel: databaseURL ? createSchema() : model
   }

   updateConfig(config);

   if (getConfig().databaseURL) {
      mongoose
         .connect(getConfig().databaseURL)
         .then(() => {
            console.log("estol-blog dependency connected to database");
         })
         .catch((err) => console.error(`estol-blog dependency failed to connect to database`, err));
      
   }
};

const getConfig = () => globalConfig;

const updateConfig = (newConfig) => {
   globalConfig = {...globalConfig, ...newConfig};
   configEmitter.emit("update", globalConfig);
}

export { configEmitter, getConfig };
