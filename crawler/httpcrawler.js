var request = require('request');
//var http = require('http');
var headers = {
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
}

var options = {
    url : 'https://btso.pw/search/%E9%9D%A0/page/3',
    headers,
    gzip:true
}
function getHtmlByUrl(href) {
    request(options, function(err, response, body) {
        console.log(response.statusCode ,response.statusMessage);
        if (!err && response.statusCode == 200) {
            console.log(body);//body即为目标页面的html
        } else {
            console.log(err);
            console.log('get page error url => ' + href);
        }
    });
}
getHtmlByUrl("https://btso.pw");