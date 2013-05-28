/**
 * @class SenChanvas.controller.phone.Main
 * @extends SenChanvas.controller.Main
 * The main controller os the iphone app
 */
Ext.define('SenChanvas.controller.phone.Main', {
    extend: 'SenChanvas.controller.Main',

    config: {
        transformDetails: [],
        refs: {
            panelPrincipal: '#principalPanel'
        },
        control: {
            '#principalPanel': {
                show: 'onShowPrincipal'
            }
        }
    },
    onShowPrincipal: function (c) {
        console.log(c);
        var me = this,
            redSquare = c.down('#redSquare'),
            blueSquare = c.down('#blueSquare');

        me.addListeners(redSquare, 10, 10);
        me.addListeners(blueSquare, 200, 10);
    },

    addListeners:function(image, x, y){
        var me = this;
        me.getTransformDetails()[image.id] = {
            scale: 1,
            angle: 0,
            x: x,
            y: y,
            lastAngle : null
        };
        console.log(me.getTransformDetails());
        image.on({
            pinch: {
                element: 'element',
                fn: function (e) {
                    // Get the scale property from the event
                    me.getTransformDetails()[image.id].scale = e.scale;
                    me.updateTransform(image);
                },
                scope:me
            },
            rotatestart: {
                element: 'element',
                fn: function (e) {
                    me.getTransformDetails()[image.id].lastAngle = me.getTransformDetails()[image.id].angle;
                },
                scope:me
            },
            rotate: {
                element: 'element',
                fn: function (e) {
                    me.getTransformDetails()[image.id].angle = me.getTransformDetails()[image.id].lastAngle + e.rotation;
                    me.updateTransform(image);
                },
                scope:me
            },
            drag: {
                element: 'element',
                fn: function (e) {
                    me.getTransformDetails()[image.id].x += e.previousDeltaX;
                    me.getTransformDetails()[image.id].y += e.previousDeltaY;
                    me.updateTransform(image);
                },
                scope:me
            },
            tap: {
                element: 'element',
                fn: function (e, node) {
                    image.setStyle({
                        border: '5px solid black'
                    });
                },
                scope:me
            }
        });
    },

    updateTransform:function(image){
        var me = this;
        image.element.setStyle('-webkit-transform', 'scaleX(' + me.getTransformDetails()[image.id].scale
            + ') scaleY(' + me.getTransformDetails()[image.id].scale + ') rotate('
            + me.getTransformDetails()[image.id].angle + 'deg)');

        image.setLeft(me.getTransformDetails()[image.id].x);
        image.setTop(me.getTransformDetails()[image.id].y);
    }
});