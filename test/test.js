'use strict';

var requirejs = require('requirejs'),
    assert = require('assert');

requirejs.config({
    baseUrl: '.',
    nodeRequire: require
});

describe('Something', function(){
    var bogus;

    before(function(done){
        requirejs(['bogus'], function(mod){
            bogus = mod;
            done();
        });
    });

    describe('bogus module', function(){
        describe('stub method', function(){
            it('should be a function', function(){
                assert(typeof bogus.stub === 'function');
            });
        });

        describe('requireWithStubs method', function(){
            it('should be a function', function(){
                assert(typeof bogus.requireWithStubs === 'function');
            });
        });

        describe('reset method', function(){
            it('should be a function', function(){
                assert(typeof bogus.reset === 'function');
            });
        });
    });
});
