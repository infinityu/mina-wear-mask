<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: scroll">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view v-if="SHOW_TIP">
			<add-tips :statusBarHeight="statusBarHeight" />
		</view>
		<view style="height: 54px; width: 750rpx; background-color: #C12928; position: absolute;"></view>
		<view class="logo-area" style="position: absolute; top: 25px; left: 20px;">
			<image style="width: 25px; height: 25px;" src="../../static/image/rwzc-logo-round.png"></image>
			<text class="text-yellow text-bold text-sm">人文之窗公众号</text>
		</view>
		<view class="container grid justify-center" id="container" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
			<view class="avatar-bg-border">
				<image @touchstart="touchAvatarBg" class="bg avatar-bg" id="avatar-bg" :src="avatarPath"></image>
			</view>
			<!-- <icon type="cancel" class="cancel" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 + 'px'}"></icon> -->
			<!-- <icon type="waiting" class="handle" id="handle" color="green" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></icon> -->
			<!-- <text class="cuIcon-order cancel circle" @click="flipHorizontal" id="cancel" :style="{top:cancelCenterY-10 + 'px', left:cancelterX-10 +'px'}"></text> -->
			<image class="mask flip-horizontal" :class="{maskWithBorder: showBorder}" id='mask' :src="maskPic" :style="{top:maskCenterY-maskSize/2-2+'px', left:maskCenterX-maskSize/2-2+'px',
				transform: 'rotate(' +rotate+ 'deg)' + 'scale(' +scale+')' + 'rotateY('+ rotateY +'deg)'}"></image>
			<text class="cuIcon-full handle circle" :class="{hideHandle: !showBorder}" id="handle" :style="{top:handleCenterY-10 + 'px', left:handleCenterX-10 +'px'}"></text>
			<text class="cuIcon-order cancel circle" v-if="isAndroid" :class="{hideHandle: !showBorder}" id="cancel" @click="flipHorizontal"
			 :style="{top:cancelCenterY-10 + 'px', left:cancelCenterX-10 +'px', transform: 'rotate(' +90+ 'deg)'}"></text>
		</view>
		<view>
			<canvas class="cans-id-mask" canvas-id="cans-id-mask" style="height:270px;width:270px;margin-left: auto;margin-right: auto;" />
		</view>
		<view class="flex-sub text-center">
			<view class="solid-bottom">
				<text class="text-yellow text-bold">戴上口罩 远离病毒 从你我做起</text>
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
			<view class="grid col-2 animation-shake animation-speed-2 animation-delay-3">
				<button class="cu-btn block line-orange lg share-btn" open-type="share">
					<text class="cuIcon-upload"></text> <text class="text-yellow">分享给好友</text> </button>
			</view>
		</view>

		<!-- <view class="infoView" style="display: none;">
			<text>
				一定要戴N95口罩才行吗？
				国家卫健委高级别专家组组长钟南山院士接受白岩松采访时表示，实际上并不一定非要戴N95，因为病毒不是单独的存在，它常常存在飞沫里。一般的外科口罩还是能够阻挡大部分的，也就是说以自我防护、降低呼吸道感染风险为目的，佩戴医用外科口罩、N95型口罩都可以。如果是去一般露天公共场所、不与病人接触，可以选择佩戴医用外科口罩，不必过度防护，不去和专业医护人员争抢紧缺的N95口罩资源。
			</text>
		</view> -->

		<scroll-view class="scrollView mask-scroll-view" scroll-x="true">
			<view v-for="(item,index) in imgList" :key="index" style="display: inline-flex;">
				<text v-if="currentMaskId == index && isAndroid" class="cuIcon-order cancel circle" @click="flipHorizontal" id="cancel"
				 :style="{transform: 'rotate(' +90+ 'deg)'}"></text>
				<!-- <text v-if="currentMaskId == index" style="margin-left: 55px;" class="cuIcon-question cancel circle" @click="showTips"
				 id="cancel"></text> -->
				<image class="imgList" :src="'/static/image/mask/'+ index +'.png'" :data-mask-id="index" @tap="changeMask"></image>
			</view>
		</scroll-view>

		<view class="cu-modal" :class="modalName=='saveTip'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content"> 已保存至相册</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					预防千万条，口罩第一条。
					健康第一位，不要吃野味。
					不往人群挤，病毒不找你。
					洗手很重要，胜过吃补药。
					通风也要紧，疾病无踪影。
				</view>
				<view class="padding">
					祝大家平安过节！戴口罩，勤洗手，早睡早起，健康美丽！
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">我知道了</button>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-modal" :class="modalName=='tips'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">一定要戴N95口罩吗？</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					N95口罩：是美国NIOSH(国家职业安全健康研究所)对美国职业用防颗粒物呼吸器过滤效率级别的最低一档,指对非油性颗粒物(如粉尘、漆雾、酸雾、微生物等)
					网上套路写着细菌过滤95%的，并不是符合N95标准的口罩，要注意甄别是否有GB 2626-2006标准的「KN95」或者NIOSH标准的「N95」的标识。
				</view>
				<view class="padding">
					国家卫健委高级别专家组组长钟南山院士接受白岩松采访时表示，实际上并不一定非要戴N95，因为病毒不是单独的存在，它常常存在飞沫里。一般的外科口罩还是能够阻挡大部分的，也就是说以自我防护、降低呼吸道感染风险为目的，佩戴医用外科口罩、N95型口罩都可以。如果是去一般露天公共场所、不与病人接触，可以选择佩戴医用外科口罩，不必过度防护，不去和专业医护人员争抢紧缺的N95口罩资源。
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
	import tuiFooter from "@/components/tui/footer";
	import addTips from "@/components/add-tips";

	// 在页面中定义激励视频广告
	let videoAd = null;
	// 在页面中定义插屏广告
	let interstitialAd = null

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
				cansWidth: 270, // 宽度 px
				cansHeight: 270, // 高度 px
				avatarPath: '/static/image/mask/avatar_mask.png',
				imgList: range(0, 16, 1), // 第二个参数是个数
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
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
			if (!!getApp().globalData.userAvatarFilePath) {
				this.avatarPath = getApp().globalData.userAvatarFilePath;
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
		},
		onShareAppMessage() {
			return {
				title: '我换上了口罩头像，防止疫情蔓延，保护家人朋友',
				desc: '防传染、戴口罩，从我做起！',
				imageUrl: '/static/image/mask/avatar_mask.png',
				path: '/pages/main/add-mask',
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
						uni.hideLoading()
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
	.main {
		background-color: #C12928;
	}

	.container {
		height: 300px;
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
		bottom: 5px;
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
		margin: 10px 10px 30px 10px;
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
