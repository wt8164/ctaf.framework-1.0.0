var webpack = require("webpack");

require("./node_modules/@ctaf/config/server.js")({
    entry: {
        'page': ['./demo/entry.ts'],
        'ctaf_framework': ['./src/entry.ts']
    },
    module: {
        loaders: [
            {
                test: require.resolve('jquery'),
                loader: "expose-loader?$!expose-loader?jQuery"
            },
            {
                test: require.resolve('underscore'),
                loader: "expose?_"
            },
            {
                test: require.resolve('numeral'),
                loader: "expose?numeral"
            },
            {
                test: require.resolve('moment'),
                loader: "expose?moment"
            },
            {
                test: require.resolve('sockjs-client'),
                loader: "expose?SockJS"
            },
        ]
    },
    externals: {
        "../src/entry": "ctaf_framework"
    }
}, true);