/**
 * Created by user on 2016/11/25.
 */
var get_video = 0;
var page_size = 40;
var download_info = {};
var last_data = {};

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

function splice_page(page, get_video, page_size, source, status, area, time1, time2, video_name, star,
                     selected, accessable, vip, name_model, classify, classify_not_in){
    var url = ip + "/search/movie/" + page;
    url = join_url(url, get_video, page_size,  star, video_name, source, time1, time2, status, area,
                  selected, accessable, vip, name_model, classify, classify_not_in);
    request_get_json(url, page)
}

function join_url(temp, get_video, page_size,  star, video_name, source, time1, time2, status, area,
                  selected, accessable, vip, name_model, classify, classify_not_in){
    var href = temp + "?get_video=" + get_video + "&page_size=" + page_size;
    if(star && star != "None"){
        href = href + "&starring=" + encodeURIComponent(star)
    }
    if(video_name && video_name != "None"){
        href = href + "&name=" + encodeURIComponent(video_name)
    }
    if(source && source != "None"){
        href = href + "&web_id=" + source
    }
    if(time1 && time1 != "None"){
        href = href + "&start_time=" + time1
    }
    if(time2 && time2 != "None"){
        href = href + "&end_time=" + time2
    }
    if(status && status != "None"){
        href = href + "&status=" + status
    }
    if(area && area != "None"){
        href = href + "&area_id=" + area
    }
    if(selected && selected != "None"){
        href = href + "&selected=" + selected
    }
    if(accessable && accessable != "None"){
        href = href + "&accessable=" + accessable
    }
    if(vip && vip != "None"){
        href = href + "&vip=" + vip
    }
    if(name_model && name_model != "None"){
        href = href + "&name_model=" + name_model
    }
    if(classify && classify != "None"){
        href = href + "&classify=" + classify
    }
    if(classify_not_in && classify_not_in != "None"){
        href = href + "&classify_not_in=" + classify_not_in
    }
    return href
}

function show_modal(button){
  var btn = $(button);
  var data_id = btn.attr("data-id");
  var current_data = last_data[data_id];
  $("#detail-img").attr("src",current_data["source_stills"]);
  var data_list = $("#detail-list");
  data_list.empty();
  $("<li class='list-group-item'>电影名称:{name}</li>".format({name:current_data["source_name"]})).appendTo(data_list);
  $("<li class='list-group-item'>导演:{director}</li>".format({director:current_data["director"]})).appendTo(data_list);
  $("<li class='list-group-item'>演员:{starring}</li>".format({starring:current_data["starring"]})).appendTo(data_list);
  $("<li class='list-group-item'>介绍:{source_desc}</li>".format({source_desc:current_data["source_desc"]})).appendTo(data_list);
  $("#myModal").modal("show");
}

function init_search_source(){
    var source_html = "<li class='li_style margin2right'><span value='' style='color:#ed3e01 '>全部</span></li>";
    var url = ip + "/api/web";
    $.get(url, function(data, status){
        $.each(data["web"], function(i, source){
            if(source["download_allowed"]==0){
              return true;
            }
            download_info[source["name"]] = source["download_allowed"];
            source_html += "<li class='li_style margin2right'><span value='" + source["web_id"] +
                    "'>" + source["name"] + "</span></li>"
        });
        $("#add-source").html(source_html);
    });
}

function init_search_area(){
    var area_html = "<li class='li_style margin2right'><span value='' style='color: #ed3e01'>全部</span></li>";
    var url = ip + "/api/area";
    $.get(url, function(data, status){
        $.each(data["area"], function(i, area){
            area_html += "<li class='li_style margin2right'><span value='" + area["area_id"] +
                    "'>" + area["name"] + "</span></li>"
        });
        $("#add-area").html(area_html);
    });
};

function request_get_json(url, page){
    var html = "";
    $.get(url, function(data, status) {
         var pageCount = data["page_count"];
         var total_count = data["total_count"];
         $("#Selected_allSelect").attr("checked", false);
         $("#allSelect").attr("checked", false);
         $("#json").empty();
         $.each(data["movies"], function(i, movie){
              last_data[movie["id"]]=movie;
              var vv = parseInt(parseInt(movie.vv)/10000);


              if (movie["selected"]==1){
                var tr_dom = $("<tr id='tr-" + movie["id"] + "' style='background-color:#D0F4FF'></tr>");
              }else if (movie["selected"]==2) {
                var tr_dom = $("<tr id='tr-" + movie["id"] + "' style='background-color:#e8e8e8'></tr>");
              }else{
                var tr_dom = $("<tr id='tr-" + movie["id"] + "'></tr>");
              }


            //   if(movie["status"] < 2 && download_info[movie["web_name"]] == 1){
            //      $("<td style='vertical-align:middle'><label><input type='checkbox' id='{id}-checkbox' value='{id}' name='checkname'</label></td>".format({id:movie["id"]})).appendTo(tr_dom);
            //  }else {
            //      $("<td style='vertical-align:middle'><label><input type='checkbox' id='{id}-checkbox' value='{id}' name='checkname' disabled</label></td> ".format({id:movie["id"]})).appendTo(tr_dom);
            //  }




             var td_dom = $("<td></td>");
             if(movie["aws_url"]){
                 $("<a target='_blank' href='{source_url}' id='{id}-video-name' onmouseover='show_process()' onmouseout='hidden_process()'>{name}</a><a href='{aws_url}'>(视频链接)</a>".format({source_url:movie["source_url"],aws_url:movie["aws_url"],name:movie["source_name"],id:movie["id"]})).appendTo(td_dom);
             }else{
                 $("<a target='_blank' href='{source_url}' id='{id}-video-name' onmouseover='show_process()' onmouseout='hidden_process()'>{name}</a><a href='javascript:return false;'>(待获取中)</a>".format({source_url:movie["source_url"],name:movie["source_name"],id:movie["id"]})).appendTo(td_dom);
             }
             $('<div id="{id}-process" name="download-process" style="display: none; position: absolute; z-index: 8888; background-color: black; width: 200px; color: white; left: 281px; top: 88px;"><div class="progress" style="width: 95%; margin-left: 5px; margin-top: 20px;display: inline-block"><span class="progress-bar" role="progressbar" aria-valuenow="60" id="{id}-bar" aria-valuemin="0" aria-valuemax="50" style="width:{percent}%"></span></div><span id="{id}-percent">进度:{percent}%</span><span id="{id}-speed">&nbsp;&nbsp;速度:{speed}MB/S</span></div>'.format({id:movie["id"],speed:(movie["download_speed"]/1024/1024).toFixed(2),percent:movie["download_percent"]})).appendTo(td_dom);
             tr_dom.append(td_dom);

             $("<td>{classify}</td>".format({classify:movie["classify"]})).appendTo(tr_dom);
             $("<td>{year}</td>".format({year:movie["year"]})).appendTo(tr_dom);
             $("<td>{area_name}</td>".format({area_name:movie["area_name"]})).appendTo(tr_dom);
             $("<td>{alias}</td>".format({alias:movie["alias"]})).appendTo(tr_dom);
             $("<td>{web}</td>".format({web:movie["web_name"]})).appendTo(tr_dom);
             $("<td>{vv}</td>".format({vv:movie["vv"]})).appendTo(tr_dom);
             if(movie["vip"]==1){
               $("<td>是</td>").appendTo(tr_dom);
             }else{
               $("<td>否</td>").appendTo(tr_dom);
             }
             $('<td><button type="button" class="btn btn-primary" onclick="show_modal(this)" data-id="{id}">More</button></td>'.format({id:movie["id"]})).appendTo(tr_dom);

             if(movie["accessable"]==1){
               $("<td>上架</td>").appendTo(tr_dom);
             }else{
               $("<td>下架</td>").appendTo(tr_dom);
             }

             $(translation_video_status(movie["status"],movie["id"])).appendTo(tr_dom);

             var selected_column = "<td style='vertical-align:middle'>";
             selected_column += "<input style='margin-right:5px' type='checkbox' id='"+movie["id"]+"-selected-checkbox' value='" + movie["id"] + "' name='selected'"

             selected_column += "<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-default' id='" +
                movie["id"] + "-selected' onclick='changeselected(source_show_id_list=" +
                movie["id"] + ", selected=1)'>选用</button></span>"

             selected_column += "<span><button type='button' class='btn btn-xs btn-default' id='" +
                movie["id"] + "-selected' onclick='changeselected(source_show_id_list=" +
                movie["id"] + ", selected=2)'>排除</button></span>"

             selected_column+= "</td>"
             $(selected_column).appendTo(tr_dom);


             td_dom=$("<td></td>");
             if(movie["status"] < 2 && download_info[movie["web_name"]] == 1){
                var checkbox_tag = "<input style='margin-right:5px' type='checkbox' id='" + movie["id"] + "-checkbox' value='" + movie["id"] +  "' name='checkname'>"
             }else {
                var checkbox_tag = "<input style='margin-right:5px' type='checkbox' id='" + movie["id"] + "-checkbox' value='" + movie["id"] + "' name='checkname' disabled>"
             }

             $(checkbox_tag).appendTo(td_dom);

             $("<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-default'><a href='/spider/movie/json/{id}' download='json'>下载Json</a></button></span>".format({id:movie["id"]})).appendTo(td_dom);
             $("<span><select class='from-control download_level' id='{id}-download-level' style='margin: 0 1% 0 1%;'><option value='1'>下载低</option><option value='2'>下载中</option><option value='3'>下载高</option></select></span>".format({id:movie["id"]})).appendTo(td_dom);
             if (movie["status"] < 2 && download_info[movie["web_name"]] == 1){
               $("<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-primary' id='{id}-download' onclick='download(id_list={id},status=2,interf=3)'>下载</span></span>".format({id:movie["id"]})).appendTo(td_dom);
             }else{
               $("<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-primary' id='{id}-download' onclick='download(id_list={id},status=2,interf=3)' disabled>下载</span></span>".format({id:movie["id"]})).appendTo(td_dom);
             };
             tr_dom.append(td_dom);



             $("#json").append(tr_dom);
            });

         $("#page").bs_pagination({
            totalPages:pageCount,
            currentPage:page,
            rowsPerPage:20,
            visiblePageLinks:5,
            totalRows: total_count,
            directURL:false,
            showGoToPage: true,
            showRowsPerPage:true,
            onChangePage:function(event, data){
                var source = $("#filter-source").attr("name");
                var status = $("#filter-status").attr("name");
                var area = $("#filter-area").attr("name");
                var time1 = $("#time1").val();
                var time2 = $("#time2").val();
                var video_name = $("#search-video").val();
                var star = $("#search-star").val();

                var name_model = $("input[name='name_model']:checked").val();
                var classify = $("#search-classify").val();
                var classify_not_in = $("search-classify_not_in").val();
                var accessable = $("#filter-accessable").attr("name");
                var selected = $("#filter-selected").attr("name");
                var vip = $("#filter-vip").attr("name");

                splice_page(data.currentPage, get_video, page_size, source, status, area, time1, time2, video_name, star,
                            selected, accessable, vip, name_model, classify, classify_not_in);
            }
         });
        $("#allSelect").attr("checked", false);
     }).error(function(){
        var text = "请求失败！";
        var warn = init_warning(text);
        $("#warning").html(warn);
    });
}

function init_search_input()
{
    var filter_source = $("#filter-source").val();
    var filter_status = $("#filter-status").val();
    var filter_area = $("#filter-area").val();

    var filter_selected        = $("#filter-selected").val();
    var filter_accessable      = $("#filter-accessable").val();
    var filter_vip             = $("#filter-vip").val();

    if (!filter_source || filter_source.length < 1){
        $("div[name='source'] ul li").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    }
    if (!filter_status || filter_status.length < 1){
        $("div[name='status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01")
            }
        })
    }
    if (!filter_area || filter_area.length < 1){
        $("div[name='area'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01")
            }
        })
    }

    if (!filter_selected || filter_selected.length < 1){
        $("div[name='video_selected'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    }
    if (!filter_accessable || filter_accessable.length < 1){
        $("div[name='video_accessable'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    }
    if (!filter_vip || filter_vip.length < 1){
        $("div[name='video_vip'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    }
}

$(function(){
    init_search_source();
    init_search_area();
    init_search_input();
    var url = ip +  "/search/movie/" + 1 + "?get_video=" + get_video+"&page_size=" + page_size ;
    request_get_json(url, 1);
    $(".form_datetime").datetimepicker({
        format:'yyyy-mm-dd',
        startDate: "2000-01-01",
        minView:"month"
    });
     $("#allSelect").click(function(){
       if (this.checked == true){
         $("td input:checkbox[name='checkname']").each(function(){
             if (!this.disabled){
              this.checked = true;
             }
         })
       }else{
         $("td input:checkbox[name='checkname']").each(function(){
             if (!this.disabled){
              this.checked = false;
             }
         })
       }
     });

     $("#Selected_allSelect").click(function(){
        if (this.checked == true){
          $("td input:checkbox[name='selected']").each(function(){
               this.checked = true;
          })
        }else{
          $("td input:checkbox[name='selected']").each(function(){
               this.checked = false;
          })
        }

     });

    $(".remove-source").click(function(e){
        $("div[name='filter-source']").css("display","none");
        $("#filter-source").val("");
        $("#filter-source").attr("name",null);
        $("div[name='source'] ul li span").removeAttr("style");
        $("div[name='source'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
     });
    $("div[name='source'] ul").on("click", "li span" , function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-source']").css("display","inline");
        $("#filter-source").val(text);
        $("#filter-source").attr("name",data);
        $("div[name='source'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });

    $(".remove-selected").click(function(e){
        $("div[name='filter-selected']").css("display","none");
        $("#filter-selected").val("");
        $("#filter-selected").attr("name",null);
        $("div[name='video_selected'] ul li span").removeAttr("style");
        $("div[name='video_selected'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
     });
    $("div[name='video_selected'] ul").on("click", "li span" , function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-selected']").css("display","inline");
        $("#filter-selected").val(text);
        $("#filter-selected").attr("name",data);
        $("div[name='video_selected'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });

    $(".remove-accessable").click(function(e){
        $("div[name='filter-accessable']").css("display","none");
        $("#filter-accessable").val("");
        $("#filter-accessable").attr("name",null);
        $("div[name='video_accessable'] ul li span").removeAttr("style");
        $("div[name='video_accessable'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
     });
    $("div[name='video_accessable'] ul").on("click", "li span" , function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-accessable']").css("display","inline");
        $("#filter-accessable").val(text);
        $("#filter-accessable").attr("name",data);
        $("div[name='video_accessable'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });

    $(".remove-vip").click(function(e){
        $("div[name='filter-vip']").css("display","none");
        $("#filter-vip").val("");
        $("#filter-vip").attr("name",null);
        $("div[name='video_vip'] ul li span").removeAttr("style");
        $("div[name='video_vip'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
     });
    $("div[name='video_vip'] ul").on("click", "li span" , function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-vip']").css("display","inline");
        $("#filter-vip").val(text);
        $("#filter-vip").attr("name",data);
        $("div[name='video_vip'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });


    $(".remove-status").click(function(e){
        $("div[name='filter-status']").css("display","none");
        $("#filter-status").val("");
        $("#filter-status").attr("name",null);
        $("div[name='status'] ul li span").removeAttr("style");
        $("div[name='status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    });
    $("div[name='status'] ul li span").click(function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-status']").css("display","inline");
        $("#filter-status").val(text);
        $("#filter-status").attr("name",data);
        $("div[name='status'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });

    $(".remove-area").click(function(e){
        $("div[name='filter-area']").css("display","none");
        $("#filter-area").val("");
        $("#filter-area").attr("name",null);
        $("div[name='area'] ul li span").removeAttr("style");
        $("div[name='area'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    });
    $("div[name='area'] ul").on("click", "li span" ,function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-area']").css("display","inline");
        $("#filter-area").val(text);
        $("#filter-area").attr("name",data);
        $("div[name='area'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });
    $(".remove-order").click(function(e){
        $("div[name='filter-order']").css("display","none");
        $("#filter-order").val("");
        $("#filter-order").attr("name",null);
        $("div[name='order'] ul li span").removeAttr("style");
    });
    $("div[name='order'] ul li span").click(function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-order']").css("display","inline");
        $("#filter-order").val(text);
        $("#filter-order").attr("name",data);
        $("div[name='order'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });
    $(".remove-time").click(function(e){
        $("div[name='filter-time']").css("display","none");
        $("#filter-time1").val("");
        $("#filter-time1").attr("name",null);
        $("#filter-time2").val("");
        $("#filter-time2").attr("name",null);
    });
    $(".remove-time").click(function(e){
        $("div[name='filter-time']").css("display","none");
        $("#filter-time1").val("");
        $("#filter-time1").attr("name",null);
        $("#filter-time2").val("");
        $("#filter-time2").attr("name",null);
        $("#time1").val("");
        $("#time2").val("");
    });
    $("#time-quantum").click(function(e){
        if (toValid("warning")){
            var time1 = $("#time1").val();
            var time2 = $("#time2").val();
            $("div[name='filter-time']").css("display","inline");
            $("#filter-time1").val(time1);
            $("#filter-time2").val(time2);
            $("#filter-time1").attr("name", time1);
            $("#filter-time2").attr("name", time2);
        }

    });

    $(".search-filter").click(function(e){
        var source = $("#filter-source").attr("name");
        var status = $("#filter-status").attr("name");
        var area = $("#filter-area").attr("name");
        var time1 = $("#filter-time1").val();
        var time2 = $("#filter-time2").val();
        var video_name = $("#search-video").val();
        var star = $("#search-star").val();

        var name_model = $("input[name='name_model']:checked").val();
        var classify = $("#search-classify").val();
        var classify_not_in = $("#search-classify_not_in").val();
        var accessable = $("#filter-accessable").attr("name");
        var selected = $("#filter-selected").attr("name");
        var vip = $("#filter-vip").attr("name");

        var page = 1;
        var href = ip + "/search/movie/" + page;
        var url = join_url(href, get_video, page_size, star, video_name, source, time1, time2, status, area,
                          selected, accessable, vip, name_model, classify, classify_not_in)
        request_get_json(url, page)
     });
});

function changeselected_all(selected){
   var selected_checkboxs = $("input[name='selected']:checked");
   var movie_id_list = new Array();
   for (var i=0;i<selected_checkboxs.length;i++){
     movie_id_list.push($(selected_checkboxs[i]).attr("value"));
   }
   movie_id_list = movie_id_list.join(",");
   changeselected(movie_id_list, selected);
}

function changeselected(movie_id_list, selected){
    var url = ip + "/spider/movie/changeselected"
    $.post(url, {"movie_id_list":movie_id_list, "selected":selected}, function(resp){
        if (resp.status==1){
           for (i=0;i<resp.movie_id_list.length;i++){
             if (selected == 1){
                $("#tr-"+resp.movie_id_list[i]).css("background-color","#D0F4FF")
             }else if (selected == 2) {
                $("#tr-"+resp.movie_id_list[i]).css("background-color","#e8e8e8")
             }
           }
        }
    })
}

function get_movie_excel(){
  $("#movie_excel").attr("disabled",true);
  window.open("/spider/excel/create_movie_excel");
  $("#movie_excel").attr("disabled",false);

}
