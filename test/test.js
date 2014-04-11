'use strict';
var requirejs = require('requirejs');
requirejs.config({
    baseUrl: '.',
    nodeRequire: require
});

describe('Something', function() {
    var foo;

    before(function(done) {
        // This saves the module foo for use in tests. You have to use
        // the done callback because this is asynchronous.
        requirejs(['src/foo'],
            function(mod) {
                console.log('fired!');
                foo = mod;
                done();
            });
    });

    describe('blah', function() {
        it('blah', function() {
            if (foo.test !== 'test'){
                throw new Error('failed!');
            }
        });
    });
});
