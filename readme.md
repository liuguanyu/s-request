### 这是什么

1. 以 vue 组件的方式封装请求
1. 可以根据预置的规则进行参数验证以及响应参数验证
1. 可以周期性请求

### 用法

#### 一般用法

Vue 代码如下：

```html
<s-request uri="/api.json" method="get" :success="this.s"> </s-request>
```

组件内 methods 中，请增加对应的方法，接收成功回调，如上例：

```Javascript
methods:{
    s(data) {
      console.log("[" + new Date().toLocaleString() + "]");
      console.log("success");
      console.log(data);
    }
}
```

同样，也可以在失败时候加入回调，亦可在失败时候进行重试，当重试 :retry 次数以上时，则终止尝试，判定失败，调用:fail 所示方法。

```html
<s-request uri="/api.json" method="get" :success="this.s" :fail="this.f" :retry="3"> </s-request>
```

#### 加入请求参数

1. 可对请求参数进行指定

```html
<s-request uri="/api.json" method="get" :success="this.s" :fail="this.f" :retry="3" :params="{a:1, b:1}"> </s-request>
```

1. 对输入参数进行验证
   仿照 Vue 的 Props 验证规则，在:input 中加入验证 schema

```html
<s-request
	uri="/api.json"
	method="get"
	:success="this.s"
	:fail="this.f"
	:retry="3"
	:params="{a:1, b:1}"
	:input="{a: Number, b: Number}"
>
</s-request>
```

如果参数不符合要求，则不会进行请求。

2. 对输出响应进行验证

```html
<s-request
	uri="/api.json"
	method="get"
	:success="this.s"
	:fail="this.f"
	:retry="3"
	:params="{a:1, b:1}"
	:input="{a: Number, b: Number}"
	:output="{
        errno: Number,
        errmsg: String,
        data: Object
    }"
>
</s-request>
```

如果响应不符合要求，则认为错误

3. 格式化输出

通过指定:format，要求必须返回格式化的数据。如果指定，这个方法将在 success 之前调用。

```html
<s-request
	uri="/api.json"
	method="get"
	:retry="2"
	:success="this.s"
	:fail="this.f"
	:format="this.formatFun"
	:params="{a:1, b:1}"
	:input="{a: Number, b: Number}"
	:output="{
        errno: Number,
        errmsg: String,
        data: Object
      }"
></s-request>
```

#### 增强

1. 周期性请求

通过指定:interval，单位为毫秒。指定之则每:interval 毫秒，请求一次。

```html
<s-request
	uri="/api.json"
	method="get"
	:retry="2"
	:success="this.s"
	:fail="this.f"
	:format="this.formatFun"
	:params="{a:1, b:1}"
	:input="{a: Number, b: Number}"
	:interval="2500"
	:output="{
    errno: Number,
    errmsg: String,
    data: Object
    }"
	:afterResponse="data=>JSON.parse(JSON.stringify(data))"
></s-request>
```

2. loading

指定:loading，在请求时调用，此时还需要指定:loadingComplete，用于调用结束使用

```html
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
	:interval="2500"
	:output="{
    errno: Number,
    errmsg: String,
    data: Object
    }"
	:afterResponse="data=>JSON.parse(JSON.stringify(data))"
></s-request>
```

### 作为子组件，影响父级

设置:upProvide，此时调用成功，则将值赋予父级组件的对应值。:upProvide 可为字符串和数组。当为字符串时候，则就是这个字符串表达的变量。是数组的时候，依次去结果中找这些字段名复值。如果没有提供，则为 data 字段。

```html
<template>
	<div>
		<h3>s-request演示</h3>
		<div>
			{{errno}}
			<ul>
				<li v-for="item in data">{{ item.title }}</li>
			</ul>
			<s-request
				uri="/api.json"
				method="get"
				:interval="5000"
				:upProvide="['data', 'errno']"
				:afterResponse="data=>JSON.parse(JSON.stringify(data))"
			></s-request>
		</div>
	</div>
</template>

<script>
	import SRequest from '../src/s-request.vue';

	export default {
		data() {
			return {
				data: [],
				errno: '',
			};
		},
		created() {},
		mounted() {},
		methods: {},
	};
</script>
```

### 作为父组件，影响子级
