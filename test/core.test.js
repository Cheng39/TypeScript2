"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var core_1 = require("../src/core");
describe('日期格式', function () {
    it('2-digit month and day', function () {
        var input = '2024-12-21';
        var output = '2024年12月21日';
        (0, chai_1.expect)((0, core_1.formatDate)(input)).to.equal(output);
    });
    it('1-digit month', function () {
        var input = '2024-01-21';
        var output = '2024年1月21日';
        (0, chai_1.expect)((0, core_1.formatDate)(input)).to.equal(output);
    });
    it('1-digit day', function () {
        var input = '2024-12-01';
        var output = '2024年12月1日';
        (0, chai_1.expect)((0, core_1.formatDate)(input)).to.equal(output);
    });
});
describe('小費計算', function () {
    it('無小費', function () {
        var subTotal = 100;
        var tipPercentage = 0;
        var output = 0;
        (0, chai_1.expect)((0, core_1.calculateTip)(subTotal, tipPercentage)).to.equal(output);
    });
    it('有小費，不需要四捨五入', function () {
        var subTotal = 100;
        var tipPercentage = 10;
        var output = 10;
        (0, chai_1.expect)((0, core_1.calculateTip)(subTotal, tipPercentage)).to.equal(output);
    });
    it('有小費，向下四捨五入', function () {
        var subTotal = 123.4;
        var tipPercentage = 10;
        var output = 12.3;
        (0, chai_1.expect)((0, core_1.calculateTip)(subTotal, tipPercentage)).to.equal(output);
    });
    it('有小費，向上四捨五入', function () {
        var subTotal = 123.5;
        var tipPercentage = 10;
        var output = 12.4;
        (0, chai_1.expect)((0, core_1.calculateTip)(subTotal, tipPercentage)).to.equal(output);
    });
});
describe('分帳計算', function () {
    it('無舍入誤差', function () {
        var input = {
            date: '2024-03-21',
            location: '開心小館',
            tipPercentage: 10,
            items: [
                {
                    price: 82,
                    name: '牛排',
                    isShared: true,
                },
                {
                    price: 10,
                    name: '橙汁',
                    isShared: false,
                    person: 'Alice',
                },
                {
                    price: 8,
                    name: '熱檸檬水',
                    isShared: false,
                    person: 'Bob',
                },
            ],
        };
        var output = {
            date: '2024年3月21日',
            location: '開心小館',
            subTotal: 100,
            tip: 10,
            totalAmount: 110,
            items: [
                {
                    name: 'Alice',
                    amount: 56.1,
                },
                {
                    name: 'Bob',
                    amount: 53.9,
                },
            ],
        };
        (0, chai_1.expect)((0, core_1.splitBill)(input)).to.deep.equal(output);
    });
    it('有舍入誤差，向下調整 0.1 元', function () {
        var input = {
            date: '2024-03-21',
            location: '開心小館',
            tipPercentage: 10,
            items: [
                {
                    price: 199,
                    name: '牛排',
                    isShared: true,
                },
                {
                    price: 10,
                    name: '橙汁',
                    isShared: false,
                    person: 'Alice',
                },
                {
                    price: 12,
                    name: '薯條',
                    isShared: true,
                },
                {
                    price: 8,
                    name: '熱檸檬水',
                    isShared: false,
                    person: 'Bob',
                },
                {
                    price: 8,
                    name: '熱檸檬水',
                    isShared: false,
                    person: 'Charlie',
                },
            ],
        };
        var output = {
            date: '2024年3月21日',
            location: '開心小館',
            subTotal: 237,
            tip: 23.7,
            totalAmount: 260.7,
            items: [
                {
                    name: 'Alice',
                    amount: 88.3 /* 向下調整 0.1 元 */,
                },
                {
                    name: 'Bob',
                    amount: 86.2,
                },
                {
                    name: 'Charlie',
                    amount: 86.2,
                },
            ],
        };
        (0, chai_1.expect)((0, core_1.splitBill)(input)).to.deep.equal(output);
    });
    it('有舍入誤差，向上調整 0.1 元', function () {
        var input = {
            date: '2024-03-21',
            location: '開心小館',
            tipPercentage: 10,
            items: [
                {
                    price: 194,
                    name: '牛排',
                    isShared: true,
                },
                {
                    price: 10,
                    name: '橙汁',
                    isShared: false,
                    person: 'Alice',
                },
                {
                    price: 10,
                    name: '橙汁',
                    isShared: false,
                    person: 'Bob',
                },
                {
                    price: 10,
                    name: '橙汁',
                    isShared: false,
                    person: 'Charlie',
                },
            ],
        };
        var output = {
            date: '2024年3月21日',
            location: '開心小館',
            subTotal: 224,
            tip: 22.4,
            totalAmount: 246.4,
            items: [
                {
                    name: 'Alice',
                    amount: 82.2 /* 向上調整 0.1 元 */,
                },
                {
                    name: 'Bob',
                    amount: 82.1,
                },
                {
                    name: 'Charlie',
                    amount: 82.1,
                },
            ],
        };
        (0, chai_1.expect)((0, core_1.splitBill)(input)).to.deep.equal(output);
    });
});
