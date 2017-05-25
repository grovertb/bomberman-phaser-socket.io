var webpack = require("webpack");
var path = require("path");

module.exports = {
    entry: "./public/src/app.js",
    resolve: {
      modules: [
        path.resolve("./public/src/"),
      ]
    },
    output: {
        path: path.join(__dirname, "public"),
        filename: "bundle.js"
    }
};
