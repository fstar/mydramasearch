/**
 * Created by user on 2017/1/9.
 */

function init_search(){
    $("div[name='filter-message']").css("display", "inline");
    $("#filter-message").val("download error");
    $("#filter-message").attr("name", -1);
}

function request_error_video(url, page){
    var html = "";
    $.get(url, function(data, status){
        $.each(data["videos"], function(i, video){
            html += "<tr>";
            html += "<td>";
            html += "<input type='checkbox' id='" + video["video_id"] + "-checkbox'" +
                " value='" + video["video_id"] + "' name='checkname'>";
            html += "</td>";
            html += "<td>" + video["video_id"] + "</td>";
            html += "<td><a href='" + video["source_url"] + "' target='_blank'>" + video["video_name"] + "</a></td>";
            if (video["status"] == -1){
                html += "<td>download error</td>";
            }else{
                html += "<td>upload error</td>";
            }
            html += "<td style='vertical-align: middle'>" +
                        "<span><select class='from-control' id='" + video["video_id"] + "-download-level" +
                        "' style='height: 30px;margin: 0 1% 0 1%;'><option value='1'>下载低</option><option value='2'>下载中</option>" +
                        "<option value='3'>下载高</option></select></span>";

            html += "<span><button type='button' class='btn btn-primary' id='" +
                        video["video_id"] + "-download'  onclick='download(id_list=" +
                         video["video_id"] + ",status=2,interf=2)'>下载</span></span></td>";
            html += "</tr>";
        });
        $("#json").html(html);
    });
}

 $(function(){
     var status = -1;
     var href = ip  + "/api/video?status=-1";
     request_error_video(href, page=1)
     init_search();
     $("#allSelect").click(function(){
        $("td input:checkbox").each(function(){
            if (!this.disabled){
             this.checked = !this.checked
            }
        })
     });

    $("div[name='choice-message'] ul > li span").click(function(e){
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-message']").css("display", "inline");
        $("#filter-message").val(text);
        $("#filter-message").attr("name", data);
        $("div[name='choice-message'] ul li span").removeAttr("style");
        $(this).attr("style", "color:red")
    });
     $(".remove-message").click(function(e){
        $("div[name='filter-message']").css("display","none");
        $("#filter-message").val("");
        $("#filter-message").attr("name",null);
        $("div[name='choice-message'] ul li span").removeAttr("style");
    });
     $(".search-filter").click(function(e){
        var message = $("#filter-message").attr("name");
        var href = ip +"/api/video?";
        if(message && message != "None"){
            href = href + "&status=" + message
        }
        request_error_video(href, page=1)
     });
});