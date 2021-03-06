function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest=new Object();
    if (url.indexOf("?") !== -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    console.log("test "+theRequest);
    return theRequest;//返回字典类型
}

function resultInfo() {
    var request=GetRequest();
    $.ajax({
        contentType: 'application/json;charset=UTF-8',
        url:'http://192.144.179.57:8080/demo-v1/api/search/paper/'+request["id"],
        type:'get',
        async:false,
        dataType: "json",
        success: function(data){
            if (data) {
                console.log(data);
                if(data.status === "succeed"){
                    var result_name=document.getElementById("result_name");
                    var result_ownersName=document.getElementById("result_ownersName");
                    var result_publicationTime=document.getElementById("result_publicationTime");
                    var result_referenceTimes=document.getElementById("result_referenceTimes");
                    var result_abstractInfo=document.getElementById("result_abstractInfo");
                    var result_purchase=document.getElementById("result_ purchase");
                    //如果该论文已收藏 显示实心star
                    if (data.data.collected){
                        result_name.innerHTML=
                            data.data.name+'<img src="images/point.png"><span class="point_icon_font">'+data.data.pointRequired+'&nbsp;&nbsp;</span>'+
                            '                                <a id="del-collect-btn">'+'<i class="fa fa-star"'+' onclick="delFromCollection('+data.data.id+')"></i></a>'+
                        '                                <a id="add-collect-btn" style="display: none">'+'<i class="fa fa-star-o"'+' onclick="addToCollection('+data.data.id+')"></i></a>'+
                            '<a><i class="fa fa-shopping-cart" onclick="purchase()"></i></a>';
                    }
                    else {  //空心star
                        result_name.innerHTML=
                            data.data.name+'<img src="images/point.png"><span class="point_icon_font">'+data.data.pointRequired+'&nbsp;&nbsp;</span>'+
                            '                                <a id="add-collect-btn">'+'<i class="fa fa-star-o"'+' onclick="addToCollection('+data.data.id+')"></i></a>'+
                        '                                <a id="del-collect-btn" style="display: none">'+'<i class="fa fa-star"'+' onclick="delFromCollection('+data.data.id+')"></i></a>'+
                            '<a><i class="fa fa-shopping-cart" onclick="purchase()"></i></a>';
                    }

                    // result_purchase.outerHTML=
                    //     '<button type="submit" class="blog-left-left" id="result_purchase" onclick="purchase('+data.data.id+')"><p>Purchase</p><p></p><p></p></button>';

                    /*for(var j=0;j<data.data.ownersName.length;j++) {
                        if (j){
                            result_ownersName.innerHTML += '，';
                        }
                        result_ownersName.innerHTML+='<a href="professor.html?pid='+data.data.ownersName[j].name;
                    }*/
                    //显示作者
                    for(var j=0;j<data.data.ownersName.length;j++) {
                        if (j){
                            result_ownersName.innerHTML += '，';
                        }
                        result_ownersName.innerHTML += '<a href="professor.html?pid=' + data.data.ownersName[j].id + '">' + data.data.ownersName[j].name + '</a>';
                    }
                    //result_ownersName.innerHTML=
                        //data.data.ownersName.id;
                    result_publicationTime.innerHTML=
                        data.data.publicationTime;
                    result_referenceTimes.innerHTML=
                        data.data.referenceTimes;
                    result_abstractInfo.innerHTML= data.data.abstractInfo;
                }
                else
                    alert(data.status);
            }
            else{
                    alert('net failure');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status);
            alert(XMLHttpRequest.readyState);
            alert(textStatus);
        }
    });
    return false;
}

function getUserBrowseRecord(pageNumber){
    //默认第一页
    var page=pageNumber||1;
    var url='http://192.144.179.57:8080/demo-v1/api/record/browseRecordList/paper/'+page;
    $.ajax({
        contentType: 'application/json;charset=UTF-8',
        url:url,
        type:'get',
        dataType: "json",
        success: function(data){
            if (data.status==='succeed') {
                var div=document.getElementById("browserecord-container");
                //无浏览
                if (data.data.items===null){
                    div.innerHTML='<div class="alert alert-warning" role="alert">\n' +
                        '            <strong>提示：</strong>暂无浏览记录' +
                        '        </div>';
                    return;
                }
                //生成显示部分
                $('tbody').html('');
                $('tbody').append('<tr>\n' +
                    // '<td>'+data.data.items[0].id+'</td>\n' +
                    // '<td>'+data.data.items[0].recordTime+'</td>\n' +
                    // '<td>'+data.data.items[0].type+'</td>\n' +
                    '<td>'+'<a href="../EssaySearchWebsite/resultpage.html?id='+data.data.items[0].achievementId+'">'+data.data.items[0].name+'</a>'+'</td>\n' +
                    '</tr>');
                for(var i=1;i<data.data.items.length;i++){
                    $('tbody>tr:last').after('<tr>\n' +
                        // '<td>'+data.data.items[i].id+'</td>\n' +
                        // '<td>'+data.data.items[i].recordTime+'</td>\n' +
                        // '<td>'+data.data.items[i].type+'</td>\n' +
                        '<td>'+'<a href="../EssaySearchWebsite/resultpage.html?id='+data.data.items[i].achievementId+'">'+data.data.items[i].name+'</a>'+'</td>\n' +
                        '</tr>');
                }
            }else{
                alert('未登录');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });


}

function purchase(){
    var temp=GetRequest()
    $.ajax({
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        url:'http://192.144.179.57:8080/demo-v1/api/user/paper/'+temp['id']+'/buy',
        type:'get',
        dataType: "json",
        success: function(data){
            if (data) {
                if (data.status==='succeed'){           //success
                    alert('购买成功');
                }
                else {
                    alert(data.status);
                }
            }else{
                alert('net failure');
                //没有登录就跳转到index.html
                window.location.href = 'index.html';
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function addToCollection(paperId){
    $.ajax({
        contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
        url:'http://192.144.179.57:8080/demo-v1/api/collect/paper/'+paperId+'/collection',
        type:'post',
        dataType: "json",
        data: {"collectionName":"a"},
        success: function(res){
            if (res) {
                if (res.status==='succeed'){           //success
                    alert('收藏成功');
                    $('#del-collect-btn').show();
                    $('#add-collect-btn').hide();
                }
                else {
                    alert('other error');
                }
            }else{
                alert('net failure');
                //没有登录就跳转到index.html
                window.location.href = 'index.html';
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });
}

function delFromCollection(paperId){
    var confirmRes=confirm('确定取消收藏吗？');
    if (confirmRes){
        $.ajax({
            contentType: 'application/json;charset=UTF-8',
            url:'http://192.144.179.57:8080/demo-v1/api/collect/paper/'+paperId+'/undoCollection',
            type:'delete',
            dataType: "json",
            success: function(res){
                if (res) {
                    if (res.status==='succeed'){           //success
                        alert('取消收藏成功');
                        $('#add-collect-btn').show();
                        $('#del-collect-btn').hide();
                    }
                    else {
                        alert('other error');
                    }
                }else{
                    alert('net failure');
                    //没有登录就跳转到index.html
                    window.location.href = 'index.html';
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                // alert(XMLHttpRequest.status);
                // alert(XMLHttpRequest.readyState);
                // alert(textStatus);
            }
        });
    }
}

window.onload=function(){
    checkLogin();
    //professorGetInfor();
    //checkRole(professorGetInfor());
    resultInfo();
    getUserBrowseRecord();
};