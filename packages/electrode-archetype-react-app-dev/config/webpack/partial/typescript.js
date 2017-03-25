"use strict";
const tsLoader = require.resolve("ts-loader");

module.exports = function (options) {
  console.log("WHAT OPTIONS:::::::");
  console.log(options);
  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: options.babel
            },
            {
              loader: tsLoader
            }
          ]
        },
      ]
    }
  };
};
