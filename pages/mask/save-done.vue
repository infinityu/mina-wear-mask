<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		
		<view class="avatar-container grid justify-center" id="avatar-container" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
			<view class="avatar-bg-border">
				<image @touchstart="touchAvatarBg" class="bg avatar-bg" id="avatar-bg" :src="avatarPath"></image>
			</view>
		</view>
		<view>
			<canvas class="cans-id-mask" canvas-id="cans-id-mask" style="height:270px;width:270px;margin-left: auto;margin-right: auto;" />
		</view>
		<view class="flex-sub text-center">
			<view class="solid-bottom">
				<text class="text-yellow text-bold">戴口罩头像保存成功，请至相册查看</text>
			</view>
		</view>
		<view class="grid justify-around action-wrapper">
			<view class="grid col-1">
				<button id="btn-my-avatar" class="cu-btn round action-btn bg-yellow shadow " open-type="getUserInfo" @getuserinfo="getUserInfoCallBack">我的头像</button>
			</view>
			<view class="grid col-2">
				<button id="btn-save" class="cu-btn round action-btn bg-yellow shadow" @click="draw">
					<!-- <text class="cuIcon-down"> -->
					</text>保存</button>
			</view>
			<view class="grid col-3">
				<button id="btn-choose-img" class="cu-btn round action-btn bg-yellow shadow" @click="chooseImage">选择图片</button>
			</view>
		</view>
		<view class="grid justify-around share-wrapper">
			<ad unit-id="adunit-85230d6cd9a1beee"></ad>
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
	import addTips from "@/components/add-tips";

	// 在页面中定义激励视频广告
	let videoAd = null;
	// 在页面中定义插屏广告
	let interstitialAd = null;

	const range = (start, end, step) => {
		return Array.from(Array.from(Array(Math.ceil((end - start) / step)).keys()), x => start + x * step);
	}
	const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';

	export default {
		components: {
			tuiFooter,
			addTips
		},
		data() {
			return {
				SHOW_TIP: false,
				duration: 15,
				statusBarHeight: 0,
				windowHeight: 0,
				isAndroid: getApp().globalData.IS_ANDROID,
				modalName: null,
				savedCounts: 0,
				cansWidth: 200, // 宽度 px
				cansHeight: 200, // 高度 px
				avatarPath: getApp().globalData.maskAvatarSavedTempPath,
				imgList: range(0, 29, 1), // 第二个参数是个数
				currentMaskId: -1,
				showBorder: false,
				maskCenterX: wx.getSystemInfoSync().windowWidth / 2,
				maskCenterY: 250,
				cancelCenterX: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
				cancelCenterY: 200,
				handleCenterX: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
				handleCenterY: 300,

				maskSize: 100,
				scale: 1,
				rotate: 0,
				rotateY: 0, // 值180时，则水平翻转
				mask_center_x: wx.getSystemInfoSync().windowWidth / 2,
				mask_center_y: 250,
				cancel_center_x: wx.getSystemInfoSync().windowWidth / 2 - 50 - 2,
				cancel_center_y: 200,
				handle_center_x: wx.getSystemInfoSync().windowWidth / 2 + 50 - 2,
				handle_center_y: 300,
				scaleCurrent: 1,
				rotateCurrent: 0,
				touch_target: "",
				start_x: 0,
				start_y: 0,
			}
		},
		computed: {
			...mapState({
				userInfo: 'userInfo'
			}),
			maskPic: function() {
				return '/static/image/mask/' + this.currentMaskId + '.png';
			}
		},
		onLoad(option) {
			this.windowHeight = getApp().globalData.windowHeight;
			if (!!getApp().globalData.userAvatarFilePath) {
				this.avatarPath = getApp().globalData.userAvatarFilePath;
			}
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-2bf7cf186785bfda'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {
					console.log(err);
				})
				interstitialAd.onClose(() => {})
			}
			
			let _this = this;
			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
				videoAd = wx.createRewardedVideoAd({
					adUnitId: 'adunit-9a8af70b40e15f29'
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
						_this.rewardedVideoAdAlreadyShow = true; // 本次使用不再展现激励广告
						// _this.saveCans();
					} else {
						// 播放中途退出，进行提示
						_this.rewardedVideoAdAlreadyShow = false;
					}
			
				})
			}
		},
		onReady() {
			// 判断是否已经显示过
			let cache = uni.getStorageSync(STORAGE_KEY);
			console.log('cache', cache);
			if (!cache) {
				this.statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
				console.log('this.statusBarHeight', this.statusBarHeight);
				
				// 没显示过，则进行展示
				this.SHOW_TIP = true;
				console.log('SHOW_TIP', this.SHOW_TIP);
				// 关闭时间
				let _this = this;
				setTimeout(() => {
					_this.SHOW_TIP = false;
				}, _this.duration * 1000);
			}
		},
		onShow() {
			console.log("onShow");
			if (getApp().globalData.rapaintAfterCrop) {
				getApp().globalData.rapaintAfterCrop = false;
				this.avatarPath = getApp().globalData.cropImageFilePath;
				this.paint();
			}
			if (interstitialAd) {
				interstitialAd.show().catch((err) => {
					console.error(err)
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
			...mapMutations(["saveLoginUserInfo"]),
			paint() {},
			showTips() {
				console.log('tips');
				this.modalName = 'tips';
			},
			touchAvatarBg() {
				this.showBorder = false;
			},
			touchStart(e) {
				console.log('e.target.id', e.target.id);
				if (e.target.id == "mask") {
					this.touch_target = "mask";
					this.showBorder = true;
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
				this.mask_center_x = this.maskCenterX;
				this.mask_center_y = this.maskCenterY;
				this.cancel_center_x = this.cancelCenterX;
				this.cancel_center_y = this.cancelCenterY;
				this.handle_center_x = this.handleCenterX;
				this.handle_center_y = this.handleCenterY;
				this.touch_target = "";
				this.scaleCurrent = this.scale;
				this.rotateCurrent = this.rotate;
			},
			touchMove(e) {
				var current_x = e.touches[0].clientX;
				var current_y = e.touches[0].clientY;
				var moved_x = current_x - this.start_x;
				var moved_y = current_y - this.start_y;
				if (this.touch_target == "mask") {
					this.maskCenterX = this.maskCenterX + moved_x;
					this.maskCenterY = this.maskCenterY + moved_y;
					this.cancelCenterX = this.cancelCenterX + moved_x;
					this.cancelCenterY = this.cancelCenterY + moved_y;
					this.handleCenterX = this.handleCenterX + moved_x;
					this.handleCenterY = this.handleCenterY + moved_y;
				};
				if (this.touch_target == "handle") {
					this.handleCenterX = this.handleCenterX + moved_x;
					this.handleCenterY = this.handleCenterY + moved_y;
					this.cancelCenterX = 2 * this.maskCenterX - this.handleCenterX;
					this.cancelCenterY = 2 * this.maskCenterY - this.handleCenterY;
					let diff_x_before = this.handle_center_x - this.mask_center_x;
					let diff_y_before = this.handle_center_y - this.mask_center_y;
					let diff_x_after = this.handleCenterX - this.mask_center_x;
					let diff_y_after = this.handleCenterY - this.mask_center_y;
					let distance_before = Math.sqrt(diff_x_before * diff_x_before + diff_y_before * diff_y_before);
					let distance_after = Math.sqrt(diff_x_after * diff_x_after + diff_y_after * diff_y_after);
					let angle_before = Math.atan2(diff_y_before, diff_x_before) / Math.PI * 180;
					let angle_after = Math.atan2(diff_y_after, diff_x_after) / Math.PI * 180;

					this.scale = distance_after / distance_before * this.scaleCurrent;
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
				let userInfo = result.detail.userInfo;
				userInfo.avatarUrl = userInfo.avatarUrl.replace("132", "0"); // 使用最大分辨率头像 959 * 959
				getApp().globalData.userAvatarUrl = userInfo.avatarUrl;
				uni.showLoading({
					title: '头像加载中...'
				});
				let self = this;
				uni.downloadFile({
					url: userInfo.avatarUrl,
					success: function(res) {
						uni.hideLoading();
						self.avatarPath = res.tempFilePath;
						getApp().globalData.userAvatarFilePath = res.tempFilePath;
					},
					fail: function(e) {
						console.log(e);
						uni.hideLoading();
						uni.showModal({
							title: '图片加载超时',
							content: '检查网络，点击确定重新加载',
							success(res) {
								if (res.confirm) {
									self.downloadAvatarAndPaintAll(imageUrl);
								} else if (res.cancel) {
									console.log('用户点击取消');
								}
							}
						})
					}
				})
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
						let tempImagePath = res.tempFilePaths[0];
						self.imageCheck(tempImagePath, self.loadRecImageOrStartToCrop);
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
			changeMask(e) {
				this.currentMaskId = e.target.dataset.maskId;
				this.showBorder = true;
			},
			draw() {
				let scale = this.scale;
				let rotate = this.rotate;
				let mask_center_x = this.mask_center_x;
				let mask_center_y = this.mask_center_y;
				let _this = this;
				// 创建节点选择器
				// 口罩中心位置的计算是从屏幕左上角开始，所以我们需要获取头像图片的位置，来得到口罩相对头像的位置
				var query = wx.createSelectorQuery();
				query.select('#avatar-bg').boundingClientRect()
				query.exec(function(res) {
					//res就是 所有标签为#的元素的信息的数组
					mask_center_x = mask_center_x - res[0].left;
					mask_center_y = mask_center_y - res[0].top;
					const pc = wx.createCanvasContext('cans-id-mask');
					const windowWidth = wx.getSystemInfoSync().windowWidth;
					const mask_size = 100 * scale;

					pc.clearRect(0, 0, _this.cansWidth, _this.cansHeight);
					pc.drawImage(_this.avatarPath, 0, 0, _this.cansWidth, _this.cansHeight);
					pc.translate(mask_center_x, mask_center_y);
					pc.rotate(rotate * Math.PI / 180);
					if (_this.isAndroid) {
						_this.rotateY == 180 && pc.scale(-1, 1);
					}
					pc.drawImage(_this.maskPic, -mask_size / 2, -mask_size / 2, mask_size, mask_size);
					pc.draw();
					_this.saveCans();
					
					// 有成功加载的激励视频，才展现提示框
					if (!!videoAd && _this.rewardedVideoAdLoaded) {
						uni.showModal({
							title: '获取无限使用次数',
							content: '请完整观看趣味广告视频，更多个性化口罩护目镜任意添加',
							success: function(res) {
								if (res.confirm) {
									console.log('用户点击确定');
									// 用户触发广告后，显示激励视频广告
									if (videoAd) {
										_this.rewardedVideoAdAlreadyShow = true;
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
									console.log('用户点击取消');
									// _this.saveCans();
									return;
								}
							}
						});
					} else {
						// _this.saveCans();
					}
				})
			},
			flipHorizontal() {
				this.rotateY = this.rotateY == 0 ? 180 : 0;
			},
			/**
			 * 保存
			 */
			saveCans() {
				let _this = this;
				uni.showLoading({
					title: '保存...',
					mask: true
				})
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					height: this.cansWidth,
					width: this.cansHeight,
					destWidth: this.cansWidth * 3,
					destHeight: this.cansHeight * 3,
					canvasId: 'cans-id-mask',
					success: function(res) {
						uni.hideLoading();
						getApp().globalData.maskAvatarSavedTempPath = res.tempFilePath;
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								if (_this.savedCounts == 0) {
									_this.modalName = 'saveTip';
								} else {
									uni.showToast({
										title: '请至相册查看'
									})
								}
								_this.savedCounts++;
								uni.vibrateShort({
									success: function() {
										console.log('vibrateShort');
									}
								});
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
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
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
						wx.getFileSystemManager().readFile({
							filePath: tempFilePathCompressed, // 压缩图片，然后安全检测
							success: buffer => {
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
	.avatar-container {
		height: 290px;
		width: 100%;
		margin-top: 150rpx;
		margin-left: auto;
		margin-right: auto;
		// background-size: 100%;
	}

	.avatar-bg-border {
		border: 6px solid white;
		border-radius: 10px;
		width: 282px;
		height: 282px;
	}

	.avatar-bg {
		position: absolute;
		z-index: 0;
		height: 270px;
		width: 270px;
	}

	.action-wrapper {
		padding-top: 10rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.share-wrapper {
		padding-top: 10rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.mask {
		height: 100px;
		width: 100px;
		position: absolute;
		top: 100px;
		border: 3px solid rgba(255, 255, 255, 0.0);
	}

	.maskWithBorder {
		border: dashed 3px white;
	}

	.hideHandle {
		display: none;
	}

	.circle {
		border-radius: 50%;
		font-size: 15px;
		color: #000;
		line-height: 25px;
		text-align: center;
		background: #fff;
	}

	.handle,
	.cancel {
		position: absolute;
		z-index: 1;
		width: 25px;
		height: 25px;
		background-color: white;
		color: black;
	}

	.scrollView {
		width: 100%;
		position: absolute;
		bottom: 0px;
		white-space: nowrap;
	}

	.infoView {
		width: 95%;
		position: absolute;
		bottom: 85px;
		white-space: nowrap;
		background-color: white;
		margin: 10px;
		padding: 1px 5px;
		border-radius: 5px;
		white-space: pre-wrap;
	}

	.imgList {
		height: 65px;
		width: 65px;
		border: 2px solid white;
		border-radius: 5px;
		margin: 10px 10px 10px 10px;
	}

	.cans-id-mask {
		position: absolute;
		top: 2000px;
		left: 1000px;
	}

	.flip-horizontal {
		-moz-transform: scaleX(-1);
		-webkit-transform: scaleX(-1);
		-o-transform: scaleX(-1);
		transform: scaleX(-1);
	}
</style>
