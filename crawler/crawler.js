var jsdom = require('jsdom');
var Crawler = require("crawler");
var https = require('https');
var request = require('request');
var superagent = require('superagent');

const getPageHref = new Crawler({
    maxConnections: 100,
    forceUTF8: true,
})

function decode(str) {
    if (!str) return;
    str = str.replace(/&#x(\w+;)/g, function (match, s) {
        return String.fromCharCode(parseInt(s, 16));
    });
    return str.replace(/<[^>]+>/g, '');
};

const getDiaosiPromise = (search, skip, limit) => { return [1,2].map(v => {
        let DIAOSISOU = encodeURI(`http://www.diaosisou.org/list/${search}/${(skip/10)+v}`);
        return new Promise((reslut, rej) => {
            let info = [];
            getPageHref.queue({
                uri: DIAOSISOU,
                callback: function (error, res) {
                    if (error) {
                        console.error(error);
                        rej(error);
                        return fasle;
                    } else {
                        var $ = res.$;
                        const dom = $('.mlist li');
                        const allSize = decode($('.rststat').html()).match(/[0-9]+/)[0];
                        dom.each((v) => {
                            const $this = dom.eq(v);
                            let item = {};
                            let _magnet = $this.find('.dInfo a').eq(0).attr('href')
                            let _thunder = $this.find('.dInfo a').eq(1).attr('href')
                            let _title = decode($this.find('a[name="file_title"]').html());
                            item.title = _title;
                            item.magnet = _magnet;
                            item.thunder = _thunder;
                            item.size = decode($this.find('.BotInfo dt span').eq(0).html());
                            item.tr_create_time = decode($this.find('.BotInfo dt span').eq(2).html());
                            item.hot = decode($this.find('.BotInfo dt span').eq(3).html());
                            info.push(item);
                        })
                        reslut({info, all_size: allSize});
                    }
                }
            })
        })
    })
}
const getCNTKittyPromise = (search, skip, limit) => [1,2].map((v)=> {
    const page = skip / 10 + v;
    let CNTORRENTKITTY = encodeURI(`http://cntorrentkitty.com/tk/${search}/${page}-0-0.html`)
    return new Promise((reslut, rej) => {
        getPageHref.queue({
            uri: CNTORRENTKITTY,
            callback: function (err, res) {
                if (err) {
                    console.error(err);
                    rej(err);
                    return false;
                } else {
                    const $ = res.$;
                    const titleArr = $('.list-area .list .dt');
                    const detailsArr = $('.list-area .list .attr');
                    const title = [],
                        size = [],
                        magnet = [],
                        tr_create_time = [],
                        type = [],
                        hot = [];
                    titleArr.each(function (i) {
                        const $this = titleArr.eq(i);
                        const _title = $this.find('a').html();
                        const _type = $this.children('span:first-of-type').html();
                        title.push(_title);
                        type.push(_type);
                    })
                    detailsArr.each(function (i) {
                        const $this = detailsArr.eq(i);
                        const _magnet = $this.find('a').attr('href');
                        const _tr_create_time = $this.find('span:nth-of-type(4) b').html();
                        const _size = $this.find('span:nth-of-type(3) b').html();
                        const _hot = $this.find('span:last-of-type b').html();
                        magnet.push(_magnet);
                        size.push(_size);
                        hot.push(_hot);
                        tr_create_time.push(_tr_create_time);
                    })
                    const allSize = decode($('.category .select .n').html());
                    const info = magnet.map((v, i) => {
                        return {
                            size: decode(size[i]),
                            magnet: decode(v),
                            type: decode(type[i]),
                            tr_create_time: decode(tr_create_time[i]),
                            hot: decode(hot[i]),
                            title: decode(title[i]),
                        }
                    })
                    reslut({info, all_size: decode(allSize) || 0});
                }
            }
        })
    })
})


export async function  getDiaoSiSou(search, skip, limit) {
    return  Promise.all(getDiaosiPromise(search, skip, limit));
}

export async function  getCNTKitty(search, skip, limit) {
    return Promise.all(getCNTKittyPromise(search, skip, limit));
}
 export  function getBTSO(search, skip, limit) {
    return getBTSOPromis(search, skip, limit).catch(e => console.log(e));
}
function getBTSOPromis(search, skip, limit) {
    const info = [];
    const page = skip / 30 + 1;
    let BTSO = encodeURI(`https://btso.pw/search/${search}/page/${page}`); 
    var headers = {
        // 'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
    }
    var options = {
        uri : BTSO,
        headers,
        gzip:true
    }
    return new Promise((result, rej) => {
            getPageHref.queue({
                uri : BTSO,
                headers,
                gzip:true,
                callback: function(err, res) {
                    if(err) {
                        rej(err)
                        console.error(err);
                        return false;
                    } else {
                        console.log(res);
                        let $ = res.$;
                        if (typeof $ == 'function') {
                            const details = $('.data-list .row');
                            details.each(function (v) {
                                if (v == 0) { } else {
                                    const reg = /\/hash\/([\w\W]+)/
                                    const $this = details.eq(v);
                                    const title = decode($this.find('a').attr('title'));
                                    const href = decode($this.find('a').attr('href'));
                                    const magnet = 'magnet:?xt=urn:btih:' + (href && href.match(reg) && href.match(reg)[1]);
                                    const size = decode($this.find('.size').html());
                                    const tr_create_time = decode($this.find('.date').html());
                                    info.push({
                                        title,
                                        size,
                                        tr_create_time,
                                        magnet
                                    })
                                }
                            })
                            result(info);
                        } else {
                            rej('res is not html')
                            console.error(err);
                            return false;
                        }

                    }
                }
            })
       
    })
}




