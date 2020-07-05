<template>
	<scroll-view class="container container-index" style="overflow-y: scroll;">
		<view v-if="SHOW_TIP">
			<add-tips :statusBarHeight="statusBarHeight" />
		</view>
		<!-- <view class="logo-area" :style="{top: statusBarHeight + 'px;'}">
			<image style="width: 25px; height: 25px;" src="../../static/image/rwzc-logo-round.png"></image>
			<text class="text-yellow text-bold text-sm">人文之窗公众号</text>
		</view> -->
		<view class="menu-list" :style="{'margin-top': statusBarHeight+40+'px' }">
			<view class="ad-container margin-top cu-list menu sm-border card-menu">
				<ad unit-id="adunit-28338c7d91d145af"></ad>
				<!-- <ad unit-id="adunit-7301464a68a1e24e" ad-type="video" ad-theme="white"></ad> -->
			</view>
			<view class="cu-card article" @click="addMask" >
				<view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
					<view class="title">
						<view class="text-cut"> 头像戴口罩 </view>
					</view>
					<view class="content">
						<image style="width: 180rpx;" src="/static/image/logo/mask-logo.png" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content"> 换上口罩头像，防止疫情蔓延。    超过30款口罩、护目镜任你选！</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">防疫情，保健康</view>
										<!-- <view class="cu-tag bg-green light sm round">保健康</view> -->
									</view>
									
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article" @click="nasa" >
				<view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
					<view class="title">
						<view class="text-cut"> 生日那天的宇宙 </view>
					</view>
					<view class="content">
						<image style="width: 180rpx;" src="/static/image/logo/nasa.jpeg" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content"> 快来看看你生日那天，哈勃望远镜看到了怎样的宇宙星空！</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">全宇宙独一无二的生日礼物</view>
										<!-- <view class="cu-tag bg-green light sm round">保健康</view> -->
									</view>
									
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article" @click="addSlogan">
				<view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
					<view class="title">
						<view class="text-cut"> 武汉加油 </view>
					</view>
					<view class="content">
						<image style="width: 180rpx;"  src="/static/image/logo/slogan-logo.jpeg" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content">  武汉加油，中国加油，加油2020，不动如山，拒绝聚会，拒绝野味。</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">武汉加油、自定义口号</view>
										<!-- <view class="cu-tag bg-green light sm round">自定义口号</view> -->
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article" @click="addText">
				<view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
					<view class="title">
						<view class="text-cut">  头像加字 </view>
					</view>
					<view class="content">
						<image style="width: 180rpx;"  src="/static/image/logo/text-logo.jpeg" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content">  头像一键加字，加V字，制作姓氏头像，让你在朋友圈脱颖而出。</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">任意文字、颜色</view>
										<!-- <view class="cu-tag bg-green light sm round">多种颜色</view> -->
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article" @click="chatBackground">
				<view class="cu-item shadow" style="margin: 30rpx 30rpx 0rpx 30rpx; ">
					<view class="title">
						<view class="text-cut">聊天背景图、壁纸锁屏 </view>
					</view>
					<view class="content">
						<image style="width: 180rpx;"  src="/static/image/logo/chat-bg-logo.png" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content"> 聊天背景图，高清手机壁纸，锁屏图片</view>
							<view>
								<view class="grid justify-between">
									<view>
										<view class="cu-tag bg-red light sm round">聊天背景、壁纸、锁屏</view>
										<!-- <view class="cu-tag bg-green light sm round">多种颜色</view> -->
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
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
			</view>
			
		</view>

	</scroll-view>
</template>

<script>
	import tuiIcon from "@/components/tui/icon";
	import addTips from "@/components/add-tips";
	
	// 在页面中定义插屏广告
	let interstitialAd = null;
	
	
	export default {
		components: {
			tuiIcon,
			addTips
		},
		data() {
			return {
				windowHeight: 0,
				statusBarHeight: 0,
				SHOW_TIP: false,
				rewardedVideoAdLoaded: false
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
				title: '我换上了口罩头像，防止疫情蔓延，30款口罩、护目镜任你选！',
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
			addMask: function() {
				uni.switchTab({
					url: '/pages/mask/add-mask'
				})
			},
			nasa: function() {
				wx.navigateToMiniProgram({
					appId: 'wxd44e78294c5c5401',
					path: 'pages/board/borad',
					success(res) {
						console.log(res);
					},
					fail(e) {
						console.log(e);
					}
				})
			},
			addSlogan: function(){
				uni.switchTab({
					url: '/pages/slogan/add-slogan'
				})
			},
			addText: function(){
				uni.navigateTo({
					url: '/pages/text/add-text'
				})
			},
			chatBackground: function(){
				uni.navigateTo({
					url: '/page-chat-bg/pages/index/index'
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
	.container-index{
		height: 2000rpx;
	}
	
	.logo-area{
		position: absolute;
		left: 20px;
	}
	.ad-container {
		width: 690rpx;
	}
	
	.about-actions{
		width: 690rpx;
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
