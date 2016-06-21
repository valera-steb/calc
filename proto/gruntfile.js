/**
 * Created by steb on 21/06/2016.
 */
module.exports = function(grunt) {
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
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};