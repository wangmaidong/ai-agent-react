import { pathJoin } from "@peryl/utils/pathJoin";
import { toArray } from "@peryl/utils/toArray";
import React from "react";
import styled from "@emotion/styled";
import * as EmotionReact from "@emotion/react";

export interface iLibraryLoadConfig {
  name: string,
  globalName?: string,
  dependencies?: string[],
  version: string,
  loader: (() => Promise<any>) | { js?: string[] | string, css?: string[] | string, },
}

export const GLOBAL_NAME = {
  RESOURCE: "__micro_cache_resource__",             // 缓存已经加载过的资源
  RES_FILE: "__micro_cache_resource_file__",        // 缓存已经加载过的资源的文件链接
  SCRIPT: "__micro_cache_script__",                 // 缓存已经执行过的script脚本
  INDEX_CACHE: "__micro_cache_index_config__",      // 缓存子应用的indexConfig
  MAIN_CACHE: "__micro_cache_main_config__",        // 缓存子应用的mainConfig
};

export const LibraryLoader = (() => {

  const Win = window as any;

  const libConfigs: iLibraryLoadConfig[] = [];

  const registry = (libConfig: iLibraryLoadConfig) => {libConfigs.push(libConfig);};

  const loadFile = async (filePath: string) => {
    if (filePath.indexOf("http") !== 0) {
      filePath = pathJoin(__webpack_public_path__, filePath);
    }
    if (!Win[GLOBAL_NAME.RES_FILE]) {Win[GLOBAL_NAME.RES_FILE] = {};}
    if (!Win[GLOBAL_NAME.RES_FILE][filePath]) {
      Win[GLOBAL_NAME.RES_FILE][filePath] = new Promise((resolve, reject) => {
        if (/\.js(\?.*)?/.test(filePath)) {
          const el = Win.document.createElement("script") as HTMLScriptElement;
          el.setAttribute("src", filePath);
          el.onload = resolve;
          el.onerror = reject;
          Win.document.body.appendChild(el);
        } else if (/\.css(\?.*)?/.test(filePath)) {
          const el = Win.document.createElement("link") as HTMLLinkElement;
          el.setAttribute("rel", "stylesheet");
          el.setAttribute("type", "text/css");
          el.setAttribute("href", filePath);
          el.onload = resolve;
          el.onerror = reject;
          Win.document.body.appendChild(el);
        }
      });
    }
    return Win[GLOBAL_NAME.RES_FILE][filePath];
  };

  const load = async (name: string) => {
    if (!Win[GLOBAL_NAME.RESOURCE]) {Win[GLOBAL_NAME.RESOURCE] = {};}
    if (!Win[GLOBAL_NAME.RESOURCE][name]) {
      Win[GLOBAL_NAME.RESOURCE][name] = (async () => {
        const resourceConfig = libConfigs.find(i => i.name === name);
        if (!resourceConfig) {throw new Error(`resource: ${name} is not defined!`);}
        if (!!resourceConfig.dependencies) {await Promise.all(resourceConfig.dependencies.map(i => load(i)));}
        const Module = await (async () => {
          if (typeof resourceConfig.loader === "function") {
            return resourceConfig.loader();
          } else {
            const jsList = toArray(resourceConfig.loader.js || []);
            const cssList = toArray(resourceConfig.loader.css || []);
            await Promise.all([
              ...jsList.map(i => loadFile(i + `?v=${resourceConfig.version}`)),
              ...cssList.map(i => loadFile(i + `?v=${resourceConfig.version}`)),
            ]);
            return Win[resourceConfig.globalName || name];
          }
        })();
        if (!Win[name]) {Win[name] = Module;}
        return Module;
      })();
    }
    return Win[GLOBAL_NAME.RESOURCE][name];
  };

  return {
    load,
    registry,
    loadFile,
  };
})();

LibraryLoader.registry({ name: "babel", globalName: "Babel", loader: { js: "/libs/babel.min.js" }, version: "7.15.8" });
LibraryLoader.registry({ name: "react", globalName: "React", loader: async () => React, version: "19.2.4" });
LibraryLoader.registry({ name: "@emotion/styled", loader: async () => styled, version: "11.14.1" });
LibraryLoader.registry({ name: "@emotion/react", loader: async () => EmotionReact, version: "11.14.0" });
LibraryLoader.registry({ name: "echarts", globalName: "echarts", loader: { js: "/libs/echarts.min.js" }, version: "6.0.0" });
