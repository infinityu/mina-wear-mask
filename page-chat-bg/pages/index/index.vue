<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<scroll-view scroll-y="true" :style="{height:windowHeight+'px'}">
			<view class="width:720rpx; margin-left:auto; margin-right:auto">
				<ad unit-id="adunit-8001ab822ee98db2"></ad>
			</view>
			<view class="grid">
				<view class="grid" v-for="(item,index) in imageList" :key="index">
					<view class="image-wrapper col-3 grid" @click="toDownload" :data-imageName="item.index">
						<image :src="item.url"></image>
					</view>
				</view>
			</view>
			<view class="margin-top grid justify-center">
				<text class="text-yellow"> ---- 更多内容持续更新中 ----</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	// 在页面中定义插屏广告
	let interstitialAd = null;

	export default {
		components: {},
		data() {
			return {
				windowHeight: getApp().globalData.windowHeight,
				statusBarHeight: 0,
				rewardedVideoAdLoaded: false,
				imageList: []
			}
		},
		onLoad() {
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-be801ba020f6edeb'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {
					console.log(err);
				})
				interstitialAd.onClose(() => {})
			}
			for (var index = 1; index < 24; index++) {
				this.imageList.push({
					url: '/page-chat-bg/static/image/' + index + '.jpg',
					index: index
				})
			}
		},
		onShareAppMessage() {
			return {
				title: '我换上了口罩头像，防止疫情蔓延，30款口罩、护目镜任你选！',
				desc: '防传染、戴口罩，从我做起！',
				imageUrl: '/static/image/mask/avatar_mask.png',
				path: '/pages/index/index',
				success: function(res) {
					console.log(res);
				}
			}
		},
		methods: {
			toDownload: function(e) {
				console.log(e);
				let imageName = e.currentTarget.dataset.imagename;
				uni.navigateTo({
					url: "/page-chat-bg/pages/download/download?imageName=" + imageName
				})
			}
		}
	}
</script>

<style scoped>
	.container {
		background-color: white;
	}

	.image-wrapper image {
		margin: 10rpx 0rpx 0rpx 15rpx;
		width: 230rpx;
		height: 408rpx;
	}

	.ad-container {
		width: 690rpx;
	}

	.about-actions {
		width: 690rpx;
	}

	.card-menu {
		margin-left: auto;
		margin-right: auto;
	}

	.free-btn-bordernone {
		background: none !important;
		color: #000 !important;
		display: inline-block !important;
	}

	.free-btn-bordernone::after {
		border: none;
	}
</style>
