/**
 * Created by steb on 21/06/2016.
 */
module.exports = function(grunt) {
    function getFiles(srcdir, wildcard) {
        //var path = require('path');
        var files = [];
        grunt.file.expand({cwd: srcdir}, wildcard).forEach(function(relpath) {
            files.push(srcdir + '/' + relpath.replace(/\.ts$/, ''));
        });
        return files;
    }
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';\n\r\n'
            },
            js_libs: {
                src: [
                    "bower_components/angular/angular.min.js",
                    "bower_components/requirejs/require.js"
                ],
                dest: 'dist/libs.js'
            },
            app_min: {
                src: [
                    "ui/app.js",
                    "ui/c.js",
                    "ui/directive/numPadButton.js",
                    "ui/factory.js"
                ],
                dest: 'dist/app.js'
            },
            styles: {
                options: {
                    separator: '\n\r\n'
                },
                src: [
                    "ui/s.css",
                    "bower_components/angular/angular-csp.css"
                ],
                dest: 'dist/main.css'
            }
        },

        ts: {
            default: {
                src: ['core/**/*.ts'],
                options: {
                    module: 'amd',
                    fast: 'never',
                    sourceMap: true
                }
            },
            tests: {
                src: ['tests/**/*.ts'],
                options: {
                    module: 'amd',
                    fast: 'never',
                    sourceMap: true
                }
            }
        },

        requirejs: {
            compile: {
                options: {
                    //baseUrl: "/",
                    name: "core/ControlSystem",
                    out: "dist/core.js",
                    include:getFiles('core/targets', '*.ts'),
                    optimize: 'none',
                    preserveLicenseComments: true
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-ts');

    grunt.registerTask('default', ['ts']);
    grunt.registerTask('relese', ['ts', 'concat']);
};