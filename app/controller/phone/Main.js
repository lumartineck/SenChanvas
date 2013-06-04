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
                width: 50,
                height: 50,
                style: "background-image: url('"+src+"'); background-size:50px 50px; background-repeat:no-repeat"
            });
            me.getTransformDetails()[newImage.id] = {
                scaleX: 1,
                scaleY: 1,
                angle: 0,
                x: x,
                y: y
            }
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

        me.getTransformDetails()[image.id] = {
            scaleX: 1,
            scaleY: 1,
            angle: 0,
            x: x,
            y: y,
            lastAngle : null,
            shadow:null
        };
        console.log('transformDetails', me.getTransformDetails());
        image.on({
            pinch: {
                element: 'element',
                fn: function (e) {
                    me.setSelectedImage(image);
                    // Get the scale property from the event
                    me.getTransformDetails()[image.id].scaleX = e.scale;
                    me.getTransformDetails()[image.id].scaleY = e.scale;
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
                        limitRight = image.getLeft() + image.getWidth() + scaledIncrementX + 10 /*pading*/ + e.previousDeltaX,
                        imageSom = me.getTransformDetails()[image.id].shadow;
                    console.log(domElement.offsetTop, limitTop, domElement.offsetLeft, limitLeft, dropRigth, limitRight, dropBottom, limitBottom);
                    //console.log(image.getTop(), ((image.getTop() * scale) - image.getTop()) / 2);
                    //me.setSelectedImage(image);
                    console.log(imageSom);
                    /**Esto ya no es necesario por que ya lo creaste en el metodo setSelectedImage
                     * me.getTransformDetails()[imageSom.id] = {
                        scaleX: 1,
                        scaleY: 1,
                        angle: 0,
                        x: imageSom.element.dom.offsetLeft, //Aparte aca le estas poniendo la misma x y y que ya traen
                        y: imageSom.element.dom.offsetTop,
                        lastAngle : null
                    };*/

                    if(domElement.offsetTop < limitTop
                        && dropBottom > limitBottom){
                        console.log('entro limite top bottom');
                        me.getTransformDetails()[image.id].y += e.previousDeltaY;
                        me.getTransformDetails()[imageSom.id].y += e.previousDeltaY // aca esta bien cambiar la coordenada solo que pienso que debes de darle un poquito mas arriba o algo asi pero ya veras tu
                    }
                    if(domElement.offsetLeft < limitLeft
                        && dropRigth > limitRight){
                        console.log('entro limite left rigth');
                        me.getTransformDetails()[image.id].x += e.previousDeltaX;
                        me.getTransformDetails()[imageSom.id].x += e.previousDeltaX;
                    }
                    //me.getTransformDetails()[image.id].scale = 1.5;
                    me.updateTransform(image);
                    me.updateTransform(imageSom);
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
        //console.log('setSelected', me.getTransformDetails()[image.id], image);
        Ext.each(dropCnt.getItems().items, function(item){
            if(item.id == image.id) {
                var xL = me.getTransformDetails()[image.id].x -10,
                    yL = me.getTransformDetails()[image.id].y -10;
                var imageShadow = dropCnt.add({
                    xtype: 'component',
                    top: yL,
                    left: xL,
                    width: 70,
                    height: 70,
                    style: "background-image: url('./resources/images/border4.png'); background-size:70px 70px; background-repeat:no-repeat"
                });
                imageShadow.setZIndex(image._zIndex - 1);

                //se guarfa la referencia entre la imagen y su sombra
                me.getTransformDetails()[image.id].shadow = imageShadow;

                //Estos son los detalles de imageShadow para ser utilizados cuando se manda a llamar updateTransform
                me.getTransformDetails()[imageShadow.id] = {
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0,
                    x: xL,
                    y: yL,
                    lastAngle : null
                };

                imageShadow.on({
                    drag: {
                        element: 'element',
                        fn: function (e, node) {
                            console.log('eeee',e);
                            //if( e.getTarget('div.circleBase')){
                                var scaleX =  e.pageX / e.startX,
                                    scaleY =  e.startY / e.pageY;

                            console.log('icon',imageShadow);
                            console.log('scale', scaleX, scaleY);
                                /*var scaleImageX =
                                    scaleImageY = */
                                me.getTransformDetails()[imageShadow.id].scaleX = scaleX;
                                me.getTransformDetails()[imageShadow.id].scaleY = scaleY;
                                me.getTransformDetails()[image.id].scaleX = scaleX;
                                me.getTransformDetails()[image.id].scaleY = scaleY;
                                me.updateTransform(imageShadow);
                                me.updateTransform(image);

                                /*var valX = me.getTransformDetails()[image.id].scaleX * me.getTransformDetails()[image.id].x,
                                    valorX = (valX - me.getTransformDetails()[image.id].x ) / me.getTransformDetails()[image.id].scaleX,
                                    valY = me.getTransformDetails()[image.id].scaleY * me.getTransformDetails()[image.id].y,
                                    valorY = (valY - me.getTransformDetails()[image.id].y) / me.getTransformDetails()[image.id].scaleY;

                                console.log('transsformer',valorX, valorY);
                                /*me.getTransformDetails()[iconTopLeft.id].x = (me.getTransformDetails()[image.id].x - valorX) - 12;
                                me.getTransformDetails()[iconTopLeft.id].y = (me.getTransformDetails()[image.id].y - valorY) - 10;
                                me.updateTransform(iconTopLeft);*/
                            //}
                        }
                    }
                });

                /*var xR = image.element.dom.offsetLeft + (image.element.dom.clientHeight - 9),
                    yR = image.element.dom.offsetTop + (image.element.dom.clientHeight - 7);


                var iconBottomRight = dropCnt.add({
                    xtype: 'container',
                    top: yR,
                    left: xR,
                    width: 20,
                    height: 20,
                    cls: 'circleBase circle'
                });

                me.getTransformDetails()[iconBottomRight.id] = {
                    scaleX: 1,
                    scaleY: 1,
                    angle: 0,
                    x: xR,
                    y: yR,
                    lastAngle : null
                };

                iconBottomRight.on({
                    drag: {
                        element: 'element',
                        fn: function (e, node) {
                            if( e.getTarget('div.circleBase')){
                                var scaleX = e.pageX / e.startX,
                                    scaleY = e.pageY / e.startY;
                                me.getTransformDetails()[image.id].scaleX = scaleX;
                                me.getTransformDetails()[image.id].scaleY = scaleY;
                                me.updateTransform(image);

                                var valX = me.getTransformDetails()[image.id].scaleX * me.getTransformDetails()[image.id].x,
                                    valorX = (valX - me.getTransformDetails()[image.id].x ) / me.getTransformDetails()[image.id].scaleX,
                                    valY = me.getTransformDetails()[image.id].scaleY * me.getTransformDetails()[image.id].y,
                                    valorY = (valY - me.getTransformDetails()[image.id].y) / me.getTransformDetails()[image.id].scaleY;

                                console.log('transsformer',valorX, valorY);
                                me.getTransformDetails()[iconBottomRight.id].x = (me.getTransformDetails()[image.id].x + image.element.dom.clientHeight + valorX);
                                me.getTransformDetails()[iconBottomRight.id].y = (me.getTransformDetails()[image.id].y + image.element.dom.clientHeight + valorY);
                                me.updateTransform(iconBottomRight);
                            }
                        }
                    }
                });*/
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
        console.log('rotate', me.getTransformDetails());
        me.getTransformDetails()[image.id].lastAngle = me.getTransformDetails()[image.id].angle;
        me.getTransformDetails()[image.id].angle = me.getTransformDetails()[image.id].lastAngle + angle;
        me.updateTransform(image);
    },

    onButtonToFrontTap:function(){
        var me = this,
            image = me.getSelected(),
            zIndex = me.getMaxZIndex()?me.getMaxZIndex()+1:100;
        image.setZIndex(zIndex);
        me.setMaxZIndex(zIndex);
    },
    onButtonToBackTap:function(){
        var me = this,
            image = me.getSelected(),
            zIndex = (me.getMinZIndex() || me.getMinZIndex() == 0) ? me.getMinZIndex()-1 : 0;
        image.setZIndex(zIndex);
        me.setMinZIndex(zIndex);
    },
    onButtonDeleteTap:function(){
        if(this.getSelected()){
            this.getSelected().destroy();
        }
    },
    onClearButtonTap:function(){
        var me = this,
            droppable = me.getMain().down('#dropable');
        droppable.removeAll(true,true);

        me.createContImages();
    },
    onExpandButtonTap:function(){

    }
});