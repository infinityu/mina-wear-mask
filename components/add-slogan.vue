<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<view v-if="SHOW_TIP">
			<add-tips :statusBarHeight="statusBarHeight" />
		</view>
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view id="avatar-section" @click="nextHappiness">
			<canvas canvas-id="cans-id-happines" style="width:270px; height:270px;" class="isCan"></canvas>
		</view>
		<view class="flex-sub text-center">
			<view class="solid-bottom padding">
				<text class="text-orange">点击头像或摇一摇换福字</text>
			</view>
		</view>

		<view class="grid justify-around action-wrapper">
			<view class="grid col-1">
				<button id="btn-my-avatar" class="cu-btn round action-btn bg-yellow shadow " open-type="getUserInfo" @getuserinfo="getUserInfoCallBack">我的头像</button>
			</view>
			<view class="grid col-2">
				<button id="btn-save" class="cu-btn round action-btn bg-yellow shadow" @click="checkAdBeforeSave">
					<!-- <text class="cuIcon-down"> -->
					</text>保存</button>
			</view>
			<view class="grid col-3">
				<button id="btn-choose-img" class="cu-btn round action-btn bg-yellow shadow" @click="chooseImage">选择图片</button>
			</view>
		</view>
		<view class="grid justify-around share-wrapper">
			<view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">
				<button class="cu-btn block line-orange lg share-btn" open-type="share">
					<text class="cuIcon-upload"></text>  分享给好友</button>
			</view>
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
	let interstitialAd = null

	export default {
		components: {
			tuiFooter,
			addTips
		},
		data() {
			return {
				windowHeight: 0,
				cansWidth: 270, // 宽度 px
				cansHeight: 270, // 高度 px
				cansBgColor: "#FFD314",
				cornerBgColor: '#C12928',
				cornerBgBoarderColor: '#FFFFFF',
				r: 40,
				boarderWidth: 15,
				wishText: '福',
				avatarPath: '/static/image/mask/avatar_mask.png',
				happinessPathList: ['/static/image/h0.png', '/static/image/h1.png', '/static/image/h2.png', '/static/image/h3.png',
					'/static/image/h4.png'
				],
				happinessIndex: 0,
				copyright: " Copyright © 2016-2020 人文之窗公众号",
				modalName: null,
				//首先定义一下，全局变量
				lastTime: 0, //此变量用来记录上次摇动的时间
				x: 0,
				y: 0,
				z: 0,
				lastX: 0,
				lastY: 0,
				lastZ: 0, //此组变量分别记录对应 x、y、z 三轴的数值和上次的数值
				shaking: false,
				shakeSpeed: 70, //设置阈值
				lastChangeTime: 0,
				showGentleMessage: false,
				savedCounts: 0,
				freeCount: 1,
				enableRewardedVideoAd: true,
				enableInterstitialAd: true,
				rewardedVideoAdAlreadyShow: false,
				interstitialAdAlreadyShow: false,
				ownImageUsed: false,
				showQuestion: false,
				envId: 'happiness-production-yy81s',
				collectionName: 'ad_config',
				docId: 'add_happiness_rwzc',
				statusBarHeight: 0,
				SHOW_TIP: false,
				duration: 20

			}
		},
		computed: {
			...mapState({
				userInfo: 'userInfo'
			}),
			happinessPath: function() {
				return this.happinessPathList[this.happinessIndex];
			},
			cornerX: function() {
				return Math.ceil(this.cansWidth * 0.7);
			},
			cornerY: function() {
				return Math.ceil(this.cansHeight * 0.7);
			}
		},
		onLoad(option) {
			if (!!getApp().globalData.userAvatarFilePath) {
				this.avatarPath = getApp().globalData.userAvatarFilePath;
			}

			this.ctx = uni.createCanvasContext('cans-id-happines', this);
			this.paint();

			const db = wx.cloud.database({
				env: this.envId,
				traceUser: true
			});

			let _this = this;
			db.collection(this.collectionName).doc(this.docId).get().then(res => {
				// res.data 包含该记录的数据
				console.log('res.data.free_count', res.data.free_count);
				_this.freeCount = res.data.free_count;
				_this.enableRewardedVideoAd = res.data.enableRewardedVideoAd;
				_this.enableInterstitialAd = res.data.enableInterstitialAd;
				_this.showQuestion = res.data.show_question;
				getApp().globalData.showQuestion = res.data.show_question;
				getApp().globalData.questionUrl = res.data.question_url;
				getApp().globalData.enableSecurityCheck = res.data.enableSecurityCheck;
			})

			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-6a39f22d22569c87'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {})
				interstitialAd.onClose(() => {})
			}

			// 在页面onLoad回调事件中创建激励视频广告实例
			if (wx.createRewardedVideoAd) {
				videoAd = wx.createRewardedVideoAd({
					adUnitId: 'adunit-e79298021d1311a7'
				})
				videoAd.onLoad(() => {
					_this.rewardedVideoAdLoaded = true;
				})
				videoAd.onError((err) => {
					// 广告组件出现错误，直接允许用户保存，不做其他复杂处理
					console.log('videoAd.onError', err);
					_this.rewardedVideoAdLoaded = false;
				})
				videoAd.onClose((res) => {
					if (res && res.isEnded || res === undefined) {
						// 正常播放结束，下发奖励
						console.log('正常播放结束，下发奖励');
						_this.rewardedVideoAdAlreadyShow = true; // 本次使用不再展现激励广告
						_this.saveCans();
					} else {
						// 播放中途退出，进行提示
						console.log('播放中途退出，重新提示');
						console.log('rewardedVideoAdAlreadyShow', _this.rewardedVideoAdAlreadyShow);
						_this.rewardedVideoAdAlreadyShow = false;
						_this.checkAdBeforeSave();
					}

				})
			}

		},
		onReady() {
			console.log("onReady");
			// 判断是否已经显示过
			let cache = uni.getStorageSync(getApp().globalData.STORAGE_KEY);
			console.log('cache', cache);
			if (!cache) {
				this.statusBarHeight = getApp().globalData.statusBarHeight;
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
			console.log("onshow");
			// let defaultAvatarIndex = Math.round(Math.random());
			// console.log(defaultAvatarIndex);
			if (getApp().globalData.rapaintAfterCrop) {
				getApp().globalData.rapaintAfterCrop = false;
				this.avatarPath = getApp().globalData.cropImageFilePath;;
				this.paint();
			} else {
				//从剪裁页面跳转回来时不用展示，其他情况下，页面打开时展示插屏广告
				if (interstitialAd && this.enableInterstitialAd && !this.interstitialAdAlreadyShow) {
					interstitialAd.show()
						.then(() => {
							this.interstitialAdAlreadyShow = true;
						})
						.catch((err) => {
							console.error(err)
						})
				}
			}
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
			wx.startAccelerometer({
				interval: 'normal'
			});
			wx.onAccelerometerChange(this.shake);
		},
		onHide() {
			wx.stopAccelerometer();
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
			openIntroduction() {
				console.log('click');
				uni.navigateTo({
					url: '/pages/happiness/introduction'
				})
			},
			shake(acceleration) {
				var nowTime = new Date().getTime(); //记录当前时间
				//如果这次摇的时间距离上次摇的时间有一定间隔 才执行
				if (nowTime - this.lastTime > 100) {
					var diffTime = nowTime - this.lastTime; //记录时间段
					this.lastTime = nowTime; //记录本次摇动时间，为下次计算摇动时间做准备
					this.x = acceleration.x; //获取 x 轴数值，x 轴为垂直于北轴，向东为正
					this.y = acceleration.y; //获取 y 轴数值，y 轴向正北为正
					this.z = acceleration.z; //获取 z 轴数值，z 轴垂直于地面，向上为正
					//计算 公式的意思是 单位时间内运动的路程，即为我们想要的速度
					var speed = Math.abs(this.x + this.y + this.z - this.lastX - this.lastY - this.lastZ) / diffTime * 10000;
					if (speed > this.shakeSpeed) {
						this.shaking = true;
					} else {
						if (this.shaking) {
							this.shaking = false;
							if (nowTime - this.lastChangeTime > 800) {
								this.nextHappiness();
								this.lastChangeTime = nowTime;
								if (!this.showGentleMessage) {
									this.showGentleMessage = true;
									uni.showToast({
										title: '轻轻摇就可以了哦'
									});
								}
							}
							console.log("换了一下");
						}
					}
					this.lastX = this.x; //赋值，为下一次计算做准备
					this.lastY = this.y; //赋值，为下一次计算做准备
					this.lastZ = this.z; //赋值，为下一次计算做准备
				}
			},
			paint(avatarFilePath, happinessFilePath) {
				if (!avatarFilePath) {
					avatarFilePath = this.avatarPath;
				}
				if (!happinessFilePath) {
					happinessFilePath = this.happinessPath;
				}
				this.drawCansBgImg(avatarFilePath);
				this.drawCornerBg();
				this.drawHappiness(happinessFilePath);
				uni.vibrateShort({
					success: function() {
						console.log('vibrateShort');
					}
				});
			},
			drawCansBgImg(imageFilePath) {
				this.ctx.drawImage(imageFilePath, 0, 0, this.cansWidth, this.cansHeight);
				this.ctx.draw(false);
			},
			drawCornerBg() {
				this._drawCircleWithBoarder(this.cornerBgBoarderColor, this.cornerBgColor, this.cornerX, this.cornerY, this.r, this
					.boarderWidth);
			},
			drawHappiness(happinessFilePath) {
				this.ctx.drawImage(happinessFilePath, this.cornerX + 5, this.cornerY + 7, this.cansWidth * 0.25, this.cansHeight *
					0.25);
				this.ctx.draw(true);
			},
			/**
			 * legacy
			 */
			drawDefaultText() {
				let textOption = {
					text: this.wishText,
					sLeft: 0.73,
					sTop: 0.93,
					fontSize: 60,
					color: 'white',
					bold: true,
					lineHeight: 12
				};
				this._drawText(textOption);
				uni.vibrateShort({
					success: function() {
						console.log('vibrateShort');
					}
				});
			},
			/**
			 *  绘制圆形边框
			 * @param {Object} sColor  线条色
			 * @param {Object} fColor
			 * @param {Object} cornerX  相对比例坐标
			 * @param {Object} cornerY
			 * @param {Object} r
			 */
			_drawCircleWithBoarder(sColor, fColor, cornerX, cornerY, r, boarderWidth) {
				this.ctx.save();
				var cx = cornerX + r;
				var cy = cornerY + r;
				// 圆的中心的 cx, cy 坐标, 圆的半径, 起始角, 结束角。
				this.ctx.arc(cx, cy, r, 0, 2 * Math.PI); // 创建弧/曲线（用于创建圆或部分圆）
				this.ctx.setLineWidth(boarderWidth);
				this.ctx.setStrokeStyle(sColor);
				this.ctx.stroke();
				this.ctx.setFillStyle(fColor);
				this.ctx.fill();
				this.ctx.restore();
				this.ctx.draw(true);
			},
			_drawText(item) {
				var isLeft
				if (item.sLeft == 'center') {
					isLeft = this.cansWidth * .5 - (item.fontSize * item.text.length) / 2
				} else {
					isLeft = item.sLeft * this.cansWidth
				}
				this.ctx.save()
				if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px edu-lishu`;
				// if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px ` + item.fontFamily;
				// fontFamily
				this.ctx.setFillStyle(item.color)
				this.ctx.setFontSize(item.fontSize)
				// this.ctx.setFontFamily(item.fontFamily);
				if (item.text instanceof Array) {
					if (!item.lineHeight) item.lineHeight = item.fontSize + 2
					console.log('我是数组', item.text)
					for (var i = 0; i < item.text.length; i++) {
						this.ctx.fillText(item.text[i], isLeft, item.sTop * this.cansHeight + item.lineHeight * i)
					}
				} else {
					console.log('绘制字符', item.text)
					this.ctx.fillText(item.text, isLeft, item.sTop * this.cansHeight)
				}
				this.ctx.draw(true)
				this.ctx.restore()
			},
			downloadAvatarAndPaintAll(imageUrl) {
				uni.showLoading({
					title: '添福中...'
				});
				let self = this;
				uni.downloadFile({
					url: imageUrl,
					success: function(res) {
						uni.hideLoading();
						self.avatarPath = res.tempFilePath;
						getApp().globalData.userAvatarFilePath = res.tempFilePath;
						self.paint();
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
				getApp().globalData.userAvatarUrl = userInfo.avatarUrl;
				this.downloadAvatarAndPaintAll(userInfo.avatarUrl);
				this.saveLoginUserInfo(userInfo);
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
			changeHappiness(e) {
				this.happinessIndex = parseInt(e.currentTarget.dataset.target, 10);
				// this.happinessPath = this.happinessPathList[this.happinessIndex];
				this.paint();
			},
			nextHappiness() {
				this.happinessIndex = (this.happinessIndex + 1) % 5;
				// this.happinessPath = this.happinessPathList[this.happinessIndex];
				this.paint();
			},
			checkAdBeforeSave() {
				console.log('enableRewardedVideoAd', this.enableRewardedVideoAd);
				console.log('videoAd', videoAd);
				console.log('ownImageUsed', this.ownImageUsed);
				console.log('this.savedCounts', this.savedCounts);
				console.log('this.freeCount', this.freeCount);
				console.log('this.savedCounts >= this.freeCount', this.savedCounts >= this.freeCount);
				console.log('interstitialAdAlreadyShow', this.interstitialAdAlreadyShow);
				console.log('this.rewardedVideoAdAlreadyShow', this.rewardedVideoAdAlreadyShow);
				console.log('this.rewardedVideoAdLoaded', this.rewardedVideoAdLoaded);
				// 有成功加载的激励视频，才展现提示框
				let _this = this;
				if (!!videoAd && this.enableRewardedVideoAd && this.rewardedVideoAdLoaded &&
					!this.rewardedVideoAdAlreadyShow && this.savedCounts >= this.freeCount) {
					uni.showModal({
						title: '获取无限使用次数',
						content: '请完整观看趣味广告视频',
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
								console.log('用户点击取消');
								// _this.saveCans();
								return;
							}
						}
					});
				} else {
					this.saveCans();
				}
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
			},
			onClickFab(e) {
				let index = e.index

				switch (index) {
					case -1:
						break;
					case 0:
						uni.switchTab({
							url: "/pages/happiness/add-mask"
						})
						break;
					case 1:
						uni.switchTab({
							url: "/pages/about/about"
						})
						break;
					// case 2:
					// 	uni.previewImage({
					// 		urls: ["https://thorui.cn/img/reward.jpg"]
					// 	})
					// 	break;
					default:
						break;
				}
			}

		},

	}
</script>

<style lang="scss" scoped>
	.main {
		background-color: #C12928;
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

	.isCan22 {
		border: 6px solid white;
		border-radius: 10px;
		position: fixed;
		left: 0;
		// z-index: 999;
		width: 270px;
		height: 270px;
		right: 0;
		top: 200upx;
		bottom: 130upx;
		margin: 0 auto;
		background-size: 100%;
	}

	.isCan {
		border: 6px solid white;
		border-radius: 10px;
		width: 270px;
		height: 270px;
		margin-top: 150rpx;
		margin-left: auto;
		margin-right: auto;
		background-size: 100%;

	}

	@media (min-width: 320px) {

		/* 仅在 320px 或更宽的屏幕上生效的样式规则 */
		.action-wrapper {
			padding-top: 50rpx;
			padding-left: 100rpx;
			padding-right: 100rpx;
			font-weight: 800;
		}

		// .action-btn {
		// 	background-color: #FFC700;
		// 	color: white;
		// }
	}

	.action-wrapper {
		padding-top: 50rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	// .action-btn {
	// 	background-color: #FFC700;
	// 	color: white;
	// }

	.share-wrapper {
		padding-top: 50rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.happiness-option-wrapper {
		position: absolute;
		z-index: 1000;
		width: 200rpx;
		margin-top: 25px;
	}

	.happiness-option {
		width: 60px;
		height: 60px;
	}
</style>
