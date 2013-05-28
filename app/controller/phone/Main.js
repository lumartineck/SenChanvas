/**
 * @class SenChanvas.controller.phone.Main
 * @extends SenChanvas.controller.Main
 * The main controller os the iphone app
 */
Ext.define('SenChanvas.controller.phone.Main', {
    extend: 'SenChanvas.controller.Main',

    config: {
        transformDetails: {
            scale: 1,
            angle: 0,
            x: 10,
            y: 10
        },
        lastAngle : null,
        refs: {
            panelPrincipal: '#principalPanel',
            imagesDataview:'imagesdataview',
            draggsCnt: '#draggsCnt'
        },
        control: {
            '#principalPanel': {
                show: 'onShowPrincipal'
            },
            imagesDataview:{
                itemtap:'onImageItemTap',
                itemtouchstart:'onItemTouchStart'
            },
            draggsCnt: {
                initialize: 'onDraggsCntInit'
            }
        }
    },

    init: function() {
        var images = Ext.getStore('Images').load();
        images.on('load',this.onDraggsCntInit)
    },

    onDraggsCntInit: function(cnt) {
        var me = this;
        console.log('Init draggs', cnt);

        Ext.each(cnt.getInnerItems(), function(item) {
            if (Ext.isDefined(item.draggableBehavior)) {
                var draggable = item.draggableBehavior.getDraggable();

                draggable.group = 'base';// Default group for droppable
                draggable.revert = true;

                draggable.setConstraint({
                    min: { x: -Infinity, y: -Infinity },
                    max: { x: Infinity, y: Infinity }
                });

                draggable.on({
                    scope: me,
                    dragstart: me.onDragStart,
                    dragend: me.onDragEnd
                });
            }
        });
    },

    onDragStart: function() {
        var me = this;

        console.log('Start dragging', arguments);
    },

    onDragEnd: function() {
        console.log('End of dragging', arguments);
    },

    onDropCntInit: function(cnt) {
        var me = this;

        var drop = Ext.create('Ext.ux.util.Droppable', {
            element: cnt.element
        });

        drop.on({
            scope: me,
            drop: me.onDrop
        });

        drop.cleared = false;

        console.log('Droppable init', drop);
    },

    onDrop: function(droppable, draggable) {
        var me = this;
        console.log('Dropped', arguments);

        var draggsCnt = me.getDraggsCnt();
        var dropCnt = me.getDropCnt();
        var dragg = Ext.getCmp(draggable.getElement().getId());

        if (!droppable.cleared) {
            dropCnt.setHtml('');
            droppable.cleared = true;
        }

        dropCnt.insert(0, Ext.create('Ext.Container', {
            html: me.getHiString(),
            padding: 20,
            margin: 5,
            style: 'border: black solid; border-radius: 7px; background-color: white; color: black;',
            layout: {
                type: 'vbox',
                align: 'center'
            }
        }));

        dragg.destroy();
    },

    onShowPrincipal: function (c) {
        console.log(c.down('#redSquare'));
        var me = this,
            redSquare = c.down('#redSquare');
            //console.log('afuera', this,me.getTransformDetails());
        redSquare.on({
            pinch: {
                element: 'element',
                fn: function (e) {
                    // Get the scale property from the event
                    me.getTransformDetails().scale = e.scale;
                    me.updateTransform(redSquare);
                },
                scope:me
            },
            rotatestart: {
                element: 'element',
                fn: function (e) {
                    me.setLastAngle(me.getTransformDetails().angle);
                },
                scope:me
            },
            rotate: {
                element: 'element',
                fn: function (e) {
                    me.getTransformDetails().angle = me.getLastAngle() + e.rotation;
                    me.updateTransform(redSquare);
                },
                scope:me
            },
            drag: {
                element: 'element',
                fn: function (e) {
                    console.log(me.getTransformDetails());
                    me.getTransformDetails().x += e.previousDeltaX;
                    me.getTransformDetails().y += e.previousDeltaY;
                    me.updateTransform(redSquare);
                },
                scope:me
            },
            tap: {
                element: 'element',
                fn: function (e) {
                    console.log('tap',arguments);
                },
                scope:me
            }
        });
    },

    updateTransform:function(component){
        var me = this;
        component.element.setStyle('-webkit-transform', 'scaleX(' + me.getTransformDetails().scale + ') scaleY(' + me.getTransformDetails().scale + ') rotate(' + me.getTransformDetails().angle + 'deg)');

        component.setLeft(me.getTransformDetails().x);
        component.setTop(me.getTransformDetails().y);
    }
});