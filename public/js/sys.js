var Sys = {

    init : function(){
        this.addItem();
        this.updateItem();
        this.removeItem();
    },

    updateItem : function(){
        var saveSys = $("#saveSys");
        saveSys.click(function(){
            var $btn = $(this).button('loading');
            debounce(function(){
                $.post("/sys",{settingArr : Sys.getDomData()},function(result){
                    $btn.button('reset');
                    Sys.showTip("succ","保存成功!","sys-box");
                });
            },1000,true)();

        })
    },

    removeItem : function() {
        //绑定删除元素事件
        $("#sys-box").delegate('.del-item', 'click', function() {
            $(this).parents(".form-group").remove();
        });
    },

    addItem : function(){
        var addItemBtn = $("#addItemBtn"),
            saveNewItem =  $("#saveNewItem"),
            addItemModal = $("#addItemModal");
        //绑定模态框弹出事件
        addItemBtn.click(function(){
            $("#addItemModal").modal();
        })

        saveNewItem.click(function(){
            var data =  [addItemModal.find('input[name=cfg_name]').val(),addItemModal.find('input[name=cfg_field]').val(),addItemModal.find('input[name=cfg_value]').val(),$("#dropdownMenuType").attr("data-type")];

           // return true;
            $.each(data,function(i,v){
                data[i] = $.trim(v);
            })

            //更新页面item
            var html = '<div class="form-group">'+
                '<label for="message-text" class="control-label">' + data[0] + '</label>'+
                '<div class="input-group" data-type="'+ data[3] +'">'+
                '<input type="text" class="form-control" name="'+ data[1] +'"  value="'+ data[2] +'">';

            if(data[3] == "file") html += '<span class="input-group-btn"> <button class="btn btn-default del-item" >上传</button> </span>' ;
            html += '<span class="input-group-btn"> <span class="btn btn-default del-item" >删除</span> </span></div></div>'
            $(html).insertBefore(".form-actions")
            $("#addItemModal").modal("hide")
        })
    },

    getDomData : function(){
        var data = [];
        $("#sys-box .form-group").each(function(){
            var  _this = $(this);
            data.push([_this.find(".form-control").attr("name"),_this.find(".control-label").text(),_this.find(".form-control").val(),_this.find(".input-group").attr("data-type")]);
        });
        return data;
    },

    showTip : function(type, str,target){
        var tpl = ""
        if(type == "succ") {
            tpl =  '<div class="alert alert-success" role="alert">' + str +'</div>'
        } else if (type == "warning") {
            tpl = '<div class="alert alert-warning" role="alert">' + str + '</div>'
        };
        $(tpl).insertBefore("#" + target);
        setTimeout(function(){
            $("div[role=alert]").remove();
        },2000)
    }
};

Sys.init();
