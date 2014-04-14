define(['require'], function(require){

    'use strict';

    // this is needed so we can stub define, when testing bogus
    if (!requirejs.define){
        requirejs.define = define;
    }

    var stubbed = [],
        originals = {};

    function stub(name, implementation){
        if (stubbed.indexOf(name) !== -1){
            throw new Error('Cannot stub module "' + name + '" twice');
        }

        if (requirejs.defined(name) && !originals[name]){
            originals[name] = requirejs(name);
        }

        stubbed.push(name);

        requirejs.undef(name);

        requirejs.define(name, [], function(){
            return implementation;
        });
    }

    function requireWithStubs(name, callback, errback){
        stubbed.push(name);
        requirejs.undef(name);
        require([name], callback, errback);
    }

    function reset(){
        stubbed.forEach(function(name){
            requirejs.undef(name);

            if (originals[name]){
                requirejs.define(name, [], function(){
                    return originals[name];
                });
            }
        });

        stubbed = [];
    }

    return {
        stub: stub,
        requireWithStubs: requireWithStubs,
        reset: reset
    };
});
