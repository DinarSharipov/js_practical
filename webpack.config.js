const path = require('path'); // для работы с путями
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd; // Данная конструкция необходима чтобы при запуске в режиме разработчика HTML не минифицировался также заранне добавляя в package.json данные настройки

console.log(isDev);
console.log(isProd);

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (isDev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

const filename = (ext) => (isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`);

module.exports = {
  context: path.resolve(__dirname, 'src'), // __dirname указывается в качестве дороги до папки где лежит сам webpack.config.js, но это не точно
  mode: 'development', // режим разработки
  entry: ['@babel/polyfill', './index.js'], // точки входа в сборку
  output: {
    // точки выхода
    filename: filename('js'), // [hash] - призван создавать уникальный номер
    path: path.resolve(__dirname, 'dist'), // создает папку и выгружает туда вышеуказанные файлы
  },
  resolve: {
    extensions: ['.js'], // пока не понял для чего это, но видимо чтобы указывать распознавание расширения
    alias: {
      // для того чтобы не прописывать ../../../ а просто писать к примеру: "@/images/path.jpeg"
      '~': path.resolve(__dirname, 'src'),
      '~core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 65535,
    hot: isDev,
  },
  plugins: [
    new CleanWebpackPlugin(), // удаляет dist перед каждым запуском сборки
    new HTMLWebpackPlugin({
      // этот  ищет твои html файлы с указанными названиями
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CopyPlugin({
      // для фавиконки
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      // сжимает css
      filename: filename('css'),
    }),
  ],

  module: {
    // так как вебпак умеет работать только с расширением js & JSON то нам необходимо скачаивать и настраивать своего рода компиляторы под вебпак, которые помогают вебпаку работать с дргуими расширениями
    rules: [
      // все это описывается в правилах
      // набор правил для очередного формата
      {
        test: /\.s[ac]ss$/i, // на какие форматы это правило распорстраняется? В данном случае SCSS SASS форматы будут преобразлованы в CSS
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // обработчики которые перелапачивают код так, чтобы его понимал webpack ВАЖНО! читает справа налево. SASS-LOADER и CSS-LOADER преобразуют в CSS а минисиэсэс соберет в файл
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: jsLoaders(),
      },
    ],
  },
};
