const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const { url } = require('inspector');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/index.tsx', // Entry point for the application
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the dist folder before each build
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.scss'], // Resolve file extensions for TypeScript and SCSS
    alias: {
      '@root/*': path.resolve(__dirname, 'src/*'),  // Alias "@" to the "src" folder (generic for all folders inside src)
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
              name: '[name].[hash].[ext]',    // Keeps the original filename with a hash
              outputPath: 'assets/img/',      // Files are placed in 'dist/assets/img/'
              publicPath: '/assets/img/',     // Correct URL path for serving images
            },
          },
        ],
      },
      // {
      //   test: /\.tsx?$/, // Look for .ts or .tsx files
      //   use: 'ts-loader', // Use ts-loader to handle TypeScript files
      //   exclude: /node_modules/,
      // },
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
              plugins: [isDevelopment && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.scss$/, // Look for .scss files
        use: [
          'style-loader', // Inject CSS into the DOM
          {
            loader: 'css-loader',
            options: {
              url: false,
            }
          }, // Resolve @import and url() in CSS files
          'sass-loader', // Compile SASS/SCSS to CSS
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/fonts/[name].[hash].[ext]', // Fonts will be copied to dist/assets/fonts/
            },
          },
        ],
      },
    ],
  },
  devtool: 'source-map', // Generate source maps for better debugging
  devServer: {
    // static: './public', // Serve files from the 'dist' directory
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    hot: true, // Enable hot module replacement (HMR) for live updates
    open: true, // Automatically open the browser on server start
    port: 3000, // Use port 3000 for the development server
    historyApiFallback: true,  // Ensure React Router handles all routes
  },
  plugins: [
    new CleanWebpackPlugin(), // Clean up the dist folder before each build
    new HtmlWebpackPlugin({
      template: './public/index.html', // Use the index.html file as a template
      filename: 'index.html', // Output the file to dist/index.html
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'), // Copy everything from public
          to: path.resolve(__dirname, 'dist'), // To the dist folder
          globOptions: {
            ignore: [
              '**/index.html',// Ignore index.html since it's handled by HtmlWebpackPlugin
              '**/design' 
            ], 
          },
        },
      ],
    }),
    ...(isDevelopment ? [new ReactRefreshWebpackPlugin()] : []),
  ],
};
