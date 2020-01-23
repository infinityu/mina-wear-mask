<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<cover-view class="happiness-option-wrapper animation-slide-left animation-speed-2">
			<cover-view class="padding">
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="0">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h0.jpg"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="1">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h1.jpg"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="2">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h2.jpg"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="3">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h3.jpg"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="4">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h4.jpg"></cover-image>
				</cover-view>
			</cover-view>
		</cover-view>
		<view id="avatar-section" @click="nextHappiness">
			<canvas canvas-id="cans-id-happines" style="width:270px; height:270px;" class="isCan"></canvas>
		</view>
		<!-- <view class="flex-sub text-center" @click="openIntroduction"> -->
		<view v-if="showQuestion" class="flex-sub text-center" @click="openIntroduction">
			<view class="solid-bottom padding">
				<text class="text-orange">点击头像或摇一摇换福字</text> 
				<text class="lg text-orange cuIcon-question" style="margin-left: 5px;"></text>
			</view>
		</view>
		<view v-else class="flex-sub text-center" >
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

			<!-- <view class="grid col-3 animation-shake animation-speed-2 animation-delay-3">
				<button class="cu-btn round action-btn bg-yellow shadow a" @click="nextHappiness">换个福字</button>
			</view> -->
			<view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">
				<!-- <button class="cu-btn block shaline-orange lg" open-type="share"> -->
				<button class="cu-btn block line-orange lg share-btn" open-type="share">
					<text class="cuIcon-upload"></text> 分享给好友</button>
			</view>
			<!-- <view class="grid col-3 animation-shake animation-speed-2 animation-delay-3">
				<button class="cu-btn round action-btn bg-yellow shadow" @click="toSharePage" data-target="image">
					分享朋友圈<text class="cuIcon-forward"></text></button>
			</view> -->
		</view>
		<!-- <view>
			<tui-footer :fixed="true" :copyright="copyright"></tui-footer>
		</view> -->
		<!-- <view @click="showModal" data-target="Modal"> -->
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white">
					<view class="action text-green">分享"福气"给好友</view>
					<view class="action text-blue" @tap="hideModal">关闭</view>
				</view>
				<view class="padding-xl grid justify-around">
					<view>
						<button class="cu-btn round action-btn bg-yellow shadow" open-type="share">
							分享小程序给好友<text class="cuIcon-forward"></text></button>
					</view>
					<view>
						<button class="cu-btn round action-btn bg-yellow shadow" @click="toSharePage">
							精彩祝福海报<text class="cuIcon-forward"></text></button>
					</view>
				</view>
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
	import tuiFooter from "@/components/footer";

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
				cansWidth: 270, // 宽度 px
				cansHeight: 270, // 高度 px
				cansBgColor: "#FFD314",
				cornerBgColor: '#C12928',
				cornerBgBoarderColor: '#FFFFFF',
				r: 40,
				boarderWidth: 15,
				wishText: '福',
				avatarPath: '/static/image/avatar.png',
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
				showQuestion: false,
				adAlreadyShow: false,
				ownImageUsed: false,
				envId: 'happiness-production-yy81s',
				collectionName: 'ad_config',
				docId: 'add_happiness_rwzc'

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
				_this.showQuestion = res.data.show_question;
				getApp().globalData.showQuestion = res.data.show_question;
				getApp().globalData.questionUrl = res.data.question_url;
				getApp().globalData.enableSecurityCheck = res.data.enableSecurityCheck;
			})

			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
			  interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-beed4816676d471a'
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
				videoAd.onLoad(() => {})
				videoAd.onError((err) => {
					// 广告组件出现错误，直接允许用户保存，不做其他复杂处理
					console.log('videoAd.onError', err);
					this.adAlreadyShow = true; // 本次使用不再展示广告
					this.saveCans();
				})
				videoAd.onClose((res) => {
					if (res && res.isEnded || res === undefined) {
						// 正常播放结束，下发奖励
						console.log('正常播放结束，下发奖励');
						this.adAlreadyShow = true; // 本次使用不再展现广告
						this.saveCans();
					} else {
						// 播放中途退出，进行提示
						console.log('播放中途退出，重新提示');
						console.log('adAlreadyShow', this.adAlreadyShow);
						this.checkAdBeforeSave();
					}

				})
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
			}
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
			wx.startAccelerometer({
				interval: 'normal'
			});
			wx.onAccelerometerChange(this.shake);
			
			// 在适合的场景显示插屏广告
			if (interstitialAd) {
				this.adAlreadyShow = true;
				interstitialAd.show().catch((err) => {
					console.error(err)
				})
			}
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
			openIntroduction(){
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
						self.paint();
						// wx.getImageInfo({
						//   src: res.tempFilePath,
						//   success (res) {
						// 	  console.log('getImageInfo');
						//     console.log(res.width)
						//     console.log(res.height)
						//   }
						// })

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
			loadRecImageOrStartToCrop(tempImagePath){
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
				console.log('adAlreadyShow', this.adAlreadyShow);
				console.log('ownImageUsed', this.ownImageUsed);
				console.log('exceed', this.savedCounts >= this.freeCount);
				console.log('this.savedCounts', this.savedCounts);
				console.log('this.freeCount', this.freeCount);
				if (this.enableRewardedVideoAd && !!videoAd && !this.adAlreadyShow &&
					this.savedCounts >= this.freeCount && this.ownImageUsed) {
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
								// 在适合的场景显示插屏广告
								if (interstitialAd) {
								  _this.adAlreadyShow = true;
								  interstitialAd.show().catch((err) => {
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
			imageCheck: function(tempImagePath, callback){
				if(!getApp().globalData.enableSecurityCheck){
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
