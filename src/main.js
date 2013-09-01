requirejs.config({
    baseUrl : '/static/lib',
    paths   : {
        jqscroll            : 'jqScroll/jqscroll',
        'jquery.mousewheel' : 'jquery-mousewheel',
        uijet_dir           : 'uijet',
        widgets             : 'uijet/widgets',
        composites          : 'uijet/composites',
        modules             : 'uijet/modules',
        comparisons            : '../projects/comparisons/comparisons',
        ui                  : '../projects/comparisons/ui',
        resources           : '../projects/comparisons/resources',
        controllers         : '../projects/comparisons/controllers',
        project_modules     : '../projects/comparisons/modules',
        project_widgets     : '../projects/comparisons/widgets',
        project_mixins      : '../projects/comparisons/mixins',
        dictionary          : '../projects/comparisons/dictionary',
        api                 : '../src/api',
        i18n                : '../src/i18n'
    },
    shim    : {
        eventbox                : ['setImmediate'],
        'backbone-fetch-cache'  : 'modules/data/backbone'
    }
});
requirejs([
    'ui/main',
    '../js/base'
], function (comparisons) {

    comparisons.start({
        AUTH_URL: window.AUTH_URL,
        auth    : {
            client_id       : '751be246011e8a6198d7',
            client_secret   : 'c62cb3b66fcbe46b82ecda2ed146b7bfe24fdea4',
            grant_type      : 'password',
            username        : 'admin',
            password        : 'morelove!'
        }
    });
});
