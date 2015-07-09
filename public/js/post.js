var Post = {

    init : function(){
        this.event();
    },

    event : function(){
        //上传图片
        $("#post-box").delegate(".btn-upload","click",function(){
            $("#fileBrower").modal();
            $(this).parent().prev().addClass("cur");
            return false;
        })
    },

    showTip : function(type, str,target){
        if(type == "succ") {
            toastr.success(str);
        } else if (type == "warning") {
            toastr.error(str);
        };
    }
};
Post.init();

function fileSelectCb(path){
    $("#post-box").find(".cur").val(path);
    $("#fileBrower").modal("hide");
};
