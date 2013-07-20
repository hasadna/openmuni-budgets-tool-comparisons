requirejs.config({
    baseUrl : '/src',
    paths   : {
        api         : 'http://dev.openmuni.org.il/static/src/api',
        i18n        : 'http://dev.openmuni.org.il/static/src/i18n',
        dictionary  : 'dictionary'
    }
});
requirejs([
    'app' // name your app
], function (app) {

    // start doing stuff
});
