<template>
  <div>
    <h3>s-request演示</h3>
    <s-request
      uri="/api.json"
      method="get"
      :retry="2"
      :success="this.s"
      :fail="this.f"
      :loading="this.loading"
      :format="this.formatFun"
      :params="{a:1, b:1}"
      :input="{a: Number, b: Number}"
      :output="{
        errno: Number,
        errmsg: String,
        data: Object
      }"
      :afterResponse="data=>JSON.parse(JSON.stringify(data))"
    ></s-request>
  </div>
</template>

<script>
import SRequest from "../src/s-request.vue";

export default {
  data() {
    return {
      prevalue: 0
    };
  },
  created() {},
  mounted() {},
  methods: {
    s(data) {
      console.log("[" + new Date().toLocaleString() + "]");
      console.log("success");
      console.log(data);
    },
    f(err) {
      console.log(err);
    },
    loading() {
      console.log("loading...");
    },
    formatFun(data) {
      return data;
    },
    condition() {
      // setInterval(function() {
      //   return ++this.prevalue > 10;
      // }, 1000);
      return true;
    }
  },
  components: {
    SRequest
  }
};
</script>