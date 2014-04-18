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
                    moduleNames = [],
                    i, j, module,
                    defineStub;

                sandbox.stub(requirejs, 'defined', function(){
                    return true;
                });

                for (i = 0; i < 10; i++){
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
                requirejs(moduleNames, function () {
                    bogus.reset(function(){
                        j = 0;
                        modules.forEach(function(module, index){
                            var call = defineStub.getCall(index);

                            assert.equal(call.args[0], module.name);
                            j++;
                        });

                        assert.equal(j, modules.length);

                        done();
                    });
                });
            });
        });
    });
}());
