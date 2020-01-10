<template>
	<view class="main">
		<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
		<view>
			<canvas canvas-id="wish-poster" style="width:270px; height:270px; margin-top: 50px" class="isCan"></canvas>
			<view class="flex solid-bottom padding justify-around actions">
				<view class="boxLeft">
					<button class="cu-btn round bg-yellow shadow btnLeft" @click="saveCans">保存</button>
				</view>
				<view class="boxRight">
					<button class="cu-btn round bg-yellow shadow" open-type="getUserInfo" @getuserinfo="getAvatar">获取头像</button>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
	import poster from '@/components/poster.vue';
	import { mapGetters, mapState, mapMutations } from "vuex";
	export default {
		components: {
			poster
		},
		data() {
			return {
				hasUserInfo: false,
				loginProvider: "weixin",
				bgImg: '',
				vatarUrl: '',
				// 海报
				cansWidth: 270, //海报宽度
				cansHeight: 270 //海报高度
			}
		},
		computed: {
			...mapGetters(["pageBg"]),
			...mapState({userInfo:'userInfo'})
		},
		created() {
			this.ctx = uni.createCanvasContext('wish-poster', this);
			//绘制底色为白色
			// this.drawBaseBg('#FFD314');
			this.drawBaseBg('#C12928');
			this.wishWordBg();
			this.wishWord();
		},
		onReady() {
			console.log("onReady");
			let self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.windowHeight = res.windowHeight;
					console.log("windowHeight", self.windowHeight);
					self.windowWidth = res.windowWidth;
					console.log("windowWidth", self.windowWidth);
				}
			});
		},
		onLoad() {
			uni.loadFontFace({
			  family: 'edu-lishu',
			  source: 'url("https://mina-img-store-1258554429.cos.ap-shanghai.myqcloud.com/new-year-wish/I.Ngaan-subfont.ttf")',
			  success() {
			      console.log('success')
					console.log("++this.userInfo.avatarUrl", this.userInfo.avatarUrl);
					if(this.userInfo.avatarUrl != null) {
						let self = this;
						uni.downloadFile({
							url: self.userInfo.avatarUrl,
							success: function(res) {
								self.ctx.drawImage(res.tempFilePath,0,0, self.cansWidth, self.cansHeight);
								self.wishWordBg();
								self.wishWord();
							}
						})
					}
			  }
			});
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
			drawBaseBg(bgColor) {
				this.ctx.rect(0, 0, this.cansWidth, this.cansHeight)
				this.ctx.setFillStyle(bgColor)
				this.ctx.fill()
				this.ctx.draw(true)
			},
			wishWordBg() {
				this.roundBoarder('white', '#C12928', .7, .7, 40);
			},
			wishWord(){
				this.drawText({
					text: '福',
					// text: '我是标题',
					sLeft: 0.73,
					sTop: 0.93,
					fontSize: 60,
					fontFamily: "KaiTi_GB2312",
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
				let userInfo = result.detail.userInfo;
				userInfo.avatarUrl = userInfo.avatarUrl.replace("132", "0"); // 959 * 959
				console.log(userInfo);
				this.saveLoginUserInfo(userInfo);
				let newBgImg = userInfo.avatarUrl;
				
				let self = this;
				uni.downloadFile({
					url: newBgImg,
					success: function(res) {
						self.ctx.drawImage(res.tempFilePath,0,0, self.cansWidth, self.cansHeight);
						self.wishWordBg();
						self.wishWord();
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.main{
		width: 750rpx;
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
		top: -200px;
		padding-left: 100rpx;
		padding-right: 100rpx;
	}
</style>