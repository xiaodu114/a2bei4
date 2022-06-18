/**
 * 简介：整理收集一些基础方法，分为一下几部分：
 *      ● utils
 *      ● other
 *      ……
 */

//#region utils 业务无关通用方法

/**
 * 获取数据的类型
 * 应用场景：
 * 示例：
 *      utils_GetDataType(null);=>"null"
 *      utils_GetDataType(undefined);=>"undefined"
 *      utils_GetDataType({});=>"object"
 *      utils_GetDataType(function(){});=>"function"
 * @param {any} obj 目标数据
 * @returns {String} 返回目标数据类型的小写形式
 */
function utils_GetDataType(obj) {
    return Object.prototype.toString
        .call(obj)
        .replace(/^\[object\s(\w+)\]$/, "$1")
        .toLowerCase();
}

/**
 * 获取一个GUID
 * 收集来源：《基于mvc的javascript web富应用开发》 书中介绍是Robert Kieffer写的，还留了网址 http://goo.gl/0b0hu 
 * 应用场景：
 * 示例：utils_GetGUID();=>'AEFC9ABC-1396-494B-AB96-C35CA3C9F92F'
 * @returns {String} 返回一个GUID
 */
function utils_GetGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16).toUpperCase();
    });
}

/**
 * 获取函数形参的名称
 * 收集来源：angular.js(1.8.2) annotate函数
 * 应用场景：
 * 示例：
 *      function fn1( a1 , b2 , p3 ){}
 *      utils_GetFunctionArgNames(fn1); => ['a1', 'b2', 'p3']
 * @param {Function} fn 目标函数
 * @returns {Array} 返回一个字符串数组
 */
function utils_GetFunctionArgNames(fn) {
    const FN_ARG_SPLIT = /,/,
        FN_ARG = /^\s*(_?)(\S+?)\1\s*$/,
        FN_ARGS = /^[^(]*\(\s*([^)]*)\)/m,
        STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let fnText = fn.toString().replace(STRIP_COMMENTS, '');
    let argDecl = fnText.match(FN_ARGS);
    let retArgNames = [];
    [].forEach.call(argDecl[1].split(FN_ARG_SPLIT), function (arg) {
        arg.replace(FN_ARG, function (all, underscore, name) {
            retArgNames.push(name);
        });
    });
    return retArgNames;
}

/**
 * 获取指定范围内的一个随机整数
 * 应用场景：
 * 示例：
 * @param {Number} num1 
 * @param {Number} num2 
 * @returns {Number} 返回一个整数
 */
function utils_GetInRangeInteger(num1, num2) {
    num1 = Number.isInteger(num1) ? num1 : 0;
    num2 = Number.isInteger(num2) ? num2 : 0;
    if (num1 > num2)
        [num1, num2] = [num2, num1];
    return Math.round(Math.random() * (num2 - num1)) + num1;
}

/**
 * 防抖(utils_Debounce)
 * 实现：在给定的时间段之后调用目标函数。如果在未超过给定的时间段内再次触发，则从新计时（也就是说之前的等待浪费了）。
 * 理解：如果你在给定的时间段内一直触发（就行缝纫机一样），那么前面的触发都是在浪费力气，只有最后一次是有效的（最后一次点击开始计时，经过给的时间段，触发目标函数）
 * 应用场景：
 * 示例： utils_Debounce(function () { }, 2000);
 * @param {Function} fn 
 * @param {Number} timeInterval 
 * @returns {Function} 返回一个方法
 */
function utils_Debounce(fn, timeInterval) {
    if (utils_GetDataType(fn) !== "function") {
        throw new Error("参数异常：fn必须是函数");
    }
    if (utils_GetDataType(timeInterval) !== "number") {
        timeInterval = 1000;
    }
    let setTimeoutId = null;
    return function () {
        let args = arguments;
        clearTimeout(setTimeoutId);
        setTimeoutId = setTimeout(() => {
            fn.apply(this, args);
        }, timeInterval);
    };
}

/**
 * 节流(utils_Throttle)——支持是否立即触发
 * 实现：在给定的时间段之内只会调用目标函数一次。如果在未超过给定的时间段内再次触发，则直接返回。
 * 理解：如果你在给定的时间段内一直触发（就行缝纫机一样），那么我也不像防抖(utils_Debounce)一样绝情，到了时间（给定的时间段）就会触发一次目标函数。也就是降频。
 * 应用场景：
 * 示例： 
 *      立即执行：   utils_Throttle(function () { }, 2000);
 *      不立即执行： utils_Throttle(function () { }, 2000, false);
 * @param {*} fn
 * @param {*} timeInterval
 * @param {boolean} [immediate=true]
 * @returns {Function} 返回一个方法
 */
function utils_Throttle(fn, timeInterval, immediate = true) {
    if (utils_GetDataType(fn) !== "function") {
        throw new Error("参数异常：fn必须是函数");
    }
    if (utils_GetDataType(timeInterval) !== "number") {
        timeInterval = 1000;
    }
    let setTimeoutId = null,
        lastDataTime = null;
    return function () {
        let args = arguments;
        if (immediate) {
            if (lastDataTime !== null && Date.now() - lastDataTime < timeInterval) return;
            lastDataTime = Date.now();
            fn.apply(this, args);
        } else {
            if (setTimeoutId) return;
            setTimeoutId = setTimeout(() => {
                fn.apply(this, args);
                setTimeoutId = null;
            }, timeInterval);
        }
    };
}

/**
 * 数值扩展方法：洗牌算法（数组内元素的顺序随机打乱）；引用的方式，无返回值
 * 收集来源：http://caibaojian.com/work-js.html  http://caibaojian.com/11-js-codes.html
 * 应用场景：
 * 示例： let arr1=; array_Shuffle(arr1); => [4, 0, 1, 5, 2, 3]
 * @param {Array} arr   目标数组
 */
function array_Shuffle(arr) {
    arr.sort(() => Math.random() - 0.5);
}

/**
 * 数值扩展方法：根据数组索引交换位置；引用的方式，无返回值
 * 应用场景：
 * 示例： let arr1=[0,1,2,3,4,5]; array_MoveTo(arr1,1,4); => [0, 2, 3, 4, 1, 5]
 * @param {Array} arr    目标数组
 * @param {Number} from  原始位置
 * @param {Number} to    目标位置
 */
function array_MoveTo(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0]);
}

export const utils = {
    getDataType: utils_GetDataType,
    getGUID: utils_GetGUID,
    getFunctionArgNames: utils_GetFunctionArgNames,
    getInRangeInteger: utils_GetInRangeInteger,
    debounce: utils_Debounce,
    throttle: utils_Throttle,
    array_Shuffle,
    array_MoveTo
};

//#endregion

//#region date 扩展一些日期（Date）相关的方法

/**
 * 转日期
 * @param {Date|String} t
 * @returns {Date} 返回日期
 */
function date_ToDate(t) {
    //let date1=new Date();
    //console.log(Date.parse(date1)===date1.valueOf());		//	false
    //console.log(Date.parse(date1.toISOString())===date1.valueOf());	//	true
    let v = NaN;
    if (utils_GetDataType(t) === "string") {
        v = Date.parse(t) || Date.parse(t.replace(/-/g, '/')) || Date.parse(t.replace(/\//g, '-'));
    }
    else {
        v = new Date(t).valueOf();
    }
    return new Date(v);
}

/**
 * 判断是不是日期
 * @param {any} t 
 * @returns {Boolean} 返回true|false
 */
function date_IsValid(t) {
    return !isNaN(date_ToDate(t).valueOf());
}

/**
 * 日期格式化
 * @param {Date} targetDate 
 * @param {String} format   格式
 * @param {Object} option   配置项
 * @returns 
 */
function date_Format(targetDate, format, option) {
    function getOrdinalNumber(num) {
        //  https://byjus.com/maths/ordinal-numStrings/
        switch (num) {
            case 1:
            case 21:
            case 31: {
                return num + "st";
            }
            case 2:
            case 22:
            case 32: {
                return num + "nd";
            }
            case 3:
            case 23:
            case 33: {
                return num + "rd";
            }
            default: {
                return num + "th";
            }
        }
    }
    function getReplaceStr(key) {
        return `--->${key}<---`;
    }
    const LANG = option?.lang ?? "zh-cn";
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const numStrings = numbers.map(x => x + "");
    let monthObj = {}, weekObj = {}, quarterObj = {};
    let getAmPm = null;
    switch (LANG) {
        case "zh-cn": {
            let numbersCn = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];
            monthObj[3] = numStrings.map(x => x + "月");
            monthObj[4] = monthObj[3];
            monthObj[5] = numbersCn.map(x => x + "月");
            weekObj[1] = ["7", ...numStrings.slice(0, 6)];
            weekObj[2] = ["日", ...numbersCn.slice(0, 6)];
            weekObj[3] = weekObj[2].map(x => "周" + x);
            weekObj[4] = weekObj[3];
            weekObj[5] = weekObj[2].map(x => "星期" + x);
            quarterObj[2] = numStrings.slice(0, 4);
            getAmPm = function (hour, minute, isLower) {
                let hm = hour * 100 + minute, retStr = "";
                if (hm < 600) {
                    retStr = '凌晨';
                } else if (hm < 900) {
                    retStr = '早上';
                } else if (hm < 1130) {
                    retStr = '上午';
                } else if (hm < 1230) {
                    retStr = '中午';
                } else if (hm < 1800) {
                    retStr = '下午';
                } else {
                    retStr = '晚上';
                }
                return retStr;
            }
            break;
        }
        case "en-us": {
            monthObj[3] = numbers.map(getOrdinalNumber);
            monthObj[4] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            monthObj[5] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            weekObj[1] = ["0", ...numStrings.slice(0, 6)];
            weekObj[2] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
            weekObj[3] = [0, ...numbers.slice(0, 6)].map(getOrdinalNumber);
            weekObj[4] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            weekObj[5] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            quarterObj[2] = numbers.slice(0, 4).map(getOrdinalNumber);
            getAmPm = function (hour, minute, isLower) {
                if (isLower) {
                    return _hour > 12 ? "pm" : "am";
                }
                return _hour > 12 ? "PM" : "AM";
            }
            break;
        }
    }

    let _year = targetDate.getFullYear(),
        _month = targetDate.getMonth(),
        _date = targetDate.getDate(),
        _day = targetDate.getDay(),
        _hour = targetDate.getHours(),
        _minute = targetDate.getMinutes(),
        _second = targetDate.getSeconds(),
        _millisecond = targetDate.getMilliseconds(),
        _quarter = Math.floor((_month + 3) / 3);

    let increaseIndex = Date.now(),
        transferReplaceObj = {};
    let o = {
        //  年（Year）
        "y+": function (counter) {
            // y和yyy都返回完整年，例如：1990
            let retStr = _year + "";
            if (counter === 2) {
                retStr = retStr.slice(-2);
            }
            else if (counter > 4) {
                retStr = retStr.padStart(counter, "0");
            }
            return retStr;
        },
        //  月份（Month）返回值有英文字母（……）注意替换顺序
        "M+": function (counter) {
            let retStr = _month + 1 + "";
            switch (counter) {
                case 2: {
                    retStr = retStr.padStart(2, "0");
                    break;
                }
                case 3:
                case 4:
                case 5: {
                    retStr = getReplaceStr(increaseIndex);
                    transferReplaceObj[retStr] = monthObj[counter][_month];
                    break;
                }
            }
            return retStr;
        },
        //  日-天（Date）
        "d+": function (counter) {
            let retStr = _date + "", _dayOrder = Math.ceil((new Date(targetDate) - new Date(_year + "")) / (24 * 60 * 60 * 1000));
            switch (counter) {
                case 2: {
                    retStr = retStr.padStart(2, "0");
                    break;
                }
                case 3: {
                    retStr = _dayOrder + "";
                    break;
                }
                case 4: {
                    retStr = (_dayOrder + "").padStart(3, "0");
                    break;
                }
            }
            return retStr;
        },
        //  小时（Hour）12小时制
        "h+": function (counter) {
            let retStr = _hour > 12 ? (_hour - 12 + "") : (_hour + "");
            if (counter === 2) {
                retStr = retStr.padStart(2, "0");
            }
            return retStr;
        },
        //  小时（Hour）24小时制
        "H+": function (counter) {
            let retStr = _hour + "";
            if (counter === 2) {
                retStr = retStr.padStart(2, "0");
            }
            return retStr;
        },
        //  分钟（Minute）
        "m+": function (counter) {
            let retStr = _minute + "";
            if (counter === 2) {
                retStr = retStr.padStart(2, "0");
            }
            return retStr;
        },
        //  秒钟（Second）
        "s+": function (counter) {
            let retStr = _second + "";
            if (counter === 2) {
                retStr = retStr.padStart(2, "0");
            }
            return retStr;
        },
        //  毫秒（Millisecond）
        "S+": function (counter) {
            let retStr = _millisecond + "";
            if (counter === 3) {
                retStr = retStr.padStart(3, "0");
            }
            return retStr;
        },
        //  上/下午（am|pm）
        "a+": function (counter) {
            let retStr = getReplaceStr(increaseIndex);
            transferReplaceObj[retStr] = getAmPm(_hour, _minute, true);
            return retStr;
        },
        //  上/下午（AM|PM）
        "A+": function (counter) {
            let retStr = getReplaceStr(increaseIndex);
            transferReplaceObj[retStr] = getAmPm(_hour, _minute);
            return retStr;
        },
        //  星期几
        "w+": function (counter) {
            let retStr = _day + "";
            switch (counter) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5: {
                    retStr = getReplaceStr(increaseIndex);
                    transferReplaceObj[retStr] = weekObj[counter][_day];
                    break;
                }
            }
            return retStr;
        },
        //  季度
        "Q+": function (counter) {
            if (counter === 2) {
                return quarterObj[counter][_quarter - 1];
            }
            return _quarter + "";
        },
    };
    for (const k in o) {
        const arrayMatch = [...format.matchAll(new RegExp("(" + k + ")", "g"))];
        if (Array.isArray(arrayMatch) && arrayMatch.length) {
            arrayMatch.forEach((item) => {
                increaseIndex++;
                format = format.replace(item[0], o[k](item[0].length, item[0]));
            });
        }
    }
    for (const k in transferReplaceObj) {
        if (Object.hasOwnProperty.call(transferReplaceObj, k)) {
            format = format.replace(new RegExp("(" + k + ")", "g"), transferReplaceObj[k]);
        }
    }
    return format;
}

/**
 * 获取指定范围内的一个时间
 * @param {Date} date1 起始时间
 * @param {Date} date2 结束时间
 * @returns {Date}
 */
function date_GetInRangeDate(date1, date2) {
    let v1 = date_ToDate(date1).valueOf(),
        v2 = date_ToDate(date2).valueOf();
    if (isNaN(v1) && isNaN(v2)) {
        v1 = 0;
        v2 = new Date().valueOf();
    }
    else {
        if (isNaN(v1)) v1 = 0;
        if (isNaN(v2)) v2 = 0;
    }
    return new Date(utils_GetInRangeInteger(Math.abs(v1 - v2)) + Math.min(v1, v2));
};

export const date = {
    toDate: date_ToDate,
    isValid: date_IsValid,
    format: date_Format,
    getInRangeDate: date_GetInRangeDate,
};
//#endregion

//#region node 扩展一些和 Node 相关的方法

//  https://developer.mozilla.org/zh-CN/docs/Web/API/Node

/**
 * 获取指定节点的前一个节点
 * @param {Node} node 指定的节点
 * @returns {Node | undefined}
 */
function node_GetPreNode(node) {
    if (!(node && node.parentNode && node.parentNode.childNodes)) return;
    return node.parentNode.childNodes[[...node.parentNode.childNodes].findIndex(x => x === node) - 1];
}

/**
 * 获取指定节点的后一个节点
 * @param {Node} node 指定的节点
 * @returns {Node | undefined}
 */
function node_GetNextNode(node) {
    if (!(node && node.parentNode && node.parentNode.childNodes)) return;
    return node.parentNode.childNodes[[...node.parentNode.childNodes].findIndex(x => x === node) + 1];
}

/**
 * 在指定节点的前面插入一个节点
 * @param {Node} me 指定的节点
 * @param {Node} node 插入的节点
 */
function node_InsertBeforeMe(me, node) {
    if (!me?.parentNode?.insertBefore) return;
    me.parentNode.insertBefore(node, me);
}

/**
 * 在指定节点的后面插入一个节点
 * @param {Node} me 指定的节点
 * @param {Node} node 插入的节点
 */
function node_InsertAfterMe(me, node) {
    if (!me?.parentNode?.insertBefore) return;
    let meNextNode = node_GetNextNode(me);
    if (meNextNode) {
        me.parentNode.insertBefore(node, meNextNode);
    }
    else {
        me.parentNode.appendChild(node);
    }
}

/**
 * 判断是否是空白空格文本节点
 * @param {Node} node 指定的节点
 * @param {String} spaceCode 空格字符
 * @returns {Boolean}
 */
function node_IsSpaceTextNode(node, spaceCode) {
    //  data nodeValue textContent wholeText
    //  &nbsp; &ensp; &emsp; &thinsp; &zwnj; &zwj; 6种空白空格
    return node?.nodeType === Node.TEXT_NODE && node.nodeValue === spaceCode;
}

/**
 * 判断是否是空文本节点
 * @param {Node} node 指定的节点
 * @returns {Boolean}
 */
function node_IsNullTextNode(node) {
    return node?.nodeType === Node.TEXT_NODE && node.nodeValue.trim().length === 0;
}

export const node = {
    getPreNode: node_GetPreNode,
    getNextNode: node_GetNextNode,
    insertBeforeMe: node_InsertBeforeMe,
    insertAfterMe: node_InsertAfterMe,
    isSpaceTextNode: node_IsSpaceTextNode,
    isNullTextNode: node_IsNullTextNode
};

//#endregion

//#region 事件派发器

export class MyEvent {

    constructor(option) {
        this.evtPool = {};

        //  处理配置
        //      1、是否需要跨页面监听
        if (option?.crossPage) {
            //  暂时在每个实例中监听；或者另一种实现方式是一个地方缓存着所有需要跨页面监听的实例，之后在回调方法中遍历实例触发
            addEventListener("storage", (evt) => {
                //  evt.key     evt.newValue    evt.oldValue
                if (evt.key !== "___my-event-cross-page-transfer___") return;
                if (!evt.newValue) return;
                let transferEvtObj = null;
                try {
                    transferEvtObj = JSON.parse(evt.newValue);
                } catch (error) {
                    throw new Error(JSON.stringify(error));
                }
                if (!transferEvtObj?.evtName) return;
                //  中转触发跨页面的事件时不指定上下文
                this.emit(transferEvtObj.evtName, transferEvtObj.data);
            });
        }
        //      ……  更多配置项等待添加
    }

    /**
     * 实例方法之事件监听
     * @param {String} name 事件名称 
     * @param {Function} fn 回调方法
     * @returns {String} 唯一标识（可以在事件销毁时使用）
     * @memberof MyEvent
     */
    on(name, fn) {
        //  flag：唯一标识。有两个用途：
        //      1、相同的name和fn，多次监听
        //      2、销毁时可以使用
        let flag = Date.now().toString() + "_" + parseInt(Math.random() * 1e8).toString();
        if (this.evtPool.hasOwnProperty(name)) {
            this.evtPool[name].push({
                flag,
                fn
            });
        }
        else {
            this.evtPool[name] = [{
                flag,
                fn
            }];
        }
        return flag;
    }

    /**
     * 实例方法之事件注销
     * @param {String} name              事件名称 
     * @param {Function|String} fnOrFlag 监听时绑定的方法或者监听方法的返回值
     * @returns
     * @memberof MyEvent
     */
    off(name, fnOrFlag) {
        if (!this.evtPool.hasOwnProperty(name)) return;
        if (!(Array.isArray(this.evtPool[name]) && this.evtPool[name].length)) {
            delete this.evtPool[name];
            return;
        }
        let delIndexes = [];
        if ((typeof fnOrFlag) === "function") {
            this.evtPool[name].forEach((x, index) => {
                if (x.fn === fnOrFlag) {
                    delIndexes.push(index);
                }
            });
        }
        else {
            let index = this.evtPool[name].findIndex(x => x.flag === fnOrFlag);
            if (index >= 0) {
                delIndexes.push(index);
            }
        }
        if (delIndexes.length) {
            delIndexes.forEach(x => {
                this.evtPool[name].splice(x, 1);
            });
            if (this.evtPool[name].length === 0) {
                delete this.evtPool[name];
            }
        }
    }

    /**
     * 实例方法之事件触发
     * @param {String} name   事件名称 
     * @param {any} data      数据
     * @param {any} context   上下文
     * @param {Object} option 配置项
     * @returns
     * @memberof MyEvent
     */
    emit(name, data, context, option) {
        if (!(Array.isArray(this.evtPool[name]) && this.evtPool[name].length)) return;
        [].forEach.call(this.evtPool[name], (item) => {
            item.fn.call(context, data);
        });
        //  是否需要跨页面触发
        if (option?.crossPage) {
            localStorage.setItem("___my-event-cross-page-transfer___", JSON.stringify({
                evtName: name,
                data: data
            }));
            //  这里删除之后还会在触发一次（变化：由有到无），监听的时候做好判断
            localStorage.removeItem("___my-event-cross-page-transfer___");
        }
    }
}

//#endregion

//#region ID生成器 

export class MyId {

    #ts = Date.now();		//	时间戳
    #sn = 0;				//	序号（保证同一客户端之间的唯一项）
    #flag = "";			    //	客户端标识（保证不同客户端之间的唯一项）
    #len = 5;				//	序号位长度（我的电脑测试，同一时间戳内可以for循环执行了1000次左右，没有一次超过3k，所以5位应该够用了）
    //  测试代码
    //  let obj = {[Date.now()]:[]}; try { for (let i = 0; i < 100000; i++) { obj[Date.now()].push(i); } } catch { console.log(obj[Object.getOwnPropertyNames(obj)[0]].length); }

    constructor(option) {
        if (option) {
            if (typeof option.flag === "string") {
                this.#flag = option.flag;
            }
            if (Number.isSafeInteger(option.len) && len >= 0) {
                this.#len = option.len;
            }
        }
    }

    nextId() {
        let ts = Date.now();
        if (ts === this.#ts) {
            this.#sn++;
            if (this.#sn >= 10 ** this.#len) {
                console.log("长度不够用了！！！");
            }
        } else {
            this.#sn = 0;
            this.#ts = ts;
        }
        return ts.toString() + this.#flag + this.#sn.toString().padStart(this.#len, "0");
    }
}

//#endregion

export const other = {};