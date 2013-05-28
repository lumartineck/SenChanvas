/**
 * @class SenChanvas.profile.Phone
 * @extends Ext.app.Profile
 * This is the tablet profile
 * @manduks
 */
Ext.define('SenChanvas.profile.Tablet', {
    extend: 'Ext.app.Profile',

    config: {
        name: 'tablet',
        namespace: 'tablet',
        controllers: ['Main'],
        views: ['Main']
    },
    isActive: function() {
        return !Ext.os.is.Phone;
    },
    launch: function() {
        // Ext.create('SenChanvas.view.tablet.Main');
        Ext.Viewport.add(Ext.create('SenChanvas.view.tablet.Main'));
    }
});