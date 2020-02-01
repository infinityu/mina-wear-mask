<template>
	<view class="container">
		<image class="page-bg" :style="{height:windowHeight+'px'}" mode="aspectFill" src="/static/image/page-bg.png"></image>
		<view v-if="SHOW_TIP">
			<add-tips :statusBarHeight="statusBarHeight" />
		</view>
		<view class="logo-area" style="position: absolute; top: 25px; left: 20px;">
			<image style="width: 25px; height: 25px;" src="../../static/image/rwzc-logo-round.png"></image>
			<text class="text-yellow text-bold text-sm">人文之窗公众号</text>
		</view>
		<view class="menu-list" style="margin-top: 65px;">
			<view @click="addHappiness">
				<view class="cu-card article">
					<view class="cu-item shadow">
						<view class="title">
							<view class="text-cut"> 头像加福字 </view>
						</view>
						<view class="content">
							<image style="width: 160rpx; margin-top: 8px;" src="/static/image/logo/happiness-logo.png" mode="widthFix"></image>
							<view class="desc">
								<view class="text-content"> 头像加福字，新年新气象，福到好运到！</view>
								<view>
									<view class="cu-tag bg-red light sm round">贺新年</view>
									<view class="cu-tag bg-green light sm round">集五福</view>
									<!-- <text class="cuIcon-roundright" ></text> -->
								</view>
								<view style="display: inline-block;">
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cu-card article" @click="addMask">
				<view class="cu-item shadow">
					<view class="title">
						<view class="text-cut"> 头像戴口罩 </view>
					</view>
					<view class="content">
						<image style="width: 160rpx;" src="/static/image/logo/mask-logo.png" mode="aspectFill"></image>
						<view class="desc">
							<view class="text-content"> 换上口罩头像，提升防疫安全意识，防止疫情蔓延，保护家人朋友。</view>
							<view>
								<view class="cu-tag bg-red light sm round">防疫情</view>
								<view class="cu-tag bg-green light sm round">保健康</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="about-actions margin-top cu-list menu sm-border card-menu animation-shake animation-speed-2 animation-delay-3">
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
		onShow() {
			this.statusBarHeight = getApp().globalData.statusBarHeight;
			this.windowHeight = getApp().globalData.windowHeight;
			this.SHOW_TIP = getApp().globalData.SHOW_TIP;
			console.log(this.SHOW_TIP);
		},
		methods: {
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
	.about-actions {
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
