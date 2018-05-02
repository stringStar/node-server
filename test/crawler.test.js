var assert = require('assert');
// import crawler from '../crawler/crawler';
var Crawler = require('../crawler/crawler.js')

describe('Torrent爬虫测试', function () {
    // 10s才算慢
    this.timeout(5000);
    // var done = () => { console.log('我是回调函数') }
    it('DIAOSISOU',async function () {
        const data = await Crawler.getDiaoSiSou('数据查询', 0 ,20);
        console.log(data);
        // assert.equal(data, )
    })
    it('我这3s就很慢了', function (done) {
        setTimeout(done, 2000)
    })
})
