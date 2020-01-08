<template>
	<view>
		<page-head :title="title"></page-head>
		<view>
			<poster :bg-img="userInfo.avatarUrl" @getAvatar="mpGetUserInfo"></poster>
		</view>
		<view class="uni-padding-wrap" v-if="false">
			<view style="background:#FFF; padding:40upx;">
				<block v-if="hasUserInfo === false">
					<view class="uni-hello-text uni-center">
						<text>请点击下方按钮获取用户头像及昵称</text>
					</view>
				</block>
				<block v-if="hasUserInfo === true">
					<view class="uni-h4 uni-center uni-common-mt">{{userInfo.nickName}}</view>
					<view style="padding:30upx 0; text-align:center;">
						<!-- <image class="userinfo-avatar2" :src="userInfo.avatarUrl"></image> -->
					</view>
				</block>
			</view>
			<view class="uni-btn-v">
				<!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-QQ -->
				<button class="flexBtn" type="primary" open-type="getUserInfo" @getuserinfo="mpGetUserInfo">获取用户信息</button>
				<!-- #endif -->
				<button @click="clear">清空</button>
			</view>
		</view>
	</view>
</template>
<script>
	import poster from '@/components/poster.vue';
	export default {
		components: {
			poster
		},
		data() {
			return {
				title: 'getUserInfo',
				hasUserInfo: false,
				userInfo: {},
				loginProvider: "weixin",
				bgImg: ''
			}
		},
		computed: {},
		methods: {
			mpGetUserInfo(result) {
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
				this.userInfo = result.detail.userInfo;
				this.userInfo.avatarUrl = this.userInfo.avatarUrl.replace("132", "0"); // 959 * 959
				console.log(this.userInfo);
			},
			clear() {
				this.hasUserInfo = false;
				this.userInfo = {};
			}
		}
	}
</script>

<style>
	.userinfo-avatar {
		border-radius: 128upx;
		width: 128upx;
		height: 128upx;
	}
</style>
