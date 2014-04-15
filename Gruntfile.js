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
            },

            // Configure a mochaTest task
            mochaTest: {
                test: {
                    options: {
                        reporter: 'spec'
                    },
                    src: ['test/**/*.js']
                }
            }
        });

        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-mocha-test');

        grunt.registerTask('test', ['jshint', 'mochaTest']);
        grunt.registerTask('default', ['test']);
    };
}());
