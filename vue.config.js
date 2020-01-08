const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                {
                    from: path.join(__dirname, 'functions'),
                    to: path.join(__dirname, 'unpackage/dist', process.env.NODE_ENV === 'production' ? 'build' : 'dev', process.env.UNI_PLATFORM, 'functions')
                }
            ])
        ]
    }
}