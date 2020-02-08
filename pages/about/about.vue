<template>
	<view class="container" :style="{height:windowHeight+'px'}">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view class="content-wrapper">
			<ad unit-id="adunit-28338c7d91d145af"></ad>
			<view class="about-actions margin-top cu-list menu sm-border card-menu animation-shake animation-speed-2 animation-delay-3">
				<view class="cu-item arrow feedback-btn">
					<view class="content">
						<button class="free-btn-bordernone" open-type="contact">
							<tui-icon name="kefu" color="green" :size="20"></tui-icon>
							<text style="color: grey; padding-left: 10px;" class="text-sm">
								联系客服
							</text>
						</button>
					</view>
				</view>
				<view class="cu-item arrow feedback-btn" @click="tucao">
					<view class="content">
						<button class="free-btn-bordernone">
							<tui-icon name="message" color="green" :size="20"></tui-icon>
							<text style="color: grey; padding-left: 10px;" class="text-sm">
								产品建议
							</text>
						</button>
					</view>
				</view>
				<!-- <view class="cu-item arrow feedback-btn" @click="addHappiness">
					<view class="content">
						<button class="free-btn-bordernone">
							<tui-icon name="agree" color="green" :size="20"></tui-icon>
							<text style="color: grey; padding-left: 10px;" class="text-sm">
								找开发小哥吐槽
							</text>
						</button>
						<view class="action">
						</view>
					</view>
				</view> -->

			</view>

			<view @click="showModal" data-target="Modal" id="btn-footer-oa">
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
	</view>
</template>

<script>
	import {
		mapGetters,
		mapState,
		mapMutations
	} from "vuex";
	import tuiFooter from "@/components/tui/footer";
	import tuiIcon from "@/components/tui/icon"

	// 在页面中定义插屏广告
	let interstitialAd = null

	export default {
		components: {
			tuiFooter,
			tuiIcon
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
				modalName: null
			}
		},
		onLoad() {
			this.windowHeight = getApp().globalData.windowHeight;
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-28338c7d91d145af'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {
					console.log(err);
				})
				interstitialAd.onClose(() => {})
			}
		},
		onShow() {
			// 在适合的场景显示插屏广告
			console.log('interstitialAd', !!interstitialAd);
			if (interstitialAd) {
				interstitialAd.show().catch((err) => {
					console.error(err)
				})
			}
		},
		computed: {
			...mapState({
				userInfo: 'userInfo'
			})
		},
		methods: {
			tucao: function() {
				const Tucao = requirePlugin('tucao').default;
				// 初始化并触发跳转，支持链式调用
				this.wx = uni;
				Tucao.init(this, {
					productId: 120746
				}).go();
			},
			addHappiness: function(){
				wx.previewImage({
				  current: '/static/image/qcode.jpeg', // 当前显示图片的http链接
				  urls: ['/static/image/qcode.jpeg'] // 需要预览的图片http链接列表
				})
				// console.log('addHappiness');
				// wx.navigateToMiniProgram({
				//   appId: 'wxb8055d6d942b3690',
				//   path: 'pages/happiness/add-happiness',
				//   success(res) {
				//     console.log(res);
				//   },
				//   fail(e){
				// 	  console.log(e);
				//   }
				// })
			},
			showModal: function(e) {
				console.log(e.currentTarget.dataset);
				this.modalName = e.currentTarget.dataset.target;
			},
			hideModal: function(e) {
				this.modalName = null;
			},
			handleContact: function(e) {
				console.log(e.detail.path)
				console.log(e.detail.query)
			}
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
		}
	}
</script>

<style scoped>
	.content-wrapper {
		margin-top: 150rpx;
	}
	
	.about-actions{
		position: fixed;
		bottom: 80px;
		width: 500rpx;
		left: 125rpx;
	}

	.card-menu {
		margin-left: auto;
		margin-right: auto;
	}

	.free-btn-bordernone {
		background: none !important;
		color: #000 !important;
		display: inline-block !important;
	}

	.free-btn-bordernone::after {
		border: none;
	}
</style>
