/**
 * @class CanvasChallenge.store.Images
 * @extends Core.data.Store
 * This is the store for the Images
 */
Ext.define('SenChanvas.store.Images', {
    extend: 'Ext.data.Store',
    requires:['SenChanvas.model.Image'],
    config:{
		model:'SenChanvas.model.Image'
    }
});