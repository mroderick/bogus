(function(){
    'use strict';

    var requirejs = require('requirejs'),
        assert    = require('assert'),
        sinon     = require('sinon'),
        Q         = require('q');

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
        var bogus, stubModule;

        before(function(done){
            requirejs(['bogus'], function(mod){
                bogus = mod;
                stubModule = Q.denodeify(bogus.stub);
                done();
            });
        });

        afterEach(function(done){
            sandbox.restore();
            bogus.reset(done);
        });

        describe('stub method', function(){
            it('should not accept the same name twice', function(done){
                var name = 'some/arbitrary/name';

                var stubbing = stubModule(name, {});

                stubbing.then(function(){
                    assert.throws(function(){
                        bogus.stub(name, {}, function(){});
                    });
                }).nodeify(done);
            });

            it('should replace the implementation for a stubbed name', function(done){
                var name = getUniqueModuleName(),
                    define = requirejs.define,
                    originalModule = {},
                    stub = {};

                define(name, originalModule);

                stubModule(name, stub).then(function(){
                    requirejs([name], function(module){
                        assert.notEqual(module, originalModule);
                        assert.equal(module, stub);
                        done();
                    });
                }).catch(done);
            });
        });

        describe('requireWithStubs method', function(){
            it('should be a function', function(){
                assert(typeof bogus.requireWithStubs === 'function');
            });
        });

        describe('reset method', function(){
            it('should return all original implementations to their names', function(done){
                var define = requirejs.define,
                    modules = [],
                    i, j, module,
                    defineStub,
                    stubPromises = [];

                sandbox.stub(requirejs, 'defined', function(){
                    return true;
                });

                for (i = 0; i < 10; i++){
                    module = {
                        name : getUniqueModuleName(),
                        originalImplementation : {},
                        stubImplementation : {}
                    };

                    define(module.name, module.originalImplementation);
                    stubPromises.push(stubModule(module.name, module.stubImplementation));

                    modules.push(module);
                }

                Q.all(stubPromises).then(function(){
                    defineStub = sandbox.stub(requirejs, 'define');

                    bogus.reset(function(){
                        j = 0;
                        modules.forEach(function(module, index){
                            var call = defineStub.getCall(index);

                            assert.equal(call.args[0], module.name);
                            j++;
                        });

                        assert.equal(j, modules.length);
                    });

                }).nodeify(done);
            });
        });
    });
}());
