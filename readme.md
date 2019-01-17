### 这是什么

1. 以 vue 组件的方式封装请求
1. 可以根据预置的规则进行参数验证以及响应参数验证
1. 可以周期性请求

### 安装

```bash
npm install s-request --S
```

### 用法

#### 最简单的用法

这是最简单的用法，Vue 代码如下：

```html
<your-component>
	<s-request 
		uri="/api.json" 
		v-model="data"> 
	</s-request>
	<li v-for="item in data">
		<span>{{ item.title }}</span> 
		<span>{{ item.name }}</span>
	</li>
</your-component>
```

同时，请在vue组件的data()方法中返回你的`v-model`所示变量。如上例：

```javascript
  data() {
    return {
      data: {}
    };
```

名称应当与`v-model`所示变量一致。

默认地，当请求成功，将响应式地同步数据。

#### 周期性请求

使用`:interval`绑定重复请求周期，每隔interval毫秒，重复请求一次。

```html
<your-component>
	<s-request 
		uri="/api.json"
		:interval="5*60*1000" 
		v-model="data"> 
	</s-request>
	<li v-for="item in data">
		<span>{{ item.title }}</span> 
		<span>{{ item.name }}</span>
	</li>
</your-component>
```

#### 指定返回字段

使用`:provide`绑定提供回置字段。可以是数组或字符串。

对于字符串，如"data"， 则直接绑定到v-model所提供的变量上，如上例，则data持有返回结果data字段的值。

对于数组，如`[a, b, c]`, 则，`v-model`所示变量等于:

```javascript
{
	a: 结果["a"],
	b: 结果["b"],
	c: 结果["c"]
}
```

#### 接收成功、失败回调

组件内 methods 中，请增加对应的方法：

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
<s-request 
	uri="/api.json" 
	method="get" 
	:success="this.s" 
	:fail="this.f" 
	:retry="3"> 
</s-request>
```

对于失败，可以获得某种状态码下的失败。如：

```javascript
this.f = {
	'fail401': () => {
		location.href = "http://www.github.com";
	}
}
```

则当状态码为401时，会跳转页面到github首页。

#### 错误重试

使用`:retry`绑定提供重试次数。当失败会有`retry`次重试

```html
<s-request 
	uri="/api.json" 
	method="get" 
	:success="this.s" 
	:fail="this.f" 
	:retry="3"> 
</s-request>
```

#### 加入请求参数

1. 可对请求参数进行指定

```html
<s-request 
	uri="/api.json" 
	method="get" 
	:success="this.s" 
	:fail="this.f" 
	:retry="3" 
	:params="{a:1, b:1}"> 
</s-request>
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

1. 对输出响应进行验证

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

1. 格式化输出

通过指定:format，要求必须返回格式化后的数据。如果指定，这个方法将在 success 之前调用。

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

#### 主动触发请求

加入`ref`

```html
    <s-request
      ref="sr_stream"
      uri="/screen/v2/globalttl"
      v-model="data_stream"
      :interval="60000"
      :success="this.setStreamInfo"
    ></s-request>
```

可以先更新请求数据，之后调用方法：

```javascript
    this.params = {
      offset: searchTime - now
    };
    this.$refs.sr.force();
```


#### loading

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
></s-request>
```

#### 全局设置

在入口处，可以设置全局参数，如baseURL、header等，每个示例化对象也可个性化覆盖之。

```javascript
Vue.use(SRequest, {
  baseURL: "http://bigscreen.aiops.soft.360.cn",
  headers: {
    "src": "aiops"
  }
});
```