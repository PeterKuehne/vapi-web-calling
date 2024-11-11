const path = require("path");

module.exports = {
  mode: "development", // oder "production" für Produktionsumgebung
  entry: "./src/index.js", // the main entry file for your application
  output: {
    filename: "bundle.js", // the output bundle file name
    path: path.resolve(__dirname, "dist"), // path to output folder
  },
  module: {
    rules: [
      {
        test: /\.js$/, // target any JavaScript files
        exclude: /node_modules/, // exclude the node_modules directory
        use: {
          loader: "babel-loader", // use babel-loader to transpile the JavaScript
          options: {
            presets: ["@babel/preset-env"], // use the preset-env for transpiling modern JavaScript to older syntax
          },
        },
      },
      {
        test: /\.json$/,
        type: 'json'  // Fügt Unterstützung für JSON-Dateien hinzu
      }
    ],
  },
  externals: {
    jquery: 'jQuery'
  }
};
