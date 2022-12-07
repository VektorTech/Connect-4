const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    script: "./src/index.ts",
    grid: "./src/grid.ts",
    alphaBetaWorker: "./src/ai/alphaBetaWorker.ts",
  },
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./public",
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};