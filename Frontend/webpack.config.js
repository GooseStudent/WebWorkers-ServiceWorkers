const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';

  const plugins = [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: 'manifest.json'
        },
        {
          from: 'src/asset/icons',
          to: 'asset/icons'
        }
      ]
    })
  ];

  if (isProduction) {
    plugins.push(
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,

        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',

            options: {
              cacheName: 'images',

              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60
              }
            }
          },

          {
            urlPattern: /^https:\/\/webworkers-serviceworkers-iaam\.onrender\.com\/api\/posts/,
            handler: 'NetworkFirst',

            options: {
              cacheName: 'api-cache',
              networkTimeoutSeconds: 5
            }
          }
        ]
      })
    );
  }

  return {
    entry: './src/js/index.js',

    output: {
      filename: 'bundle.[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
      publicPath: '/WebWorkers-ServiceWorkers/'
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },

        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'asset/images/[name][ext]'
          }
        }
      ]
    },

    plugins,

    devServer: {
      static: {
        directory: path.join(__dirname, 'dist')
      },
      compress: true,
      port: 8080,
      hot: false,
      liveReload: false,
      watchFiles: [],
      client: {
        logging: 'none',
        overlay: false,
        progress: false
      },
      historyApiFallback: true
    }
  };
};