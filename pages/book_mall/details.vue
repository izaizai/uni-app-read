<template>
	<view>
		<view class="flex p-xs padding">
			<view class="flex-twice margin-xs">
				<view class="text-xl">{{bookData.name}}</view>
				<view class="margin-top">{{bookData.author}}</view>
				<view class="text-grey margin-top-sm">
					<text>{{bookData.sort}}</text>
					<text class="margin-left-sm">{{bookData.state}}</text>
				</view>
				<view class="margin-top">{{bookData.time}}</view>
			</view>
			<view class="flex-sub margin-xs">
				<image :src="bookData.img" mode="widthFix" class="radius img-box" lazy-load></image>
			</view>
		</view>
		
		<scroll-view scroll-x class="bg-white nav" scroll-with-animation>
			<view class="cu-item" v-for="(item,index) in TabData" :key="index" 
				  :class="index==TabCur?'text-orange cur':''" 
				  @tap="tabSelect" :data-id="index">
				{{item}}
			</view>
		</scroll-view>
		<view class="bg-white padding solid-top margin-bottom" v-if="TabCur==0">
			简介：{{bookData.intro}}
		</view>
		<view class="bg-white solid-top margin-bottom" v-else>
			<view class="cu-bar solid-bottom">
				<view class="action">
					<text class="text-sm">更新至{{bookData.news}}</text>
				</view>
				<view class="action">
					<text @click="orderClick">{{order}}</text>
				</view>
			</view>
			<view class="cu-list menu">
				<view class="cu-item arrow" v-for="(item,index) in listData" :key="index" @click="details(item,index)">
					<view class="content">
						{{item.name}}
					</view>
				</view>
			</view>
		</view>
		<view class="cu-tabbar-height"></view>
		<view class="cu-bar bg-white tabbar border zai-tabbar-bar">
			<view class="btn-group">
				<button class="cu-btn bg-orange round shadow-blur" @click="AddClick" v-if="addBtn==false">加入书架</button>
				<text v-else>已加入书架</text>
			</view>
			<view class="btn-group">
				<button class="cu-btn bg-red round shadow-blur" @click="readClick">立即阅读</button>
			</view>
		</view>
	</view>
</template>

<script>
	import _tool from '@/util/tools.js';
	export default {
		data() {
			return {
				TabCur: 0, TabData: ['简介','目录'], bookData: {}, listData: [], order: '倒序', BookID: null, addBtn: true, newsID: null, newsName: '',
			}
		},
		onLoad(option) {
			this.BookID = option.id;
			this.GetBookDetails(option.id);
			//是否已经加入书架
			_tool.GetBookListID(option.id).then((res) => {
				this.addBtn = res;
			});
		},
		methods: {
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
			},
			GetBookDetails(id) {
				this.zaiApi({
					url:'dingdian/' + id,
				}).then((res) => {
					this.GetDetailsData(res)
				});
			},
			GetDetailsData(Book) {
				_tool.DetailsData(Book).then((res) => {
					this.bookData = res.data;
					this.listData = res.list;
					this.newsID = res.list[0].id;
					this.newsName = res.list[0].name;
				});
			},
			orderClick() {
				let order = this.order;
				if(order=='正序') {
					this.order = '倒序';
				} else {
					this.order = '正序';
				}
				//排序
				this.listData = this.listData.reverse();
			},
			AddClick() {
				let bookData = {
					id: this.BookID,
					news: this.newsID,
					page: 0,
					index: 1,
					name: this.newsName,
					title: this.bookData.name,
					img: this.bookData.img
				};
				_tool.AddBookListData(bookData).then((res) => {
					this.addBtn = true;
				});
			},
			readClick() {
				let bookData = {
					id: this.BookID,
					news: this.newsID,
					page: 0,
					index: 1,
					name: this.newsName,
					title: this.bookData.name,
					img: this.bookData.img
				};
				try {
				    uni.setStorageSync('BookReadData', bookData);
					uni.navigateTo({
						url: '/pages/bookshelf/read'
					})
				} catch (e) {
				    uni.showToast({
				        title: '数据异常',
				        icon: 'none'
				    });
				}
			},
			details(item,index) {
				let order = this.order;
				let readId = index + 1;
				if(order=='正序') {
					let listId = this.listData.length;
					readId = listId - index - 1;
				}
				let bookData = {
					id: this.BookID,
					news: item.id,
					page: 0,
					index: readId,
					name: item.name,
					title: this.bookData.name,
					img: this.bookData.img
				};
				try {
				    uni.setStorageSync('BookReadData', bookData);
					uni.navigateTo({
						url: '/pages/bookshelf/read'
					})
				} catch (e) {
				    uni.showToast({
				        title: '数据异常',
				        icon: 'none'
				    });
				}
			}
		}
	}
</script>

<style lang="less">
	.img-box {
		width: 220rpx;
	}
</style>
