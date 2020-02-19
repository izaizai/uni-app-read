<template>
	<view>
		<view class="cu-bar">
			<view class="action">
				<text>共有{{DataList.length}}本</text>
			</view>
			<view class="action">
				<text @click="editClick">编辑</text>
			</view>
		</view>
		<view class="grid col-3 canui-list-box">
			<view class="padding-sm" v-for="(item,index) in DataList" :key="index" @click="readClick(item)">
				<image :src="item.img" mode="widthFix" class="radius"></image>
				<view>{{item.title}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import _tool from '@/util/tools.js';
	export default {
		data() {
			return {
				DataList: [],
			}
		},
		onLoad() {
			//this.GetBookList();
		},
		onShow() {
			this.GetBookList();
		},
		methods: {
			GetBookList() {
				_tool.GetBookListData().then((res) => {
					if(res == "" || res == null || res == undefined) {
						this.DataList = [];
					} else {
						this.DataList = res;
					}
				});
			},
			editClick() {
				uni.navigateTo({
					url: '/pages/bookshelf/edit'
				})
			},
			readClick(bookData) {
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
	.canui-list-box {
		image {
			height: 330rpx;
		}
	}
</style>
