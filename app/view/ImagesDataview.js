/**
 * @class CanvasChallenge.view.ImagesDataview
 * @extends Ext.dataview.DataView
 * This is the dataview for the images thats scrolls horizontal
 */
Ext.define('SenChanvas.view.ImagesDataview', {
    extend: 'Ext.dataview.DataView',
    alias: 'widget.imagesdataview',
    config: {
        store: 'Images',
        ui: 'image',
        masked: {
            xtype: 'loadmask',
            message: 'Cargando'
        },
        emptyText: 'No hay imagenes ...',
        scrollable: 'horizontal',
        inline: {
            wrap: false
        },
        layout: 'hbox',
        /*itemTpl: [
                '<div class="image-dataview-item" id="image-{id}" draggable="true" style="z-index:10;overflow:visible;">',
                	'<div class="image" style="margin:5px;">',
                		'<img src="{src}" style="width:50px; height:50px; z-index:2000;">',
                	'</div>',
                '</div>'
        ],*/
        items:[
            {
                xtype: 'image',
                src: './resources/images/001.jpg',
                height:100,
                width: 100,
                draggable: true
            },
            {
                xtype: 'image',
                src: './resources/images/002.jpg',
                height:100,
                width: 100,
                draggable: true
            },
            {
                xtype: 'image',
                src: './resources/images/003.jpg',
                height:100,
                width: 100,
                draggable: true
            }
        ]
    }/*,

    initialize: function () {
        this.callParent(arguments);
        var me = this;
        //get the divs that we want to make draggable
        //
        setTimeout(function (argument) {
            var images = me.element.select("div.image-dataview-item");
            Ext.each(images.elements, function (imageElement) {
                var draggable = new Ext.util.Draggable({
                    element: imageElement,
                    listeners: {
                        dragstart: function(self, e, startX, startY) {
                            console.log("test dragStart[" + startX + ":" + startY + "]");
                        },
                        drag: function(self, e, newX, newY) {
                            console.log("test drag[" + newX + ":" + newY + "]");
                        },
                        dragend: function(self, e, endX, endY) {
                            console.log("test dragend[" + endX + ":" + endY + "]");
                        }
                    }
                });
                draggable.setConstraint({
                    min: { x: -Infinity, y: -Infinity },
                    max: { x: Infinity, y: Infinity }
                });
                draggable.group = 'base';// Default group for droppable
                draggable.revert = true;

                console.log('dragable..', draggable);
            });

            var drop = Ext.create('Ext.ux.util.Droppable', {
                element: Ext.getCmp('dropable').element,
                group : 'base',
                listeners: {
                    drop:function  () {
                        console.log(arguments);
                        alert(123);
                    }
                }
            });

            drop.cleared = false;

        },2000);
    }*/
});