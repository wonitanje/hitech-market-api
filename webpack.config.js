const path = require('path')
const fs = require('fs')
const CopyPlugin = require("copy-webpack-plugin");
const nodeModules = {}

fs.readdirSync(path.resolve(__dirname, 'node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { nodeModules[mod] = `commonjs ${mod}` })

const { NODE_ENV = 'development', PORT = '3000' } = process.env

module.exports = {
  name: 'server',
  target: 'node',
  mode: NODE_ENV,

  entry: './src/app.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },

  externals: nodeModules,

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|.docker)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      edge: "17",
                      firefox: "60",
                      chrome: "67",
                      safari: "11.1"
                    },
                    useBuiltIns: "usage",
                    corejs: "3.6.5"
                  }
                ]
              ]
            }
          }
        ]
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "static", to: "static" },
      ],
    }),
  ],
};