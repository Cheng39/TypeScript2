"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitBill = splitBill;
exports.formatDate = formatDate;
exports.calculateTip = calculateTip;
//核心函数
function splitBill(input) {
    // ... (之前的代码 - formatDate, location, subTotal, tip, totalAmount, items 的计算) ...
    var date = formatDate(input.date); //声明日期，调用formatDate，函数格式化日期
    var location = input.location; //声明地点，直接使用输入的地点
    var subTotal = calculateSubTotal(input.items); //声明小计，计算小计，直接使用输入项目里的
    var tip = calculateTip(subTotal, input.tipPercentage); //声明小费，计算小费，包含小计，输入，个人小费，并调用函数计算小费
    var totalAmount = subTotal + tip; //总金额=小计+小费
    var items = calculateItems(input.items, input.tipPercentage); //声明项目，由calculateItems函数来计算输入项目，输入个人小费费用
    adjustAmount(totalAmount, items); // 调用 adjustAmount 函数调整个人应付金额以匹配总金额
    // 声明 billOutput 变量，并将 BillOutput 对象赋值给它
    var billOutput = {
        date: date, //返回日期
        location: location, //返回地点
        subTotal: subTotal, //返回小计
        tip: tip, //返回小费
        totalAmount: totalAmount, //返回总金额
        items: items.map(function (item) { return ({ name: item.name, amount: parseFloat(item.amount.toFixed(1)) }); }), //返回项目，并在这里对 amount 进行四舍五入
    };
    console.log("完整账单输出 (BillOutput):");
    console.log(billOutput); // 现在 billOutput 变量已经被定义，可以正常使用
    return billOutput; // 返回 billOutput 变量
}
/*0210,最先的代码，根据老师里加export调用函数日期，
export function formatDate(date: string): string {
    const [year, month, day] = date.split('-');//使用‘-’分隔开字串，取得年月日。
    const formattedMonth = parseInt(month, 10).toString();//将月份字串，转换为数字后，再变回字串，移除前缀0
    const formattedDay = parseInt(day, 10).toString();//与月份同理
    return `${year}年${formattedMonth}月${formattedDay}日`;//使用样板字串组合输出格式
//使用Gemini，0209/1700抄写测试。

    
    console.log(formatDate('2024-12-21')); // 預期輸出: 2024年12月21日
    console.log(formatDate('2024-01-21')); // 預期輸出: 2024年1月21日
    console.log(formatDate('2024-12-01')); // 預期輸出: 2024年12月1日
//用于测试日期模块，是否符合老师要求，使用-分割，且没0字。
在0214抛弃，专用deepseek的正则表达，更严谨。*/
function formatDate(date) {
    //导出函数，格式化日期为字符串模式
    var match = date.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    //常量 匹配本地数组返回结果，日期匹配
    //^从头匹配，\d数字，{4}连续出现4个数字，=年份，保存在第一个分组match1，-减号分割
    //\d数字，{1,2}连续出现1个或者2个数字，保存在march2
    //与上同理，只是保存在march3
    if (!match) { //如果，！match正则匹配失败，则提示，输入格式不正确。
        throw new Error("Invalid date format. Expected: YYYY-MM-DD.");
        //抛出一个错误提示词，日期的格式无效，正确的是XXXX-XX-XX.
    }
    var _a = match.slice(1), year = _a[0], month = _a[1], day = _a[2]; //数组第0项目的123项对应年月日
    var monthNum = parseInt(month, 10); //声明，月份，以10进制解析，用来去0.
    var dayNum = parseInt(day, 10); //目前只认识parseInt，精确使用不会。
    // 校验月份和日期的有效性
    if (monthNum < 1 || monthNum > 12 || //月份数字小于1，或者大于12，抛出一个错误，||做对比验证
        dayNum < 1 || dayNum > 31 //两次连续对比，第一测大小，如果小直接出错，如果不小于，但是大于31，也会提示错误。
    ) {
        throw new Error("Invalid date value."); //抛出一个日期格式错误
    }
    // 移除前导零并拼接
    return "".concat(year, "\u5E74").concat(monthNum, "\u6708").concat(dayNum, "\u65E5");
    //字符串占位符${}，year转化为字符串，到设定好的位置，数字填入年月日前面。
    //类似一个变量容器，表达式放入进去，自动计算结果
}
function calculateSubTotal(items) {
    var subTotal = 0; // 初始化小计为0
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) { // 循环遍历每个账单项目
        var item = items_1[_i];
        subTotal += item.price; // 累加项目价格到小计
    }
    return subTotal; // 返回计算后的小计
}
function calculateTip(subTotal, tipPercentage) {
    if (isNaN(subTotal) || isNaN(tipPercentage)) { // 检查 subTotal 和 tipPercentage 是否为数字
        return 0; // 如果不是数字，则返回小费 0，或者你也可以抛出错误
    }
    var tip = subTotal * (tipPercentage / 100); // 计算小费
    return Math.round(tip * 10) / 10; // **更改 1: 使用 Math.round 实现四舍五入到 0.1**
}
function scanPersons(items) {
    var persons = new Set(); // 使用 Set 来存储人员姓名，自动去重
    for (var _i = 0, items_2 = items; _i < items_2.length; _i++) { // 遍历每个账单项目
        var item = items_2[_i];
        if (!item.isShared && item.person) { // 检查是否为个人项目并且存在 person 属性
            persons.add(item.person); // 如果是个人项目，将 person 属性值添加到 Set 中
        }
    }
    return Array.from(persons); // 将 Set 转换为数组并返回
    // scan the persons in the items
}
function calculateItems(items, tipPercentage) {
    var names = scanPersons(items); // 获取所有人员姓名
    var personsCount = names.length; // 获取人员数量
    var sharedItemsSubTotal = items.filter(function (item) { return item.isShared; }).reduce(function (sum, item) { return sum + item.price; }, 0); // 计算共享项目的总价
    var sharedTip = calculateTip(sharedItemsSubTotal, tipPercentage); // 计算共享项目的小费
    // 更改 1: 在计算 sharedTipPerPerson 时进行舍入
    var sharedTipPerPerson = parseFloat((sharedTip / personsCount).toFixed(1)); // 计算每个人应分摊的共享小费, 并舍入到一位小数
    var personItemsMap = new Map(); // 使用 Map 存储每个人的项目明细
    names.forEach(function (name) {
        personItemsMap.set(name, { name: name, amount: 0 }); // 初始应付金额为 0
    });
    var _loop_1 = function (item) {
        if (item.isShared) { // 如果是共享项目
            // 更改 2: 在计算 pricePerPerson 时进行舍入
            var pricePerPerson_1 = parseFloat((item.price / personsCount).toFixed(1)); // 计算每个人应分摊的共享项目价格, 并舍入到一位小数
            names.forEach(function (name) {
                var personItem = personItemsMap.get(name); // 使用 ! 断言 personItem 存在，因为前面已经初始化
                // 更改 3: 累加时加上舍入后的小费
                personItem.amount += pricePerPerson_1 + sharedTipPerPerson; // 累加共享项目分摊价格和共享小费
                // 更改 4: 对 personItem.amount 再次舍入，确保累加后的总额也是一位小数
                personItem.amount = parseFloat(personItem.amount.toFixed(1));
            });
        }
        else { // 如果是个人项目
            var personalItem = item; // 类型断言为 PersonalBillItem
            var personItem = personItemsMap.get(personalItem.person); // 获取个人项目所属人的 PersonItem
            personItem.amount += personalItem.price; // 累加个人项目价格，个人项目不分摊小费
            // 更改 5: 对 personItem.amount 再次舍入，确保累加个人项目后的总额也是一位小数
            personItem.amount = parseFloat(personItem.amount.toFixed(1));
        }
    };
    for (var _i = 0, items_3 = items; _i < items_3.length; _i++) {
        var item = items_3[_i];
        _loop_1(item);
    }
    // 将 Map 转换为 PersonItem 数组
    var personItems = [];
    personItemsMap.forEach(function (item) { return personItems.push(item); });
    return personItems;
}
function adjustAmount(totalAmount, items) {
    var currentTotal = parseFloat(items.reduce(function (sum, item) { return sum + item.amount; }, 0).toFixed(1));
    var diff = parseFloat((totalAmount - currentTotal).toFixed(1));
    if (Math.abs(diff) > 0.01) {
        // 优先调整金额较多的人，或者可以根据其他策略更均匀地分配差额
        var sortedItems = __spreadArray([], items, true).sort(function (a, b) { return b.amount - a.amount; }); // 金额从高到低排序
        var adjustmentPerPerson = parseFloat((diff / items.length).toFixed(2)); // 计算平均每人调整多少 (保留两位小数先)
        var remainingDiff = diff;
        for (var i = 0; i < sortedItems.length; i++) {
            var itemToAdjust = sortedItems[i];
            var adjustment = adjustmentPerPerson;
            // 确保最后一个人调整后，总额完全相等，避免累积误差
            if (i === sortedItems.length - 1) {
                adjustment = remainingDiff; // 将剩余的差额全部给最后一人
            }
            var adjustedAmount = parseFloat((itemToAdjust.amount + adjustment).toFixed(1)); // 调整金额并舍入到一位小数
            itemToAdjust.amount = adjustedAmount;
            remainingDiff = parseFloat((remainingDiff - adjustment).toFixed(1)); // 减去已调整的差额, 并进行舍入
            if (Math.abs(remainingDiff) <= 0.01) { // 差额足够小，提前结束调整
                break;
            }
        }
        // 再次进行最终的总额校验和微调 (可以省略，如果在循环中已精确控制)
        currentTotal = parseFloat(items.reduce(function (sum, item) { return sum + item.amount; }, 0).toFixed(1));
        diff = parseFloat((totalAmount - currentTotal).toFixed(1));
        if (Math.abs(diff) > 0.01 && items.length > 0) { // 最后的微调，如果还有少量误差，调整第一个人
            items[0].amount = parseFloat((items[0].amount + diff).toFixed(1));
        }
    }
}
