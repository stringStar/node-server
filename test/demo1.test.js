var assert = require('assert');

describe('我的第一个describe会被运行',function() {
    // 10s才算慢
    this.timeout(10000);
    var done = () => {console.log('我是回调函数')}
    it('我这里延迟5s都不慢', function(done) {
        this.slow(100000);
       setTimeout(done, 5000)
    })
    it('我这3s就很慢了', function(done) {
      setTimeout(done, 2000)
    })
  })