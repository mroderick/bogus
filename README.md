bogus
======================

bogus is a small utility for mocking dependencies when testing [RequireJS](http://requirejs.org) based projects

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

// load bogus
define([
    'bower_components/bogus/bogus'  // this is ofc. dependent on where you installed it
], function(
    bogus
){

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
