<template>
	<view class="container">
		<view class="page-body uni-content-info" :style="{height:windowHeight+'px'}">
			<view class="grid justify-center padding">
				<text class="text-white">请拖动红框选择所要截取的区域</text>
			</view>
			<view class='cropper-content'>
				<view v-if="isShowImg" class="uni-corpper" :style="'width:'+cropperInitW+'px;height:'+cropperInitH+'px;background:#000'">
					<view class="uni-corpper-content" :style="'width:'+cropperW+'px;height:'+cropperH+'px;'">
						<image :src="imageSrc" :style="'width:'+cropperW+'px;height:'+cropperH+'px'"></image>
						<view class="uni-corpper-crop-box" @touchstart.stop="contentStartMove" @touchmove.stop="contentMoveing"
						 @touchend.stop="contentTouchEnd" :style="'left:'+cutL+'px;top:'+cutT+'px; width:'+ cropBoxW +'px; height: '+ cropBoxW +'px'">
							<view class="uni-cropper-view-box">
								<view class="uni-cropper-dashed-h"></view>
								<view class="uni-cropper-dashed-v"></view>
								<!-- <view class="uni-cropper-line-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<!-- <view class="uni-cropper-line-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<!-- <view class="uni-cropper-line-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<!-- <view class="uni-cropper-line-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<!-- <view class="uni-cropper-point point-t" data-drag="top" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<view class="uni-cropper-point point-tr" data-drag="topTight"></view>
								<!-- <view class="uni-cropper-point point-r" data-drag="right" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<!-- <view class="uni-cropper-point point-rb" data-drag="rightBottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<!-- <view class="uni-cropper-point point-b" data-drag="bottom" @touchstart.stop="dragStart" @touchmove.stop="dragMove" @touchend.stop="dragEnd"></view> -->
								<!-- <view class="uni-cropper-point point-bl" data-drag="bottomLeft"></view> -->
								<!-- <view class="uni-cropper-point point-l" data-drag="left" @touchstart.stop="dragStart" @touchmove.stop="dragMove"></view> -->
								<view class="uni-cropper-point point-lt" data-drag="leftTop"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- <view class='cropper-config'> -->
			<view class="grid justify-between cropper-config" >
				<button class="action-btn lg" @click="cancel" style='margin-top: 30upx;'> 取消 </button>
				<button class="action-btn lg" @click="chooseImage" style='margin-top: 30upx;'> 选择图片 </button>
				<button class="action-btn lg" @click="cropImage" style='margin-top: 30upx;'> 确定 </button>
			</view>
			<canvas canvas-id="myCanvas" :style="'position:absolute;border: 1px solid red; width:'+imageW+'px;height:'+imageH+'px;top:-9999px;left:-9999px;'"></canvas>
		</view>
		<page-foot :name="name"></page-foot>
	</view>
</template>

<script>
	let sysInfo = uni.getSystemInfoSync();
	let SCREEN_WIDTH = sysInfo.screenWidth;
	let paddingPreSet = 80;// container padding-top + action-config height
	let SCREEN_HEIGHT = sysInfo.screenHeight - paddingPreSet;
	console.log('SCREEN_HEIGHT', SCREEN_HEIGHT);
	let SCREEN_RATIO = SCREEN_WIDTH.toFixed(3) / SCREEN_HEIGHT.toFixed(3);
	console.log('SCREEN_RATIO', SCREEN_RATIO);
	let PAGE_X, // 手按下的x位置
		PAGE_Y, // 手按下y的位置 
		PR = sysInfo.pixelRatio, // dpi
		T_PAGE_X, // 手移动的时候x的位置
		T_PAGE_Y, // 手移动的时候Y的位置
		CUT_L, // 初始化拖拽元素的left值
		CUT_T, // 初始化拖拽元素的top值
		CUT_R, // 初始化拖拽元素的right
		CUT_B, // 初始化拖拽元素的bottom
		CUT_W, // 初始化拖拽元素的宽度
		CUT_H, // 初始化拖拽元素的高度
		IMG_RATIO, // 图片比例
		IMG_REAL_W, // 图片实际的宽度
		IMG_REAL_H, // 图片实际的高度
		DRAFG_MOVE_RATIO = 1, //移动时候的比例,
		INIT_DRAG_POSITION = 100, // 初始化屏幕宽度和裁剪区域的宽度之差，用于设置初始化裁剪的宽度
		DRAW_IMAGE_W = sysInfo.screenWidth // 设置生成的图片宽度
	export default {
		/**
		 * 页面的初始数据
		 */
		data() {
			return {
				windowHeight: 0,
				name: '薛大宝',
				imageSrc: 'https://img-cdn-qiniu.dcloud.net.cn/demo_crop.jpg',
				isShowImg: false,
				// 初始化的宽高
				cropperInitW: SCREEN_WIDTH,
				cropperInitH: SCREEN_WIDTH,
				// 动态的宽高
				cropperW: SCREEN_WIDTH,
				cropperH: SCREEN_WIDTH,
				// 动态的left top值
				cropperL: 0,
				cropperT: 0,
				transL: 0,
				transT: 0,
				// 图片缩放值
				scaleP: 0,
				imageW: 0,
				imageH: 0,
				// 裁剪框 宽高
				cropBoxW:SCREEN_WIDTH,
				// cropBoxH:SCREEN_WIDTH,
				cutL: 0,
				cutT: 0,
				cutB: SCREEN_WIDTH,
				cutR: '100%',
				qualityWidth: DRAW_IMAGE_W,
				innerAspectRadio: DRAFG_MOVE_RATIO
			}
		},
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad: function(option) {
			console.log('onLoad');
			// this.getImage(); //这里定义为从前页面跳转过来，所以默认打开相册选择
			console.log('option.tempFilePath', option.tempFilePath);
			// this.imageCheck(option.tempFilePath, this.getImageFromFront);
			this.getImageFromFront(option.tempFilePath);
		},
		/**
		 * 生命周期函数--监听页面初次渲染完成
		 */
		onReady: function() {
			// this.loadImage();
		},
		onShow: function() {
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
		},
		methods: {
			setData: function(obj) {
				let that = this;
				Object.keys(obj).forEach(function(key) {
					that.$set(that.$data, key, obj[key])
				});
			},
			getImageFromFront: function(tempFilePath) {
				var _this = this
				uni.getImageInfo({
					src: tempFilePath,
					success: function(image) {
						_this._adjustParameters(image, _this);
					}
				});
				// _this.imageCheck(tempFilePath, _this.loadAndShowImage)
				_this.loadAndShowImage(tempFilePath);
			},
			cancel: function(){
				uni.navigateBack({
				  delta: 1
				})
			},
			chooseImage: function() {
				var _this = this
				uni.chooseImage({
					success: function(res) {
						uni.getImageInfo({
							src: res.tempFilePaths[0],
							success: function(image) {
								_this._adjustParameters(image, _this);
							}
						});
						
						_this.imageCheck(res.tempFilePaths[0], _this.loadAndShowImage)
					},
				})
			},
			loadAndShowImage(imagePath){
				this.setData({
					imageSrc: imagePath,
				})
				this.loadImage(imagePath);
			},
			_adjustParameters: function(image, _this){
				let width = image.width;
				let height = image.height;
				if (width < height) { // 等比缩放
					_this.cropperW = SCREEN_WIDTH;
					_this.cropperH = height.toFixed(3) / width.toFixed(3) * SCREEN_WIDTH;
				} else {
					_this.cropperH = SCREEN_WIDTH;
					_this.cropperW = width.toFixed(3) / height.toFixed(3) * SCREEN_WIDTH;
				}
				// 如果比例不合适，缩放后超出了可视区域，则进行进一步缩小，同时缩小剪裁口径
				if (_this.cropperH > SCREEN_WIDTH) {
					_this.cropperH = SCREEN_WIDTH;
					_this.cropperW = width.toFixed(3) / height.toFixed(3) * SCREEN_WIDTH;
					_this.cropBoxW = _this.cropperW;
					
					_this.cropperInitW = _this.cropperW;
					_this.cropperInitH = _this.cropperH;
				} else if (_this.cropperW > SCREEN_WIDTH) {
					_this.cropperW = SCREEN_WIDTH;
					_this.cropperH = height.toFixed(3) / width.toFixed(3) * SCREEN_WIDTH;
					_this.cropBoxW = _this.cropperH;
					
					_this.cropperInitW = _this.cropperW;
					_this.cropperInitH = _this.cropperH;
				}
				
				console.log(image.width);
				console.log(image.height);
			},
			loadImage: function(imagePath) {
				var _this = this
				uni.showLoading({
					title: '加载中...',
				})
				uni.getImageInfo({
					src: imagePath,
					success: function success(res) {
						IMG_RATIO = res.width / res.height
						console.log('IMG_RATIO', IMG_RATIO);
						// if(IMG_RATIO < 1) { //  竖图形式下，用高作为显示框范围
						// console.log('竖图参数调整中');
						// 	if(IMG_RATIO > SCREEN_RATIO){
						// 		console.log('图片更宽');
						// 		_this.cropperInitW = _this.cropperInitW.toFixed(3) / IMG_RATIO;
						// 		_this.cropBoxH = SCREEN_WIDTH;
						// 		SCREEN_WIDTH = SCREEN_HEIGHT;
						// 	} else{
						// 		console.log('图片没有可视区域宽');
						// 		_this.cropperInitH = SCREEN_HEIGHT;
						// 		_this.cropBoxW = _this.cropperInitH * IMG_RATIO;
						// 		SCREEN_WIDTH = SCREEN_HEIGHT;
						// 	}
						// }
						if (IMG_RATIO >= 1) {
							IMG_REAL_W = SCREEN_WIDTH
							IMG_REAL_H = SCREEN_WIDTH / IMG_RATIO
						} else {
							IMG_REAL_W = SCREEN_WIDTH * IMG_RATIO
							IMG_REAL_H = SCREEN_WIDTH
						}
						let minRange = IMG_REAL_W > IMG_REAL_H ? IMG_REAL_W : IMG_REAL_H
						INIT_DRAG_POSITION = minRange > INIT_DRAG_POSITION ? INIT_DRAG_POSITION : minRange
						// 根据图片的宽高显示不同的效果   保证图片可以正常显示
						if (IMG_RATIO >= 1) {
							// let cutT = Math.ceil((SCREEN_WIDTH / IMG_RATIO - (SCREEN_WIDTH / IMG_RATIO - INIT_DRAG_POSITION)) / 2);
							let cutT = 0;
							let cutB = cutT;
							// let cutL = Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH + INIT_DRAG_POSITION) / 2);
							let cutL = Math.ceil((SCREEN_WIDTH - _this.cropBoxW) / 2);
							let cutR = cutL;
							_this.setData({
								cropperW: SCREEN_WIDTH,
								cropperH: SCREEN_WIDTH / IMG_RATIO,
								// 初始化left right
								cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
								cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH / IMG_RATIO) / 2),
								cutL: cutL,
								cutT: cutT,
								cutR: cutR,
								cutB: cutB,
								// 图片缩放值
								imageW: IMG_REAL_W,
								imageH: IMG_REAL_H,
								scaleP: IMG_REAL_W / SCREEN_WIDTH,
								qualityWidth: DRAW_IMAGE_W,
								innerAspectRadio: IMG_RATIO
							})
						} else {
							let cutL = Math.ceil((SCREEN_WIDTH * IMG_RATIO - (SCREEN_WIDTH * IMG_RATIO)) / 2);
							let cutR = cutL;
							let cutT = Math.ceil((SCREEN_WIDTH - _this.cropBoxW) / 2);
							let cutB = cutT;
							_this.setData({
								cropperW: SCREEN_WIDTH * IMG_RATIO,
								cropperH: SCREEN_WIDTH,
								// 初始化left right
								cropperL: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH * IMG_RATIO) / 2),
								cropperT: Math.ceil((SCREEN_WIDTH - SCREEN_WIDTH) / 2),
								cutL: cutL,
								cutT: cutT,
								cutR: cutR,
								cutB: cutB,
								// 图片缩放值
								imageW: IMG_REAL_W,
								imageH: IMG_REAL_H,
								scaleP: IMG_REAL_W / SCREEN_WIDTH,
								qualityWidth: DRAW_IMAGE_W,
								innerAspectRadio: IMG_RATIO
							})
						}
						_this.setData({
							isShowImg: true
						})
						uni.hideLoading()
					}
				})
			},
			// 拖动时候触发的touchStart事件
			contentStartMove(e) {
				console.log("contentStartMove");
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			// 拖动时候触发的touchMove事件
			contentMoveing(e) {
				console.log("contentMoveing");
				var _this = this
				var dragLengthX = (PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
				var dragLengthY = (PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
				// 左移
				if (dragLengthX > 0) {
					if (this.cutL - dragLengthX < 0) dragLengthX = this.cutL
				} else {
					if (this.cutR + dragLengthX < 0) dragLengthX = -this.cutR
				}
				if (dragLengthY > 0) {
					if (this.cutT - dragLengthY < 0) dragLengthY = this.cutT
				} else {
					if (this.cutB + dragLengthY < 0) dragLengthY = -this.cutB
				}
				this.setData({
					cutL: this.cutL - dragLengthX,
					cutT: this.cutT - dragLengthY,
					cutR: this.cutR + dragLengthX,
					cutB: this.cutB + dragLengthY
				})
				PAGE_X = e.touches[0].pageX
				PAGE_Y = e.touches[0].pageY
			},
			contentTouchEnd() {
				console.log("contentTouchEnd");
			},
			// 获取图片
			cropImage() {
				var _this = this;
				uni.showLoading({
					title: '图片生成中...',
				});
				// 将图片写入画布
				const ctx = uni.createCanvasContext('myCanvas');
				ctx.drawImage(_this.imageSrc, 0, 0, IMG_REAL_W, IMG_REAL_H);
				ctx.draw(true, () => {
					// 获取画布要裁剪的位置和宽度   均为百分比 * 画布中图片的宽度    保证了在微信小程序中裁剪的图片模糊  位置不对的问题 canvasT = (_this.cutT / _this.cropperH) * (_this.imageH / pixelRatio)
					var canvasW = ((_this.cropperW - _this.cutL - _this.cutR) / _this.cropperW) * IMG_REAL_W;
					var canvasH = ((_this.cropperH - _this.cutT - _this.cutB) / _this.cropperH) * IMG_REAL_H;
					if(IMG_RATIO > 1){
						canvasW = canvasH;
					} else{
						canvasH = canvasW;
					}
					var canvasL = (_this.cutL / _this.cropperW) * IMG_REAL_W;
					var canvasT = (_this.cutT / _this.cropperH) * IMG_REAL_H;
					console.log("IMG_REAL_H", IMG_REAL_H);
					uni.canvasToTempFilePath({
						x: canvasL,
						y: canvasT,
						width: canvasW,
						height: canvasH,
						destWidth: canvasW*3,
						destHeight: canvasH*3,
						quality: 0.5,
						canvasId: 'myCanvas',
						success: function(res) {
							uni.hideLoading();
							getApp().globalData.cropImageFilePath = res.tempFilePath;
							getApp().globalData.rapaintAfterCrop = true;
							uni.navigateBack({
							  delta: 1
							})
							// 成功获得地址的地方
							// uni.previewImage({
							// 	current: '', // 当前显示图片的http链接
							// 	urls: [res.tempFilePath] // 需要预览的图片http链接列表
							// })
						}
					});
				});
			},
			// 设置大小的时候触发的touchStart事件
			dragStart(e) {
				T_PAGE_X = e.touches[0].pageX
				T_PAGE_Y = e.touches[0].pageY
				CUT_L = this.cutL
				CUT_R = this.cutR
				CUT_B = this.cutB
				CUT_T = this.cutT
			},
			// 设置大小的时候触发的touchMove事件
			dragMove(e) {
				var _this = this
				var dragType = e.target.dataset.drag
				switch (dragType) {
					case 'right':
						var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_R + dragLength < 0) dragLength = -CUT_R
						this.setData({
							cutR: CUT_R + dragLength
						})
						break;
					case 'left':
						var dragLength = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						if (CUT_L - dragLength < 0) dragLength = CUT_L
						if ((CUT_L - dragLength) > (this.cropperW - this.cutR)) dragLength = CUT_L - (this.cropperW - this.cutR)
						this.setData({
							cutL: CUT_L - dragLength
						})
						break;
					case 'top':
						var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_T - dragLength < 0) dragLength = CUT_T
						if ((CUT_T - dragLength) > (this.cropperH - this.cutB)) dragLength = CUT_T - (this.cropperH - this.cutB)
						this.setData({
							cutT: CUT_T - dragLength
						})
						break;
					case 'bottom':
						var dragLength = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_B + dragLength < 0) dragLength = -CUT_B
						this.setData({
							cutB: CUT_B + dragLength
						})
						break;
					case 'rightBottom':
						var dragLengthX = (T_PAGE_X - e.touches[0].pageX) * DRAFG_MOVE_RATIO
						var dragLengthY = (T_PAGE_Y - e.touches[0].pageY) * DRAFG_MOVE_RATIO
						if (CUT_B + dragLengthY < 0) dragLengthY = -CUT_B
						if (CUT_R + dragLengthX < 0) dragLengthX = -CUT_R
						let cutB = CUT_B + dragLengthY;
						let cutR = CUT_R + dragLengthX;
						this.setData({
							cutB: cutB,
							cutR: cutR
						})
						break;
					default:
						break;
				}
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
						console.log('tempFilePath size', res.size);
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

<style>
	page{
		background-color: #000000;
	}
	
	/* pages/uni-cropper/index.wxss */
	.uni-content-info {
		/* position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: block;
		align-items: center;
		flex-direction: column; */
	}

	.cropper-config {
		padding: 20upx 0upx;
		position: fixed;
		bottom:  100rpx;
		width: 750upx;
		heigh: 80px;
	}

	.cropper-content {
		/* min-height: 750upx; */
		width: 100%;
	}

	.uni-corpper {
		position: relative;
		overflow: hidden;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		box-sizing: border-box;
		margin: 0 auto;
	}

	.uni-corpper-content {
		position: relative;
		margin: 0 auto;
	}

	.uni-corpper-content image {
		display: block;
		width: 100%;
		min-width: 0 !important;
		max-width: none !important;
		height: 100%;
		min-height: 0 !important;
		max-height: none !important;
		image-orientation: 0deg !important;
		margin: 0 auto;
	}

	/* 移动图片效果 */
	.uni-cropper-drag-box {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		cursor: move;
		background: rgba(0, 0, 0, 0.6);
		z-index: 1;
	}

	/* 内部的信息 */
	.uni-corpper-crop-box {
		position: absolute;
		background: rgba(255, 255, 255, 0.3);
		z-index: 2;
	}

	.uni-corpper-crop-box .uni-cropper-view-box {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
		outline: 2px solid #C12928;
		box-shadow: 0px 0px 5px #888888;
	}

	/* 横向虚线 */
	.uni-cropper-dashed-h {
		position: absolute;
		top: 33.33333333%;
		left: 0;
		width: 100%;
		height: 33.33333333%;
		border-top: 1upx dashed rgba(255, 255, 255, 0.5);
		border-bottom: 1upx dashed rgba(255, 255, 255, 0.5);
	}

	/* 纵向虚线 */
	.uni-cropper-dashed-v {
		position: absolute;
		left: 33.33333333%;
		top: 0;
		width: 33.33333333%;
		height: 100%;
		border-left: 1upx dashed rgba(255, 255, 255, 0.5);
		border-right: 1upx dashed rgba(255, 255, 255, 0.5);
	}

	/* 四个方向的线  为了之后的拖动事件*/
	.uni-cropper-line-t {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		top: 0;
		left: 0;
		height: 1upx;
		opacity: 0.1;
		cursor: n-resize;
	}

	.uni-cropper-line-t::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0upx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41upx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-r {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		right: 0upx;
		width: 1upx;
		opacity: 0.1;
		height: 100%;
		cursor: e-resize;
	}

	.uni-cropper-line-r::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41upx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-b {
		position: absolute;
		display: block;
		width: 100%;
		background-color: #69f;
		bottom: 0;
		left: 0;
		height: 1upx;
		opacity: 0.1;
		cursor: s-resize;
	}

	.uni-cropper-line-b::before {
		content: '';
		position: absolute;
		top: 50%;
		right: 0upx;
		width: 100%;
		-webkit-transform: translate3d(0, -50%, 0);
		transform: translate3d(0, -50%, 0);
		bottom: 0;
		height: 41upx;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-line-l {
		position: absolute;
		display: block;
		background-color: #69f;
		top: 0;
		left: 0;
		width: 1upx;
		opacity: 0.1;
		height: 100%;
		cursor: w-resize;
	}

	.uni-cropper-line-l::before {
		content: '';
		position: absolute;
		top: 0;
		left: 50%;
		width: 41upx;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
		bottom: 0;
		height: 100%;
		background: transparent;
		z-index: 11;
	}

	.uni-cropper-point {
		width: 5upx;
		height: 5upx;
		background-color: #69f;
		opacity: .75;
		position: absolute;
		z-index: 3;
	}

	.point-t {
		top: -3upx;
		left: 50%;
		margin-left: -3upx;
		cursor: n-resize;
	}

	.point-tr {
		top: -3upx;
		left: 100%;
		margin-left: -3upx;
		cursor: n-resize;
	}

	.point-r {
		top: 50%;
		left: 100%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-rb {
		left: 100%;
		top: 100%;
		-webkit-transform: translate3d(-50%, -50%, 0);
		transform: translate3d(-50%, -50%, 0);
		cursor: n-resize;
		width: 36upx;
		height: 36upx;
		background-color: #69f;
		position: absolute;
		z-index: 1112;
		opacity: 1;
	}

	.point-b {
		left: 50%;
		top: 100%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-bl {
		left: 0%;
		top: 100%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-l {
		left: 0%;
		top: 50%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	.point-lt {
		left: 0%;
		top: 0%;
		margin-left: -3upx;
		margin-top: -3upx;
		cursor: n-resize;
	}

	/* 裁剪框预览内容 */
	.uni-cropper-viewer {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.uni-cropper-viewer image {
		position: absolute;
		z-index: 2;
	}
	
	.container{
		padding-top: 50px;
		background-color: black;
	}
	
	.action-btn{
		background-color: transparent;
		border-style: none;
		color: white;
	}
</style>
