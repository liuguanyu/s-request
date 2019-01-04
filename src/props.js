export default {
    /* 请求方法，对于websocket无效*/
    method: {
        validator: value => {
            return ["get", "post", "put", "delete", "patch"].indexOf(value.toLowerCase()) !== -1;
        },
        default: "get"
    },
    /* 请求地址*/
    uri: {
        type: String,
        required: true
    },

    /* 输入参数 */
    params: {
        type: Object,
        default: () => {}
    },

    /* 输入参数验证方法 */
    input: {
        type: Object,
        default: () => {}
    },

    /* 输出参数验证方法 */
    output: {
        type: Object,
        default: () => {}
    },

    /* 重试次数，默认不重试 */
    retry: {
        type: Number,
        default: 0
    },

    /* 重复请求间隔，单位毫秒，websocket下无效 */
    interval: {
        type: Number,
        default: 0
    },

    /* loading函数，在调取数据过程前调用 */
    loading: {
        type: Function
    },

    /* 将数据集的对应字段同步到父级组件 */
    upProvide: {
        type: [String, Array],
        validator: value => {
            if (typeof value === "string") return true;

            if (Object.prototype.toString.call(value) === "[object Array]") {
                return value.every(el => typeof el === "string");
            }

            return false;
        },
        default: "data"
    },

    /* loading结束，在调取数据过程完毕后调用 */
    loadComplete: {
        type: Function
    },

    /* 结果集数据整理函数，返回整理格式后数据 */
    format: {
        type: Function
    },

    /* 请求条件，当为true或对应函数返回为true时才请求，否则不做请求，websocket时，只在第一次时候可以限制 */
    request_condition: {
        type: [Function, Boolean],
        default: true
    },
    /* 依赖参数 */
    dependency: {
        type: [String, Array],
        validator: value => {
            return true;
        }
    },

    /* 请求成功函数，成功时调用，当同时提供format时，在format后调用 */
    success: {
        type: Function
    },

    /* 请求失败函数 */
    fail: {
        type: Function
    }
}