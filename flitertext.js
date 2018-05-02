var fs = require('fs');
function filterText(...filterUser) {
    fs.readFile('./dm.txt', 'utf-8',function(err, res) {
        // console.log(res);   
        var reg = /[^\n]+/g;
        const data = res.match(reg);
        const newData = []
        data.forEach(v => {
            if(v.indexOf('):') === -1) {
                newData[newData.length -1] = newData[newData.length -1]+'\n'+ v;
            } else {
                newData.push(v);
            }
        })
        const userData = newData.filter(v => {
            if(v.indexOf('----') > -1) return false;
            if(v.indexOf(filterUser) > -1) return false;
            return true
        })
        const strData = userData.map(v => {
            var a = v.match(/^[\w\W]+\):*\s*/)[0];
            return v.replace(a, '');
        });
        const str = [...new Set(strData)];
        fs.writeFile('output.txt',str.join('\n'),function(err) {
            if(err) console.log(err);
            console.log('输出成功')
        } )
    })
}

filterText(['菲寻家居旗舰店',])