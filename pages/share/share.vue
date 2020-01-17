<template>
	<view class="main" :style="{height:windowHeight+'px'}"  style="overflow: hidden">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view style="margin-top: 75px;" class="grid justify-around" @click="downloadMiniCode" data-target="Modal">
			<view class="grid col-1">
				<image style="width:270px; height:270px;" mode="aspectFill" src="/static/image/minicode.jpg"></image>
			</view>
			<view class="grid col-1">
				<text class="text-white margin-top animation-shake animation-speed-2 animation-delay-1">  下载小程序码，分享朋友圈，向大家送福吧！ </text>
			</view>	
		</view>
		
		<view class="grid justify-center action-wrapper" style="margin-top: 100rpx;">
			<view class="grid col-1">
				<button @click="downloadMiniCode" class="cu-btn round action-btn bg-yellow"> <text class="cuIcon-down"></text>下载</button>
			</view>
		</view>
		
		<view @click="showModal" data-target="Modal">
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
				menuArrow: true
            }
        },
		onShow() {
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
		},
		computed: {
			...mapState({userInfo:'userInfo'})
		},
		methods: {
			tucao: function(){
				const Tucao = requirePlugin('tucao').default;
				// 初始化并触发跳转，支持链式调用
				this.wx = uni;
				Tucao.init(this, {productId:117112}).go();
			},
			showModal: function(e){
				console.log(e.currentTarget.dataset);
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
			},
			downloadMiniCode: function() {
				uni.saveImageToPhotosAlbum({
					filePath: '/static/image/minicode.jpg',
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

<style>
	.main{
		background-color: #C12928;
		height: 1334rpx;
		width: 750rpx;
	}
	
	.aboutContent{
		width: 690rpx;
		/* margin-top: 75px; */
	}
	
	.action-btn {
		background-color: #FFC700;
		color: white;
	}
</style>