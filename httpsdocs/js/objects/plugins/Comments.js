Ext.namespace('CB.objects.plugins');

CB.objects.plugins.Comments = Ext.extend(CB.objects.plugins.Base, {

    initComponent: function(){

        var tpl = new Ext.XTemplate(
            // <div>
            //     View 12 more comments
            // </div>

            '<table class="block-plugin" style="margin:0">'
            ,'<tpl for="data">'
            ,'<tr>'
            ,'    <td class="obj">'
            ,'        <img class="i32" src="/photo/{cid}.jpg" title="{user}">'
            ,'    </td>'
            ,'    <td>'
            ,'        <span class="">{content}</span><br />'
            ,'        <span class="gr">{cdate_text}</span>'
            ,'    </td>'
            ,'</tr>'
            ,'</tpl>'
            ,'</table>'
        );

        this.dataView = new Ext.DataView({
            tpl: tpl
            ,autoHeight: true
            ,itemSelector:'tr'
        });

        this.messageField = new Ext.form.TextArea({
            emptyText: 'Write a comment...'
            ,flex: 1
            ,height: 32
            // ,autoHeight: true
            ,enableKeyEvents: true
            ,style: 'margin-top: 5px; font-family: \'lucida grande\',tahoma,verdana,arial,sans-serif; font-size: 11px'
            ,listeners: {
                scope: this
                ,keypress: this.onMessageBoxKeyPress
            }
        });
        this.messageField.on('focus', this.messageField.syncSize, this.messageField);

        Ext.apply(this, {
            title: L.Comments
            ,cls: 'block-plugin-comments'
            ,autoHeight: true
            ,items: [
                this.dataView
                ,{
                    xtype: 'compositefield'
                    ,layout: 'hbox'
                    ,cls: 'msg-box'
                    ,autoHeight: true
                    ,items: [
                        {
                            xtype: 'label'
                            ,html: '<img class="i32" src="/photo/' + App.loginData.id + '.jpg">'
                        }
                        ,this.messageField
                    ]
                }
            ]
        });
        CB.objects.plugins.Comments.superclass.initComponent.apply(this, arguments);

    }

    ,onLoadData: function(r, e) {
        this.loadedData = r;
        if(this.rendered) {
            this.dataView.update(r);
        } else {
            this.dataView.data = r;
        }
    }

    ,onMessageBoxKeyPress: function(tf, e) {
        this.messageField.syncSize();
        this.syncSize();
        if ((e.getKey() == e.ENTER)) {
            if(e.hasModifier()) {
                // this.messageField.setValue(this.messageField.getValue()+"\n");
            } else {
                var msg = tf.getValue().trim();
                if(Ext.isEmpty(msg)) {
                    return;
                }
                CB_Objects.addComment(
                    {
                        id: this.params.id
                        ,msg: msg
                    }
                    ,this.onAddCommentProcess
                    ,this
                );
            }
        }
    }

    ,onAddCommentProcess: function(r, e) {
        this.messageField.setValue('');
        if(r.success !== true) {
            return;
        }

        if(Ext.isEmpty(this.loadedData.data)) {
            this.loadedData.data = [];
        }
        this.loadedData.data.push(r.data);
        this.onLoadData(this.loadedData);
    }


});

Ext.reg('CBObjectsPluginsComments', CB.objects.plugins.Comments);
