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
            panelPrincipal: '#principalPanel'
        },
        control: {
            '#principalPanel': {
                show: 'onShowPrincipal'
            }
        }
    },
    onShowPrincipal: function (c) {
        console.log(c.down('#redSquare'));
        var me = this,
            redSquare = c.down('#redSquare');
console.log('afuera', this,me.getTransformDetails());
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