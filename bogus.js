define(['require'], function(require){

    'use strict';

    // this is needed so we can stub define, when testing bogus
    if (!requirejs.define){
        requirejs.define = define;
    }

    var stubbed = [],
        originals = {};

    function stub(name, implementation, done){
        if (stubbed.indexOf(name) !== -1){
            throw new Error('Cannot stub module "' + name + '" twice');
        }

        if (typeof done !== 'function'){
            throw new TypeError('bogus.stub needs a done argument');
        }

        if (requirejs.defined(name) && !originals[name]){
            originals[name] = requirejs(name);
        }

        stubbed.push(name);

        requirejs.undef(name);

        requirejs.define(name, [], function(){
            return implementation;
        });

        // require the module in order to trigger requirejs to commit to defining it
        require([name], function(){
            done();
        }, done);
    }

    function requireWithStubs(name, callback, errback){
        stubbed.push(name);
        requirejs.undef(name);
        require([name], callback, errback);
    }

    function reset(callback){
        var originalsToRestore = [];

        stubbed.forEach(function(name){
            requirejs.undef(name);

            if (originals[name]){
                requirejs.define(name, [], function(){
                    return originals[name];
                });
                originalsToRestore.push(name);
            }
        });

        // require the module in order to trigger requirejs to commit to defining it
        require(originalsToRestore, function(){
            stubbed = [];
            callback();
        }, callback);
    }

    return {
        stub: stub,
        requireWithStubs: requireWithStubs,
        reset: reset
    };
});
