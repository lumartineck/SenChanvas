/**
 * @class SenChanvas.controller.tablet.Main
 * @extends SenChanvas.controller.Main
 * The main controller os the iphone app
 */
Ext.define('SenChanvas.controller.tablet.Main', {
    extend: 'SenChanvas.controller.Main',

    config: {
        transformDetails: [],
        selected:undefined,
        rotationAngle:10,
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
            /*dropCnt: {
                initialize: 'onDropCntInit'
            },*/
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
        Ext.getStore('Images').load();
    },

    onDraggsCntInit: function(cnt) {
        var me = this,
            drop = me.getDropCnt();

        //Ext.getStore('Images').on('load',me.createContImages.bind(cnt));

        console.log('Init draggs');
        cnt.on('painted',function(){
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
        });

        me.onDropCntInit();
    },

    createContImages: function (cnt) {
          Ext.getStore('Images').each(function (item, index, lenght){
            var src = item.get('src');
               cnt.add({
                   xtype: 'component',
                   draggable: true,
                   html: '<img src="'+src+'" width="50" height="50">'
               });
          });

        console.log('contendorrrrr',cnt);
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
            el = Ext.getCmp('dropable');

        var drop = Ext.create('Ext.ux.util.Droppable', {
            element: el.element
        });
console.log('drop..', drop);
        drop.on({
            scope: me,
            drop: me.onDrop
        });

        drop.cleared = false;

        console.log('Droppable init', drop);
    },

    onDrop: function(droppable, draggable) {
        console.log('has ganadooo..');
        var me = this;
        console.log('Dropped', arguments);

        var draggsCnt = me.getDraggsCnt();
        var dropCnt = me.getDropCnt();
        var dragg = Ext.getCmp(draggable.getElement().getId());

        if (!droppable.cleared) {
            dropCnt.setHtml('');
            droppable.cleared = true;
        }
        var x = dragg.getInnerHtmlElement().getX(),
            y = dragg.getInnerHtmlElement().getY(),
            src = dragg.getSrcImage(),
            newImage = dropCnt.add({
            xtype: 'component',
            top: y,//Falta poner dinamico el x y y
            left: x,
            draggable: true,
            html: '<img src="'+src+'" width="150" height="150">',
            width: 150,
            height: 150
            //style: "background-image: url('./resources/images/001.jpg');"
        });
        me.addListeners(newImage, x, y);
        dragg.destroy();
    },

    onShowPrincipal: function (c) {
        /*console.log(c);
        var me = this,
            redSquare = c.down('#redSquare'),
            blueSquare = c.down('#blueSquare');

        me.addListeners(redSquare, 10, 10);
        me.addListeners(blueSquare, 200, 10);*/
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
        //console.log('setSelected', dropCnt.getItems().items);
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
            draggable: true,
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
        var me = this;
        me.rotate(me.getRotationAngle());

    },
    onButtonRotateLTap:function(){
        console.log('rotateL');
        var me = this;
        me.rotate(-me.getRotationAngle());
    },

    rotate:function(angle){
        var me = this,
            image = me.getSelected();
        me.getTransformDetails()[image.id].lastAngle = me.getTransformDetails()[image.id].angle;
        me.getTransformDetails()[image.id].angle = me.getTransformDetails()[image.id].lastAngle + angle;
        me.updateTransform(image);
    },

    onButtonToFrontTap:function(){
        console.log('frotn');
        var me = this,
            image = me.getSelected();
        image.setZIndex(1000);
    },
    onButtonToBackTap:function(){
        console.log('back');
        var me = this,
            image = me.getSelected();
        image.setZIndex(0);
    },
    onButtonDeleteTap:function(){
        console.log('delete');
        if(this.getSelected()){
            this.getSelected().destroy();
        }
    }
});