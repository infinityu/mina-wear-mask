<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<!-- <image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" :src="pageBg"></image> -->
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		
		<view>
			<canvas canvas-id="cans-id-happines" style="width:270px; height:270px; margin-top: 75px" class="isCan"></canvas>
		</view>
		<view class="solid-bottom grid justify-around actions">
			<view class="grid col-1">
				<button class="cu-btn round bg-yellow shadow" open-type="getUserInfo" @getuserinfo="getUserInfoCallBack">获取头像</button>
			</view>
			<view class="grid col-2">
				<button class="cu-btn round bg-yellow shadow btnLeft" @click="chooseImage">选择图片</button>
			</view>
			<view class="grid col-3">
				<button class="cu-btn round bg-yellow shadow btnLeft" @click="saveCans">保存</button>
			</view>
			<view class="grid col-1" style="margin-top: 50rpx">
				<button class="cu-btn block line-orange lg" open-type="share">
					<text class="cuIcon-upload"></text>推荐给朋友</button>
			</view>
		</view>
		<!-- <view @click="showModal" data-target="Modal"> -->
		<view>
			<tui-footer :fixed="true" :copyright="copyright"></tui-footer>
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
	import { mapGetters, mapState, mapMutations } from "vuex";
	import tuiFooter from "@/components/footer";
	export default {
		components: {
			tuiFooter
		},
		data() {
			return {
				windowHeight: 0,
				cansWidth: 270, // 宽度 px
				cansHeight: 270 ,// 高度 px
				cansBgColor: "#FFD314",
				textBgBoarderColor: '#FFFFFF',
				textBgColor: '#C12928',
				wishText: '福',
				defaultAvatarList: ['/static/image/avatar-0.png', '/static/image/avatar-0.png'],
				defaultAvatarIndex: 0,
				// defaultHappinessText: '/static/image/happiness_text.png',
				copyright: " Copyright © 2016-2020 人文之窗公众号",
				modalName: null
			}
		},
		computed: {
			...mapGetters(["pageBg", "defaultAvatarUrl"]),
			...mapState({userInfo:'userInfo'}),
			defaultAvatarPath: function() {
				return this.defaultAvatarList[this.defaultAvatarIndex];
			}
		},
		created() {
		},
		onLoad() {
			this.ctx = uni.createCanvasContext('cans-id-happines', this);
			// this.drawCansBgColor(this.cansBgColor);
			this.drawCansBgImg(this.defaultAvatarPath);
			this.drawDefaultTextBg();
			this.drawDefaultText();

		},
		onReady() {
		},
		onShow() {
			console.log("onshow");
			this.defaultAvatarIndex = Math.round(Math.random());
			console.log(this.defaultAvatarIndex);
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
			// this.refresh();
		},
		onShareAppMessage() {
			return {
				title: '送你一个福字儿',
				desc: '为头像添加一个福字儿',
				path: '/pages/happiness/add-happiness',
				success: function(res){
					console.log(res);
				}
			}
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
			loadFont(){
				let self = this;
				uni.loadFontFace({
				  family: 'edu-lishu',
				  source: 'url("https://mina-img-store-1258554429.cos.ap-shanghai.myqcloud.com/new-year-wish/I.Ngaan-subfont.ttf")',
				  success() {
						console.log('loadFontFace success')
						self.drawDefaultTextBg();
						self.drawDefaultText();
						if(self.userInfo!= null && self.userInfo.avatarUrl != null) {
							console.log("++this.userInfo.avatarUrl", self.userInfo.avatarUrl);
							uni.downloadFile({
								url: self.userInfo.avatarUrl,
								success: function(res) {
									self.ctx.drawImage(res.tempFilePath,0,0, self.cansWidth, self.cansHeight);
								}
							})
						}
						
				  }
				});	
			},
			refresh(){
				this.drawCansBgImg(this.defaultAvatarPath);
				this.drawDefaultTextBg();
				this.drawDefaultText();
			},
			drawCansBgColor(bgColor) {
				this.ctx.rect(0, 0, this.cansWidth, this.cansHeight)
				this.ctx.setFillStyle(bgColor)
				this.ctx.fill()
				this.ctx.draw(true)
			},
			drawCansBgImg(imageFilePath) {
				this.ctx.drawImage(imageFilePath, 0, 0, this.cansWidth, this.cansHeight);
				this.ctx.draw(true);
			},
			/**
			 *  绘制圆形边框
			 * @param {Object} sColor  线条色
			 * @param {Object} fColor
			 * @param {Object} x  相对比例坐标
			 * @param {Object} y
			 * @param {Object} r
			 */
			_drawCircleWithBoarder(sColor, fColor, x, y, r, boarderWidth){
				this.ctx.save();
				var cx = x + r;
				var cy = y + r;
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
			drawDefaultTextBg() {
				let x = Math.ceil(this.cansWidth * 0.7);
				let y = Math.ceil(this.cansHeight * 0.7);
				let r = 40;
				let boarderWidth = 15;
				this._drawCircleWithBoarder(this.textBgBoarderColor, this.textBgColor, x, y, r, boarderWidth);
			},
			circleImg(img, x, y, r) {
				uni.getImageInfo({
					src: img
				}).then((image) => {
					console.log(image[1].path)
					x = Math.ceil(this.cansWidth * x)
					y = Math.ceil(this.cansHeight * y)
					this.ctx.save();
					var d = 2 * r;
					var cx = x + r;
					var cy = y + r;
					this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
					this.ctx.clip();
					this.ctx.drawImage(image[1].path, x, y, d, d);
					this.ctx.restore();
					this.ctx.draw(true);
				})
			},
			drawPara(item) {
				var redIndexObj = {}
				if (item.redWord.length > 0) {
					for (var i = 0; i < item.redWord.length; i++) {
						let startIndex = 0,
							index;
						while ((index = item.para.indexOf(item.redWord[i], startIndex)) > -1) {
							redIndexObj[index] = true;
							for (var j = 0; j < item.redWord[i].length; j++) {
								redIndexObj[index + j] = true
							}
							startIndex = index + 1;
						}
					}
				}
				this.ctx.font = `normal normal ${item.fontSize}px sans-serif`;
				this.ctx.setFillStyle(item.color)
				var isLeft
				if (item.sLeft == 'center') {
					isLeft = this.cansWidth * (.5 - item.sMaxWidth / 2) - item.fontSize
				} else {
					isLeft = item.sLeft * this.cansWidth
				}
				var maxWidth = Math.floor(this.cansWidth * item.sMaxWidth)
				var tempList = item.para.split('')
				var nowText = '',
					isCol = 0,
					textWidth = 0
				for (var i = 0; i < tempList.length; i++) {
					if (i > 0) {
						nowText += tempList[i - 1]
					} else {
						nowText += tempList[0]
					}
					textWidth = this.ctx.measureText(nowText).width
					if (textWidth > maxWidth) {
						isCol++
						nowText = '占'
						textWidth = this.ctx.measureText(nowText).width
					}
					if (redIndexObj[i]) {
						this.ctx.save()
						if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
						this.ctx.setFillStyle(item.redColor)
					}
					this.ctx.fillText(tempList[i], isLeft + textWidth, item.sTop * this.cansHeight + item.titleHeight * isCol)
					this.ctx.restore()
				}
				this.ctx.draw(true)
			},
			drawBg(item) {
				if (item.sLeft == 'center') {
					this.ctx.drawImage(item.url, this.cansWidth * (.5 - item.sWidth / 2), this.cansHeight * item.sTop, this.cansWidth *
						item.sWidth, this.cansHeight * item.sHeight);
				} else {
					this.ctx.drawImage(item.url, this.cansWidth * item.sLeft, this.cansHeight * item.sTop, this.cansWidth * item.sWidth,
						this.cansHeight * item.sHeight);
				}
				this.ctx.draw(true);
			},
			drawText(item) {
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
			drawDefaultText(){
				let textOption = {
					text: this.wishText,
					sLeft: 0.73,
					sTop: 0.93,
					fontSize: 60,
					color: 'white',
					bold: true,
					lineHeight: 12
				};
				this.drawText(textOption);
				uni.vibrateShort({
					success: function() {
						console.log('success');
					}
				});
			},
			downloadImageAndDrawWithText(imageUrl){
				uni.showLoading({
				    title: '加载中...'
				});
				let self = this;
				uni.downloadFile({
					url: imageUrl,
					success: function(res) {
						uni.hideLoading();
						self.drawCansBgImg(res.tempFilePath);
						self.drawDefaultTextBg();
						self.drawDefaultText();
					},
					fail: function(e){
						console.log(e);
						uni.hideLoading();
						uni.showModal({
							title: '图片加载超时',
							content: '请检查网络，点击确定重新加载',
							success(res) {
								if (res.confirm) {
									self.downloadImageAndDrawWithText(imageUrl);
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
				this.downloadImageAndDrawWithText(userInfo.avatarUrl);
				this.saveLoginUserInfo(userInfo);
			},
			/**
			 *  选择图片
			 */
			chooseImage(){
				let self = this;
				uni.chooseImage({
				    count: 1, // 默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'],
				    success: function (res) {
						console.log(res);
						self.drawCansBgImg(res.tempFilePaths[0]);
						self.drawDefaultTextBg();
						self.drawDefaultText();
						// self.downloadImageAndDrawWithText(res.tempFilePaths[0]);
				    }
				});
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
								uni.switchTab({
									url: '/pages/happiness/introduction'
								});
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
			showModal: function(e){
				console.log(e.currentTarget.dataset);
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
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
		position: fixed;
		left: 0;
		// z-index: 999;
		width: 270px;
		height: 270px;
		right: 0;
		top: 50upx;
		bottom: 130upx;
		margin: 0 auto;
		background-size: 100%;
	}
	.actions{
		position: absolute;
		top: 440px;
		padding-left: 100rpx;
		padding-right: 100rpx;
		font-weight: 800;
	}
</style>