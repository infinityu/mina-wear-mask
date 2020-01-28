<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<view>
			<view class="container" id="container" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
				<image class="bg" :src="bgPic"></image>
				<icon type="cancel" class="cancel" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 + 'px'}"></icon>
				<!-- <icon type="waiting" class="handle" id="handle" color="green" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></icon> -->
				<text class="cuIcon-full handle" id="handle" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></text>
				<image class="hat" id='hat' src="/static/image/mask/mask3.png" :style="{top:hatCenterY-hatSize/2-2+'px', left:hatCenterX-hatSize/2-2+'px',
				transform: 'rotate(' +rotate+ 'deg)' + 'scale(' +scale+')'}"></image>
			</view>
		</view>
		<view class="grid col-1">
			<button id="btn-my-avatar" class="cu-btn round action-btn bg-yellow shadow " open-type="getUserInfo" @getuserinfo="getUserInfoCallBack">我的头像</button>
			<button @tap="combinePic">确定</button>
		</view>
	</view>
</template>
<script>
	import {
		mapGetters,
		mapState,
		mapMutations
	} from "vuex";
	import tuiFooter from "@/components/tui/footer";

	// 在页面中定义激励视频广告
	let videoAd = null;
	// 在页面中定义插屏广告
	let interstitialAd = null

	export default {
		components: {
			tuiFooter
		},
		data() {
			return {
				windowHeight: 0,
				bgPic: null,
				hatCenterX: wx.getSystemInfoSync().windowWidth / 2,
				hatCenterY: 150,
				cancelCenterX: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
				cancelCenterY: 100,
				handleCenterX: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
				handleCenterY: 200,

				hatSize: 100,
				scale: 1,
				rotate: 0,
				hat_center_x: wx.getSystemInfoSync().windowWidth / 2,
				hat_center_y: 150,
				cancel_center_x: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
				cancel_center_y: 100,
				handle_center_x: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
				handle_center_y: 200,
				scaleCurrent: 1,
				rotateCurrent: 0,
				touch_target: "",
				start_x: 0,
				start_y: 0
			}
		},
		computed: {
			...mapState({
				userInfo: 'userInfo'
			})
		},
		onLoad(option) {
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
		},
		onShareAppMessage() {
			return {
				title: '头像加福贺新春',
				desc: '贺新春，贴福字，为你的头像加个福字吧',
				imageUrl: '/static/image/redirect-cover.jpg',
				path: '/pages/happiness/add-happiness',
				success: function(res) {
					console.log(res);
				}
			}
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
			touchStart(e) {
				console.log('e.target.id', e.target.id);
				if (e.target.id == "hat") {
					this.touch_target = "hat";
				} else if (e.target.id == "handle") {
					this.touch_target = "handle"
				} else {
					this.touch_target = ""
				};

				if (this.touch_target != "") {
					this.start_x = e.touches[0].clientX;
					this.start_y = e.touches[0].clientY;
				}
			},
			touchEnd(e) {
				this.hat_center_x = this.hatCenterX;
				this.hat_center_y = this.hatCenterY;
				this.cancel_center_x = this.cancelCenterX;
				this.cancel_center_y = this.cancelCenterY;
				this.handle_center_x = this.handleCenterX;
				this.handle_center_y = this.handleCenterY;
				// }
				this.touch_target = "";
				this.scaleCurrent = this.scale;
				this.rotateCurrent = this.rotate;
				console.log('this.scale', this.scale);
				console.log('this.rotate', this.rotate);
			},
			touchMove(e) {
				var current_x = e.touches[0].clientX;
				var current_y = e.touches[0].clientY;
				var moved_x = current_x - this.start_x;
				var moved_y = current_y - this.start_y;
				if (this.touch_target == "hat") {
					this.hatCenterX = this.hatCenterX + moved_x;
					this.hatCenterY = this.hatCenterY + moved_y;
					this.cancelCenterX = this.cancelCenterX + moved_x;
					this.cancelCenterY = this.cancelCenterY + moved_y;
					this.handleCenterX = this.handleCenterX + moved_x;
					this.handleCenterY = this.handleCenterY + moved_y;
				};
				if (this.touch_target == "handle") {
					this.handleCenterX = this.handleCenterX + moved_x;
					this.handleCenterY = this.handleCenterY + moved_y;
					this.cancelCenterX = 2 * this.hatCenterX - this.handleCenterX;
					this.cancelCenterY = 2 * this.hatCenterY - this.handleCenterY;
					let diff_x_before = this.handle_center_x - this.hat_center_x;
					let diff_y_before = this.handle_center_y - this.hat_center_y;
					let diff_x_after = this.handleCenterX - this.hat_center_x;
					let diff_y_after = this.handleCenterY - this.hat_center_y;
					let distance_before = Math.sqrt(diff_x_before * diff_x_before + diff_y_before * diff_y_before);
					let distance_after = Math.sqrt(diff_x_after * diff_x_after + diff_y_after * diff_y_after);
					let angle_before = Math.atan2(diff_y_before, diff_x_before) / Math.PI * 180;
					let angle_after = Math.atan2(diff_y_after, diff_x_after) / Math.PI * 180;

					this.scale = distance_after / distance_before * this.scaleCurrent;
					console.log('distance_after', distance_after);
					console.log('distance_before', distance_before);
					console.log('this.scaleCurrent', this.scaleCurrent);
					this.rotate = angle_after - angle_before + this.rotateCurrent;
				}
				this.start_x = current_x;
				this.start_y = current_y;
			},
			/**
			 *  获取用户信息回调方法
			 * @param {Object} result
			 */
			getUserInfoCallBack(result) {
				console.log('mpGetUserInfo', result);
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.showModal({
						title: '获取用户头像失败',
						content: '用户信息仅用于创建新的图片，请放心使用',
						showCancel: false
					});
					return;
				}
				this.ownImageUsed = true;
				let userInfo = result.detail.userInfo;
				console.log(userInfo);
				userInfo.avatarUrl = userInfo.avatarUrl.replace("132", "0"); // 使用最大分辨率头像 959 * 959
				this.bgPic = userInfo.avatarUrl;
			},
			/**
			 *  选择图片
			 */
			chooseImage() {
				let self = this;
				uni.chooseImage({
					count: 1, // 默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'],
					success: function(res) {
						console.log(res);
						let tempImagePath = res.tempFilePaths[0];
						self.imageCheck(tempImagePath, self.loadRecImageOrStartToCrop);
						// self.loadRecImageOrStartToCrop(tempImagePath);
					}
				});
			},
			loadRecImageOrStartToCrop(tempImagePath) {
				this.ownImageUsed = true;
				let self = this;
				uni.getImageInfo({
					src: tempImagePath,
					success: function(image) {
						let width = image.width;
						let height = image.height;
						let delta = (width - height) / width.toFixed(3);
						console.log('delta', delta);
						// 如果是正方形或者接近正放心则直接加载不进行剪裁
						if ((-0.02 <= delta && delta <= 0) || (0 < delta && delta <= 0.02)) {
							let tempFilePathCompressed = tempImagePath;
							self.avatarPath = tempImagePath;
							self.paint();
						} else {
							uni.navigateTo({
								url: '/pages/crop/crop?tempFilePath=' + tempImagePath
							})
						}
					}
				});
			},
			/**
			 * 保存
			 */
			saveCans() {
				console.log('保存...')
				let _this = this;
				uni.showLoading({
					title: '保存...',
					mask: true
				})
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: this.cansWidth * 1.5,
					height: this.cansHeight * 1.5,
					destWidth: this.cansWidth * 3,
					destHeight: this.cansHeight * 3,
					canvasId: 'cans-id-happines',
					success: function(res) {
						uni.hideLoading()
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								uni.showToast({
									title: '请至相册查看'
								})
								uni.vibrateShort({
									success: function() {
										console.log('vibrateShort');
									}
								});
								_this.savedCounts++;
								// 保存时，如果没有激励广告则展示一次插屏广告，因为一个完整操作流程已结束，提升广告曝光
								if (interstitialAd && _this.enableInterstitialAd && !_this.interstitialAdAlreadyShow &&
									!_this.rewardedVideoAdAlreadyShow) { // 没有激励广告才在保存时展示插屏广告
									interstitialAd.show()
										.then(() => {
											_this.interstitialAdAlreadyShow = true;
										})
										.catch((err) => {
											interstitialAd.load().then(() => {
												interstitialAd.show();
											}).catch(err => {
												console.log(err);
												console.log('插屏广告显示失败')
											})
											console.error(err)
										})
								}
								console.log('保存成功')
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
					},
					fail(res) {
						uni.hideLoading()
					}
				}, this)
			},
			showModal: function(e) {
				console.log(e.currentTarget.dataset);
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
			},
			toSharePage: function() {
				uni.switchTab({
					url: '/pages/share/share'
				});
				this.hideModal();
			},
			imageCheck: function(tempImagePath, callback) {
				if (!getApp().globalData.enableSecurityCheck) {
					callback(tempImagePath);
					return;
				}
				let _this = this;
				uni.compressImage({
					src: tempImagePath,
					quality: 1,
					success: res => {
						let tempFilePathCompressed = res.tempFilePath;
						// console.log(res.tempFilePath)
						wx.getFileSystemManager().readFile({
							filePath: tempFilePathCompressed, // 压缩图片，然后安全检测
							success: buffer => {
								console.log(buffer.data);
								uni.showLoading({
									title: '加载中...'
								});
								//这里是 云函数调用方法
								wx.cloud.callFunction({
									name: 'contentCheck',
									data: {
										value: buffer.data
									},
									success(json) {
										console.log("checkContent result", json)
										if (json.result.errCode == 87014) {
											uni.showModal({
												title: '请勿使用违法违规内容',
												content: '图片含有违法违规内容',
												showCancel: false,
												confirmText: '知道了',
											});
											console.log("bad")
										} else {
											console.log("good")
											//图片合规则进行进一步处理
											callback(tempImagePath);
										}
									},
									fail(e) {
										console.log(e);
										uni.showModal({
											title: '请重试',
											content: '对不起，服务器开了小差',
											showCancel: false,
											confirmText: '好的',
										});
									},
									complete() {
										uni.hideLoading();
									}
								})
							}
						})

					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main {
		// background-color: #C12928;
	}

	.userinfo-avatar {
		border-radius: 128upx;
		width: 128upx;
		height: 128upx;
	}

	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		// z-index: 998;
		// background-color: rgba(0, 0, 0, 0.8);
	}

	.container {
		height: 300px;
		width: 100%;
	}

	.bg {
		position: absolute;
		z-index: 0;
		height: 300px;
		width: 300px;
	}

	button {
		margin-top: 10px;

	}

	.hat {
		height: 100px;
		width: 100px;
		position: absolute;
		border: dashed 2px yellow;
		top: 100px;
	}

	.handle,
	.cancel {
		position: absolute;
		z-index: 1;
		width: 25px;
		height: 25px;
	}

	.scrollView {
		width: 100%;
		position: absolute;
		bottom: 5px;
		white-space: nowrap;
	}

	.imgList {
		height: 70px;
		width: 70px;
		border: 2px solid;
		margin: 5px;
	}
</style>
