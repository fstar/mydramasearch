/**
 * Created by user on 2016/11/25.
 */
$(function(){
    $('#nav a').click(function(e){
        $('#nav a').removeClass("current");
        $(this).addClass("current");
    });
    var pathname = window.location.pathname;
    if (pathname.indexOf("movie") > 0 ){
        $("a[href*='movie'] span").addClass("current");
    }else if(pathname.indexOf("video") > 0){
        $("a[href*='video'] span").addClass("current");
    }else if(pathname.indexOf("show") > 0){
        $("a[href*='show'] span").addClass("current")
    }else if(pathname.indexOf("comic") > 0){
        $("a[href*='comic'] span").addClass("current")
    }else if(pathname.indexOf("url") > 0){
        $("a[href*='url'] span").addClass("current")
    }else if(pathname.indexOf("admin") > 0){
        $("a[href*='admin_management'] span").addClass("current")
    }else if(pathname.indexOf("ip") > 0){
        $("a[href*='ip_management'] span").addClass("current")
    }else if(pathname.indexOf("error") > 0){
        $("a[href*='error_spider'] span").addClass("current")
    }
    var token = localStorage.getItem("token");
    $("#logout a").click(function(e){
        console.log("get token");
        console.log(token);
        $.ajax({
           type:"post",
           url:"/logout",
           beforeSend:function(xhr){
               xhr.setRequestHeader("Authorization", "Token " + token);
           },
           success:function(data){
                console.log(data);
               if (data["response_code"] == 1){
                    localStorage.removeItem("username");
                    localStorage.removeItem("token");
                    window.location.href = "/spider/management/login"
                }
           }
        });
    });
});
