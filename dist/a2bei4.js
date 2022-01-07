/*!
 * a2bei4 - xiaodu114.github.io
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.du = {}));
})(this, (function (exports) { 'use strict';

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
     *      getDataType(null);=>"null"
     *      getDataType(undefined);=>"undefined"
     *      getDataType({});=>"object"
     *      getDataType(function(){});=>"function"
     * @param {any} obj 目标数据
     * @returns {String} 返回目标数据类型的小写形式
     */
    function getDataType(obj) {
        return Object.prototype.toString
            .call(obj)
            .replace(/^\[object\s(\w+)\]$/, "$1")
            .toLowerCase();
    }

    /**
     * 获取一个GUID
     * 收集来源：《基于mvc的javascript web富应用开发》 书中介绍是Robert Kieffer写的，还留了网址 http://goo.gl/0b0hu 
     * 应用场景：
     * 示例：getGUID();=>'AEFC9ABC-1396-494B-AB96-C35CA3C9F92F'
     * @returns {String} 返回一个GUID
     */
    function getGUID() {
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
     *      getFunctionArgNames(fn1); => ['a1', 'b2', 'p3']
     * @param {Function} fn 目标函数
     * @returns {Array} 返回一个字符串数组
     */
    function getFunctionArgNames(fn) {
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
     * 防抖(debounce)
     * 实现：在给定的时间段之后调用目标函数。如果在未超过给定的时间段内再次触发，则从新计时（也就是说之前的等待浪费了）。
     * 理解：如果你在给定的时间段内一直触发（就行缝纫机一样），那么前面的触发都是在浪费力气，只有最后一次是有效的（最后一次点击开始计时，经过给的时间段，触发目标函数）
     * 应用场景：
     * 示例： debounce(function () { }, 2000);
     * @param {Function} fn 
     * @param {Number} timeInterval 
     * @returns {Function} 返回一个方法
     */
    function debounce(fn, timeInterval) {
        if (getDataType(fn) !== "function") {
            throw new Error("参数异常：fn必须是函数");
        }
        if (getDataType(timeInterval) !== "number") {
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
     * 节流(throttle)——支持是否立即触发
     * 实现：在给定的时间段之内只会调用目标函数一次。如果在未超过给定的时间段内再次触发，则直接返回。
     * 理解：如果你在给定的时间段内一直触发（就行缝纫机一样），那么我也不像防抖(debounce)一样绝情，到了时间（给定的时间段）就会触发一次目标函数。也就是降频。
     * 应用场景：
     * 示例： 
     *      立即执行：   throttle(function () { }, 2000);
     *      不立即执行： throttle(function () { }, 2000, false);
     * @param {*} fn
     * @param {*} timeInterval
     * @param {boolean} [immediate=true]
     * @returns {Function} 返回一个方法
     */
    function throttle(fn, timeInterval, immediate = true) {
        if (getDataType(fn) !== "function") {
            throw new Error("参数异常：fn必须是函数");
        }
        if (getDataType(timeInterval) !== "number") {
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

    const utils = {
        getDataType,
        getGUID,
        getFunctionArgNames,
        debounce,
        throttle,
        array_Shuffle,
        array_MoveTo
    };

    //#endregion

    const other = {};

    exports.other = other;
    exports.utils = utils;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
