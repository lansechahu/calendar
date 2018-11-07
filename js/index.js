var total = 6 * 7;
var nowRow = 1;
var totalRow = 5;
var nowLow = 0;
var totalLow = 7;

var oDate = new Date();
var oYear = oDate.getYear();
var isLeap = oYear % 400 == 0 ? 1 : ((oYear % 100 != 0 && oYear % 4 == 0) ? 1 : 0);
var aMouth = [31, 28 + isLeap, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];//创建月份尾数表，作为每张日历最后一个数
var aWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

var y = oDate.getFullYear();
var m = oDate.getMonth(),
    d = oDate.getDate(),
    w = oDate.getDay();

var dateArr = [];

var lunarYear = ''; //当前的阴历年份


$(function () {
    init();
})


function init() {
    var rowEle = document.getElementsByClassName('row');
    //console.log(rowEle[1].children[0]);
    for (var i = 0; i < aWeek.length; i++) {
        rowEle[0].children[i].innerHTML = aWeek[i];
    }
}


update();
getToday();


//清空表格
function clearTable() {
    nowRow = 1;
    nowLow = 0;
    for (var i = 0; i < total; i++) {
        var temp = $('.row').eq(nowRow).children('.box').eq(nowLow);
        if (temp.hasClass('boxLineSelect')) {
            temp.removeClass('boxLineSelect');
        }
        if (!temp.hasClass('boxLine')) {
            temp.addClass('boxLine');
        }
        if (temp.hasClass('nothisMonth')) {
            temp.removeClass('nothisMonth');
        }
        if (!temp.hasClass('thisMonth')) {
            temp.addClass('thisMonth');
        }

        temp.children('.gongli').html('');
        nowLow++;
        if (nowLow >= totalLow) {
            nowLow = 0;
            nowRow++;
        }
        temp.off('click');
    }

    dateArr = [];
}

function update() {
    clearTable();
    var firstDate = new Date(y, m, 1); //获取当月第一天
    var dayOfWeek = firstDate.getDay();//获取当月的第一天是星期几
    //console.log(aMouth[m], d);
    nowRow = 1;
    nowLow = dayOfWeek;

    //获取阴历年份，用当年当月（月份要+1，因为是从0开始的）的最后一天换算阴历年份
    lunarYear = GetLunarYear(y, m + 1, aMouth[m]);

    var tempLow = 0;
    var dayNum = 1;
    for (var i = 0; i < total; i++) {
        var temp = {};
        if (dayNum > aMouth[m]) {
            temp.str = '后一个月';
        } else {
            if (tempLow < nowLow) {
                if (nowRow == 1) {
                    temp.str = '前一个月';
                } else {
                    temp = setInfo(y, m, d, dayNum);
                    dayNum++;
                }
            } else {
                temp = setInfo(y, m, d, dayNum);
                dayNum++;
            }
        }

        dateArr.push(temp);

        tempLow++;
        if (tempLow >= totalLow) {
            tempLow = 0;
            nowRow++;
        }
    }

    setPreMonth();
    setNextMonth();

    //设置前一个月
    function setPreMonth() {
        var tempM = m - 1;
        var tempY = y;
        if (tempM < 0) {
            tempM = 11;
            tempY--;
        }
        var __odate = new Date(tempY, tempM);
        var __y = __odate.getFullYear();
        var __m = __odate.getMonth();
        var __d = __odate.getDate();
        var __dayNum = aMouth[__m];

        for (var i = dateArr.length - 1; i >= 0; i--) {
            if (dateArr[i].str == '前一个月') {
                var temp = setInfo(__y, __m, __d, __dayNum);
                dateArr[i] = temp;
                __dayNum--;
            }
        }
    }

    //设置后一个月
    function setNextMonth() {
        var tempM = m + 1;
        var tempY = y;
        if (tempM > 11) {
            tempM = 0;
            tempY++;
        }
        var __odate = new Date(tempY, tempM);
        var __y = __odate.getFullYear();
        var __m = __odate.getMonth();
        var __d = __odate.getDate();
        var __dayNum = 1;

        for (var i = 0; i < dateArr.length; i++) {
            if (dateArr[i].str == '后一个月') {
                var temp = setInfo(__y, __m, __d, __dayNum);
                dateArr[i] = temp;
                __dayNum++;
            }
        }
    }


    function setInfo(__y, __m, __d, __dayNum) {
        var temp = {};
        temp.str = __dayNum;
        temp.year = __y;
        temp.month = __m + 1;
        temp.date = __dayNum;
        temp.canClick = true;
        var tempDate = new Date(__y, __m, __dayNum - 1);
        var tempW = tempDate.getDay() + 1;

        //获取阴历日期及节气
        var obj = GetLunarDay(temp.year, temp.month, temp.date);
        temp.cYear = obj.cYear;
        temp.cMonth = obj.cMonth;
        temp.cDay = obj.cDay;
        temp.solarTerm = obj.solarTerm;

        tempW = (tempW == 7) ? tempW = 0 : tempW;
        temp.month = temp.month < 10 ? '0' + temp.month : temp.month.toString();

        temp.day = aWeek[tempW] || tempW;
        //判断当前日期是不是今天
        if (dayNum == __d && y == new Date().getFullYear() && m == new Date().getMonth()) {
            temp.today = true;
        } else {
            temp.today = false;
        }
        //判断是不是当前显示的月份的日子
        if (m != __m) {
            temp.thisMonth = false;
        }
        return temp;
    }

    showFullDate();
    showSelectYM();
}

//显示日历
function showFullDate() {
    //显示阴历年份
    $('#lunarYear').html(lunarYear);

    nowRow = 1;
    nowLow = 0;

    for (var i = 0; i < total; i++) {
        var tempDay = dateArr[i];
        var temp = $('.row').eq(nowRow).children('.box').eq(nowLow);
        //console.log($('.row').eq(nowRow).children('.box').eq(nowLow).children('.gongli'));
        temp.children('.gongli').html(tempDay.str);
        temp.children('.yinli').html('立冬');
        temp.attr('year', tempDay.year);
        temp.attr('month', tempDay.month);
        temp.attr('date', tempDay.date);
        temp.attr('day', tempDay.day);
        temp.attr('cYear', tempDay.cYear);
        temp.attr('cMonth', tempDay.cMonth);
        temp.attr('cDay', tempDay.cDay);
        temp.attr('solarTerm', tempDay.solarTerm);

        if (tempDay.solarTerm != '') {
            temp.children('.yinli').html(tempDay.solarTerm);
        } else {
            temp.children('.yinli').html(tempDay.cMonth + tempDay.cDay);
        }

        //判断当前日期是不是今天
        if (tempDay.today == true) {
            temp.addClass('today');
        } else {
            if (temp.hasClass('today')) {
                temp.removeClass('today');
            }
        }

        //判断当前日期是不是当前显示的月份的
        if (tempDay.thisMonth == false) {
            temp.removeClass('thisMonth');
            temp.addClass('nothisMonth');
        }

        nowLow++;
        if (nowLow >= totalLow) {
            nowLow = 0;
            nowRow++;
        }

        if (tempDay.canClick) temp.on('click', selectDay);
    }
}

//点击选了某一天
function selectDay() {
    //console.log($(this));
    var __row = 1;
    var __low = 0;
    for (var i = 0; i < total; i++) {
        var temp = $('.row').eq(__row).children('.box').eq(__low);
        if (temp.hasClass('boxLineSelect')) {
            temp.removeClass('boxLineSelect');
        }
        if (!temp.hasClass('boxLine')) {
            temp.addClass('boxLine');
        }
        __low++;
        if (__low >= totalLow) {
            __low = 0;
            __row++;
        }
    }
    $(this).addClass('boxLineSelect');
    var str = $(this).attr('year') + '年' + $(this).attr('month') + '月' + $(this).attr('date') + '日 ' + $(this).attr('day');
    $('#selectYM').html(str);

    //显示阴历部分
    var lunarStr = $(this).attr('cYear') + $(this).attr('cMonth') + $(this).attr('cDay');
    $('#selectLunar').html(lunarStr);
}

//显示当前日期
function getToday() {
    var __date = new Date();
    var __y = __date.getFullYear();
    var __m = __date.getMonth() + 1;
    var __d = __date.getDate();
    var __w = __date.getDay();

    __m = __m < 10 ? '0' + __m : __m.toString();
    __d = __d < 10 ? '0' + __d : __d.toString();
    __w = (__w == 7) ? __w = 0 : __w;

    var str = __y + '-' + __m + '-' + __d + ' ' + aWeek[__w];
    $('#nowDate').html(str);
}

//显示当前表格所显示的年月
function showSelectYM() {
    var mStr = m + 1;
    mStr = mStr < 10 ? '0' + mStr : mStr.toString();
    var str = y + '年' + mStr + '月';
    $('#selectYM').html(str);
}

//上一个月
function preMonth() {
    m--;
    if (m < 0) {
        y--;
        m = 11;
    }
    update();
}

//上一年
function preYear() {
    y--;
    update();
}

//下一年
function nextYear() {
    y++;
    update();
}

//下一月
function nextMonth() {
    m++;
    if (m > 11) {
        y++;
        m = 0;
    }
    update();
}