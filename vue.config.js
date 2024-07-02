// // vue.config.js
module.exports = {
    devServer: {
      proxy: {
        '/assets': {
          target: 'http://127.0.0.1:9081',
          changeOrigin: true,
        },
      },
    },
  };
// module.exports = {
//     devServer: {
//        proxy: 'http://127.0.0.1:9081/',
//     }
//   }