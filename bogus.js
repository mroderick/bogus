define(['require'], function(require){

    'use strict';

    // Modified (not to use global) and minified from https://github.com/timjansen/PinkySwear.js
    /* jshint ignore:start */
    var pinkySwear = (function(){function n(n){return"function"==typeof n}function t(n){return"object"==typeof n}function e(n){"undefined"!=typeof setImmediate?setImmediate(n):"undefined"!=typeof process&&process.nextTick?process.nextTick(n):setTimeout(n,0)}function r(o){var c,i=[],f=[],a=function(n,t){return null==c&&null!=n&&(c=n,i=t,f.length&&e(function(){for(var n=0;n<f.length;n++)f[n]()})),c};return a.then=function(a,p){var l=r(o),s=function(){function e(r){var o,c=0;try{if(r&&(t(r)||n(r))&&n(o=r.then)){if(r===l)throw new TypeError;o.call(r,function(){c++||e.apply(u,arguments)},function(n){c++||l(!1,[n])})}else l(!0,arguments)}catch(i){c++||l(!1,[i])}}try{var r=c?a:p;n(r)?e(r.apply(u,i||[])):l(c,i)}catch(o){l(!1,[o])}};return null!=c?e(s):f.push(s),l},o&&(a=o(a)),a}var u;return r}());
    /* jshint ignore:end */

    // PinkySwear is A+ only and lacks .catch, which is a part of ES2015 promises. This function is
    // used as an argument to pinkySwear to bridge the gap (just in case).
    function addCatch(p){
        p.catch = function(cb){
            p.then(undefined, cb);
        };
        return p;
    }

    function isObject(value){
        return Object.prototype.toString.call(value) === '[object Object]';
    }

    // this is needed so we can stub define, when testing bogus
    if (!requirejs.define){
        requirejs.define = define;
    }

    var stubbed = [],
        originals = {};

    function preserveDefinition(name){
        if (requirejs.defined(name) && !originals[name]){
            originals[name] = requirejs(name);
        }
    }

    function stub(name, implementation){
        if (stubbed.indexOf(name) !== -1){
            throw new Error('Cannot stub module "' + name + '" twice');
        }

        preserveDefinition(name);
        stubbed.push(name);

        requirejs.undef(name);

        requirejs.define(name, [], function(){
            return implementation;
        });
    }

    function stubOneOrMany(){
        var stubOne  = typeof arguments[0] === 'string' && arguments[1] !== undefined,
            stubMany = isObject(arguments[0]),
            map = stubMany && arguments[0],
            key;

        if (stubOne){
            stub(arguments[0], arguments[1]);
            return;
        }

        if (stubMany){
            for (key in map){
                if (map.hasOwnProperty(key)){
                    stub(key, map[key]);
                }
            }
            return;
        }

        throw new Error('stub method expects either an Object as a map of names and implementations, or a single name/implementation pair as arguments');
    }

    function requireWithStubs(name, callback, errback){
        // Cache the current index of the module in the array.
        var moduleIndex = stubbed.push(name) - 1;
        var promise = pinkySwear(addCatch);

        preserveDefinition(name);
        requirejs.undef(name);


        function resolve(mod){
            promise(true, [mod]);

            if (callback) {
                callback(mod);
            }
        }

        function reject(err){
            promise(false, [err]);

            if (errback) {
                errback(err);
            }
        }

        // Require all the dependencies to ensure that they're registered.
        require(stubbed, function(){
            resolve(arguments[moduleIndex]); // Return the required module.
        }, reject);

        return promise;
    }

    function reset(callback){
        var originalsToRestore = [];
        var promise = pinkySwear(addCatch);

        if (stubbed.length === 0) {
            callback();
            return;
        }

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

            if (callback) {
                callback();
            }

            promise(true, []);
        });

        return promise;
    }

    return {
        stub: stubOneOrMany,
        require: requireWithStubs,
        requireWithStubs: requireWithStubs,
        reset: reset
    };
});
