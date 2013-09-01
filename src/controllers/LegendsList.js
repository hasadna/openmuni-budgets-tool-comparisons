define([
    'uijet_dir/uijet',
    'comparisons'
], function (uijet, comparisons) {

    uijet.Adapter('LegendsList', {
        createItemModel : function (state, index) {
            var model = new comparisons.LegendItemModel(state || {
                title       : '',
                placeholder : gettext('Insert title'),
                muni        : '',
                nodes       : [],
                amount_type : 'budget',
                color       : this.resource.colors.shift()
            });
            // make sure color is unique
            if ( state ) {
                model.set('color', this.resource.colors.shift());
            }
            this.resource.add(model, { at : index });
            return model;
        },
        createItemWidget: function (model, index) {
            var $el = uijet.$('<li>', {
                id  : this.id + '_item_' + model.id
            });
            if ( index ) {
                $el.insertAfter(this.$element.children().eq(index - 1));
            }
            else {
                $el.prependTo(this.$element);
            }
            uijet.start({
                factory : 'LegendItem',
                config  : {
                    element : $el,
                    resource: model,
                    index   : index,
                    signals : {
                        post_full_render: '-legend_item_added',
                        pre_destroy     : '-legend_item_removed'
                    },
                    picking : this.picking
                }
            }, true);
            return this;
        },
        createItem      : function (model_index) {
            var new_index = model_index + 1,
                state = ~ model_index ? this.resource.at(model_index).attributes : null,
                model = this.createItemModel(state, new_index);

            return this.createItemWidget(model, new_index);
        },
        addItem         : function (model_index) {
            this.picking = true;
            this.createItem(model_index)
                .selectItem(~ model_index ? model_index + 1 : 0);
            return this;
        },
        setEntity       : function (id) {
            this.resource.at(this.current_index).set({
                muni: uijet.Resource('Munis').get(id)
            });
            return this;
        },
        selectItem      : function (index) {
            var model, muni;
            if ( index !== this.current_index ) {
                this.resource.where({
                    disabled: false
                }).forEach(function (model) {
                    model.set('disabled', true);
                });
                model = this.resource.at(index).set('disabled', false);
                muni = model.get('muni');
                this.current_index = index;
                if ( muni ) {
                    this.updateState(model, muni);
                }
            }
        },
        updateState     : function (model, muni) {
            if ( ! model ) {
                model = this.resource.at(this.current_index);
            }
            if ( ! muni ) {
                muni = model.get('muni');
            }
            this.publish('select_state', {
                entity_id   : muni.get('id'),
                selection   : model.get('state'),
                amount_type : model.get('amount_type')
            });
        },
        deleteItem      : function (index) {
            var is_current_index = index === this.current_index,
                new_length;
            this.resource.remove(this.resource.at(index));
            // if the user is currently viewing the item s/he's deleting
            if ( is_current_index ) {
                new_length = this.resource.length;
                // if we still have other legend items left
                // and it was the last item in the list
                if ( new_length && new_length === index ) {
                    return index - 1;
                }
            }
            // if current selected item is below the deleted one then need to shift the index by 1
            else if ( index < this.current_index ) {
                return this.current_index - 1;
            }
            return this.current_index;
        },
        removeItem      : function (index) {
            var new_current_index = this.deleteItem(index);
            if ( this.resource.length ) {
                if ( this.picking ) {
                    uijet.publish('picker_done.clicked');
                }
            }
            else {
                uijet.publish('welcome');
            }
            this.sizeAndScroll();
        },
        updateSelection : function (data) {
            if ( data && data.reset ) return;
            //TODO: can optimize since we're already looping LatestSheet in nodes_list widget on selection
            var resource = uijet.Resource('LatestSheet'),
                selected_nodes = resource.where({ selected : 'selected' }),
                selected_nodes_ids = selected_nodes.map(uijet.utils.prop('id')),
                partial_nodes = resource.where({ selected : 'partial' })
                                        .map(uijet.utils.prop('id'));
            this.resource.at(this.current_index).set({
                nodes   : selected_nodes.filter(function (node) {
                    return !~ selected_nodes_ids.indexOf(node.get('parent'));
                }).map(uijet.utils.prop('id')),
                state   : {
                    selected: selected_nodes_ids,
                    partial : partial_nodes
                }
            });
        },
        resetItems      : function () {
            this.destroyContained();
            this.resource.models.forEach(this.createItemWidget, this);
            this.createOverlay();
            if ( ! this.resource.length ) {
                uijet.publish('welcome');
            }
            return this;
        },
        createOverlay   : function () {
            var overlay_id = this.id + '_overlay';
            uijet.start({
                factory : 'LegendOverlay',
                config  : {
                    element     : uijet.$('<div>', {
                        id      : overlay_id
                    }).appendTo(this.$wrapper),
                    container   : this.id
                }
            });
            return this;
        },
        sizeAndScroll   : function () {
            var $wrapper = this.$wrapper,
                // -44 for normalization_selector
                max_height = $wrapper[0].offsetParent.offsetHeight - 44,
                el_height = this.$element[0].offsetHeight;
            if ( ! this.picking ) {
                // -44 for add_legend
                max_height -= 44;
            }
            this.$wrapper.css({
                'max-height': max_height + 'px',
                height      : (el_height > max_height ? max_height : el_height) + 'px'
            });
            return this.scroll();
        }
    });

});
