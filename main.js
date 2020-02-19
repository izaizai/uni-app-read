import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//封装的异步请求（H5不可直接请求，会报跨域错误，需要浏览器进行设置，或者API允许跨域。APP直接使用即可）
Vue.prototype.zaiApi = function (promise,Loading = true) {
	if (Loading) uni.showLoading({title: '加载中...'});
	//域名接口前缀，方便统一管理，只需要在这里改动即可。
	let ApiUrl = 'https://www.280xs.com/'; //view-source:https://www.280xs.com
	//异步请求处理
	return new Promise(function (resolve, reject) {
		uni.request({
			url: ApiUrl + promise.url,
			data: promise.data,
			method: !promise.method?'GET':promise.method,
			success: (res) => {
				if (Loading) uni.hideLoading();
				resolve(res.data);
			},
			fail(e){
				if (Loading) uni.hideLoading();
				uni.showToast({title: "网络异常",icon: 'none'});
				reject(e)
			}
		});
	});
};

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
