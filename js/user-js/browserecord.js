
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
                div.innerHTML='';
                //无浏览
                if (data.data.items===null){
                    div.innerHTML+='<h3>暂无浏览记录</h3>';
                    return;
                }
                div.innerHTML='<div class="bs-docs-example wow fadeInUp animated" data-wow-delay=".5s">\n' +
                    '                <table class="table table-striped">\n' +
                    '                    <thead>\n' +
                    '                    <tr>\n' +
                    '                        <th>id</th>\n' +
                    '                        <th>浏览时间</th>\n' +
                    '                        <th>成果类型</th>\n' +
                    '                        <th>成果名</th>\n' +
                    '                    </tr>\n' +
                    '                    </thead>\n' +
                    '                    <tbody>\n' +
                    '                    </tbody>\n' +
                    '                </table>\n' +
                    '            </div>';
                //生成显示部分
                $('<tbody>').append('<tr>\n' +
                    '<td>'+data.data.items[0].id+'</td>\n' +
                    '<td>'+data.data.items[0].recordTime+'</td>\n' +
                    '<td>'+data.data.items[0].type+'</td>\n' +
                    '<td>'+data.data.items[0].name+'</td>\n' +
                    '</tr>');
                for(var i=1;i<data.data.items.length;i++){
                    $('tbody tr:last').after('<tr>\n' +
                        '<td>'+data.data.items[i].id+'</td>\n' +
                        '<td>'+data.data.items[i].recordTime+'</td>\n' +
                        '<td>'+data.data.items[i].type+'</td>\n' +
                        '<td>'+data.data.items[i].name+'</td>\n' +
                        '</tr>');
                }

                //生成翻页符
                displayNav(div,data.data.totalPage,data.data.nowPage);
                var obj=document.getElementById("page_re").getElementsByTagName("a");
                for(var i=0;i<obj.length;i++){
                    if (obj[i].id==="previous_page"){
                        obj[i].onclick=function(){
                            getUserBrowseRecord(parseInt(data.data.nowPage)-1)
                        };
                        continue;
                    }
                    if (obj[i].id==="next_page"){
                        obj[i].onclick=function(){
                            getUserBrowseRecord(parseInt(data.data.nowPage)+1)
                        };
                        continue;
                    }
                    (function (i) {
                        obj[i].onclick=function(){
                            getUserBrowseRecord(parseInt(obj[i].innerHTML));
                        };
                    })(i);
                }
            }else{
                alert('net failure');
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            // alert(XMLHttpRequest.status);
            // alert(XMLHttpRequest.readyState);
            // alert(textStatus);
        }
    });


}


$(function(){
    checkLogin();
    getUserBrowseRecord();
});