<template>
	<view class="container" style="overflow-y: scroll;">
		<!-- <image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image> -->
		<view v-if="SHOW_TIP">
			<add-tips :statusBarHeight="statusBarHeight" />
		</view>
		<view class="logo-area" :style="{top: statusBarHeight + 'px;'}">
			<image style="width: 25px; height: 25px;" src="../../static/image/rwzc-logo-round.png"></image>
			<text class="text-yellow text-bold text-sm">人文之窗公众号</text>
		</view>
		<view class="menu-list" :style="{'margin-top': statusBarHeight+40+'px' }">
			<view class="cu-card article">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut"> 实时疫情 </view>
					</view>
					<view class="content">
						<image style="width: 160rpx;" @click="realtimeInfo" src="/static/image/logo/ncov-logo.png" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content"> 全国及各省市新型冠状病毒肺炎疫情实时状态，疫情最新数据汇总。</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">新冠肺炎</view>
										<view class="cu-tag bg-green light sm round">疫情实时</view>
									</view>
									<view>
										<button class="cu-btn line-orange sm" @click="realtimeInfo">
											<text class="cuIcon-forward"></text> <text class="text-orange">打开</text> </button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view>
				<view class="cu-card article">
					<view class="cu-item shadow">
						<view class="title">
							<view class="text-cut"> 头像加福字 </view>
						</view>
						<view class="content">
							<image @click="addHappiness" style="width: 160rpx; margin-top: 8px;" src="/static/image/logo/happiness-logo.png"
							 mode="widthFix"></image>
							<view class="desc">
								<view class="text-content"> 头像加福字，新年新气象，福到好运到！</view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">贺新年</view>
										<view class="cu-tag bg-green light sm round">集五福</view>
									</view>
									<view>
										<button class="cu-btn line-orange sm" @click="addHappiness">
											<text class="cuIcon-forward"></text> <text class="text-orange">打开</text> </button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut"> 头像戴口罩 </view>
					</view>
					<view class="content">
						<image style="width: 160rpx;" @click="addMask" src="/static/image/logo/mask-logo.png" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content"> 换上口罩头像，提升防疫安全意识，防止疫情蔓延，保护家人朋友。</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">防疫情</view>
										<view class="cu-tag bg-green light sm round">保健康</view>
									</view>
									<view>
										<button class="cu-btn line-orange sm" @click="addMask">
											<text class="cuIcon-forward"></text> <text class="text-orange">打开</text> </button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut"> 武汉加油 </view>
					</view>
					<view class="content">
						<image style="width: 160rpx;" @click="addSlogan" src="/static/image/logo/slogan-logo.jpeg" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content">  武汉加油，中国加油，加油2020，不动如山，拒绝聚会，拒绝野味。</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">武汉加油</view>
										<view class="cu-tag bg-green light sm round">中国加油</view>
									</view>
									<view>
										<button class="cu-btn line-orange sm" @click="addSlogan">
											<text class="cuIcon-forward"></text> <text class="text-orange">打开</text> </button>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
		</view>

		<view class="about-actions margin-top cu-list menu sm-border card-menu animation-shake animation-speed-2 animation-delay-3"
			style="margin-bottom: 50rpx;">
			<view class="cu-item feedback-btn">
				<view class="content">
					<button class="free-btn-bordernone" open-type="contact">
						<tui-icon name="kefu" color="green" :size="20"></tui-icon>
						<text style="color: grey; padding-left: 10px;" class="text-sm">
							联系客服
						</text>
					</button>
				</view>

				<view class="content" @click="tucao">
					<button class="free-btn-bordernone">
						<tui-icon name="message" color="green" :size="20"></tui-icon>
						<text style="color: grey; padding-left: 10px;" class="text-sm">
							产品建议
						</text>
					</button>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import tuiIcon from "@/components/tui/icon";
	import addTips from "@/components/add-tips";
	
	// 在页面中定义插屏广告
	let interstitialAd = null
	
	export default {
		components: {
			tuiIcon,
			addTips
		},
		data() {
			return {
				windowHeight: 0,
				statusBarHeight: 0,
				SHOW_TIP: false
			}
		},
		onLoad() {
			// 在页面onLoad回调事件中创建插屏广告实例
			if (wx.createInterstitialAd) {
				interstitialAd = wx.createInterstitialAd({
					adUnitId: 'adunit-be801ba020f6edeb'
				})
				interstitialAd.onLoad(() => {})
				interstitialAd.onError((err) => {
					console.log(err);
				})
				interstitialAd.onClose(() => {})
			}
		},
		onShow() {
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.windowHeight = getApp().globalData.windowHeight;
			this.SHOW_TIP = getApp().globalData.SHOW_TIP;
			console.log(this.SHOW_TIP);
			
			if (interstitialAd) {
				interstitialAd.show().catch((err) => {
					console.error(err)
				})
			}
		},
		onShareAppMessage() {
			return {
				title: '我换上了口罩头像，防止疫情蔓延，保护家人朋友',
				desc: '防传染、戴口罩，从我做起！',
				imageUrl: '/static/image/mask/avatar_mask.png',
				path: '/pages/index/index',
				success: function(res) {
					console.log(res);
				}
			}
		},
		methods: {
			realtimeInfo: function() {
				wx.navigateToMiniProgram({
					appId: 'wx1656b2e5df4e587c',
					path: 'pages/index/index',
					success(res) {
						console.log(res);
					},
					fail(e) {
						console.log(e);
					}
				})
			},
			addHappiness: function() {
				console.log('addHappiness');
				wx.navigateToMiniProgram({
					appId: 'wxb8055d6d942b3690',
					path: 'pages/happiness/add-happiness',
					success(res) {
						console.log(res);
					},
					fail(e) {
						console.log(e);
					}
				})
			},
			addMask: function() {
				uni.switchTab({
					url: '/pages/mask/add-mask'
				})
			},
			addSlogan: function(){
				uni.switchTab({
					url: '/pages/slogan/add-slogan'
				})
			},
			tucao: function() {
				const Tucao = requirePlugin('tucao').default;
				// 初始化并触发跳转，支持链式调用
				this.wx = uni;
				Tucao.init(this, {
					productId: 120746
				}).go();
			},
			handleContact: function(e) {
				console.log(e.detail.path)
				console.log(e.detail.query)
			}
		}
	}
</script>

<style scoped>
	.logo-area{
		position: absolute;
		left: 20px;
	}
	.about-actions {
		/* position: fixed; */
		/* bottom: 80px; */
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
