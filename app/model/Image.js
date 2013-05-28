/**
 * @class CanvasChallenge.model.Image
 * @extends Ext.data.Model
 * This is the model 
 */
Ext.define('SenChanvas.model.Image', {
    extend: 'Ext.data.Model',

    config: {
        fields: [{
            name: 'id',
            type: 'int'
        },{
            name: 'author',
            type: 'string'
        }, {
            name: 'src',
            type: 'string'
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'price',
            type: 'float'
        } ],
        proxy: {
            type: 'jsonp',
            url: 'server/images.json',
            reader: {
                type: 'json',
                rootProperty: 'images'
            }
        }
    }
});