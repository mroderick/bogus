// derived from http://www.symphonious.net/2013/07/08/injecting-stubsmocks-into-tests-with-require-js/
define(['require'], function(require){
    'use strict';

    var stubbed = [];

    function stub(name, implementation){
        stubbed.push(name);
        requirejs.undef(name);
        define(name, [], function(){
            return implementation;
        });
    }

    function requireWithStubs(name, callback){
        stubbed.push(name);
        requirejs.undef(name);
        require([name], callback);
    }

    function reset(){
        stubbed.forEach(function(name){
            requirejs.undef(name);
        });
        stubbed = [];
    }

    return {
        stub: stub,
        requireWithStubs: requireWithStubs,
        reset: reset
    };
});
