<template></template>

<script>
import Vue from "vue";
import VFactory from "./vendors";

import props from "./partials/props";
import utils from "./partials/utils";

import Props2Schema from "vue-props-schema";
import JSONSchemaValidator from "./libs/json-schema-validator/json-schema-validator";

export default {
  name: "SRequest",
  props: props,

  install(Vue, opts) {
    Vue.component("SRequest", this);

    let mixin = {
      created: function() {
        this.baseOpts = opts ? opts : {};
      }
    };

    Vue.mixin(mixin);
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
          ...this.baseOpts,
          method: this.method,
          url: this.uri
        };

        if (JSON.stringify(this.params) !== "{}") {
          cfg = {
            ...cfg,
            params: this.params
          };
        }

        return cfg;
      }
    };
  },

  methods: {
    __before() {
      if (!this.input) {
        return true;
      }

      let schema = Props2Schema(this.input);
      let validator = new JSONSchemaValidator();

      validator.validate(this.params, schema);

      return validator.errors.length === 0;
    },

    async __request() {
      let res;

      let vendor = (opts => {
        return new VFactory().getByOpts(opts);
      })({
        ...this.opts()
      });

      try {
        res = await vendor.run();
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