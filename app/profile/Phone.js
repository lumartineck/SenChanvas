/**
 * @class SenChanvas.profile.Phone
 * @extends Ext.app.Profile
 * This is the phone profile
 * @manduks
 */
Ext.define('SenChanvas.profile.Phone', {
    extend: 'Ext.app.Profile',
    
    config: {
        name: 'phone',
		namespace: 'phone',
		controllers: ['Main'],
		views: ['Main']
    },
	isActive: function(){
		return Ext.os.is.Phone;
	},
	launch: function(){
		// Ext.create('SenChanvas.view.phone.Main');
		Ext.Viewport.add(Ext.create('SenChanvas.view.phone.Main'));
	}
});