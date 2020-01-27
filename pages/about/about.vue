<template>
	<view class="main" :style="{height:windowHeight+'px'}" style="overflow: hidden">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<!-- <view style="margin-top: 75px;" class="grid justify-around" data-target="Modal">
			<view class="grid col-1">
				<image style="width:270px; height:270px;" mode="aspectFill" src="/static/image/official-account.png"></image>
			</view>
			<view class="grid col-1">
				<text class="text-grey margin-top animation-shake animation-speed-2 animation-delay-1"> 更多精彩，请关注公众号【人文之窗】 </text>
			</view>	
		</view> -->
		<view class="grid justify-center" style="margin-top: 75rpx;">
			<view>
				<image class="animation-speed-2 animation-slide-right" style="height: 470rpx;" mode="aspectFit" src="/static/image/mouse-2020.png"></image>
			</view>
			<view style="margin-top: -50rpx;">
				<image class="animation-speed-2 animation-slide-left" style="height: 335rpx;" mode="aspectFit" src="/static/image/wish5happiness.png"></image>
			</view>
		</view>

		<view class="margin-top cu-list menu sm-border card-menu animation-shake animation-speed-2 animation-delay-3" style="width: 525rpx;">
			<view class="cu-item arrow feedback-btn">
				<view class="content">
					<button class="free-btn-bordernone" open-type="contact" >
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
					<!-- <text class="cuIcon-comment text-green"></text> -->
				</view>
			</view>
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
			this.windowHeight = getApp().globalData.WINDOW_HEIGHT;
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-beed4816676d471a'
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
					productId: 117112
				}).go();
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
	.main {
		background-color: #C12928;
		height: 1334rpx;
		width: 750rpx;
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
