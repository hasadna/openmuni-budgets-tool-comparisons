define([
    'uijet_dir/uijet',
    'comparisons',
    'ui/legend',
    'ui/site-menu',
    'ui/entities',
    'ui/nodes',
    'ui/nodes-list',
    'ui/nodes-footer',
    'ui/chart-container',
    'ui/chart'
], function (uijet, comparisons, legend, site_menu, entities, nodes, nodes_list, nodes_footer, chart_container, chart) {

    uijet.declare([{
        type    : 'Pane',
        config  : {
            element     : '#welcome',
            mixins      : ['Layered'],
            app_events  : {
                welcome : 'wake'
            }
        }
    }])
        .declare(legend)
        .declare(site_menu)
        .declare(entities)
        .declare(nodes)
        .declare(nodes_footer)
        .declare(nodes_list)
        .declare(chart_container)
        .declare(chart);

    return comparisons;
});
