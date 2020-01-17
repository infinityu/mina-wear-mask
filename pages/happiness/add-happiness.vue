<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<cover-view class="happiness-option-wrapper animation-slide-left animation-speed-2">
			<cover-view class="padding">
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="0">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h0.png"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="1">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h1.png"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="2">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h2.png"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="3">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h3.png"></cover-image>
				</cover-view>
				<cover-view class="grid col-4 grid-square margin-top-sm" @click="changeHappiness" data-target="4">
					<cover-image class="happiness-option" mode="aspectFill" src="/static/image/h4.png"></cover-image>
				</cover-view>
			</cover-view>
		</cover-view>
		<view @click="nextHappiness">
			<canvas canvas-id="cans-id-happines" style="width:270px; height:270px;" class="isCan"></canvas>
		</view>
		<view class="grid justify-around action-wrapper">
			<view class="grid col-1">
				<button class="cu-btn round action-btn shadow animation-scale-down animation-delay-1 animation-speed-2" open-type="getUserInfo" @getuserinfo="getUserInfoCallBack">我的头像</button>
			</view>
			<view class="grid col-2">
				<button class="cu-btn round action-btn shadow animation-slide-top animation-delay-2" @click="saveCans">
					<text class="cuIcon-down"></text>保存</button>
			</view>
			<view class="grid col-3">
				<button class="cu-btn round action-btn shadow animation-scale-down animation-delay-1 animation-speed-2" @click="chooseImage">选择图片</button>
			</view>
		</view>
		<view class="grid justify-around share-wrapper">
			<view class="grid col-1 animation-shake animation-speed-2 animation-delay-3">
				<!-- <button class="cu-btn block shaline-orange lg" open-type="share"> -->
				<button class="cu-btn round action-btn shadow" open-type="share">
					推荐给朋友<text class="cuIcon-forward"></text></button>
			</view>
			<view class="grid col- 2 animation-shake animation-speed-2 animation-delay-3">
				<!-- <button class="cu-btn block shaline-orange lg" open-type="share"> -->
				<button class="cu-btn round action-btn shadow" @click="toSharePage" data-target="image">
					分享朋友圈<text class="cuIcon-forward"></text></button>
			</view>
			
		</view>
		<!-- <view @click="showModal" data-target="Modal"> -->
		<view>
			<tui-footer :fixed="true" :copyright="copyright"></tui-footer>
		</view>
		<view class="cu-modal" :class="modalName=='image'?'show':''">
			<view class="cu-dialog">
				<view class="bg-img" style="background-image: url('/static/image/minicode.jpg');height:200px;">
					<view class="cu-bar justify-end text-white">
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close "></text>
						</view>
					</view>
				</view>
				<view class="cu-bar bg-white">
					<view class="action margin-0 flex-sub  solid-left" @tap="hideModal">我知道了</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">微信搜索《人文之窗》</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					中外名曲，经典老歌，电影故事，夜读美文，戏剧唱段，名家书画，摄影佳作。
				</view>
				<view class="padding">
					人文之窗综艺微刊，每晚与您不见不散。
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">我知道了</button>
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
				modalName: null
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
		onLoad() {
			this.ctx = uni.createCanvasContext('cans-id-happines', this);
			this.paint();
		},
		onShow() {
			console.log("onshow");
			let defaultAvatarIndex = Math.round(Math.random());
			console.log(defaultAvatarIndex);
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
		},
		onShareAppMessage() {
			return {
				title: ' 头像加福贺新春',
				desc: '为头像添加一个福字儿',
				path: '/pages/happiness/add-happiness',
				success: function(res) {
					console.log(res);
				}
			}
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
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
						console.log('success');
					}
				});
			},
			drawCansBgImg(imageFilePath) {
				this.ctx.drawImage(imageFilePath, 0, 0, this.cansWidth, this.cansHeight);
				this.ctx.draw(false);
			},
			drawCornerBg() {
				this._drawCircleWithBoarder(this.cornerBgBoarderColor, this.cornerBgColor, this.cornerX, this.cornerY, this.r, this.boarderWidth);
			},
			drawHappiness(happinessFilePath) {
				this.ctx.drawImage(happinessFilePath, this.cornerX + 5, this.cornerY + 7, this.cansWidth * 0.25, this.cansHeight * 0.25);
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
						console.log('success');
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
					},
					fail: function(e) {
						console.log(e);
						uni.hideLoading();
						uni.showModal({
							title: '图片加载超时',
							content: '请检查网络，点击确定重新加载',
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

						wx.getFileSystemManager().readFile({
							filePath: tempImagePath, //这里做示例，所以就选取第一张图片
							success: buffer => {
								console.log(buffer.data);
								uni.showLoading({
									title: '添福中...'
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
											// uni.showToast({
											//     title: '图片含有违法违规内容'
											// });
											uni.showModal({
												title: '请勿使用违法违规内容',
												content: '图片含有违法违规内容',
												showCancel: false,
												confirmText: '知道了',
											});
											console.log("bad")
										} else {
											console.log("good")
											//图片正常
											self.avatarPath = tempImagePath;
											self.paint();
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
				});
			},
			changeHappiness(e) {
				this.happinessIndex = parseInt(e.currentTarget.dataset.target, 10);
				this.happinessPath = this.happinessPathList[this.happinessIndex];
				this.paint();
			},
			nextHappiness() {
				this.happinessIndex = (this.happinessIndex + 1) % 5;
				this.happinessPath = this.happinessPathList[this.happinessIndex];
				this.paint();
			},
			/**
			 * 保存
			 */
			saveCans() {
				console.log('保存...')
				uni.showLoading({
					title: '保存ing...',
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
										console.log('success');
									}
								});
								// uni.switchTab({
								// 	url: '/pages/happiness/introduction'
								// });
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
			toSharePage: function(){
				uni.navigateTo({
				    url: '/pages/share/share'
				});
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
	.isCan{
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
	  	padding-top: 100rpx;
	  	padding-left: 100rpx;
	  	padding-right: 100rpx;
	  	font-weight: 800;
	  }
	  
	  .action-btn {
	  	background-color: #FFC700;
	  	color: white;
	  }
	}

	.action-wrapper {
		padding-top: 100rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.action-btn {
		background-color: #FFC700;
		color: white;
	}
	
	.share-wrapper {
		padding-top: 50rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}

	.happiness-option-wrapper {
		position: absolute;
		z-index: 2000;
		width: 200rpx;
		margin-top: 25px;
	}

	.happiness-option {
		width: 60px;
		height: 60px;
	}
</style>
