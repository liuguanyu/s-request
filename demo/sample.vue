<template>
  <div>
    <ul id="example-1">
      <li v-for="item in data">{{ item.title }}</li>
    </ul>
  </div>
</template>
<script>
import SRequest from "../src/s-request.vue";

export default {
  data() {
    return {
      data: [];
    };
  }
</script>