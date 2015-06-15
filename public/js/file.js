function refreshIframe() {
    window.location.reload();
}

function uploadCb() {
    $('#fileUpload').modal('hide');
    window.location.reload();
}



$(function(){

    //upload file form
    var formHtml = '<input type="hidden" name="src" value="' + $("#filepath").html() +'"/> <div class="alert alert-warning alert-dismissable"> <button aria-hidden="true" data-dismiss="alert" class="close" type="button">×</button> <span>x支持JPG,JPEG,GIF,BMP,SWF,RMVB,RM,AVI文件的上传,文件小于10MB</span> </div> <div class="form-group"><label>File Select</label> <input type="file" name="file" placeholder="File name" class="form-control"></div> ';
    $('#fileUpload').on('show.bs.modal', function (e) {
        $(this).find(".modal-body").html(formHtml)
    });

    $("#refresh").click(function(){
        window.location.reload();
    });

    $(".folder-list a").click(function(){
        var path = $.trim($(this).text());
        $.ajax({
            url: "/file/" + path,
            type: 'GET',
            success: function(data){
                var html = "";
                if(!isEmptyValue(data.fileInfo)) {
                    $.each(data.fileInfo,function(i,v){
                        html  +=  '<div class="file-box" title="' + v.name +'">' +'<div class="file"><span class="badge badge-success badge-select">selected</span>' + '<a href="javascript:void(0)">' + '<span class="corner"></span>' ;
                        if(v["type"] == "file") {
                            html += '<div class="icon">' + '<i class="fa fa-file"></i>' + '</div>' ;
                        } else {
                            html += '<div class="image"><img alt="image" class="img-responsive" src="' + v.path.split("public")[1] + '"></div>'
                        }
                        html += '<div class="file-name"><p class="name" >Name:' + v.name + '</p><p class="size">Size: ' + v.size + '</p><p class="time">Time: ' + v.time + '</p></div></a></div></div>';
                    });
                } else {
                    html = '<div class=" text-center animated fadeInDown" style="padding:50px 0;"> <h3>File List Empty!!!</h3> </div>'
                }


                $("#list-files").attr({"path" : path }).html(html);
                $("#list-files").prev().find("h5").html(path +" Files List");
                $('#list-files .file-box').each(function() {
                    animationHover(this, 'pulse');
                });
                $(".folder-list li").removeClass("cur");
                $(".folder-list li:contains('" +path +"')").addClass("cur");
                $('#fileUpload').modal('hide');

            },
            error: function(xmlHTTPRequest, status, error){
                console.log(status);
            }
        })
        return false;
    });

    //del file
    $("#btn-file-del").click(function(){
        var delList = [],path = $("#filepath").html();
        $(".file-list li").each(function(){
            if($(this).find(".cke input:checked").length != 0) {
                delList.push( $(this).find(".name").text());
            };
        });
        if(delList.length == 0) return;
        $.ajax({
            url: "http://127.0.0.1:3000/fileDel",
            type: 'POST',
            data: {delList : delList,delFilePath : path},
            success: function(data){
                $(".folder-list a:contains('" +path +"')").eq(0).click();
                toastr.success('Del Success!');
            },
            error: function(error){
                toastr.error('Del Error!')
            }
        })
        return false;
    });

    $("#btn-select-all").click(function(){
        $(".file-list li .cke input").attr("checked",true);
    });
    $("#btn-select-cancel").click(function(){
        $(".file-list li .cke input").attr("checked",false);
    });
    $(".btn-view").click(function(){
        var path = $(this).parents("li").attr("path");
        window.open(path);
    });
    $(".btn-select").click(function(){
        var path = $(this).parents("li").attr("path");
        exec_iframe("http://127.0.0.1:3000/proxy/proxy_file_select.html?path=" + path);
    });

})