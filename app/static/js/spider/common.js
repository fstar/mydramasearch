/**
 * Created by user on 2016/12/8.
 */
var ip = "http://" +  window.location.host;

String.prototype.replaceAll = function (exp, newStr) {
    return this.replace(new RegExp(exp, "gm"), newStr);
};

/**
 * 原型：字符串格式化
 * @param args 格式化参数值
 */
String.prototype.format = function(args) {
    var result = this;
    if (arguments.length < 1) {
        return result;
    }

    var data = arguments; // 如果模板参数是数组
    if (arguments.length == 1 && typeof (args) == "object") {
        // 如果模板参数是对象
        data = args;
    }
    for ( var key in data) {
        var value = data[key];
        if (undefined != value) {
            result = result.replaceAll("\\{" + key + "\\}", value);
        }
    }
    return result;
};

function time2stamp(time_temp){
        var newstr = time_temp.replace(/-/g, '/')
        var data = new Date(newstr);
        if (data){
            var timestamp2 = data.getTime().toString();
            return timestamp2.substr(0, 10)
        }
        return null

}

function init_warning(text){
    var html = '';
    html += "<div class='alert alert-block warning_style'>" +
                "<button type='button' class='close' data-dismiss='alert'>&times;</button>" +
                "<h4 style='color: #c09853'>警告！</h4>"　+ text + "</div>";
    return html
}

function toValid(id){
    var time1 = $("#time1").val();
    var time2 = $("#time2").val();
    var html = null;
    if (!time1 || !time2){
        html = init_warning("time1 or time2 error");
        $("#" + id).html(html);
        return false
    }
    var time1_stamp = time2stamp(time1);
    var time2_stamp = time2stamp(time2);
    if (time1_stamp && !time2_stamp){
        html = init_warning("time2 error");
        $("#" + id).html(html);
        return false
    }
    if (!time1_stamp && time2_stamp){
            html = init_warning("time1 error");
            $("#" + id).html(html);
            return false
        }
    if (time2stamp(time1) > time2stamp(time2)){
        html = init_warning("时间选择有误，time1 > time2,请重新输入！")
        $("#" + id).html(html);
        return false
    }
    return true;
};

function show_process(){
    var id = (event.target.id).split("-")[0];
    var mousex = event.clientX + 20;
    var mousey = event.clientY - 100;
    var download_process = document.getElementById(id + "-process");
    download_process.style.left = mousex + document.body.scrollLeft + "px";
    download_process.style.top = mousey + document.body.scrollTop + "px";
    download_process.style.display = "block";
}

function hidden_process(){
    var id = (event.target.id).split("-")[0];
     var download_process = document.getElementById(id + "-process");
    download_process.style.display = "none";
}

function show_stills(){
    var id = (event.target.id).split("-")[0];
    var mousex = event.clientX + 20;
    var mousey = event.clientY - 100;
    var show_stil = document.getElementById(id + "-stills-overplay");
    show_stil.style.left = mousex + document.body.scrollLeft + "px";
    show_stil.style.top = mousey + document.body.scrollTop + "px";
    show_stil.style.display = "block";
}

function hidden_stills(){
    var id = (event.target.id).split("-")[0];
    var show_stil = document.getElementById(id + "-stills-overplay");
    show_stil.style.display = "none"
}

function download(id_list, status, interf){
    var temp = '';
    var level = 1;
    var url = '';
    if (status == 1)
    {
        var obj = document.getElementsByName("checkname");
        var array = [];
        level = document.getElementById("download-level-1").value;
        for(var o=0; o < obj.length; o++){
            if(obj[o].checked)
            {
                array.push(obj[o].value);
                $("#" + obj[o].value + "-download").removeAttr("disabled");
                $("#" + obj[o].value + "-download").attr("disabled","disabled");
                $("#" + obj[o].value + "-checkbox").attr("checked", false);
                $("#" + obj[o].value + "-checkbox").attr("disabled","disabled");
            }
        }
        if (array.length < 1){
            temp = null;
        }else {
            temp = array.join(";");
        }
    }else{
        temp = id_list;
        level = document.getElementById(id_list +"-download-level").value;
        $("#" + id_list + "-download").removeAttr("disabled");
        $("#" + id_list + "-download").attr("disabled","disabled");
        $("#" + id_list + "-checkbox").attr("checked", false);
        $("#" + id_list + "-checkbox").attr("disabled","disabled");
    }
    if (interf == 1){
        url += ip + "/spider/source_episode/download?";
        if (temp && level && String(temp).length> 0){
            url += "source_episode_id=" + temp;
            url += "&priority=" + level;
            $.get(url, function(data){
                $.each(data["source_episode"], function(i,episode){
                    document.getElementById("download-status-" + episode["source_episode_id"]).innerHTML = "下载中";
                    $("#tr-"+episode["source_episode_id"]).css("background-color","#D0F4FF")
                });
                console.log("download success");
                console.log(data);

            })
        }else{
            var warn = init_warning("当前未选中相关视频！");
            $("#warning").html(warn);
        }
    }else if(interf==3){
      url = ip+"/spider/movie/download_trigger?";
      if (temp && level && String(temp).length> 0){
          url += "movie_id=" + temp;
          url += "&priority=" + level;
          $.get(url, function(data){
              $.each(data["movies"], function(i,movie){
                  document.getElementById("download-status-" + movie).innerHTML = "下载中";
                  $("#tr-"+movie).css("background-color","#D0F4FF")

              });
              console.log("download success");
              console.log(data);

          })
      }else{
          var warn = init_warning("当前未选中相关视频！");
          $("#warning").html(warn);
      }
    }else if(interf ==4){
      url += ip + "/spider/source_show/download?";
      if (temp && level && String(temp).length> 0){
          url += "source_show_id=" + temp;
          url += "&priority=" + level;
          $.get(url, function(data){
              $.each(data["source_show"], function(i,show){
                  document.getElementById("download-status-" + show["source_show_id"]).innerHTML = "下载中";
                  $("#tr-"+show["source_show_id"]).css("background-color","#D0F4FF")

              });
              console.log("download success");
              console.log(data);

          })
      }else{
          var warn = init_warning("当前未选中相关视频！");
          $("#warning").html(warn);
      }
    }else if(interf == 5){
      url +=  ip + "/spider/showvideo/download_trigger?";
      if (temp && level && String(temp).length > 0){
          url += "showvideo_id=" + temp;
          url += "&priority=" + level;
          $.get(url, function(data){
              $.each(data["source_show"], function(i,show){
                  $.each(show["video_ids"], function(i, video){
                      if($("#download-status-" + video).length > 0){
                          document.getElementById("download-status-" + video).innerHTML = "下载中";
                      }
                  });
              });
              console.log("download success");
              console.log(data);
          })
      }else{
          var wa = init_warning("当前未选中相关视频！");
          $("#warning").html(wa);
      }
    }
    else{
        url +=  ip + "/spider/video/download_trigger?";
        if (temp && level && String(temp).length > 0){
            url += "video_id=" + temp;
            url += "&priority=" + level;
            $.get(url, function(data){
                $.each(data["source_episode"], function(i,episode){
                    $.each(episode["video_ids"], function(i, video){
                        if($("#download-status-" + video).length > 0){
                            document.getElementById("download-status-" + video).innerHTML = "下载中";
                        }
                    });
                });
                console.log("download success");
                console.log(data);
            })
        }else{
            var wa = init_warning("当前未选中相关视频！");
            $("#warning").html(wa);
        }
    }

}
