'use strict';
var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({
        watch: {
            options: {
                nospawn: true
            },
            less: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: ['app/styles/*.less'],
                tasks: ['less:server']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    'app/*.html',
                    'app/styles/{,*/}*.css',
                    'app/js/{,*/}*.js',
                    'app/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, 'app'),
                            lrSnippet
                        ];
                    }
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= connect.options.port %>'
            }
        },
        less: {
            server: {
                options: {
                    paths: ['app/libs/bootstrap/less', 'app/styles']
                },
                files: {
                    'app/styles/main.css': 'app/styles/main.less'
                }
            }
        },
        wiredep: {
          task: {
            src: [
              'app/**/*.html'
            ]
          }
        }
    });

    grunt.registerTask('server', function (target) {

        grunt.task.run([
            'less:server',
            'wiredep',
            'connect:livereload',
            'open',
            'watch'
        ]);
    });
};