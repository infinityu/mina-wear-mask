<template>
	<view class="wish-main" :style="{height:windowHeight+'px;'}">
		<view class="wish-bg">
			<swiper class="swiper" @change="pageChange" :style="{height:windowHeight+'px;'}" circular vertical :indicator-dots="false"
			 :current="currentPageIndex">
				// page 1
				<swiper-item>
					<view>
						<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
						<view class="content-wrapper ">
							<view class="content-item">
								<image class="avatar-bg" mode="aspectFit" :src="avatarBg"></image>
							</view>
							<view class="content-item">
								<image class="greetings  animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 0)}" mode="aspectFit"
								 :src="greetings"></image>
							</view>
							<view class="content-item">
								<view class="customized-wish">{{fromMessage}}</view>
							</view>
							<view class="content-item">
								<image class="countDown animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 0)}" style="width: 600rpx; height: 300rpx; margin-top: 50rpx;"
								 mode="aspectFit" :src="countDown"></image>
								<span class="animation-speed-2" :class="{ 'animation-slide-right': (currentPageIndex == 0)}" style="font-size: 500%; font-weight: 1000; margin-top: -180rpx; margin-left: 110rpx;">
									<font style="color: white">{{countDownDays}}</font>
								</span>
							</view>
						</view>
					</view>
				</swiper-item>
				// page 2
				<swiper-item>
					<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
					<view class="content-wrapper ">
						<view class="content-item ">
							<image class="animation-speed-2" :class="{ 'animation-shake': (currentPageIndex == 1)}" style="width: 350rpx; height: 400rpx;"
							 mode="aspectFit" :src="mouseHappiness"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 1)}" style="width: 250rpx; height: 100rpx;"
							 mode="aspectFit" :src="bannerWishMouseYear"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-down': (currentPageIndex == 1)}" style="width: 650rpx; height: 500rpx;"
							 mode="aspectFit" :src="wishMsg1"></image>
						</view>
					</view>
				</swiper-item>
				// page 3
				<swiper-item>
					<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
					<view class="content-wrapper ">
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 2)}" style="width: 550rpx; height: 400rpx;"
							 mode="aspectFit" :src="littleYear"></image>

						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 2)}" style="width: 550rpx; height: 200rpx; margin-top: -70rpx;"
							 mode="aspectFit" :src="bannerWishRec"></image>
							<span class="animation-speed-2" :class="{ 'animation-slide-right': (currentPageIndex == 2)}" style="font-size: 120%; font-weight: 500; margin-top: -130rpx;">
								<font style="color: #C12928">在这里，给您拜年喽！</font>
							</span>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-down': (currentPageIndex == 2)}" style="width: 650rpx; height: 500rpx; margin-top: -40rpx;"
							 mode="aspectFit" :src="wishMsg2"></image>
						</view>
					</view>
				</swiper-item>
				// page 4
				<swiper-item>
					<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
					<view class="content-wrapper ">
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 3)}" style="width: 550rpx; height: 100rpx;"
							 mode="aspectFit" :src="bannerWishMouseYear"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 3)}" style="width: 650rpx; height: 500rpx;"
							 mode="aspectFit" :src="mouse2020"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-down': (currentPageIndex == 3)}" style="width: 650rpx; height: 500rpx; margin-top: -100rpx;"
							 mode="aspectFit" :src="wishMsg3"></image>
						</view>
					</view>
				</swiper-item>
				// page 5
				<swiper-item>
					<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
					<view class="content-wrapper ">
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 4)}" style="width: 550rpx; height: 380rpx;"
							 mode="aspectFit" :src="mouseMoney"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-down': (currentPageIndex == 4)}" style="width: 650rpx; height: 600rpx; margin-top: 10rpx;"
							 mode="aspectFit" :src="wishMsg4"></image>
						</view>
					</view>
				</swiper-item>
				// page 6
				<swiper-item>
					<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
					<view class="content-wrapper ">
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 5)}" style="width: 550rpx; height: 80rpx; margin-left: -300rpx;"
							 mode="aspectFit" :src="bannerWishMouseYear"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 5)}" style="width: 550rpx; height: 400rpx;"
							 mode="aspectFit" :src="picDinner"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-down': (currentPageIndex == 5)}" style="width: 650rpx; height: 500rpx;"
							 mode="aspectFit" :src="wishMsg5"></image>
						</view>
					</view>
				</swiper-item>
				// page 7
				<swiper-item>
					<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
					<view class="content-wrapper ">
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 6)}" style="width: 350rpx; height: 150rpx;"
							 mode="aspectFit" :src="pic2020Hot"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-slide-right': (currentPageIndex == 6)}" style="width: 600rpx; height: 300rpx; margin-top: -50rpx;"
							 mode="aspectFit" :src="picSpringFestival"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-shake': (currentPageIndex == 6)}" style="width: 300rpx; height: 300rpx; margin-top: 0rpx;"
							 mode="aspectFit" :src="mouseCute"></image>
						</view>
						<view class="content-item">
							<image class="animation-speed-2" :class="{ 'animation-scale-down': (currentPageIndex == 6)}" style="width: 650rpx; height: 500rpx; margin-top: -100rpx;"
							 mode="aspectFit" :src="wishMsg6"></image>
						</view>
					</view>
				</swiper-item>
				// page 8
				<swiper-item>
					<view>
						<image class="page-bg" :style="{height:windowHeight+'px;'}" mode="aspectFill" :src="pageBg"></image>
						<view class="content-wrapper ">
							<view class="content-item">
								<image class="avatar-bg" mode="aspectFit" :src="avatarBg"></image>
							</view>
							<view class="content-item">
								<image class="greetings  animation-speed-2" :class="{ 'animation-slide-left': (currentPageIndex == 0)}" mode="aspectFit"
								 :src="greetings"></image>
							</view>
							<view class="content-item">
								<view class="padding-xl customized-wish">
									<view class="uni-textarea2">
										<textarea maxlength="100" :value="wishMessage" placeholder-style="color: white" placeholder="请输入祝福语或选择模板" />
										</view>
								</view>
							</view>
							<!-- <view class="content-item">
								<image class="animation-speed-2" :class="{ 'animation-scale-up': (currentPageIndex == 0)}" 
								style="width: 600rpx; height: 300rpx; margin-top: 50rpx;" mode="aspectFit" :src="mouseOnCoin"></image>
							</view> -->
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
				</swiper-item>
			</swiper>
		</view>
		<view class="flex solid-bottom padding justify-around actions">
			<view class="action-item "><button class="cu-btn round bg-yellow shadow" @tap="startEditWishMessage"> 定制转发</button></view>
			<image class="nextIcon animation-delay-2 animation-slide-top" mode="aspectFit" :src="nextIcon"></image>
			<view class="action-item "><button class="cu-btn round bg-yellow shadow" @click="jumpTo"> 加福字儿</button></view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from "vuex";
	
	export default {
		data() {
			return {
				wish_db: null,
				windowHeight: 800,
				windowWidth: 400,
				currentPageIndex: 0,
				fromMessage: "祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您祝福您",
				countDownDays: 20,
				wishMessage: "",
			};
		},
		computed: {
			...mapGetters(["pageBg", "avatarBg","greetings","countDown","nextIcon",
			"mouseHappiness", "bannerWishMouseYear", "littleYear", "bannerWishRec",
			"mouse2020", "mouseMoney", "picDinner", "pic2020Hot", "picSpringFestival",
			"mouseCute", "mouseOnCoin", "wishMsg1", "wishMsg2", "wishMsg3","wishMsg4",
			"wishMsg5", "wishMsg6"]),
		},
		onReady() {
			console.log("onReady");
			uni.hideTabBar();
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
			// this.wish_db.add({
			//   // data 字段表示需新增的 JSON 数据
			//   data: {
			//     // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
			//     description: "learn cloud database",
			//     due: new Date("2018-09-01"),
			//     tags: [
			//       "cloud",
			//       "database"
			//     ],
			//     // 为待办事项添加一个地理位置（113°E，23°N）
			//     location: new db.Geo.Point(113, 23),
			//     done: false
			//   },
			//   success: function(res) {
			//     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
			//     console.log(res)
			//   },
			//   fail: function(res){
			// 	console.log(res);
			//   }
			// })
			
			wx.cloud.callFunction({
			  name: 'wish',
			  complete: res => {
			    console.log('callFunction wish result: ', res)
			  }
			})
			
			// load background music
			const bgAudioMannager = uni.getBackgroundAudioManager();
			bgAudioMannager.title = '春节序曲';
			bgAudioMannager.singer = '中华人民解放军军乐团';
			bgAudioMannager.coverImgUrl = 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/audio/music.jpg';
			bgAudioMannager.src =
				'http://m10.music.126.net/20191222221122/3e5dcfb90d0e6c5287b2164e26e78ca0/ymusic/525a/510f/015c/e0d86224e5fe4e592b3166332eee55e6.mp3';
			bgAudioMannager.play();
			bgAudioMannager.onPlay(function() {
				console.log('开始播放背景声音');
			});
			bgAudioMannager.onEnded(function() {
				console.log("end");
				bgAudioMannager.src =
					'http://m10.music.126.net/20191222221122/3e5dcfb90d0e6c5287b2164e26e78ca0/ymusic/525a/510f/015c/e0d86224e5fe4e592b3166332eee55e6.mp3';
				bgAudioMannager.play();
			});
			bgAudioMannager.onError(function(res) {
				console.log("bgAudioMannager.onError", res.errMsg);
				console.log("bgAudioMannager.onError", res.errCode);
			});

		},
		onShareAppMessage() {
			console.log("share");
		},
		methods: {
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
			startEditWishMessage: function() {
				this.currentPageIndex = 7;
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
	.swiper {
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
		height: 220rpx;
		width: 220rpx;
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

	.nextIcon{
		width: 45rpx;
		height: 45rpx;
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
