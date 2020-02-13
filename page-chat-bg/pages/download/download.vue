<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<view :style="{height:windowHeight+'px'}">
			<image class="chat-bg" :src="imageUrl" mode="widthFix"></image>
		</view>

		<view>
			<button @click="watchAdBeforeSave" class="cu-btn round download-btn shadow bg-yellow">保存</button>
		</view>
	</view>
</template>

<script>
	// 在页面中定义激励视频广告
	let videoAd = null;

	export default {
		components: {},
		data() {
			return {
				windowHeight: getApp().globalData.windowHeight,
				statusBarHeight: 0,
				rewardedVideoAdLoaded: false,
				imageUrl: ""
			}
		},
		onLoad(opt) {
			this.imageUrl = "/page-chat-bg/static/image/" + opt.imageName + ".jpg";
			let _this = this;
			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
				videoAd = wx.createRewardedVideoAd({
					adUnitId: 'adunit-5944ed6c3cf7e43c'
				})
				videoAd.onLoad(() => {
					_this.rewardedVideoAdLoaded = true;
				})
				videoAd.onError((err) => {
					// 广告组件出现错误，直接允许用户保存，不做其他复杂处理
					_this.rewardedVideoAdLoaded = false;
				})
				videoAd.onClose((res) => {
					if (res && res.isEnded || res === undefined) {
						// 正常播放结束，下发奖励
						_this.download();
					} else {
						// 播放中途退出，进行提示
						uni.showToast({
							title: '请完整观看哦'
						})
					}
			
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
			watchAdBeforeSave: function(){
				// 有成功加载的激励视频，才展现提示框
				let _this = this;
				if (!!videoAd && this.rewardedVideoAdLoaded) {
					uni.showModal({
						title: '保存限制',
						content: '观看完视频可以自动保存哦',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								// 用户触发广告后，显示激励视频广告
								if (videoAd) {
									videoAd.show().catch(() => {
										// 失败重试
										videoAd.load()
											.then(() => {
												videoAd.show();
											})
											.catch(err => {
												console.log(err);
												console.log('激励视频 广告显示失败')
											})
									})
								}
							} else if (res.cancel) {
								console.log('用户点击取消，不进一步限制使用');
								// 但下次点击保存时，依旧会弹出提示
								_this.download();
								return;
							}
						}
					});
				} else {
					// 未拉取到广告，直接允许用户保存
					_this.download();
				}
			},
			download: function() {
				uni.saveImageToPhotosAlbum({
					filePath: this.imageUrl,
					success: function(res) {
						uni.showToast({
							title: '保存成功'
						})
						uni.vibrateShort({
							success: function() {
								console.log('vibrateShort');
							}
						});
					},
					fail(res) {
						console.log(res)
						if (res.errMsg.indexOf("fail")) {
							uni.showModal({
								title: '您需要授权相册权限',
								success(res) {
									if (res.confirm) {
										uni.openSetting({
											success(res) {
												console.log("相册授权成功");
											},
											fail(res) {
												console.log(res)
											}
										})
									}
								}
							})
						}
					}
				});
			}
		}
	}
</script>

<style scoped>
	.container {
		background-color: white;
	}

	.chat-bg {
		width: 750rpx;
		height: 100%;
	}

	.download-btn {
		position: fixed;
		width: 150rpx;
		height: 150rpx;
		left: 300rpx;
		bottom: 100rpx;
	}
</style>
