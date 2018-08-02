/*"use strict";

//创建一个新的文件夹来存储爬虫后的数据

var port,server,service,
    system=require('system');
var fs = require('fs');
var root = fs.absolute("./data");
fs.makeDirectory(root);
fs.changeWorkingDirectory(root);
console.log("workingDirectory:" + root);

//创建页面实例

var page = require('webpage').create();

if(system.args.length !== 2){ //判断命令行输入的参数是否等于2 第一个参数是文件名 第二个是端口号
    console.log('Usage: serverkeepalive.js <portnumber>');
    phantom.exit(1);
}else {
    port = system.args[1];
    server = require('webserver').create();

    service = server.listen(port,function (request,response) {
        var requsetUrl = request.post.url;
        response.headers = {
            'Cache' : 'no-cache',
            'Content-Type' : 'text/html;charset=utf-8'
        };
       if (requsetUrl){
           page.open(requsetUrl,function (status) {
               if(status!=='success'){
                   console.log('Fail to load the address');
                   return;
               }
               page.switchToFrame(0);
               page.includeJs(jq,function () {
                  page.evaluate(playListsCallback);
               });
               handlerPlayListDetail();
               response.write('success');
               response.close();
           });
       }else {
           var body = 'no spider url';
           response.write(body);
           response.close();
       }
    });

    if (service){
        console.log('Web server running on port ' + port);
    } else {
        console.log('Error: Could not create web server listening on port '+ port);
        phantom.exit();
    }
}

var jq = "https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js";

var playLists = [];

page.onError = function (message) {
  if (message.indexOf('__data__') != -1){
      var data = message.substr(8);
      console.log(data);
      var jsonData = JSON.parse(data);
      if (jsonData.dataType === 'playLists'){
          for (var i = 0; i<jsonData.playLists.length; i++){
              playLists.push(jsonData.playLists[i]);
          }
      }else if (jsonData.dataType === 'playListDetail'){
          var playListDetailFile = './' + jsonData.id + ".json" ;
          if (!fs.exists(playListDetailFile)){
              fs.write(playListDetailFile,data,'w');
          }
      }
  }else {
      console.log(message);
  }
};

function playListsCallback() {
    var items = [];
    jQuery('#m-pl-container li').each(function () {
        var target = jQuery(this);
        var href = 'https://music.163.com/#' + target.find(
            '.ucover a').attr('href');
        var item = {
            href:href,
            id: target.find('.icon-play').data('res-id')
        };
        items.push(item);
    });

    var playLists = {
        dataType : "playLists",
        playLists: items
    };
    console.error('__data__' + JSON.stringify(playLists, undefined, 4));
}

function handlerPlayListDetail() {
    setTimeout(invokeDetail,0);
}

function invokeDetail() {
    if(playLists.length === 0){
        handlerPlayListDetail();
        return ;
    }

    var playListHref = playLists[0].href;
    var playListDetailFile = './' + playLists[0].id + ".json";
    playLists = playLists.slice(1);

    if(fs.exists(playListDetailFile)){
        handlerPlayListDetail();
        return;
    }

    page.open(playListHref,function (status) {
        if (status != 'success'){
            console.log('FAIL to load the address',page.url);
            playLists.push((page.url));
            handlerPlayListDetail();
            return;
        } else {
            console.log('SUCCESS to load the address',page.url);
            page.includeJs(jq,function () {
                page.evaluate(detailCallback);
                handlerPlayListDetail();
            });
        }
    });

   function detailCallback() {
       var playList = {
           dataType:'playListDetail',
           title:jQuery('.tit h2').text(),
           id:jQuery('#content-operation').data('rid'),
           cover:jQuery('.u-cover img').attr('src'),
           desc:jQuery('#album-desc-dot').html(),
           songs:[]
       };

       jQuery('.m-table tbody tr').each(function () {
           var song = {
               id:jQuery(this).find('.hd span').data('res-id'),
               name:jQuery(this).find('b').attr('title'),
               duration: jQuery(this).find('.u-dur').text(),
               singer: jQuery(this).find('.text').attr('title'),
               albumName: jQuery(this).find('.text >a').attr('title')
           };
           playList.songs.push(song);
       });
       console.error('__data__' + JSON.stringify((playList, undefined, 4)));
   }

}
*/

"use strict";
var port, server, service,
    system = require('system');
var fs = require('fs');
var root = fs.absolute("./data");
fs.makeDirectory(root);
fs.changeWorkingDirectory(root);
console.log('workingDirectory:' + root);

var page = require('webpage').create();

if (system.args.length !== 2) {
    console.log('Usage: serverkeepalive.js <portnumber>');
    phantom.exit(1);
} else {
    port = system.args[1];
    server = require('webserver').create();

    service = server.listen(port, function (request, response) {
        var requestUrl = request.post.url;
        response.headers = {
            'Cache': 'no-cache',
            'Content-Type': 'text/html;charset=utf-8'
        };
        if (requestUrl) {
            page.open(requestUrl, function (status) {
                if (status !== 'success') {
                    console.log('FAIL to load the address');
                    return;
                }
                page.switchToFrame(0);
                page.includeJs(jq, function () {
                    page.evaluate(playListsCallback);

                });

                handlerPlayListDetail();

                response.write('success');
                response.close();
            });
        } else {
            var body = 'no spider url';
            response.write(body);
            response.close();
        }

    });
    if (service) {
        console.log('Web server running on port' + port);
    } else {
        console.log('Error: Could not create web server listening on port' + port);
        phantom.exit();
    }
}
var jq = "http://cdn.bootcss.com/jquery/3.3.1/jquery.min.js";
var playLists = [];
page.onError = function (message) {
    if (message.indexOf('__data__') != -1) {
        var data = message.substr(8);
        console.log(data);
        var jsonData = JSON.parse(data);
        if (jsonData.dataType === 'playLists') {
            for (var i = 0; i < jsonData.playLists.length; i++) {
                playLists.push(jsonData.playLists[i]);
            }
        }else if (jsonData.dataType === 'playListDetail'){
            var playListDetailFile = './' + jsonData.id + ".json";
            if (!fs.exists(playListDetailFile)){
                fs.write(playListDetailFile,data,'w');
            }
        }

    } else {
        console.log(message);
    }

};


function playListsCallback() {
    var items = [];
    jQuery('#m-pl-container li').each(function () {
        var target = jQuery(this);
        var href = 'https://music.163.com/#' + target.find(
            '.u-cover a').attr('href');
        var item = {
            href: href,
            id: target.find('.icon-play').data('res-id')
        };
        items.push(item);

    });
    var playLists = {
        dataType: 'playLists',
        playLists: items
    };
    console.error('__data__' + JSON.stringify(playLists, undefined, 4));
}
function detailCallback() {
    var playList = {
        dataType: 'playListDetail',
        title: jQuery('.tit h2').text(),
        id: jQuery('#content-operation').data('rid'),
        cover: jQuery('.u-cover img').attr('src'),
        desc: jQuery('#album-desc-dot').html(),
        songs: []
    };
    jQuery('.m-table tbody tr').each(function () {
        var song = {
            id: jQuery(this).find('.hd span').data('res-id'),
            name: jQuery(this).find('b').attr('title'),
            duration: jQuery(this).find('.u-dur').text(),
            singer: jQuery(this).find('.text').attr('title'),
            albumName: jQuery(this).find('.text a').attr('title')
        };
        playList.songs.push(song);
    });
    console.error('__data__' + JSON.stringify(playList, undefined, 4));
}

function handlerPlayListDetail() {
    setTimeout(invokeDetail, 0);
}



function invokeDetail() {
    if (playLists.length === 0) {
        handlerPlayListDetail();
        return;
    }
    var palyListHref = playLists[0].href;
    var playListDetailFile = './' + playLists[0].id + ".json";
    playLists = playLists.slice(1);
    if (fs.exists(playListDetailFile)) {
        handlerPlayListDetail();
        return;
    }
    page.open(palyListHref,function (status) {
        if (status !== 'success'){
            console.log('FAIL to load the address',page.url);
            playLists.push(page.url);
            handlerPlayListDetail();
            return;
        }


        console.log('SUCCESS to load the address', page.url);
        page.includeJs(jq, function () {
            page.evaluate(detailCallback);
            handlerPlayListDetail();

        });
    });
}
