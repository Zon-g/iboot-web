module.exports = {
    lintOnSave: false,

    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },

    pluginOptions: {
      moment: {
        locales: [
          'en'
        ]
      }
    }

}
