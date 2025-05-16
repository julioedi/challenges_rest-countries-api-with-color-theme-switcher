const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

// Load environment variables from .env file
const env = dotenv.config().parsed || {};

// Extract NODE_ENV early for usage
const nodeEnv = process.env.NODE_ENV || 'development';
const isDevelopment = nodeEnv !== 'production';

// Convert environment variables to `DefinePlugin` format, excluding NODE_ENV to avoid conflict
const envKeys = Object.keys(env)
  .filter(key => key !== 'NODE_ENV')
  .reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

// Also explicitly define NODE_ENV for use in the app
envKeys['process.env.NODE_ENV'] = JSON.stringify(nodeEnv);

let output = {
  filename: 'bundle.js',
  path: path.resolve(__dirname, 'dist'),
  clean: true,
};

let template = {
  templateParameters: {
    publicPath: !isDevelopment && process.env.RELATIVE_PATH ? process.env.RELATIVE_PATH : "/",
    version: process.env.VERSION ?? "1.0",
  }
};

output["publicPath"] = (!isDevelopment && process.env.RELATIVE_PATH) ? process.env.RELATIVE_PATH : "/";
console.log('isDevelopment:', isDevelopment);  // Add this to debug
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);


const plugins = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: './public/index.html',
    filename: 'index.html',
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true,
    },
    ...template,
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist'),
        globOptions: {
          ignore: [
            '**/index.html',
            '**/design'
          ],
        },
      },
    ],
  }),
  // ...(isDevelopment ? [new ReactRefreshWebpackPlugin()] : []),
  new webpack.DefinePlugin(envKeys),
];

if (isDevelopment) {
  plugins.push(new ReactRefreshWebpackPlugin());
}

module.exports = {
  mode: nodeEnv, // Explicitly set mode
  entry: './src/index.tsx',
  output,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss'],
    alias: {
      '@root/*': path.resolve(__dirname, 'src/*'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(jpg|jpeg|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/img/',
              publicPath: '/assets/img/',
            },
          },
        ],
      },
      {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            // Only apply React Refresh plugin when in development mode
            plugins: isDevelopment ? [require.resolve('react-refresh/babel')] : [],
          },
        },
      ],
    },,
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { url: false },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[hash].[ext]',
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
  },
  plugins: plugins.filter(Boolean),
};
