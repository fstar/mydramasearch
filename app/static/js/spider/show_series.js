/**
 * Created by user on 2016/11/25.
 */
var simple_video = 0;

function translation_video_status(status, video_id){
        if (status == -1){
            return "<td id='download-status-" + video_id +  "'>下载失败</td>";
        }else if (status == -2){
            return "<td id='download-status-" + video_id +  "'>上传失败</td>";
        }else if (status == 1){
            return "<td id='download-status-" + video_id +  "'>未触发下载</td>";
        }else if (status == 2){
            return "<td id='download-status-" + video_id +  "'>等待下载</td>";
        }else if (status == 3){
            return "<td id='download-status-" + video_id +  "'>下载中</td>";
        }else if (status == 4){
            return "<td id='download-status-" + video_id +  "'>下载完成</td>";
        }else if (status == 5){
            return "<td id='download-status-" + video_id +  "'>等待上传</td>";
        }else if(status == 6){
            return "<td id='download-status-" + video_id +  "'>上传中</td>";
        }else if(status == 7){
            return "<td id='download-status-" + video_id +  "'>上传完成</td>";
        }else{
            return "<td id='download-status-" + video_id +  "'>" + status + "</td>";
        }
}

function request_get_json(url){
    $.get(url, function(data, status) {
        var html = "";
        var video_name = data["source_show"]["source_name"];
        $.each(data["source_show"]["video"], function(key,val){
            $.each(val, function(i, show){
                html += "<tr>";
                if (show["status"] < 2 && key != "123kubo" && key != "flv"  && key != "xfplay"){
                    html += "<td><input type='checkbox' id='" + show["video_id"] + "-checkbox' value='" + show["video_id"] + "' name='checkname'></td>";
                }else{
                    html += "<td><input type='checkbox' id='" + show["video_id"] + "-checkbox' value='" + show["video_id"] + "' name='checkname' disabled></td>";
                }
                html += "<td><a href='" + show["source_url"] + "' target='_blank' id='" + show["video_id"] + "-video-name' onmouseover='show_process()' onmouseout='hidden_process()'> " +
                            video_name + "-" + show["episode_num"] + "</a>";
                if(show["aws_url"]){
                    html += "(<a href='" + show["aws_url"] + "' >视频链接</a>)";
                }else{
                    html += "(<a href='javascript:return false;'>待获取中</a>)";
                }
                html += "<div id='" + show["video_id"] + "-process' name='download-process' style='display: none; position: absolute; z-index: 8888;background-color: black; width: 200px;color: white'>" +
                            "<div class='progress' style='width: 95%; margin-left: 5px; margin-top: 20px;display: inline-block'>" +
                            "<span class='progress-bar' role='progressbar' aria-valuenow='60' id='" + show["video_id"] + "-bar'" +
                            "aria-valuemin='0' aria-valuemax='50' style='width:" + show["download_percent"] + "%'></span></div>" +
                            "<span id='" + show["video_id"] + "-percent'>进度:" + show["download_percent"] + "%</span>" +
                            "<span id='" + show["video_id"]  + "-speed'>&nbsp;&nbsp;速度:" + (show["download_speed"]/1024/1024).toFixed(2) + "MB/S</span>";
                html += "</div></td>";
                html += "<td>" + key + "</td>";
                html += "<td>" + parseInt(show["size"]/1024/1024)+ "MB</td>";
                html += "<td>" + show["video_format"] + "</td>";
                html += translation_video_status(show["status"], show["video_id"]);
                html += "<td>";
                html += "<select class='form-control' style='height: 30px;width: 19%;display: inline;margin-right: 2px' id='" +
                        show["video_id"] +"-download-level'> " +
                        "<option value='1' >下载低</option> " +
                        "<option value='2' >下载中</option> " +
                        "<option value='3' >下载高</option></select>";
                if (show["status"] < 2 && key != "123kubo" && key != "flv"  && key != "xfplay"){
                    html +=  "<button type='button' class='btn btn-primary' id='" +
                         show["video_id"] + "-download' " +
                        "onclick='download(" +
                        "id_list=" + show["video_id"] + ",status=2,interf=5" +
                        ")'>下载</button>";
                }else{
                    html +=  "<button type='button' class='btn btn-primary' id='" +
                         show["video_id"] + "-download' " +
                        "onclick='download(" +
                        "id_list=" + show["video_id"] + ",status=2 , interf=5" +
                        ")' disabled>下载</button>";
                }
                if (key != "123kubo" && key != "flv"  && key != "xfplay"){
                    html += "<span style='margin-left:2px'><button type='button' class='btn btn-warning'>投放辨识</button></span>";
                }else{
                    html += "<span style='margin-left:2px'><button type='button' class='btn btn-warning' disabled>投放辨识</button></span>";
                }
                html += "</td>";
            });
            html += "</tr>";
        });
        $("#json").html(html);
    });
}

$(function(){
    $("#allSelect").click(function(){
        $("td input:checkbox").each(function(){
            if (!this.disabled){
             this.checked = !this.checked
            }
        })
    });
    $.getUrlParam = function(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        return r?decodeURIComponent(r[2]):null;
    };
    var source_show_id = $.getUrlParam("source_show_id");

    $("#search").click(function () {
        var video_status = $("select[name='video_status']").val();
        var search_url = null;
        if (video_status && video_status.length > 0){
            search_url = ip  + "/search/show_video?source_show_id=" +
            source_show_id + "&simple_video=" + simple_video + "&video_status=" + video_status;
        }else{
            search_url = ip + "/search/show_video?source_show_id=" +
            source_show_id + "&simple_video=" + simple_video
        }
        request_get_json(search_url);
    });
    var url = ip + "/search/show_video?source_show_id=" + source_show_id +
        "&simple_video=" + simple_video;
    request_get_json(url)
});
