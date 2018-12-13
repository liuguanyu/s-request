<template></template>

<script>
import axios from "axios";
import { setInterval } from "timers";
axios.defaults.baseURL = "/";

import Vue from "vue";

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

    if (this.interval) {
      setInterval(this.init, this.interval);
    }
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

      try {
        res = await axios(this.opts());
        res = this.afterResponse(res);
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
      }
    }
  }
};
</script>