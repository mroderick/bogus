bogus [![Build Status](https://travis-ci.org/mroderick/bogus.svg)](https://travis-ci.org/mroderick/bogus) [![Dependency status](https://david-dm.org/mroderick/bogus/dev-status.svg)](https://david-dm.org/mroderick/bogus#info=devDependencies&view=table)
======================

bogus is a small utility for stubbing dependencies when testing [RequireJS](http://requirejs.org) based projects

Getting bogus
----------------------

You can install bogus into your project using either `npm` or `bower`


```bash
$ npm install bogus --save-dev
```
or

```bash
$ bower install bogus --save-dev
```

Usage
----------------------

```javascript

// SteeringWheel
define('SteeringWheel', function(){
    function SteeringWheel(){
        this.color = 'black';
    }

    return SteeringWheel;
});

// Car
define('Car', ['SteeringWheel'], function(SteeringWheel){
    function Car(){
        this.steeringWheel = new SteeringWheel();
    }

    Car.prototype.getSteeringWheelColor = function getSteeringWheelColor(){
        return this.steeringWheel.color;
    }

    return Car;
});

// load bogus
define([
    'bower_components/bogus/bogus'  // this is ofc. dependent on where you installed it
], function(
    bogus
){
    describe('myModule', function{
        var Car;

        beforeEach(function(done){
            var fakeSteeringWheel = function(){
                this.color = 'blue';
            };

            // stub out a dependency (SteeringWheel) with our fake
            bogus.stub('SteeringWheel', fakeSteeringWheel);

            // load Car module, that depends on SteeringWheel
            bogus.requireWithStubs('Car', function(module){
                Car = module;
                done();
            });
        });

        afterEach(function(done){
            bogus.reset(done);
        })

        describe('Car', function(){
            describe('getSteeringWheelColor method', function(){
                it('should return the actual color of the SteeringWheel', function(){
                    var car = new Car();

                    assert.equal(car.getSteeringWheelColor(), 'blue');
                });
            });
        });
    });
});
```




Development
----------------------

You can run the tests with

```bash
$ npm test
```

or with

```bash
$ mocha
```

if you have [mocha](http://visionmedia.github.io/mocha/) installed as a global

See also
----------------------
* [Injecting Stubs/Mocks into Tests with Require.js](http://www.symphonious.net/2013/07/08/injecting-stubsmocks-into-tests-with-require-js/) - the blog post that laid the groundwork for what became bogus
* [Squire.js](https://github.com/iammerrick/Squire.js/) - also stubs out RequireJS dependencies. I couldn't get it to stop [re-downloading all the dependencies for each test ... nor could someone else](https://github.com/iammerrick/Squire.js/issues/39)

License
----------------------
MIT: <http://mrgnrdrck.mit-license.org>
