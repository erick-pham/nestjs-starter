/* eslint-disable linebreak-style */
const path = require('path');

module.exports = (options) => ({
  mode: 'production',
  devtool: 'source-map',
  // entry: './src/widget-happy-score.tsx',
  output: {
    filename: process.env.OUTPUT,
    path: path.resolve(__dirname, 'widget'),
    library: [process.env.LIBRARY_NAME],
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  entry: [
    // require.resolve('react-app-polyfill/ie11'),
    // require.resolve('react-app-polyfill/stable'),
    process.env.INPUT
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery
        }
      },
      {
        test: /\.js$/, // Transform all .js files required somewhere with Babel
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader'
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                enabled: false
                // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                // Try enabling it in your environment by switching the config to:
                // enabled: true,
                // progressive: true,
              },
              gifsicle: {
                interlaced: false
              },
              optipng: {
                optimizationLevel: 7
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024
            }
          }
        ]
      }
    ]
  },
  resolve: {
    // modules: ['node_modules'],
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['browser', 'main', 'jsnext:main']
  },
  // devtool: options.devtool,
  target: 'web' // Make web variables accessible to webpack, e.g. window
});
