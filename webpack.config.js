const webpack           = require('webpack'),
      path              = require('path')

module.exports = {
  devtool      : 'eval',
  // devtool : 'inline-source-map',
  cache   : true,
  context : __dirname,
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './src/App.jsx',
  ],
  output: {
    path:  __dirname + '/public/', // Next line is not used in dev but WebpackDevServer crashes without it:
    pathinfo: true, // Add /* filename */ comments to generated require()s in the output.
    // This does not produce a real file. It's just the virtual path that is
    // served by WebpackDevServer in development. This is the JS bundle
    // containing code from all our entry points, and the Webpack runtime.
    filename: 'static/js/bundle.js',
    chunkFilename: 'static/js/[name].chunk.js', // There are also additional JS chunk files if you use code splitting.
    publicPath: '/', // This is the URL that app is served from. We use "/" in development.
    // filename  : 'client.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader'],
        exclude: /(node_modules)/,
      },
      {
        test   : /\.js$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'node_modules', 'src')
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.styl/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '__[hash:base64:5]'
            }
          },
          'stylus-loader'
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(), // Esto es necesario para emitir actualizaciones activas (actualmente sólo CSS):
    new webpack.NamedModulesPlugin() //Imprime nombres de módulos más legibles en la consola del navegador en actualizaciones HMR
  ],
  // Algunas bibliotecas importan módulos de nodo pero no los utilizan en el navegador.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  // Desactive las sugerencias de rendimiento durante el desarrollo porque no hacemos ninguna división o
  // minificación en interés de la velocidad. Estas advertencias se vuelven incómodas
  performance: {
    hints: false,
  },
};
