<template>
  <div>
    <h3>s-request演示</h3>
    <s-request
      uri="/screen/v2/idcmap"
      method="get"
      :retry="2"
      :interval="2500"
      :success="this.s"
      :fail="this.f"
      :loading="this.loading"
      :format="this.formatFun"
      :params="{a:1, b:1}"
      :input="{a: Number, b: Number}"
    ></s-request>
  </div>
</template>
<script>
import SRequest from "../src/s-request.vue";
export default {
  data() {
    return {};
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
    }
  },
  components: {
    SRequest
  }
};
</script>