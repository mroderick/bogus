# bogus [![Build Status](https://travis-ci.org/mroderick/bogus.svg)](https://travis-ci.org/mroderick/bogus) [![Dependency Status](https://david-dm.org/mroderick/bogus.svg)](https://david-dm.org/mroderick/bogus) [![Dependency status](https://david-dm.org/mroderick/bogus/dev-status.svg)](https://david-dm.org/mroderick/bogus#info=devDependencies&view=table)

bogus is a small utility for stubbing dependencies when testing [RequireJS](http://requirejs.org) based projects

#### Link Seam

In [Working Effectively with Legacy Code](http://www.informit.com/store/working-effectively-with-legacy-code-9780131177055), Michael Feathers describes *[Seams](http://www.informit.com/articles/article.aspx?p=359417)*. In the vernacular of that book, `bogus` would be considered a *Link Seam*.

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

## Usage

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
    };

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
            bogus.require('Car', function(module){
                Car = module;
                done();
            });
        });

        afterEach(function(done){
            bogus.reset(done);
        });

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

### Promises

Both `bogus.require` and `bogus.reset` return promises. The `beforeEach` and
`afterEach` in the example above can be written as:

```javascript
beforeEach(function(){
    var fakeSteeringWheel = function(){
        this.color = 'blue';
    };

    bogus.stub('SteeringWheel', fakeSteeringWheel);

    return bogus.require('Car').then(function(module){
        Car = module;
    });
});

afterEach(function(){
    return bogus.reset();
});
```

### Stub multiple dependencies

If you're stubbing several dependencies, you can pass a map of them to `stub`

```javascript
var firstFake = {};
var secondFake = {};

bogus.stub({
    'path/to/first/dependency': firstFake,
    'path/to/second/dependency': secondFake
});
```

## Development

You can run the tests with

```bash
$ npm test
```

or with

```bash
$ mocha
```

if you have [mocha](http://visionmedia.github.io/mocha/) installed as a global

## See also

* [Injecting Stubs/Mocks into Tests with Require.js](http://www.symphonious.net/2013/07/08/injecting-stubsmocks-into-tests-with-require-js/) - the blog post that laid the groundwork for what became bogus
* [Squire.js](https://github.com/iammerrick/Squire.js/) - also stubs out RequireJS dependencies. I couldn't get it to stop [re-downloading all the dependencies for each test ... nor could someone else](https://github.com/iammerrick/Squire.js/issues/39)

## License

MIT: <http://mrgnrdrck.mit-license.org>
