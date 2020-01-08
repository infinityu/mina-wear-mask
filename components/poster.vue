<template>
	<view>
		<!-- 海报 -->
		<canvas canvas-id="wish-poster" :style="{width:cansWidth,height:cansHeight}" class="isCan"></canvas>
		<view class="bg" @click="closeCans"></view>
		<view class="fixedBox">
			<view class="boxLeft">
				<button class="flexBtn btnLeft" hover-class="btnHover" @click="saveCans">保存</button>
			</view>
			<view class="boxRight">
				<button class="flexBtn" type="primary" open-type="getUserInfo" @getuserinfo="getAvatar">获取头像</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			bgImg: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				avatarUrl: '',
				// 海报
				cansWidth: 270, //海报宽度
				cansHeight: 270 //海报高度
				// 海报
			};
		},
		computed: {
			bgImgUrl() {
				console.log('bgImg', this.bgImg);
				if (this.bgImg) {
					return this.bgImg;
				}
				return '/static/image/location.png';
			}
		},
		watch: {
			avatarUrl: function(newBgImg) {
				let self = this;
				
				uni.downloadFile({
					url: newBgImg,
					success: function(res) {
						// self.drawBg({
						// 	url: res.tempFilePath,
						// 	sLeft: 0,
						// 	sTop: 0,
						// 	sWidth: 1,
						// 	sHeight: 0.75
						// })
						self.ctx.drawImage(res.tempFilePath,0,0, self.cansWidth, self.cansHeight);
						self.wishWordBg();
						self.wishWord();
					}
				})
				
				console.log("newBgImg", newBgImg);
			},
		},
		created() {
			this.ctx = uni.createCanvasContext('wish-poster', this);
			//绘制底色为白色
			this.drawBaseBg('#FFD314');
			this.wishWordBg();
			this.wishWord();
		},
		computed: {
			today() {
				let year = new Date().getFullYear();
				let month = new Date().getMonth() + 1
				let date = new Date().getDate()
				let time = year + "年" + month + "月" + date + "日"
				return time
			}
		},
		methods: {
			drawBaseBg(bgColor) {
				this.ctx.rect(0, 0, this.cansWidth, this.cansHeight)
				this.ctx.setFillStyle(bgColor)
				this.ctx.fill()
				this.ctx.draw(true)
			},
			wishWordBg() {
				this.roundBoarder('white', '#f3a32b', .7, .7, 40);
			},
			wishWord(){
				this.drawText({
					text: '福',
					// text: '我是标题',
					sLeft: 0.77,
					sTop: 0.91,
					fontSize: 42,
					color: 'white',
					bold: true,
					lineHeight: 12
				})
			},
			roundBoarder(sColor, fColor, x, y, r){
				x = Math.ceil(this.cansWidth * x)
				y = Math.ceil(this.cansHeight * y)
				this.ctx.save();
				var d = 2 * r;
				var cx = x + r;
				var cy = y + r;
				this.ctx.arc(cx, cy, r, 0, 2 * Math.PI);
				this.ctx.setLineWidth(15);
				this.ctx.setStrokeStyle(sColor);
				this.ctx.stroke();
				this.ctx.setFillStyle(fColor);
				this.ctx.fill();
				this.ctx.restore();
				this.ctx.draw(true);
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
			closeCans() {
				this.$parent.posterShow = false
			},
			saveCans() {
				console.log('保存')
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
					canvasId: 'wish-poster',
					success: function(res) {
						uni.hideLoading()
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success: function(res) {
								uni.showToast({
									title: '保存相册成功'
								})
								console.log('save success')
							},
							fail(res) {
								console.log(res)
								if (res.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
									uni.showModal({
										title: '您需要授权相册权限',
										success(res) {
											if (res.confirm) {
												uni.openSetting({
													success(res) {

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
				if (item.bold) this.ctx.font = `normal bold ${item.fontSize}px sans-serif`;
				this.ctx.setFillStyle(item.color)
				this.ctx.setFontSize(item.fontSize)
				if (item.text instanceof Array) {
					if (!item.lineHeight) item.lineHeight = item.fontSize + 2
					console.log('我是数组', item.text)
					for (var i = 0; i < item.text.length; i++) {
						this.ctx.fillText(item.text[i], isLeft, item.sTop * this.cansHeight + item.lineHeight * i)
					}
				} else {
					console.log('我是字符串', item.text)
					this.ctx.fillText(item.text, isLeft, item.sTop * this.cansHeight)
				}
				this.ctx.draw(true)
				this.ctx.restore()
			},
			getAvatar(result) {
				console.log('mpGetUserInfo', result);
				if (result.detail.errMsg !== 'getUserInfo:ok') {
					uni.showModal({
						title: '获取用户信息失败',
						content: '错误原因' + result.detail.errMsg,
						showCancel: false
					});
					return;
				}
				this.hasUserInfo = true;
				this.userInfo = result.detail.userInfo
				this.userInfo.avatarUrl = this.userInfo.avatarUrl.replace("132", "0"); // 959 * 959
				this.avatarUrl = this.userInfo.avatarUrl;
				console.log(this.userInfo);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		// z-index: 998;
		// background-color: rgba(0, 0, 0, 0.8);
	}

	.fixedBox {
		width: 100%;
		height: 100upx;
		position: fixed;
		bottom: 30upx;
		left: 0;
		display: flex;
		// z-index: 1000;

		.boxLeft,
		.boxRight {
			width: 50%;
			height: 100%;
			display: flex;
			align-items: center;
			position: relative;
			// z-index: 1000;
			justify-content: center;

			.flexBtn {
				position: relative;
				// z-index: 1000;
				width: 200upx;
				height: 60upx;
				text-align: center;
				line-height: 55upx;
				font-size: 24upx;
				border-bottom: 6upx #f58365 solid;
				border-radius: 32upx;
				color: white;
				background: linear-gradient(to left, #f58365, #ff188a);
			}
		}
	}

	.btnHover {
		height: 55upx !important;
		border-bottom: 0 #F6BE3C solid !important;
		transform: translateY(3px) translateZ(0px) !important;
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
</style>
