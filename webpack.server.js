const webpack           = require('webpack'),
      WebpackDevServer  = require('webpack-dev-server'),
      webpackConfig     = require('./webpack.config'),
      compiler          = webpack(webpackConfig);
const Dashboard         = require('webpack-dashboard')
const DashboardPlugin   = require('webpack-dashboard/plugin')

// const mDashboard = new Dashboard()
// compiler.apply(new DashboardPlugin(mDashboard.setData))

new WebpackDevServer(compiler, {
    publicPath        : webpackConfig.output.publicPath,
    hot               : true,
    quiet             : false, // MUESTRA LOG EN CONSOLA
    overlay           : false, // Show error full window
    stats             : {
      colors: true,
    },
    historyApiFallback: true,
    // Control the console log messages shown in the browser when using inline mode. Can be `error`, `warning`, `info` or `none`.
    clientLogLevel: "info",
    // Set this if you want to enable gzip compression for assets
    compress: true,
  }).listen(8080, 'localhost', err => {
    if (err)
      console.log("err", err)
  })
