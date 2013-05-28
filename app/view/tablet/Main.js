/**
 * @class SenChanvas.view.tablet.Main
 * @extends SenChanvas.view.Main
 * This is the view class for our tablet application
 */
Ext.define('SenChanvas.view.tablet.Main', {
    extend: 'SenChanvas.view.Main',
    config: {
        navigationBar: {
            items: [
                {
                    xtype: 'button',
                    iconAlign: 'center',
                    text: 'Clear',
                    align: 'left',
                    iconMask: true
                },
                {
                    xtype: 'button',
                    iconAlign: 'center',
                    align: 'right',
                    iconMask: true,
                    text: 'Publish'
                }
            ]
        },
        items: [
            {
                xtype: 'panel',
                id:'principalPanel',
                title: 'Fancy',
                items: [
                    {
                        xtype:'component',
                        html: 'Pinch me',
                        itemId:'redSquare',
                        top: 10,
                        left: 10,
                        width: 300,
                        height: 300,
                        style: 'background: red'
                    }
                ]
            }
        ]
    }
});