<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<view v-if="SHOW_TIP">
			<!-- <add-tips :statusBarHeight="statusBarHeight" /> -->
		</view>
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view id="avatar-section" @click="nextHappiness">
			<canvas canvas-id="cans-id-happines" style="width:270px; height:270px;" class="isCan"></canvas>
		</view>
		<view class="tui-drop-input-box grid justify-center">
			<tui-dropdown-list :show="dropdownShow" :top="94" :height="400">
				<template v-slot:selectionbox>
					<tui-button size="small" type="white" shape="circle" @click="dropDownList(-1)">选择口号
						<view class="tui-animation" :class="[dropdownShow?'tui-animation-show':'']">
							<tui-icon name="turningdown" :size="20"></tui-icon>
						</view>
					</tui-button>
				</template>
				<template v-slot:dropdownbox>
					<view class="tui-selected-list">
						<scroll-view scroll-y class="tui-dropdown-scroll">
							<block v-for="(item,index) in dropdownlistData" :key="index">
								<tui-list-cell @click="dropDownList(index)" :last="dropdownlistData.length-1==index">
									<tui-icon :name="item.icon" :size="item.size" :color="item.color"></tui-icon>
									<text class="tui-ml-20" style="margin-left: 20px;">{{item.name}}</text>
								</tui-list-cell>
							</block>
						</scroll-view>
					</view>
				</template>
			</tui-dropdown-list>
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
			<ad unit-id="adunit-9eaa632f3263c819"></ad>
			<!-- <view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">
				<button class="cu-btn block line-orange lg share-btn" open-type="share">
					<text class="cuIcon-upload"></text><text class="text-yellow"> 分享给好友</text></button>
			</view> -->
		</view>

		<!-- <scroll-view class="scrollView mask-scroll-view" scroll-x="true">
			<view v-for="(item,index) in imgList" class="imgList shadow" :key="index" style="display: inline-flex;">
				<view class="slogan-bg">
					<text>{{item}}</text>
				</view>
			</view>
		</scroll-view> -->
	</view>
</template>
<script>
	import {
		mapGetters,
		mapState,
		mapMutations
	} from "vuex";
	import addTips from "@/components/add-tips";
	import tuiFooter from "@/components/tui/footer";
	import tuiIcon from "@/components/tui/icon"
	import tuiButton from "@/components/tui/button"
	import tuiListCell from "@/components/tui/list-cell"
	import tuiDropdownList from "@/components/tui/dropdown-list"

	// 在页面中定义激励视频广告
	let videoAd = null;
	// 在页面中定义插屏广告
	let interstitialAd = null

	export default {
		components: {
			tuiFooter,
			tuiButton,
			tuiListCell,
			tuiDropdownList,
			tuiIcon,
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
				wishText: '武汉加油',
				dropdownlistData: [{
						name: "武汉加油",
						color: "#000",
						icon: "attestation",
						size: 20
					}, {
						name: "中国加油",
						color: "#000",
						icon: "attestation",
						size: 20
					}, {
						name: "加油2020",
						color: "#000",
						icon: "attestation",
						size: 20
					}, {
						name: "奋斗2020",
						color: "#000",
						icon: "attestation",
						size: 20
					}, {
						name: "努力2020",
						color: "#000",
						icon: "attestation",
						size: 20
					}, {
						name: "不动如山",
						color: "#000",
						icon: "attestation",
						size: 20
					},
					{
						name: "拒绝聚会",
						color: "#000",
						icon: "attestation",
						size: 20
					},
					{
						name: "拒绝野味",
						color: "#000",
						icon: "attestation",
						size: 20
					}
				],
				// dropdownlistData: ['武汉加油', '中国加油', '加油2020', '不动如山', '拒绝聚会', '拒绝野味'],
				dropdownShow: false,
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
			this.windowHeight = getApp().globalData.windowHeight;
			if (!!getApp().globalData.userAvatarFilePath) {
				this.avatarPath = getApp().globalData.userAvatarFilePath;
			}

			this.ctx = uni.createCanvasContext('cans-id-happines', this);
			this.paint();

			const db = wx.cloud.database({
				env: getApp().globalData.envId,
				traceUser: true
			});

			let _this = this;
			db.collection(getApp().globalData.collectionName).doc(getApp().globalData.docId).get().then(res => {
				// res.data 包含该记录的数据
				_this.enableRewardedVideoAd = res.data.enableRewardedVideoAd;
				_this.enableInterstitialAd = res.data.enableInterstitialAd;
				getApp().globalData.enableSecurityCheck = res.data.enableSecurityCheck;
			})

			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-42a76755483ec613'
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
				if (interstitialAd) {
					interstitialAd.show()
						.then(() => {
							this.interstitialAdAlreadyShow = true;
						})
						.catch((err) => {
							console.error(err)
						})
				}
			}
		},
		onHide() {},
		onShareAppMessage() {
			return {
				title: '武汉加油，中国加油！',
				desc: '武汉加油，中国加油，加油2020，不动如山，拒绝聚会，拒绝野味。',
				// imageUrl: '/static/image/redirect-cover.jpg',
				path: '/pages/index/index',
				success: function(res) {
					console.log(res);
				}
			}
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
			dropDownList(index) {
				if (index !== -1) {
					this.wishText = this.dropdownlistData[index].name;
					this.paint();
				}
				this.dropdownShow = !this.dropdownShow
			},
			paint(avatarFilePath, happinessFilePath) {
				if (!avatarFilePath) {
					avatarFilePath = this.avatarPath;
				}
				if (!happinessFilePath) {
					happinessFilePath = this.happinessPath;
				}
				this.drawCansBgImg(avatarFilePath);
				this.drawTextBg();
				// this.drawHappiness(happinessFilePath);
				this.drawDefaultText();
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
			drawTextBg() {
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
					sLeft: 0.05,
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
				this.ctx.rect(0, 190, 270, 80);
				this.ctx.setFillStyle('#d81e06');
				this.ctx.fill();
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

	.isCan {
		border: 6px solid white;
		border-radius: 10px;
		width: 270px;
		height: 270px;
		margin-top: 150rpx;
		margin-left: auto;
		margin-right: auto;
		background-size: 100%;
		z-index: 800;
	}

	@media (min-width: 320px) {

		/* 仅在 320px 或更宽的屏幕上生效的样式规则 */
		.action-wrapper {
			padding-top: 50rpx;
			padding-left: 100rpx;
			padding-right: 100rpx;
			font-weight: 800;
		}

	}

	.action-wrapper {
		padding-top: 50rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

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

	.scrollView {
		width: 100%;
		position: absolute;
		bottom: 5px;
		white-space: nowrap;
	}

	.imgList {
		height: 35px;
		width: 65px;
		border: 2px solid white;
		border-radius: 5px;
		margin: 10px 10px 10px 10px;
		background-color: white;
	}

	.slogan-bg {
		background-color: red;
		border-radius: 25px;
		height: 25px;
		width: 55px;
		color: white;
		margin: auto;

	}

	.tui-dropdown-list {
		width: 140px !important;
	}

	.tui-drop-input-box {
		padding: 50upx 50upx 0upx 50upx;
		box-sizing: border-box;
	}

	.tui-animation {
		display: inline-block;
		transform: rotate(0deg);
		transition: all 0.2s;
	}

	.tui-animation-show {
		transform: rotate(180deg);
	}

	.tui-selected-list {
		width: 140px;
		background: #fff;
		border-radius: 20upx;
		overflow: hidden;
		transform: translateZ(0);
	}

	.tui-dropdown-scroll {
		height: 400upx;
	}

	.tui-btn-block {
		height: 60rpx !important;
		line-height: 60rpx !important;
		font-size: 32rpx !important;

	}
</style>
