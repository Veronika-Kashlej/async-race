const path = require('path');

module.exports = {
  devServer: {
    open: true,
    host: 'local-host',
    compress: true,
    hot: true,
    port: 9000,
    static: path.resolve(__dirname, './dist'),
    historyApiFallback: true,
  },
};
