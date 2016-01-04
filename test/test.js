(function(){
    'use strict';

    var requirejs = require('requirejs'),
        assert    = require('assert'),
        sinon     = require('sinon');

    requirejs.config({
        baseUrl: '.',
        nodeRequire: require
    });

    var sandbox = sinon.sandbox.create();

    function getUniqueModuleName(){
        if (getUniqueModuleName.uid === undefined){
            getUniqueModuleName.uid = 0;
        }
        getUniqueModuleName.uid++;

        return 'path/to/module/with/name/' + getUniqueModuleName.uid.toString();
    }

    describe('bogus module', function(){
        var bogus;

        before(function(done){
            requirejs(['bogus'], function(mod){
                bogus = mod;
                done();
            });
        });

        afterEach(function(done){
            sandbox.restore();
            bogus.reset(done);
        });

        describe('stub method', function(){
            it('should not accept the same name twice', function(){
                var name = 'some/arbitrary/name';

                bogus.stub(name, {});
                assert.throws(function(){
                    bogus.stub(name, {});
                });
            });

            it('should replace the implementation for a stubbed name', function(done){
                var name = getUniqueModuleName(),
                    define = requirejs.define,
                    originalModule = {},
                    stub = {};

                define(name, [], function () { return originalModule; });

                bogus.stub(name, stub);

                requirejs([name], function(module){
                    assert.notEqual(module, originalModule);
                    assert.equal(module, stub);
                    done();
                });
            });

            it('should accept a map of stubs', function(done){
                var define = requirejs.define,
                    names = [
                        getUniqueModuleName(),
                        getUniqueModuleName(),
                        getUniqueModuleName()
                    ],
                    originals = {},
                    fakes = {};

                // define all the modules, making sure they're all unique
                names.forEach(function(name){
                    var original = {
                            name: name
                        };

                    originals[name] = original;

                    define(name, [], function () { return original; });
                });

                // create the fakes
                names.forEach(function(name){
                    fakes[name] = {
                        name: name
                    };
                });

                bogus.stub(fakes);

                // verify all the stubs
                names.forEach(function(name, index){
                    requirejs([name], function(module){
                        assert.notEqual(module, originals[name]);
                        assert.equal(module, fakes[name]);

                        if (index === names.length - 1){
                            done();
                        }
                    });
                });
            });
        });

        describe('requireWithStubs method', function(){
            it('should be a function', function(){
                assert(typeof bogus.requireWithStubs === 'function');
            });

            it('should return a promise', function(){
                var p = bogus.requireWithStubs('blah', function(){}, function(){});

                assert.equal(typeof p.then, 'function');
                assert.equal(typeof p.catch, 'function');
            });
        });

        describe('require method', function(){
            it('should be an alias of requireWithStubs', function(){
                assert.equal(bogus.require, bogus.requireWithStubs);
            });
        });

        describe('reset method', function(){
            var modules;
            var defineStub;

            beforeEach(function(done){
                var define = requirejs.define;
                var i;
                var moduleNames = [];
                var module;

                modules = [];

                sandbox.stub(requirejs, 'defined', function(){
                    return true;
                });

                for (i = 0; i < 10; i++) {
                    module = {
                        name : getUniqueModuleName(),
                        originalImplementation : {name: 'original'},
                        stubImplementation : {name: 'stub'}
                    };

                    define(module.name, module.originalImplementation);
                    bogus.stub(module.name, module.stubImplementation);

                    modules.push(module);
                    moduleNames.push(module.name);
                }

                defineStub = sandbox.spy(requirejs, 'define');

                requirejs(moduleNames, function(){
                    done();
                });
            });

            it('is a function', function(){
                assert.equal(typeof bogus.reset, 'function');
            });

            it('returns a promise', function(){
                var p = bogus.reset();

                assert.equal(typeof p.then, 'function');
                assert.equal(typeof p.catch, 'function');
            });

            it('returns all original implementations to their names and call a callback', function(done){
                bogus.reset(function(){
                    modules.forEach(function(module, index){
                        var call = defineStub.getCall(index);

                        assert.equal(call.args[0], module.name);
                    });

                    done();
                });
            });

            it('returns all original implementations to their names and resolves a returned promise', function(){
                return bogus.reset().then(function(){
                    modules.forEach(function(module, index){
                        var call = defineStub.getCall(index);

                        assert.equal(call.args[0], module.name);
                    });
                });
            });
        });
    });
}());
