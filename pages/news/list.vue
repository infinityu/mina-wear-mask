<template>
	<view class="content">
		<view class="uni-list">
			<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(item,index) in news" :key="index"
			@tap="openInfo" :data-news="item">
				<view class="uni-media-list">
					<image class="uni-media-list-logo" :src="item.author_avatar"></image>
					<view class="uni-media-list-body">
						<view class="uni-media-list-text-top">{{item.title}}</view>
						<view class="uni-media-list-text-bottom uni-ellipsis">{{item.created_at}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
 
<script>
	export default {
		data() {
			return {
				title: 'Hello',
				news: []
			}
		},
		onPullDownRefresh() {
			uni.showToast({
			        title: '标题',
			        duration: 2000
			    });
		},
		onLoad() {
			uni.showLoading({
				title: '',
				mask: false
			});
			uni.request({
				url: 'https://unidemo.dcloud.net.cn/api/news',
				method: 'GET',
				data: {},
				success: res => {
					console.log(res);
					this.news = res.data;
					uni.hideLoading();
					
				},
				fail: () => {},
				complete: () => {}
			});
		},
		methods: {
			openInfo(e){
				let news = e.currentTarget.dataset.news;
				getApp().globalData.currentNewsInfo = news;
				uni.navigateTo({
					url: '../info/info'
				});
			}
		}
	}
</script>

<style>
	.uni-media-list-body{
		height: auto;
	}
</style>
