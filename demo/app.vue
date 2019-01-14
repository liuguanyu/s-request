<template>
  <div>
    <h3>s-request演示</h3>
    <div>
      错误码：{{errno}}
      <ul>
        <li v-for="item in data">
          <span>{{ item.title }}</span>
          <span>{{ item.name }}</span>
        </li>
      </ul>
      <s-request
        uri="/api.json1"
        method="get"
        :retry="5"
        :input="{a:{c: {type: [Number, String], required: true, default: 0}, d: String, e: {type: Number, required: true}}, b:{type: String, required: true}, f: {type: String, required: true, default: '1'}}"
        :params='{"a": {"c": 1, "e": 111},"b": "111"}'
        :upProvide="['data', 'errno']"
        :fail="this.failing"
      ></s-request>
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
      }
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
    }
  }
};
</script>