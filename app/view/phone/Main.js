/**
 * @class SenChanvas.view.phone.Main
 * @extends SenChanvas.view.Main
 * This is the view class for our phone application
 */
Ext.define('SenChanvas.view.phone.Main', {
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
                layout: 'vbox',
                items: [
                    {
                        xtype: 'container',
                        id: 'dropable',
                        flex: 4,
                        items: [
                            {xtype: 'component',
                                html: 'Pinch me',
                                itemId: 'redSquare',
                                top: 10,
                                left: 10,
                                width: 300,
                                height: 300,
                                style: 'background: red'
                            },
                            {
                                xtype: 'component',
                                html: 'Pinch me',
                                itemId: 'blueSquare',
                                top: 10,
                                left: 200,
                                width: 300,
                                height: 300,
                                style: 'background: blue'}
                        ]
                    },
                    {
                        xtype: 'imagesdataview',
                        id: 'draggsCnt',
                        flex: 1
                    }
                ]
            }
        ]
    }
});