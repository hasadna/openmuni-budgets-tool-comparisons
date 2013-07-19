requirejs.config({
    baseUrl : '/src',
    paths   : {
        api : 'http://dev.openmuni.org.il/static/src/api'
    }
});
requirejs([
    'app' // name your app
], function (app) {

    // start doing stuff
});
