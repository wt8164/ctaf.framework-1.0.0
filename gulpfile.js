var gulp = require("gulp");
var webpack = require("webpack");

var moduleGulp = require('./node_modules/@ctaf/config/gulpfile.js');

gulp.tasks = moduleGulp.tasks;

gulp.task("build.project", function(cb) {
    let config = {
        entry: {
            'ctaf_framework': ('./src/entry.ts')
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
        }
    };

    moduleGulp.buildproject(config, cb, true);
});

gulp.task("build.demo", function(cb) {
    let config = {
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
    };

    moduleGulp.builddemo(config, cb, true);
});
