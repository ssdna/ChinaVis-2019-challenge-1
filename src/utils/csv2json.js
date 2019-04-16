/**
 * 简易数据格式转换
 */

const fs = require('fs');
const path = require('path');

const fileList = [
    'data/log-day1',
    'data/log-day2',
    'data/log-day3',
    // 'data/position',
]

for (let i = 0; i < fileList.length-1; i++) {
// for (let i = 0; i < 1; i++) {
    const file = fileList[i];
    const csv = fs.readFileSync(file + '.csv');
    // console.log(csv.toString().split('\n'))
    const json = csv2json(csv.toString())
    fs.writeFileSync(file + '.json', json);
}

function csv2json(csv) {
    const [title, ...content] = csv.trim().split(/\r?\n/);
    const keys = title.split(',');

    const data = content.map(item => {
        const values = item.split(',').map(i => parseInt(i));

        let obj = {};
        for (let i = 0; i < keys.length; i++) {
            obj[keys[i]] = values[i];
        }
        // sid 解析
        const sid = obj.sid;
        obj.x = Math.floor(sid / 100) % 100;
        obj.y = sid % 100;
        obj.z = Math.floor(sid / 10000);

        return obj;
    }).sort((a, b) => {
        if (a.id - b.id > 0) {
            return 1;
        } else if (a.id - b.id < 0) {
            return -1;
        } else if (a.id - b.id === 0) {
            return a.time - b.time;
        }
    })
    // console.log(title)
    return JSON.stringify(data);
}