/**
 * @class SenChanvas.view.phone.Main
 * @extends SenChanvas.view.Main
 * This is the view class for our phone application
 */
Ext.define('SenChanvas.view.phone.Main', {
    extend: 'SenChanvas.view.Main',
    config: {
        navigationBar: {
            id: 'navigationBar',
            items: [
                {
                    xtype: 'button',
                    iconAlign: 'center',
                    text: 'Clear',
                    align: 'left',
                    iconMask: true,
                    action: 'clearDroppable'
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
                id: 'principalPanel',
                title: 'Fancy',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'container',
                        layout:'hbox',
                        id: 'buttons',
                        style: {
                            'border' : 'solid 1px #D7D9DE',
                            'border-radius' : '9px'
                        },
                        margin: '3 5 3 5',
                        defaults: {
                            iconMask: true,
                            xtype: 'button',
                            margin: '3 3 3 3',
                            ui: 'action'
                        },
                        items: [
                            {xtype: 'spacer'},
                            {iconCls: 'add', action: 'expand'},
                            {iconCls: 'refresh', action: 'rotateR'},
                            {iconCls: 'refresh', action: 'rotateL'},
                            {iconCls: 'arrow_up', action: 'toFront'},
                            {iconCls: 'arrow_down', action: 'toBack'},
                            {iconCls: 'delete', action: 'delete'}
                        ]
                    },
                    {
                        xtype: 'container',
                        id: 'dropable',
                        flex: 4,
                        style: {
                            'border' : 'solid 3px #3CA9D0',
                            'border-radius' : '5px'
                        },
                        margin: '3 5 3 5'
                    },
                    {
                        xtype: 'imagesdataview',
                        flex:1,
                        id: 'draggable'
                    }
                ]
            }
        ]
    }
});