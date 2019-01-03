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
      <s-request uri="/api.json" method="get" :interval="5000" :upProvide="['data', 'errno']"></s-request>
    </div>
  </div>
</template>

<script>
import SRequest from "../src/s-request.vue";

export default {
  data() {
    return {
      data: [],
      errno: ""
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
    }
  },
  components: {
    SRequest
  }
};
</script>