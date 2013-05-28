/**
 * @class SenChanvas.controller.phone.Main
 * @extends SenChanvas.controller.Main
 * The main controller os the iphone app
 */
Ext.define('SenChanvas.controller.phone.Main', {
    extend: 'SenChanvas.controller.Main',

    config: {
        transformDetails: [],
        selected:undefined,
        refs: {
            panelPrincipal: '#principalPanel',
            imagesDataview:'imagesdataview',
            draggsCnt: '#draggsCnt',
            dropCnt: '#dropable'
        },
        control: {
            '#principalPanel': {
                show: 'onShowPrincipal'
            },
            draggsCnt: {
                initialize: 'onDraggsCntInit'
            },
            dropCnt: {
                initialize: 'onDropCntInit'
            },
            imagesDataview:{
                itemtouchstart:'onItemTouchStart'
            },
            '#principalPanel button[action=rotateR]': {
                tap:'onButtonRotateRTap'
            },
            '#principalPanel button[action=rotateL]': {
                tap:'onButtonRotateLTap'
            },
            '#principalPanel button[action=toFront]': {
                tap:'onButtonToFrontTap'
            },
            '#principalPanel button[action=toBack]': {
                tap:'onButtonToBackTap'
            },
            '#principalPanel button[action=delete]': {
                tap:'onButtonDeleteTap'
            }
        }
    },

    init: function() {
       var images = Ext.getStore('Images').load();

        images.on('load',this.onDraggsCntInit.bind(this));

    },

    onDraggsCntInit: function(cnt) {
        var me = this,
            drag = me.getDraggsCnt();
        console.log('dragggg', drag);

        Ext.each(cnt.getInnerItems(), function(item) {
            if (Ext.isDefined(item.draggableBehavior)) {
                var draggable = item.draggableBehavior.getDraggable();
                console.log('draggable', draggable);
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

        cnt.on('painted', me.onDropCntInit.bind(me));
    },

    onDragStart: function() {
        var me = this;

        console.log('Start dragging', arguments);
    },

    onDragEnd: function() {
        console.log('End of dragging', arguments);
    },

    onDropCntInit: function() {
        var me = this,
            dropCnt = me.getDropCnt();

        var drop = Ext.create('Ext.ux.util.Droppable', {
            element: dropCnt.element
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
                    me.setSelectedImage(image);
                    // Get the scale property from the event
                    me.getTransformDetails()[image.id].scale = e.scale;
                    me.updateTransform(image);
                },
                scope:me
            },
            rotatestart: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    me.getTransformDetails()[image.id].lastAngle = me.getTransformDetails()[image.id].angle;
                },
                scope:me
            },
            rotate: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    me.getTransformDetails()[image.id].angle = me.getTransformDetails()[image.id].lastAngle + e.rotation;
                    me.updateTransform(image);
                },
                scope:me
            },
            drag: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    me.getTransformDetails()[image.id].x += e.previousDeltaX;
                    me.getTransformDetails()[image.id].y += e.previousDeltaY;
                    me.updateTransform(image);
                },
                scope:me
            },
            tap: {
                element: 'element',
                fn: function (e, node) {
                    me.setSelectedImage(image);
                },
                scope:me
            }
        });
    },

    setSelectedImage:function(image){
        var me =this,
            dropCnt = me.getDropCnt();
        console.log('setSelected', dropCnt.getItems().items);
        Ext.each(dropCnt.getItems().items, function(item){
            if(item.id == image.id) {
                item.setStyle({
                    border: '5px solid black'
                });
            } else {
                item.setStyle({
                    border: '0px'
                });
            }
        });
        me.setSelected(image);
    },

    updateTransform:function(image){
        var me = this;
        image.element.setStyle('-webkit-transform', 'scaleX(' + me.getTransformDetails()[image.id].scale
            + ') scaleY(' + me.getTransformDetails()[image.id].scale + ') rotate('
            + me.getTransformDetails()[image.id].angle + 'deg)');

        image.setLeft(me.getTransformDetails()[image.id].x);
        image.setTop(me.getTransformDetails()[image.id].y);
    },

    onItemTouchStart:function ( dataview, index, target, record, e, eOpts ) {

        // alert('touchstart');
        Ext.create('Ext.util.Draggable', {
            element: "image-"+record.get('id'),
            threshold: 0,
            //direction: 'vertical',
            animationDuration: 100,
            listeners:{
                drag:function  () {
                    console.log('drag');
                },
                dragend:function  () {
                    console.log('dragend');
                },
                dragstart:function  () {
                    console.log('dragstart');
                }
            }
        });
        // Ext.get("image-"+record.get('id')).hide();
    },


    onButtonRotateRTap:function(){
        console.log('rotateR');
    },
    onButtonRotateLTap:function(){
        console.log('rotateL');
    },
    onButtonToFrontTap:function(){
        console.log('frotn');
    },
    onButtonToBackTap:function(){
        console.log('back');
    },
    onButtonDeleteTap:function(){
        console.log('delete');
        if(this.getSelected()){
            this.getSelected().destroy();
        }
    }
});