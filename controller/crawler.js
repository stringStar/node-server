import {getDiaoSiSou, getCNTKitty, getBTSO} from '../crawler/crawler';
class Crawler {
    constructor() {
    }
    async getCNTKitty(req, res, next) {
        console.log('begin')
        const {
            search = '',
            skip = 0, 
            limit = 20, 
            website = 'DSS'
        } = req.query;
        let data = {};
        try {
            switch (website) {
                case 'DSS':
                   let list = await getDiaoSiSou(search, skip, limit);
                   console.log(list);
                   data = {
                       data: [...list[0].info, ...list[1].info],
                       all_size: list[0].all_size
                    }
                    break;
                case 'TRNK':
                    let list2 = await getCNTKitty(search, skip, limit);
                    console.log(list2);
                    data = {
                        data: [...list2[0].info, ...list2[1].info],
                        all_size: list2[0].all_size
                     }
                    break;
                case 'BTSO':
                    let btso = await getBTSO(search, skip, limit);
                    data = {
                        data: btso,
                        all_size: btso.length < 30 ? Number(skip) + 20 : Number(skip) + 31
                    }
                    break;
                default:
            }
            res.send({code: 0, ...data});
        } catch (e) {
            console.log(e);
            res.send({ code: 1, data: [] })
        }
    }
}
export default new Crawler;