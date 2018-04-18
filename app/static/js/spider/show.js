/**
 * Created by user on 2016/11/25.
 */
var get_video = 0;
var page_size = 40;
var download_info = {};

function splice_page(page, get_video, page_size, source, video_status, update_status,
                     area, time1, time2, video_name, star, upload_status,
                     selected, accessable, vip, name_model, classify, classify_not_in){
    var url = ip + "/search/show/" + page;
    url = join_url(url, get_video, page_size,  star, video_name, source, time1,
        time2, video_status, update_status, area, upload_status,
        selected, accessable, vip, name_model, classify, classify_not_in);
    request_get_json(url, page)
}

function join_url(temp, get_video, page_size,  star, video_name, source, time1,
                  time2, video_status, update_status, area, upload_status,
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
    if(video_status && video_status != "None"){
        href = href + "&download_status=" + video_status
    }
    if(update_status && update_status != "None"){
        href = href + "&update_status=" + update_status
    }
    if(upload_status && upload_status != "None"){
        href = href + "&upload_status=" + upload_status;
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
    $("#Selected_allSelect").attr("checked", false);
    $("#allSelect").attr("checked", false);
    $.get(url, function(data, status) {
         var pageCount = data["page_count"];
         var total_count = data["total_count"];
         $.each(data["shows"], function(index, val){
            var key = val["website_name"];
            var vv = parseInt(parseInt(val["vv"]) /10000);
            if (val["selected"]==1){
              html += "<tr id='tr-" + val["source_show_id"] + "' style='background-color:#D0F4FF'>"
            }else if (val["selected"]==2) {
              html += "<tr id='tr-" + val["source_show_id"] + "' style='background-color:#e8e8e8'>"
            }else{
              html += "<tr id='tr-" + val["source_show_id"] + "'>";
            }

            //  if(val["download_status"] < 2 && download_info[key] == 1){
            //     html += "<td style='vertical-align:middle'><label><input type='checkbox' id='" + val["source_show_id"] + "-checkbox' value='" + val["source_show_id"] +  "' name='checkname'</label></td>"
            // }else {
            //     html += "<td style='vertical-align:middle'><input type='checkbox' id='" + val["source_show_id"] + "-checkbox' value='" + val["source_show_id"] + "' name='checkname' disabled></td>"
            // }
            html += "<td style='vertical-align:middle' width='8%'>" +
                       "<a target='_blank' href='/spider/management/show/get_series?source_show_id=" + val["source_show_id"] + "'>"  + val["source_name"] + "</a>" +
                       "<a href='" + val["source_url"] + "'>(网址)</a>" +
                       "<span id='" + val["source_show_id"]  + "' onmouseover='show_stills()' onmouseout='hidden_stills()'>(剧照)</span>" +
                       "<div id='" + val["source_show_id"] + "-stills-overplay' " +
                           "style='display: none;position: absolute;z-index: 8888;width: 150px;height: 200px;background: white;border: solid 1px grey'>" +
                           "<img src='" + val["source_stills"] + "' height='100%' width='100%'>" +
                       "</div>" +
                   "</td>";
            html += "<td style='vertical-align:middle'>" + val["video_num"] + "</td>";

            if (val["accessable"] == 1){
              html += "<td style='vertical-align:middle'>上架</td>";
            }else
            {
              html += "<td style='vertical-align:middle'>下架</td>";
            }

            html += "<td style='vertical-align:middle'>" + val["classify"] + "</td>";
            html += "<td style='vertical-align: middle;word-wrap: break-word' >" + val["starring"] + "</td>";
            html += "<td style='vertical-align:middle'>" + val["area"]["name"] + "</td>";
            html += "<td style='vertical-align:middle'>" + val["year"] + "</td>";
            if(!val["alias"] || val["alias"].length < 1){
                html += "<td style='vertical-align:middle'>无别名</td>";
            }else{
               html += "<td style='vertical-align:middle'>" + val["alias"] + "</td>";
            }
           html += "<td style='vertical-align:middle'>" + val["website_name"] + "</td>";
           html += "<td style='vertical-align:middle' width='5%'>" + vv + "万</td>";
           if (val["download_status"] == -1){
               html += "<td style='vertical-align:middle' width='5%' id='download-status-" + val["source_show_id"]   + "'>下载失败</td>";
           }else if(val["download_status"] == 1){
               html += "<td style='vertical-align:middle' width='5%' id='download-status-" + val["source_show_id"]   + "'>未触发下载</td>";
           }else if(val["download_status"] == 2){
               html += "<td style='vertical-align:middle' width='5%' id='download-status-" + val["source_show_id"]   + "'>下载中</td>";
           }else if(val["download_status"] == 3){
               html += "<td style='vertical-align:middle' width='5%' id='download-status-" + val["source_show_id"]   + "'>下载完成</td>";
           }else{
               html += "<td style='vertical-align:middle' width='5%' id='download-status-" + val["source_show_id"]   + "'>" +val["download_status"] +
                   "</td>";
           }
           if(val["upload_status"] == -1){
               html += "<td style='vertical-align:middle' width='5%'>上传失败</td>"
           }else if(val["upload_status"] == 1){
               html += "<td style='vertical-align:middle' width='5%'>未触发上传</td>"
           }else if(val["upload_status"] == 2){
               html += "<td style='vertical-align:middle' width='5%'>上传中</td>"
           }else if(val["upload_status"] == 3){
               html += "<td style='vertical-align:middle' width='5%'>上传完成</td>"
           }else{
               html += "<td style='vertical-align:middle' width='5%'>" + val["upload_status"] +
                   "</td>"
           }

           html += "<td style='vertical-align:middle'>"

           html += "<input style='margin-right:5px' type='checkbox' id='"+val["source_show_id"]+"-selected-checkbox' value='" + val["source_show_id"] + "' name='selected'>"

           html += "<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-default' id='" +
              val["source_show_id"] + "-selected' onclick='changeselected(source_show_id_list=" +
              val["source_show_id"] + ", selected=1)'>选用</button></span>"

           html += "<span><button type='button' class='btn btn-xs btn-default' id='" +
              val["source_show_id"] + "-selected' onclick='changeselected(source_show_id_list=" +
              val["source_show_id"] + ", selected=2)'>排除</button></span>"

           html+= "</td>"


           if(val["download_status"] < 2 && download_info[val["website_name"]] == 1){
              checkbox_tag = "<input style='margin-right:5px' type='checkbox' id='" + val["source_show_id"] + "-checkbox' value='" + val["source_show_id"] +  "' name='checkname'>"
          }else {
              checkbox_tag = "<input style='margin-right:5px' type='checkbox' id='" + val["source_show_id"] + "-checkbox' value='" + val["source_show_id"] + "' name='checkname' disabled>"
          }


           html += "<td style='vertical-align: middle'>" + checkbox_tag +
               "<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-default'><a href='/spider/source_show/json/"
               + val["source_show_id"] + "' download='json'>下载Json</a></button></span>" +
               "<span><select class='from-control download_level' id='" + val["source_show_id"] + "-download-level" +
               "' style='margin: 0 1% 0 1%;'><option value='1'>下载低</option><option value='2'>下载中</option>" +
               "<option value='3'>下载高</option></select></span>";


           if (val["download_status"] < 2 && download_info[key] == 1){
               html += "<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-primary' id='" +
                  val["source_show_id"] + "-download'  onclick='download(id_list=" +
                val["source_show_id"] + ",status=2,interf=4)'>下载</span></span>";
           }else{
               html += "<span><button style='margin-right:5px' type='button' class='btn btn-xs btn-primary' id='" +
                  val["source_show_id"] + "-download' onclick='download(id_list=" +
                  val["source_show_id"] + ",status=2,interf=4)' disabled>下载</button></span>";
           }
           html += "</td>"
           html += "</tr>"
          });


        $("#json").html(html);


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
                var video_status = $("#filter-video_status").attr("name");
                var update_status = $("#filter-update_status").attr("name");
                var area = $("#filter-area").attr("name");
                var time1 = $("#time1").val();
                var time2 = $("#time2").val();
                var video_name = $("#search-video").val();
                var star = $("#search-star").val();
                var upload_status = $("#filter-upload_status").attr("name");

                var name_model = $("input[name='name_model']:checked").val();
                var classify = $("#search-classify").val();
                var classify_not_in = $("search-classify_not_in").val();
                var accessable = $("#filter-accessable").attr("name");
                var selected = $("#filter-selected").attr("name");
                var vip = $("#filter-vip").attr("name");

                splice_page(data.currentPage, get_video, page_size, source, video_status,
                    update_status, area, time1, time2, video_name, star, upload_status,
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
    var filter_download_status = $("#filter-video_status").val();
    var filter_update_status = $("#filter-update_status").val();
    var filter_area = $("#filter-area").val();
    var filter_upload_status = $("#filter-upload_status").val();

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
    if (!filter_download_status || filter_download_status.length < 1){
        $("div[name='video_status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01")
            }
        })
    }
    if (!filter_upload_status || filter_upload_status.length < 1){
        $("div[name='upload_status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01")
            }
        })
    }
    if (!filter_update_status || filter_update_status.length < 1){
        $("div[name='update_status'] ul li span").each(function(){
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
    var url = ip +  "/search/show/" + 1 + "?get_video=" + get_video+"&page_size=" + page_size ;
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
    $(".remove-video_status").click(function(e){
        $("div[name='filter-video_status']").css("display","none");
        $("#filter-video_status").val("");
        $("#filter-video_status").attr("name",null);
        $("div[name='video_status'] ul li span").removeAttr("style");
        $("div[name='video_status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    });
    $("div[name='video_status'] ul li span").click(function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-video_status']").css("display","inline");
        $("#filter-video_status").val(text);
        $("#filter-video_status").attr("name",data);
        $("div[name='video_status'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });

    $(".remove-upload_status").click(function(e){
        $("div[name='filter-upload_status']").css("display","none");
        $("#filter-upload_status").val("");
        $("#filter-upload_status").attr("name",null);
        $("div[name='upload_status'] ul li span").removeAttr("style");
        $("div[name='upload_status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    });
    $("div[name='upload_status'] ul li span").click(function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-upload_status']").css("display","inline");
        $("#filter-upload_status").val(text);
        $("#filter-upload_status").attr("name",data);
        $("div[name='upload_status'] ul li span").removeAttr("style");
        $(this).attr("style","color:#ed3e01");
    });

    $(".remove-update_status").click(function(e){
        $("div[name='filter-update_status']").css("display","none");
        $("#filter-update_status").val("");
        $("#filter-update_status").attr("name",null);
        $("div[name='update_status'] ul li span").removeAttr("style");
        $("div[name='update_status'] ul li span").each(function(){
            if (!$(this).attr("value")){
                $(this).attr("style", "color:#ed3e01");
            }
        })
    });
     $("div[name='update_status'] ul li span").click(function (e) {
        var data = $(this).attr("value");
        var text = $(this).text();
        $("div[name='filter-update_status']").css("display","inline");
        $("#filter-update_status").val(text);
        $("#filter-update_status").attr("name",data);
        $("div[name='update_status'] ul li span").removeAttr("style");
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

    $(".search-filter").click(function(e){
        var source = $("#filter-source").attr("name");
        var video_status = $("#filter-video_status").attr("name");
        var update_status = $("#filter-update_status").attr("name");
        var upload_status = $("#filter-upload_status").attr("name");
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
        var href = ip + "/search/show/" + page;
        var url = join_url(href, get_video, page_size, star, video_name, source, time1, time2, video_status, update_status, area, upload_status,
                        selected, accessable, vip, name_model, classify, classify_not_in);
        request_get_json(url, page)
     });
});

function changeselected_all(selected){
   var selected_checkboxs = $("input[name='selected']:checked");
   var source_show_id_list = new Array();
   for (var i=0;i<selected_checkboxs.length;i++){
     source_show_id_list.push($(selected_checkboxs[i]).attr("value"));
   }
   source_show_id_list = source_show_id_list.join(",");
   changeselected(source_show_id_list, selected);
}
function changeselected(source_show_id_list, selected){
    var url = ip + "/spider/source_show/changeselected"
    $.post(url, {"source_show_id_list":source_show_id_list, "selected":selected}, function(resp){
        if (resp.status==1){
           for (i=0;i<resp.source_show_id_list.length;i++){
             if (selected == 1){
                $("#tr-"+resp.source_show_id_list[i]).css("background-color","#D0F4FF")
             }else if (selected == 2) {
                $("#tr-"+resp.source_show_id_list[i]).css("background-color","#e8e8e8")
             }
           }
        }
    })
}

function get_show_excel(){
  $("#show_excel").attr("disabled",true);
  window.open("/spider/excel/create_source_show_excel");
  $("#show_excel").attr("disabled",false);
}
