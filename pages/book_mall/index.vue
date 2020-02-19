<template>
	<view>
		<view class="cu-bar search">
			<view class="search-form round bg-white">
				<text class="cuIcon-search"></text>
				<input :adjust-position="false" type="text" @input='searchKey' @confirm='searchBtn' placeholder="搜索小说" confirm-type="search"></input>
			</view>
			<view class="action">
				<text @click="searchBtn">搜索</text>
			</view>
		</view>
		<view class="margin-top text-center" v-if="listData.length <= 0">
			暂时只提供搜索的方式
		</view>
		<view class="cu-bar solid-bottom" v-if="listData.length > 0">
			<view class="action">搜索结果</view>
		</view>
		<view class="cu-list menu-avatar" v-if="listData.length > 0">
		
			<view class="cu-item" v-for="(item,index) in listData" :key="index" @click="details(item.id)">
				<image :src="item.img" class="cu-avatar radius lg" mode="widthFix" lazy-load></image>
				<view class="content">
					<view>
						<view class="text-cut">{{item.name}}</view>
						<view class="cu-tag round bg-orange sm">{{item.author}}</view>
					</view>
					<view class="text-gray text-sm flex"> <view class="text-cut">{{item.introduce}}</view></view>
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	import _tool from '@/util/tools.js';
	export default {
		data() {
			return {
				key: '', listData: [],
			}
		},
		onLoad() {

		},
		methods: {
			searchKey(event) {
				this.key = event.detail.value;
			},
			searchBtn() {
				let that = this;
				this.zaiApi({
					url:'searchbook.php?search_key=' + that.key,
				}).then(function(res) {
					that.GetSearchData(res)
				});
			},
			GetSearchData(res) {
				let that = this;
				_tool.searchData(res).then(function(res) {
					that.listData = res;
				});
			},
			details(id) {
				uni.navigateTo({
					url: '/pages/book_mall/details?id=' + id
				})
			}
		}
	}
</script>

<style>
	.cu-bar .search-form{
		background-color: #ffffff;
	}
</style>
