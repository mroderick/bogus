(function(){
    'use strict';

    module.exports = function(grunt){

        grunt.initConfig({
            jshint: {
                all: [
                    'Gruntfile.js',
                    'bogus.js',
                    'test/**/*.js'
                ]
            }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');

        grunt.registerTask('default', ['jshint', 'test']);
    };
}());
