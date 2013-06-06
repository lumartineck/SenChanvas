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
        rotationAngle:10,
        minZIndex:undefined,
        maxZIndex:undefined,
        refs: {
            panelPrincipal: '#principalPanel',
            imagesDataview:'imagesdataview',
            draggsCnt: '#draggsCnt',
            dropCnt: '#dropable',
            buttonsAct: '#buttons',
            navigationBar: '#navigationBar'
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
            },
            'button[action=clearDroppable]':{
                tap:'onClearButtonTap'
            },
            'button[action=expand]':{
                tap:'onExpandButtonTap'
            }
        }
    },

    init: function() {
        Ext.getStore('Images').load();

        //Ext.getStore('Images').on('load',this.createContImages.bind(this));
    },

    createContImages: function () {
        Ext.getStore('Images').each(function (item, index, lenght){
            var src = item.get('src'),
                cnt = Ext.getCmp('draggsCnt');
            console.log('connnn',cnt)
            cnt.add({
                xtype: 'image',
                draggable: true,
                src: src,
                height: 100,
                width: 100
            });
        });
    },

    onDraggsCntInit: function(cnt) {
        var me = this,
            drop = me.getDropCnt();

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

    onDrop: function(droppable, draggable, e) {
        console.log('has ganadooo..');
        var me = this,
            elemnt = draggable.getElement(),
            heightNavigationBar = me.getNavigationBar().element.dom.offsetHeight,
            heightButtons = me.getButtonsAct().element.dom.offsetHeight;
        console.log('Dropped', arguments);
        var dropCnt = me.getDropCnt();
        var dragg = Ext.getCmp(draggable.getElement().getId());

        console.log('AQUI', dragg, draggable);

            if (!droppable.cleared) {
            dropCnt.setHtml('');
            droppable.cleared = true;
        }

        var x = elemnt.getX(),
            y = elemnt.getY() - (heightButtons+heightNavigationBar),
            src = dragg._src,
            newImage = dropCnt.add({
                xtype: 'component',
                top: y,
                left: x,
                width: 70,
                height: 70,
                style: "background-image: url('"+src+"'); background-size:70px 70px; background-repeat:no-repeat"
            });
            me.getTransformDetails()[newImage.id] = {
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                x: x,
                y: y,
                lastAngle : null,
                shadow:null
            };
        me.setSelectedImage(newImage);
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

        console.log('transformDetails', me.getTransformDetails());
        image.on({
            pinch: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    var imageShadows = me.getTransformDetails()[image.id].shadows;
                    // Get the scale property from the event
                    me.getTransformDetails()[image.id].scaleX = e.scale;
                    me.getTransformDetails()[image.id].scaleY = e.scale;
                    me.getTransformDetails()[imageShadows[0].id].scaleX = e.scale;
                    me.getTransformDetails()[imageShadows[0].id].scaleY = e.scale;
                    me.getTransformDetails()[imageShadows[1].id].scaleX = e.scale;
                    me.getTransformDetails()[imageShadows[1].id].scaleY = e.scale;
                    me.updateTransform(image);
                    me.updateTransform(imageShadows[0]);
                    me.updateTransform(imageShadows[1]);
                },
                scope:me
            },
            rotatestart: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    var imageShadows = me.getTransformDetails()[image.id].shadows;
                    me.getTransformDetails()[image.id].lastAngle = me.getTransformDetails()[image.id].angle;
                    me.getTransformDetails()[imageShadows[0].id].lastAngle = me.getTransformDetails()[imageShadows[0].id].angle;
                    me.getTransformDetails()[imageShadows[1].id].lastAngle = me.getTransformDetails()[imageShadows[1].id].angle;
                },
                scope:me
            },
            rotate: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    var imageShadows = me.getTransformDetails()[image.id].shadows;
                    me.getTransformDetails()[image.id].angle = me.getTransformDetails()[image.id].lastAngle + e.rotation;
                    me.getTransformDetails()[imageShadows[0].id].angle = me.getTransformDetails()[imageShadows[0].id].lastAngle + e.rotation;
                    me.getTransformDetails()[imageShadows[1].id].angle = me.getTransformDetails()[imageShadows[1].id].lastAngle + e.rotation;
                    me.updateTransform(image);
                    me.updateTransform(imageShadows[0]);
                    me.updateTransform(imageShadows[1]);
                },
                scope:me
            },
            drag: {
                element: 'element',
                fn: function (e) {
                    var domElement = me.getDropCnt().element.dom,
                        scaleX = me.getTransformDetails()[image.id].scaleX,
                        scaleY = me.getTransformDetails()[image.id].scaleY,
                        scaledIncrementX = (((image.getHeight() * scaleX) - image.getHeight()) / 2),
                        scaledIncrementY = (((image.getHeight() * scaleY) - image.getHeight()) / 2),

                        limitTop = image.getTop() - scaledIncrementY + me.getButtonsAct().element.dom.offsetHeight+ 10/*padding*/ + e.previousDeltaY,
                        dropBottom = domElement.offsetTop - me.getButtonsAct().element.dom.offsetHeight + domElement.offsetHeight,
                        limitBottom = image.getTop() + image.getHeight() + scaledIncrementY + 10 /*pading*/ + e.previousDeltaY,

                        limitLeft = image.getLeft() - scaledIncrementX + 6 /*pading*/ + e.previousDeltaX,
                        dropRigth = domElement.offsetLeft + domElement.offsetWidth,
                        limitRight = image.getLeft() + image.getWidth() + scaledIncrementX + 10 /*pading*/ + e.previousDeltaX;
                    console.log(domElement.offsetTop, limitTop, domElement.offsetLeft, limitLeft, dropRigth, limitRight, dropBottom, limitBottom);

                    me.setSelectedImage(image);
                    var imageShadows = me.getTransformDetails()[image.id].shadows
                    if(domElement.offsetTop < limitTop
                        && dropBottom > limitBottom){
                        console.log('entro limite top bottom', me.getTransformDetails()[imageShadows[0].id].y,me.getTransformDetails()[imageShadows[1].id].y, e.previousDeltaY);
                        me.getTransformDetails()[image.id].y += e.previousDeltaY;
                        me.getTransformDetails()[imageShadows[0].id].y += e.previousDeltaY;
                        me.getTransformDetails()[imageShadows[1].id].y += e.previousDeltaY;
                    }
                    if(domElement.offsetLeft < limitLeft
                        && dropRigth > limitRight){
                        console.log('entro limite left rigth', me.getTransformDetails()[imageShadows[0].id].x, me.getTransformDetails()[imageShadows[1].id].x,  e.previousDeltaX);
                        me.getTransformDetails()[image.id].x += e.previousDeltaX;
                        me.getTransformDetails()[imageShadows[0].id].x += e.previousDeltaX;
                        me.getTransformDetails()[imageShadows[1].id].x += e.previousDeltaX;
                    }
                    me.updateTransform(image);
                    me.updateTransform(imageShadows[0]);
                    me.updateTransform(imageShadows[1]);
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
            console.log('entrooooo');
        Ext.each(dropCnt.getItems().items, function(item){
            if(item.id == image.id) {
                var xL = me.getTransformDetails()[image.id].x -10,
                    yL = me.getTransformDetails()[image.id].y -10,
                    xR = (me.getTransformDetails()[image.id].x + image.getWidth()) - 10,
                    yR = (me.getTransformDetails()[image.id].y + image.getHeight()) - 10;
                if(!me.getTransformDetails()[image.id].shadows){
                var imageShadows = [dropCnt.add({
                    xtype: 'component',
                    top: yL,
                    left: xL,
                    width: 20,
                    height: 20,
                    //src: './resources/images/border4.png'
                    style: "background-image: url('./resources/images/corner.png'); background-size:20px 20px; background-repeat:no-repeat"
                }),dropCnt.add({
                    xtype: 'component',
                    top: yR,
                    left: xR,
                    width: 20,
                    height: 20,
                    //src: './resources/images/border4.png'
                    style: "background-image: url('./resources/images/corner.png'); background-size:20px 20px; background-repeat:no-repeat"
                })];

                console.log(imageShadows);
                imageShadows[0].setZIndex(image._zIndex + 1);
                imageShadows[1].setZIndex(image._zIndex + 1);

                me.getTransformDetails()[image.id].shadows = imageShadows;
                console.log('creado el shadow', me.getTransformDetails()[image.id].shadows);

                me.getTransformDetails()[imageShadows[0].id] = {
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0,
                    x: xL,
                    y: yL,
                    lastAngle : null
                };

                me.getTransformDetails()[imageShadows[1].id] = {
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0,
                    x: xR,
                    y: yR,
                    lastAngle : null
                };
                imageShadows[0].on({
                    drag: {
                        element: 'element',
                        fn: function (e, node) {
                            var scaleX, scaleY;
                            console.log('eeee', e, e.pageX, e.pageY);
                            console.log('compare', e.startX, image.getLeft() + image.getWidth() + 10);

                            if(e.pageX > e.startX){
                                console.log('1111', e.pageX, e.startX);
                                scaleX = e.pageX / e.startX;
                            } else {
                                console.log('2222', e.pageX, e.startX);
                                scaleX =  e.startX / e.pageX;
                            }
                            if(e.pageY > e.startY){
                                console.log('3333', e.pageX, e.startY);
                                scaleY =  e.pageY / e.startY;
                            } else {
                                console.log('4444', e.pageX, e.startY);
                                scaleY =  e.pageY / e.startY;
                            }

                            console.log('scalasssss',scaleX, scaleY);

                            var scaledIncrementX = (((image.getWidth() * scaleX) - image.getWidth()) / 2),
                                scaledIncrementY = (((image.getHeight() * scaleY) - image.getHeight()) / 2);

                            console.log('incrementar',scaledIncrementX, scaledIncrementY);
                            console.log('icon',me.getTransformDetails()[image.id]);
                            console.log('scale', e.pageX, e.startX, e.pageY, e.startY, scaleX, scaleY);
                                me.getTransformDetails()[imageShadows[0].id].x = me.getTransformDetails()[image.id].x - scaledIncrementX - 10;
                                me.getTransformDetails()[imageShadows[0].id].y = me.getTransformDetails()[image.id].y - scaledIncrementY - 10;
                                me.getTransformDetails()[imageShadows[1].id].x = (me.getTransformDetails()[image.id].x + image.getWidth()) + scaledIncrementX - 10;
                                me.getTransformDetails()[imageShadows[1].id].y = (me.getTransformDetails()[image.id].y + image.getHeight()) + scaledIncrementY - 10;
                                me.getTransformDetails()[image.id].scaleX = scaleX;
                                me.getTransformDetails()[image.id].scaleY = scaleY;
                                me.updateTransform(imageShadows[0]);
                                me.updateTransform(imageShadows[1]);
                                me.updateTransform(image);
                        }
                    }
                });

                imageShadows[1].on({
                    drag: {
                        element: 'element',
                        fn: function (e, node) {
                            var scaleX, scaleY;
                            console.log('eeee', e, e.pageX, e.pageY);
                            console.log('compare', e.startX, image.getLeft() + image.getWidth() + 10);

                            if(e.pageX > e.startX){
                                console.log('1111', e, e.pageX, e.startX);
                                scaleX = e.pageX / e.startX;
                            } else {
                                console.log('2222', e, e.pageX, e.startX);
                                scaleX =  e.pageX / e.startX;
                            }

                            if(e.pageY > e.startY){
                                console.log('3333', e, e.pageX, e.startY);
                                scaleY = e.pageY / e.startY;
                            } else {
                                console.log('4444', e, e.pageX, e.startY);
                                scaleY = e.pageY / e.startY;
                            }

                            var scaledIncrementX = (((image.getWidth() * scaleX) - image.getWidth()) / 2),
                                scaledIncrementY = (((image.getHeight() * scaleY) - image.getHeight()) / 2);

                            console.log(scaledIncrementX, scaledIncrementY);
                            console.log('icon',me.getTransformDetails()[image.id]);
                            console.log('scale', e.pageX, e.startX, e.pageY, e.startY, scaleX, scaleY);
                            me.getTransformDetails()[imageShadows[1].id].x = (me.getTransformDetails()[image.id].x + image.getWidth()) + scaledIncrementX - 10;
                            me.getTransformDetails()[imageShadows[1].id].y = (me.getTransformDetails()[image.id].y + image.getHeight()) + scaledIncrementY - 10;
                            me.getTransformDetails()[imageShadows[0].id].x = me.getTransformDetails()[image.id].x - scaledIncrementX - 10;
                            me.getTransformDetails()[imageShadows[0].id].y = me.getTransformDetails()[image.id].y - scaledIncrementY - 10;
                            me.getTransformDetails()[image.id].scaleX = scaleX;
                            me.getTransformDetails()[image.id].scaleY = scaleY;
                            me.updateTransform(imageShadows[1]);
                            me.updateTransform(imageShadows[0]);
                            me.updateTransform(image);
                        }
                    }
                });
                } else {
                    me.getTransformDetails()[image.id].shadows[0].setHidden(false);
                    me.getTransformDetails()[image.id].shadows[1].setHidden(false);
                }
            } else {
                if(me.getTransformDetails()[item.id].shadows){
                    me.getTransformDetails()[item.id].shadows[0].setHidden(true);
                    me.getTransformDetails()[item.id].shadows[1].setHidden(true);
                }
            }

        });
        me.setSelected(image);
    },

    updateTransform:function(image){
        var me = this;
        //console.log('update', me.getTransformDetails()[image.id]);
        image.element.setStyle('-webkit-transform', 'scaleX(' + me.getTransformDetails()[image.id].scaleX
            + ') scaleY(' + me.getTransformDetails()[image.id].scaleY + ') rotate('
            + me.getTransformDetails()[image.id].angle + 'deg)');

        image.setLeft(me.getTransformDetails()[image.id].x);
        image.setTop(me.getTransformDetails()[image.id].y);
    },

    onItemTouchStart:function ( dataview, index, target, record, e, eOpts ) {

        Ext.create('Ext.util.Draggable', {
            element: "image-"+record.get('id'),
            threshold: 0,
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
            image = me.getSelected(),
            imageShadows = me.getTransformDetails()[image.id].shadows;

        me.getTransformDetails()[image.id].lastAngle = me.getTransformDetails()[image.id].angle;
        me.getTransformDetails()[image.id].angle = me.getTransformDetails()[image.id].lastAngle + angle;

        var angleRot = (me.getTransformDetails()[image.id].angle * Math.PI) / 180;

        console.log('angulo de rotacion',angleRot);
        me.getTransformDetails()[imageShadows[0].id].x = (me.getTransformDetails()[imageShadows[0].id].x * Math.cos(angleRot)) - (me.getTransformDetails()[imageShadows[0].id].y * Math.sin(angleRot)) - 10;
        me.getTransformDetails()[imageShadows[0].id].y = (me.getTransformDetails()[imageShadows[0].id].y * Math.cos(angleRot)) + (me.getTransformDetails()[imageShadows[0].id].x * Math.sin(angleRot)) - 10;
        me.getTransformDetails()[imageShadows[1].id].x = ((me.getTransformDetails()[imageShadows[1].id].x) * Math.cos(angleRot)) - (me.getTransformDetails()[imageShadows[1].id].y * Math.sin(angleRot)) - 10;
        me.getTransformDetails()[imageShadows[1].id].y = ((me.getTransformDetails()[imageShadows[1].id].y)* Math.cos(angleRot)) + (me.getTransformDetails()[imageShadows[1].id].x * Math.sin(angleRot)) - 10;
        /*me.getTransformDetails()[imageShadows[0].id].lastAngle = me.getTransformDetails()[imageShadows[0].id].angle;
        me.getTransformDetails()[imageShadows[0].id].angle = me.getTransformDetails()[imageShadows[0].id].lastAngle + angle;
        me.getTransformDetails()[imageShadows[1].id].lastAngle = me.getTransformDetails()[imageShadows[1].id].angle;
        me.getTransformDetails()[imageShadows[1].id].angle = me.getTransformDetails()[imageShadows[1].id].lastAngle + angle;*/
        me.updateTransform(image);
        me.updateTransform(imageShadows[0]);
        me.updateTransform(imageShadows[1]);
    },

    onButtonToFrontTap:function(){
        var me = this,
            image = me.getSelected(),
            imageShadows = me.getTransformDetails()[image.id].shadows,
            zIndex = me.getMaxZIndex()?me.getMaxZIndex()+1:100;

        image.setZIndex(zIndex);
        imageShadows[0].setZIndex(zIndex);
        imageShadows[1].setZIndex(zIndex);
        me.setMaxZIndex(zIndex);
    },
    onButtonToBackTap:function(){
        var me = this,
            image = me.getSelected(),
            imageShadows = me.getTransformDetails()[image.id].shadows,
            zIndex = (me.getMinZIndex() || me.getMinZIndex() == 0) ? me.getMinZIndex()-1 : 0;

        image.setZIndex(zIndex);
        imageShadows[0].setZIndex(zIndex);
        imageShadows[1].setZIndex(zIndex);
        me.setMinZIndex(zIndex);
    },
    onButtonDeleteTap:function(){
        if(this.getSelected()){
            this.getSelected().destroy();
            this.getSelectedShadow().destroy();
        }
    },
    onClearButtonTap:function(){
        var me = this,
            droppable = me.getMain().down('#dropable');
        droppable.removeAll(true,true);

        me.createContImages();
    },
    onExpandButtonTap: function () {
        var me = this,
            image = me.getSelected();
            //imageShadow = me.getTransformDetails()[image.id].shadow;
        if (image) {
            var domElement = me.getDropCnt().element.dom,
                dropBottom = domElement.offsetTop - me.getButtonsAct().element.dom.offsetHeight + domElement.offsetHeight,
                dropRigth = domElement.offsetLeft + domElement.offsetWidth,
                scaleX = dropRigth / image.getWidth() ,
                scaleY = dropBottom / image.getHeight(),
                scaledIncrementX = (((image.getWidth() * scaleX) - image.getWidth()) / 2),
                scaledIncrementY = (((image.getHeight() * scaleY) - image.getHeight()) / 2);

                /*scaleShadowX = dropRigth / imageShadow.getWidth(),
                scaleShadowY = dropBottom / imageShadow.getHeight(),
                scaledIncrementShadowX = (((imageShadow.getWidth() * scaleShadowX) - imageShadow.getWidth()) / 2),
                scaledIncrementShadowY = (((imageShadow.getWidth() * scaleShadowY) - imageShadow.getWidth()) / 2);*/

            me.getTransformDetails()[image.id].scaleX = scaleX;
            me.getTransformDetails()[image.id].scaleY = scaleY;

            /*me.getTransformDetails()[imageShadow.id].scaleX = scaleShadowX;
            me.getTransformDetails()[imageShadow.id].scaleY = scaleShadowY;*/

            me.getTransformDetails()[image.id].x = domElement.offsetLeft + scaledIncrementX - 3;
            me.getTransformDetails()[image.id].y = domElement.offsetTop - me.getButtonsAct().element.dom.offsetHeight + scaledIncrementY - 8;

            /*me.getTransformDetails()[imageShadow.id].x = domElement.offsetLeft + scaledIncrementShadowX - 2;
            me.getTransformDetails()[imageShadow.id].y = domElement.offsetTop - me.getButtonsAct().element.dom.offsetHeight + scaledIncrementShadowY - 10;*/
            console.log(me.getTransformDetails()[image.id]);
            //console.log(me.getTransformDetails()[imageShadow.id]);
            me.updateTransform(image);
            //me.updateTransform(imageShadow);
        }
    }
});