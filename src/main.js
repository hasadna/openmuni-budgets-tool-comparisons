requirejs.config({
    baseUrl : '/src',
    paths   : {
        api : '../lib/api'
    }
});
requirejs([
    'app' // name your app
], function (app) {

    // start doing stuff
});
