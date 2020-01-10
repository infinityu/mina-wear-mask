<template>
	<view class="wish-main" :style="{height:windowHeight+'px;'}">
		<view class="wish-bg">
			<view>
				<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
				<view class="content-wrapper ">
					<view class="content-item">
						<image class="avatar-bg" mode="aspectFit" :src="avatarBg"></image>
						<image class="avatar-from cu-avatar round margin-left" mode="aspectFit" :src="userInfo.avatarUrl"></image>
					</view>
					<view class="content-item">
						<input style="text-align: center; font-size: 180%; color: #fbbd08;" v-model="userInfo.nickName" />
					</view>
					<view class="content-item">
						<image class="greetings  animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 0)}" mode="aspectFit"
						 :src="greetings"></image>
					</view>
					<view class="content-item">
						<view class="padding-xl customized-wish">
							<view class="uni-textarea2">
								<textarea style="width: 700rpx; height: 200rpx;" maxlength="100"  placeholder-style="color: white"
								 placeholder="请输入祝福语或选择模板" v-model="wishMessage" />
								</view>
							</view>
						</view>
						<view class="content-item">
							<view class="flex">
								<view class="flex-sub padding-sm margin-xs"><button class="cu-btn round bg-yellow shadow" 
									@tap="applyWishTemplate" data-template="1">祝福一 </button></view>
								<view class="flex-sub padding-sm margin-xs"><button class="cu-btn round bg-yellow shadow" 
									@tap="applyWishTemplate" data-template="2">祝福二 </button></view>
							</view>
							<view class="flex">
								<view class="flex-sub padding-sm margin-xs"><button class="cu-btn round bg-yellow shadow" 
									@tap="applyWishTemplate" data-template="3">祝福三 </button></view>
								<view class="flex-sub padding-sm margin-xs"><button class="cu-btn round bg-yellow shadow" 
									@tap="applyWishTemplate" data-template="0">自定义 </button></view>
							</view>
						</view>
					</view>
				</view>
		</view>
		<view class="flex solid-bottom padding justify-around actions">
			<view class="action-item "><button class="cu-btn round bg-yellow shadow" open-type="getUserInfo" @getuserinfo="startEditWishMessage">  获取头像</button></view>
			<view class="action-item "><button class="cu-btn round bg-yellow shadow" open-type="share" @click="share"> 发送祝福</button></view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapState, mapMutations } from "vuex";
	
	export default {
		data() {
			return {
				wish_db: null,
				windowHeight: 800,
				windowWidth: 400,
				countDownDays: 20,
				wishMessage: "",
				fromUserInfo: {
					avatarUrl: "https://mina-img-store-1258554429.cos.ap-shanghai.myqcloud.com/new-year-wish/kids-trans.png",
					nickName: "你的名字"
				}
			};
		},
		computed: {
			...mapGetters(["pageBg", "avatarBg","greetings"]),
			...mapState({userInfo:'userInfo'})
		},
		onShareAppMessage() {
			console.log("share done");
			this.userInfo.message = this.wishMessage;
			return {
				title: this.userInfo.nickName,
				desc: '为您送来新春祝福',
				path: '/pages/wish/wish-swiper?fromUserInfo=' + encodeURIComponent(JSON.stringify(this.userInfo)),
				success: function(res){
					console.log(res);
				}
			}
		},
		onReady() {
			console.log("onReady");
			let self = this;
			uni.getSystemInfo({
				success: function(res) {
					self.windowHeight = res.windowHeight;
					console.log("windowHeight", self.windowHeight);
					self.windowWidth = res.windowWidth;
					console.log("windowWidth", self.windowWidth);
				}
			});
		},
		onLoad() {
			console.log("onLoad");
			const db = wx.cloud.database({
			  env: 'typo-battle-prdct-05f8e4'
			})
			this.wish_db = db.collection('wish_redirect');
			
			// wx.cloud.callFunction({
			//   name: 'wish',
			//   complete: res => {
			//     console.log('callFunction wish result: ', res)
			//   }
			// })
			

		},
		onTabItemTap(e) {
			console.log(e);
		},
		methods: {
			...mapMutations(["saveLoginUserInfo"]),
			share:function() {
				console.log("share");
				uni.share({
					complete
				})
			},
			jumpTo: function() {
				console.log("jump");
				uni.switchTab({
					url: '/pages/login/login'
				});
			},
			pageChange: function(event){
				console.log(event.detail);
				this.currentPageIndex = event.detail.current;
			},
			startEditWishMessage: function(result) {
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
				let userInfo = result.detail.userInfo;
				userInfo.avatarUrl = userInfo.avatarUrl.replace("132", "0"); // 959 * 959
				console.log(userInfo);
				this.saveLoginUserInfo(userInfo);
			},
			applyWishTemplate: function(e) {
				let templateId = e.currentTarget.dataset.template;
				console.log(templateId);
				switch (templateId) {
				    case "0":
				        this.wishMessage = "点击此处，输入你想要的祝福语";
				        break;
				    case "1":
				        this.wishMessage = "祝福语模板一";
				         break;
				    case "2":
				        this.wishMessage = "祝福语模板二";
				         break;
				    case "3":
				        this.wishMessage = "祝福语模板三";
				         break;
				} 
				console.log("this.wishMessage", this.wishMessage);
			},
		}
	}
</script>

<style>
	.wish-main{
		width: 750rpx;
		background-color: #C12928;
	}

	.content-wrapper {
		top: 0rpx;
		position: absolute;
		padding-top: 100rpx;
		padding-left: 50rpx;
		padding-right: 50rpx;
		width: 750rpx;
	}
	.content-item {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
	}

	.page-bg-header{
		top: 0;
	}
	
	.page-bg {
		height: 1400rpx;
		width: 750rpx;
	}

	.avatar-bg {
		height: 250rpx;
		width: 250rpx;
	}

	.avatar-from{
		position: absolute;
		margin-top: 25rpx;
		margin-left: auto;
		margin-right: auto;
		height: 200rpx;
		width: 200rpx;
	}

	.greetings {
		height: 125rpx;
	}

	.customized-wish {
		width: 700rpx;
		padding: 10rpx 5rpx 10rpx 5rpx;
		border: 2px yellow dashed ;
		border-radius: 20rpx;
		color: #EEEEEE;
		margin-top: 40rpx;
	}

	.actions {
		top: -200rpx;
		padding-left: 100rpx;
		padding-right: 100rpx;
	}
	
	.boxes{
		color: red;
	}
</style>
