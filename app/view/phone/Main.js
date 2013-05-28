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
                id: 'principalPanel',
                title: 'Fancy',
                layout: 'vbox',
                items: [
                    {
                        xtype: 'container',
                        layout:'hbox',
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
                        margin: '3 5 3 5'/*,
                        items: [
                            {
                                xtype: 'component',
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
                        ]*/
                    },
                    {
                        xtype: 'container',
                        id: 'draggsCnt',
                        layout: 'hbox',
                        flex: 1,
                        items: [{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/001.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/001.jpg';
                            }
                        },{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/002.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/002.jpg';
                            }
                        },{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/003.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/003.jpg';
                            }
                        },{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/004.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/004.jpg';
                            }
                        },{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/005.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/005.jpg';
                            }
                        },{
                            xtype: 'component',
                            getSrcImage:function(){
                                return './resources/images/001.jpg';
                            },
                            draggable: true,
                            html: '<img src="./resources/images/001.jpg" width="50" height="50">'
                        },{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/002.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/002.jpg';
                            }
                        },{
                            xtype: 'component',
                            draggable: true,
                            html: '<img src="./resources/images/003.jpg" width="50" height="50">',
                            getSrcImage:function(){
                                return './resources/images/003.jpg';
                            }
                        }]
                    }
                ]
            }
        ]
    }
});