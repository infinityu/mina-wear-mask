<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view style="margin-top: 75rpx;" class="grid justify-around"  data-target="Modal">
			<!-- <view class="grid col-1">
				<image style="width:270px; height:270px;" mode="aspectFill" src="/static/image/minicode.jpg"></image>
			</view>
			<view class="grid col-1">
				<text class="text-white margin-top animation-shake animation-speed-2 animation-delay-1">  下载小程序码，分享朋友圈，向大家送福吧！ </text>
			</view>	 -->
		<swiper class="swiper" :class="dotStyle?'square-dot':'round-dot'" :indicator-dots="true" :circular="true"
		 :autoplay="true" interval="2000" duration="500" @change="posterSwiperChange" indicator-color="#fff"
		 indicator-active-color="#fbbd08" :current="currentPosterIndex">
				<swiper-item class="grid justify-center swiper-item">
					<view>
						<image class="poster" mode="aspectFit" src="/static/image/poster1.jpg"></image>
					</view>
				</swiper-item>
				<swiper-item class="grid justify-center swiper-item">
					<view>
						<image class="poster" mode="aspectFit" src="/static/image/poster2.jpg"></image>
					</view>
				</swiper-item>
				<swiper-item class="grid justify-center swiper-item">
					<view>
						<image class="poster" mode="aspectFit" src="/static/image/poster1.jpg"></image>
					</view>
				</swiper-item>
				<swiper-item class="grid justify-center swiper-item">
					<view>
						<image class="poster" mode="aspectFit" src="/static/image/poster2.jpg"></image>
					</view>
				</swiper-item>
			</swiper>
		</view>

		<view class="grid justify-center action-wrapper" style="margin-top: 25rpx;">
			<view class="grid col-1">
				<button @click="downloadMiniCode" class="cu-btn round bg-yellow"> <text class="cuIcon-down"></text>下载</button>
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
				copyright: " Copyright © 2016-2020 人文之窗公众号",
				officialAccountUrl: "https://mina-img-store-1258554429.cos.ap-shanghai.myqcloud.com/new-year-wish/renwenzhichuang.png",
				windowHeight: 0,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				modalName: null,
				menuBorder: true,
				menuCard: true,
				menuArrow: true,
				currentPosterIndex: 0
			}
		},
		onShow() {
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
		},
		computed: {
			...mapState({
				userInfo: 'userInfo'
			})
		},
		methods: {
			posterSwiperChange: function(event) {
				this.currentPosterIndex = event.detail.current;
			},
			showModal: function(e) {
				console.log(e.currentTarget.dataset);
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
			},
			
			preview: function(){
				let filePath = '/static/image/poster'+ (this.currentPosterIndex%2+1) +'.jpg';
				console.log("filePath", filePath);
				uni.previewImage({
				            urls: [filePath],
				            longPressActions: {
				                itemList: ['发送给朋友', '保存'],
				                success: function(data) {
				                    console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
				                },
				                fail: function(err) {
				                    console.log(err.errMsg);
				                }
				            }
				        });
			},
			downloadMiniCode: function() {
				let filePath = '/static/image/poster'+ (this.currentPosterIndex%2+1) +'.jpg'
				uni.saveImageToPhotosAlbum({
					filePath: filePath,
					success: function(res) {
						uni.showToast({
							title: '小程序码已保存至相册，请通过朋友圈分享'
						})
						uni.vibrateShort({
							success: function() {
								console.log('success');
							}
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
			}
		}
	}
</script>

<style scoped>
	.main {
		background-color: #C12928;
		height: 1334rpx;
		width: 750rpx;
	}

	.aboutContent {
		width: 690rpx;
		/* margin-top: 75px; */
	}

	.swiper{
		width: 270px;
		height: 420px;
	}
	
	/* .swiper-item{
		padding-top: 50rpx;
		border: 6px solid white;
		border-radius: 10px;
		border-color: #fbbd08;
	} */
	
	.poster{
		width: 200px;
		height: 355px;
	}
</style>
