<template>
  <div>
    <h3>s-request演示</h3>
    <div>错误码：
      <ul>
        <li v-for="item in data">
          <span>{{ item.title }}</span>
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <s-request
        ref="sr"
        uri="/api.json"
        method="get"
        :retry="5"
        :input="{a:{c: {type: [Number, String], required: true, default: 0}, d: String, e: {type: Number, required: true}}, b:{type: String, required: true}, f: {type: String, required: true, default: '1'}}"
        :params="this.p"
        :fail="this.failing"
        upProvide="datas"
        v-model="data"
      ></s-request>
      <input type="button" value="马上请求" v-on:click="this.forceRequest">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      data: [],
      errno: "",
      test: false,
      failing: {
        fail401: function() {}
      },
      p: { a: { c: 1, e: 111 }, b: "111" }
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
    f404(res) {
      console.log(111);
    },
    loading() {
      console.log("loading...");
    },
    formatFun(data) {
      return data;
    },
    rc() {
      this.test = !this.test;
      return this.test;
    },
    forceRequest() {
      this.p = { a: { c: 1, e: 111 }, b: "33" };
      this.$refs.sr.forceRequest();
    }
  }
};
</script>