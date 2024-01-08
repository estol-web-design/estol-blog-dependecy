// blog.config.js
import EventEmitter from "events";
import createSchema from "../models/post.model.js";

const configEmitter = new EventEmitter();

export let globalConfig = {
   PostModel: undefined,
   mongoose: undefined,
};

export const setGlobalConfig = async ({model, mongoose}) => {
   const config = {
      mongoose: mongoose || null,
      PostModel: mongoose ? createSchema(mongoose) : model
   }

   updateConfig(config);
};

const getConfig = () => globalConfig;

const updateConfig = (newConfig) => {
   globalConfig = {...globalConfig, ...newConfig};
   configEmitter.emit("update", globalConfig);
}

export { configEmitter, getConfig };
