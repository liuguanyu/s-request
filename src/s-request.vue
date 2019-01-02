<template></template>

<script>
import axios from "axios";
axios.defaults.baseURL = "/";

import Vue from "vue";
import VFactory from "./vendors";

export default {
  name: "SRequest",
  props: {
    method: {
      validator: value => {
        return ["get", "post"].indexOf(value.toLowerCase()) !== -1;
      },
      default: "get"
    },
    uri: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: () => {}
    },
    input: {
      type: Object,
      default: () => {}
    },
    output: {
      type: Object,
      default: () => {}
    },
    retry: {
      type: Number,
      default: 0
    },
    interval: {
      type: Number,
      default: 0
    },
    loading: {
      type: Function
    },
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
    loadComplete: {
      type: Function
    },
    format: {
      type: Function
    },
    request_condition: {
      type: [Function, Boolean],
      default: true
    },
    dependency: {
      type: String,
      validator: value => {
        return eval(value) !== undefined;
      }
    },
    success: {
      type: Function
    },
    fail: {
      type: Function
    },
    afterResponse: {
      type: Function
    }
  },

  mounted() {
    this.init();

    // if (this.interval) {
    //   setInterval(this.init, this.interval);
    // }
  },

  data() {
    return {
      nowRetry: this.retry,
      opts: () => {
        let cfg = {
          method: this.method,
          url: this.uri
        };

        if (JSON.stringify(this.params) !== "{}") {
          cfg = {
            ...cfg,
            data: this.params
          };
        }

        return cfg;
      }
    };
  },

  methods: {
    __before() {
      if (this.input) {
        try {
          let CheckInput = Vue.component("check-input", {
            props: this.input
          });

          new CheckInput({
            propsData: this.params
          });
        } catch (e) {
          throw new Error(e.message);
          return false;
        }
      }
      return true;
    },

    async __request() {
      let res;

      let vendor = (opts => {
        return new VFactory().getByOpts(opts);
      })(this.opts());

      try {
        res = await vendor.run(this.opts());
        if (this.afterResponse) {
          res = this.afterResponse(res);
        }
      } catch (e) {
        if (--this.nowRetry > 0) {
          return await this.__request();
        } else {
          return new Error("Request Error!");
        }
      }
      return res.data;
    },

    async init() {
      let ret = this.__before();

      if (ret === false) {
        return;
      }

      if (this.loading) {
        await this.loading(); // 支持异步loading
      }

      let res = await this.__request();

      if (this.loadComplete) {
        await this.loadComplete(); // 支持异步loading
      }
      this.__after(res);
    },

    __after(res) {
      if (res instanceof Error) {
        if (this.fail) {
          this.fail(res);
        }
      } else {
        if (this.output) {
          let CheckOutput = Vue.component("check-output", {
            props: this.output
          });

          res = res;

          new CheckOutput({
            propsData: res
          });
        }

        if (this.format) {
          res = this.format(res);
        }

        if (this.success) {
          this.success(res);
        }

        // this.$parent[this.upProvide] = res.data;
        if (typeof this.upProvide === "string") {
          this.$parent[this.upProvide] = res.data;
        } else {
          this.upProvide.forEach(el => {
            this.$parent[el] = res[el];
          });
        }
      }
    }
  }
};
</script>