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
        temp.html('');
        nowLow++;
        if (nowLow >= totalLow) {
            nowLow = 0;
            nowRow++;
        }
        temp.off('click');
    }

    dateArr=[];
}

function update() {
    clearTable();
    var firstDate = new Date(y, m, 1); //获取当月第一天
    var dayOfWeek = firstDate.getDay();//获取当月的第一天是星期几
    //console.log(aMouth[m], d);
    nowRow = 1;
    nowLow = dayOfWeek;
    var rowEle = document.getElementsByClassName('row');

    var tempLow = 0;
    var dayNum = 1;
    for (var i = 0; i < total; i++) {
        var temp = $('.row').eq(nowRow).children('.box').eq(tempLow);
        if (dayNum > aMouth[m]) {
            temp.html('后一个月');
        } else {
            if (tempLow < nowLow) {
                if (nowRow == 1) {
                    temp.html('前一个月');
                } else {
                    temp.html(dayNum);
                    dayNum++;
                }
            } else {
                temp.html(dayNum);
                dayNum++;
            }
        }

        tempLow++;
        if (tempLow >= totalLow) {
            tempLow = 0;
            nowRow++;
        }
    }

    /*for (var i = 0; i < aMouth[m]; i++) {
        var temp = $('.row').eq(nowRow).children('.box').eq(nowLow);
        temp.html(i + 1);
        temp.attr('year', y);
        temp.attr('month', m + 1);
        temp.attr('date', i + 1);
        var tempDate = new Date(y, m, i);
        var tempW = tempDate.getDay();
        temp.attr('day', tempW + 1);
        //rowEle[nowRow].children[nowLow].innerHTML = i + 1;
        //判断当前日期是不是今天
        if (i + 1 == d && y == new Date().getFullYear() && m == new Date().getMonth()) {
            temp.addClass('today');
        } else {
            if (temp.hasClass('today')) {
                temp.removeClass('today');
            }
        }
        nowLow++;
        if (nowLow >= totalLow) {
            nowLow = 0;
            nowRow++;
        }

        temp.on('click', selectDay);
    }*/

    showSelectYM();
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
    var __w = $(this).attr('day');
    __w = (__w == 7) ? __w = 0 : __w;
    var str = $(this).attr('year') + '年' + $(this).attr('month') + '月' + $(this).attr('date') + '日 ' + aWeek[__w];
    $('#selectYM').html(str);
    //console.log($(this).attr('day'));
    //console.log($(this).attr('year') + '-' + $(this).attr('month') + '-' + $(this).attr('date') + ' ' + aWeek[$(this).attr('day')]);
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
    /*console.log(__w);
    console.log(__y + '-' + __m + '-' + __d + ' ' + aWeek[__w]);*/

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