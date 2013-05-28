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
        itemTpl: [
                '<div class="image-dataview-item" id="image-{id}">',
                	'<div class="image" style="margin:5px;">',
                		'<img src="{src}" style="width:50px; height:50px">',
                	'</div>',
                '</div>'
        ]
    }
});