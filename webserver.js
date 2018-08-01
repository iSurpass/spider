"use strict";

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
               body = page.content;
               //写入文件
               fs.write('demo.html',body,'w');
               response.write(body);
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