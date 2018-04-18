

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
}

var Data;
var keyword="";
var page=1;


function search_click(){
   var current_keyword = $("input[name='keyword']").val();
   page = 1;
   keyword= current_keyword;
   get_data();
}

function get_data(){  // 获取数据
   $.ajax({
     url:'/search/episode/{page}'.format({page:page}),
     type:'GET',
     data:{'keyword':keyword, get_video:1, simple_video:1, simple_source_episode:1},
     beforeSend:function(XMLHttpRequest){
        var result_list_dom = $("#result_list");
        result_list_dom.empty();
        $('<div class="row alert alert-warning" style="margin-top:10px" role="alert">请稍等....</div>').appendTo(result_list_dom);
        return
     },
     error:function(XMLHttpRequest, textStatus, errorThrown){
        var result_list_dom = $("#result_list");
        result_list_dom.empty();
        $('<div class="row alert alert-danger" style="margin-top:10px" role="alert">加载失败</div>').appendTo(result_list_dom);
        return
     },
     success:function(data){
        Data = data.episode;
        var result_list_dom = $("#result_list");
        result_list_dom.empty();
        if (Data.length == 0){
           result_list_dom.append('<div class="row alert alert-warning alert-dismissible" role="alert">'+
           '<button type="button" class="close" data-dismiss="alert">'+
           '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'+
           '</button><strong>没有匹配到结果!</strong></div>');
        }else{
          if (keyword.length!=0){
            result_list_dom.append('<div class="row alert alert-success alert-dismissible" role="alert">'+
            '<button type="button" class="close" data-dismiss="alert">'+
            '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'+
            '</button><strong>搜索<font color="red">{keyword}</font>,为您找到{total_count}部剧</strong></div>'.format({keyword:keyword,total_count:data.total_count}));
          }else{
            result_list_dom.append('<div class="row alert alert-success alert-dismissible" role="alert">'+
            '<button type="button" class="close" data-dismiss="alert">'+
            '<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>'+
            '</button><strong>为您找到{total_count}部剧</strong></div>'.format({total_count:data.total_count}));
          }
        }
        show_data(result_list_dom);
        show_pagination(data.page_count);
     }
   })
}

function show_data(result_list_dom){ // 展示数据
    if (Data.length == 0){
      return;
    }
    $.each(Data, function(resultIndex, value){ // 剧集信息
       var one_episode_dom = $("<div class='row' id='episode_{resultIndex}'></div>".format({resultIndex:resultIndex})); // 一部剧集的row

       //  创建平台标签
       var platform_dom = $("<div class='col-sm-offset-3'></div>");
       var platform_ul_dom = $("<ul class='nav nav-tabs' role='tablist'></ul>")
       var first_platform = '';
       $.each(value.website, function(platformName, value){ // 平台信息
          if (first_platform.length == 0){
             platform_ul_dom.append("<li class='active' role='presentation'>"+
             "<a onclick='show_detail(this)' data-resultIndex={resultIndex}".format({resultIndex:resultIndex})+
             " data-platform={platformName}>{platformName}</a></li>".format({platformName:platformName}));
             first_platform = platformName;
          }else{
             platform_ul_dom.append("<li role='presentation'>"+
             "<a onclick='show_detail(this)' data-resultIndex={resultIndex}".format({resultIndex:resultIndex})+
             " data-platform={platformName}>{platformName}</a></li>".format({platformName:platformName}));
          }
       });
       platform_dom.append(platform_ul_dom);
       one_episode_dom.append(platform_dom);
       // 创建平台标签 - 结束

       var detail_dom = $("<div class='row'></div>"); // 某一个平台的row
       var image_dom = create_image_dom(resultIndex, first_platform);  // 图片标签
       detail_dom.append(image_dom);
       var episode_info_dom = create_episode_info_dom(resultIndex, first_platform); // 影片信息标签
       detail_dom.append(episode_info_dom);
       one_episode_dom.append(detail_dom);
       one_episode_dom.append("<div class='page-header'>  </div>")


       result_list_dom.append(one_episode_dom);
    })

}

function create_image_dom(resultIndex, platformName){   // 某个平台的剧照
   var image_dom = $("<div class='col-sm-2'></div>");
   var image_url = Data[resultIndex].website[platformName].source_stills;
   image_dom.append("<img src='{image_url}' style='width:250px;height:412px'>".format({image_url:image_url}));
   return image_dom;
}

function get_video_num_max(one_platform_data){
  var max_num = 0;
  $.each(one_platform_data.video, function(key, value){
    if (value.length>max_num){
      max_num = value.length;
    }
  })
  return max_num;
}

function create_episode_info_dom(resultIndex, platformName){  // 某个平台的剧集信息
    var dom_row = $("<div class='col-sm-offset-1 col-sm-8'></div>");
    var one_platform_data = Data[resultIndex].website[platformName]
    var episode_url = one_platform_data.source_url;
    var name = one_platform_data.source_name;
    var classify = Data[resultIndex].classify;
    var year = Data[resultIndex].year;
    var video_num = get_video_num_max(one_platform_data);
    var total_num = Data[resultIndex].video_num;
    var alias = Data[resultIndex].alias;
    var starring = Data[resultIndex].starring;
    var desc = one_platform_data.source_desc;
    $(" <div class='page-header'> <h2><a target='_blank' href=' {episode_url} '><font color='blue'>{name}</font></a>".format({episode_url:episode_url,name:name})+
      "<small>({year})更新至{video_num}集/共{total_num}集</small></h2>".format({year:year,video_num:video_num,total_num:total_num})).appendTo(dom_row);
    $("<p>别名:{alias}</p>".format({alias:alias})).appendTo(dom_row);
    $("<p>分类:{classify}</p>".format({classify:classify})).appendTo(dom_row);
    $("<p>演出:{starring}</p>".format({starring:starring})).appendTo(dom_row);
    $("<p>描述:{desc}</p>".format({desc:desc})).appendTo(dom_row);

    var accordion_dom = $("<div class='panel-group' id='{resultIndex}_{platformName}_accordion'".format({resultIndex:resultIndex, platformName:platformName})+
                          " role='tablist' aria-multiselectable='true'></div>");
    var first = true;
    $.each(one_platform_data.video, function(key, value){
      var platform_child_dom = $("<div class='panel panel-default'></div>");

      platform_child_dom.append("<div class='panel-heading'>"+
                                "<h4 class='panel-title'>"+
                                "<a data-toggle='collapse' data-parent='#{resultIndex}_{platformName}_accordion'".format({resultIndex:resultIndex, platformName:platformName})+
                                " href='#{resultIndex}_{platformName}_{child_platform}_list'>".format({child_platform:key, resultIndex:resultIndex, platformName:platformName})+
                                "{child_platform}</a></h4></div>".format({child_platform:key}));

      if (first && value.length < 50){
        var platform_child_list = $("<div id='{resultIndex}_{platformName}_{child_platform}_list' class='panel-collapse collapse in'></div>".format({child_platform:key, resultIndex:resultIndex, platformName:platformName}));
        first=false;
      }else{
        var platform_child_list = $("<div id='{resultIndex}_{platformName}_{child_platform}_list' class='panel-collapse collapse'></div>".format({child_platform:key, resultIndex:resultIndex, platformName:platformName}));
      }
      var platform_child_body = $("<div class='panel-body'></div>");
      $.each(value, function(index, data){
        $("<div class='btn-group btn-group-sm col-sm-1' style='margin:10px'> "+
          "<a target='_blank' style='min-width:36px' class='btn btn-default' href='{url}'>{index}</a> </div>".format({url:data.source_url, index:data.episode_num})).appendTo(platform_child_body);
      });
      platform_child_list.append(platform_child_body);
      platform_child_dom.append(platform_child_list);
      accordion_dom.append(platform_child_dom);
    });

    dom_row.append(accordion_dom);
    return dom_row;
}

function show_pagination(totalpages){

   $("#pagination").bs_pagination("destroy");
   if (totalpages==0){
      $("#pagination").attr("hidden","true");
   }else{
      $("#pagination").removeAttr("hidden");
   }
   $("#pagination").bs_pagination({
      currentPage: page,
      totalPages: totalpages,
      visiblePageLinks: 8,
      showGoToPage: true,
      showRowsPerPage: false,
      showRowsInfo: false,
      showRowsDefaultInfo: false,
      onChangePage: function(event, data) { // returns page_num and rows_per_page after a link has clicked
         var currentPage = data.currentPage;
         if (currentPage != page){
           page = currentPage;
           get_data();
         }

      },
      onLoad: function() { // returns page_num and rows_per_page on plugin load
      }
   });
}

function input_keypress(e){
     var keyCode = null;

     if(e.which)
         keyCode = e.which;
     else if(e.keyCode)
         keyCode = e.keyCode;

     if(keyCode == 13)
     {
         search_click();
         return false;
     }
 }

function show_detail(btn){
   var tag_dom = $(btn);
   if (tag_dom.parent("li").attr('class') == 'active'){
     return;
   }
   var resultIndex = tag_dom.attr("data-resultindex");
   var platformName = tag_dom.attr("data-platform");
   var parent = $("#episode_{resultIndex}".format({resultIndex:resultIndex}));
   // 清除 active
   parent.find("li.active").removeAttr("class");
   tag_dom.parent("li").attr('class','active');
   //
   var row_dom = parent.find("div.row");
   row_dom.empty();
   var image_dom = create_image_dom(resultIndex, platformName);  // 图片标签
   row_dom.append(image_dom);
   var episode_info_dom = create_episode_info_dom(resultIndex, platformName); // 影片信息标签
   row_dom.append(episode_info_dom);
}

function get_keyword_list(input){
  var current_keyword = $(input).val();
  if (current_keyword.length==0 || (keyword.length !=0 && current_keyword.indexOf(keyword)==0)){
    return;
  }
  keyword = current_keyword;
  keyword_list = [];
  var keyword_datalist_dom = $("#keyword_list");
  keyword_datalist_dom.empty();
  $.ajax({
    url:"/keyword_list",
    type:"GET",
    data:{keyword:current_keyword},
    success:function(data){
      $.each(data.keyword_list,function(index, value){
         keyword_datalist_dom.append("<option>{value}</option>".format({value:value}))
      })
    }
  })
}

$(function(){
   get_data();
})
