// noinspection JSUnusedGlobalSymbols

import { resolve, join } from "path";
import HTMLPlugin from "html-webpack-plugin";

const BUILD_PATH = resolve("dist");
const SOURCE_PATH = resolve("src");
const IS_DEV_MODE = process.argv.reduce((acc, arg) => acc || arg.includes("development"), false);

const config = {
  devtool: IS_DEV_MODE && "cheap-module-source-map",
  entry: join(SOURCE_PATH, "index.ts"),
  output: {
    path: BUILD_PATH,
    filename: createFileName,
    clean: true,
  },
  optimization: getOptimizations(),
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: getLoaders(),
  },
  plugins: getPlugins(),
  devServer: {
    contentBase: BUILD_PATH,
    compress: true,
    port: 4200,
    hot: true,
  },
};

function createFileName(pathData) {
  let isVendorChunk = !pathData.chunk.name;
  if (isVendorChunk) {
    return IS_DEV_MODE ? "static/js/[name].chunk.js" : "static/js/[name].[contenthash:8].chunk.js";
  } else {
    return IS_DEV_MODE ? "static/js/[name].bundle.js" : "static/js/[name].[contenthash:8].js";
  }
}

function getOptimizations() {
  return {
    minimize: !IS_DEV_MODE,
    splitChunks: {
      chunks: "all",
    },
    // Keep the runtime chunk separated to enable long term caching
    // https://github.com/facebook/create-react-app/issues/5358
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`,
    },
  };
}

function getLoaders() {
  return [
    {
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    },
  ];
}

function getPlugins() {
  return [
    new HTMLPlugin({ template: join(SOURCE_PATH, "../", "public", "index.html") }),
  ];
}

export default config;
