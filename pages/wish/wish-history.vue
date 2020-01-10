<template>
	<view class="history-main" :style="{height:windowHeight+'px'}">
		<view class="cu-bar bg-white margin-top">
			<view class="action">
				<text class="cuIcon-title text-pink"></text>   收到与送出的祝福
			</view>
		</view>
		<view class="cu-card dynamic" :class="isCard?'no-card':''">
			<view class="cu-item shadow">
				<view class="cu-list menu-avatar comment solids-top">
					<view class="cu-item">
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/img/champion/Morgana.png);"></view>
						<view class="content">
							<view class="text-grey"> 叶轻眉</view>
							<view class="text-gray text-content text-df">
								小竹竹，你终将会被自己的光芒闪耀。
							</view>
							<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
								<view class="flex">
									<view>我（五竹）：</view>
									<view class="flex-sub">大姐头，新年快乐！！</view>
								</view>
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">2020年1月14日</view>
								<view>
									<text class="cuIcon-appreciatefill text-red"></text>
									<text class="cuIcon-messagefill text-gray margin-left-sm"></text>
								</view>
							</view>
						</view>
					</view>
		
					<view class="cu-item">
						<view class="cu-avatar round" style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);"></view>
						<view class="content">
							<view class="text-grey">陈萍萍</view>
							<view class="text-gray text-content text-df">
								没想到，你居然是第五大宗师啊！新年快乐！！
							</view>
							<view class="bg-grey padding-sm radius margin-top-sm  text-sm">
								<view class="flex">
									<view>我（五竹）：</view>
									<view class="flex-sub">陈院长，如果不能立足于大地，要这双脚又有何用?</view>
								</view>
							</view>
							<view class="margin-top-sm flex justify-between">
								<view class="text-gray text-df">2020年1月14日</view>
								<view>
									<text class="cuIcon-appreciate text-gray"></text>
									<text class="cuIcon-messagefill text-gray margin-left-sm"></text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapState, mapMutations } from "vuex";
	export default {
		data() {
			return {
				cardCur: 0,
				swiperList: [{
					id: 0,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
				}, {
					id: 1,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
				}, {
					id: 2,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
				}, {
					id: 3,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
				}, {
					id: 4,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
				}, {
					id: 5,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
				}, {
					id: 6,
					type: 'image',
					url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
				}],
				dotStyle: false,
				towerStart: 0,
				direction: ''
			};
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
		computed: {
			...mapGetters(["pageBg"]),
			...mapState({userInfo:'userInfo'})
		},
		methods: {
			DotStyle(e) {
				this.dotStyle = e.detail.value
			},
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			// towerSwiper
			// 初始化towerSwiper
			TowerSwiper(name) {
				let list = this[name];
				for (let i = 0; i < list.length; i++) {
					list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
					list[i].mLeft = i - parseInt(list.length / 2)
				}
				this.swiperList = list
			},

			// towerSwiper触摸开始
			TowerStart(e) {
				this.towerStart = e.touches[0].pageX
			},

			// towerSwiper计算方向
			TowerMove(e) {
				this.direction = e.touches[0].pageX - this.towerStart > 0 ? 'right' : 'left'
			},

			// towerSwiper计算滚动
			TowerEnd(e) {
				let direction = this.direction;
				let list = this.swiperList;
				if (direction == 'right') {
					let mLeft = list[0].mLeft;
					let zIndex = list[0].zIndex;
					for (let i = 1; i < this.swiperList.length; i++) {
						this.swiperList[i - 1].mLeft = this.swiperList[i].mLeft
						this.swiperList[i - 1].zIndex = this.swiperList[i].zIndex
					}
					this.swiperList[list.length - 1].mLeft = mLeft;
					this.swiperList[list.length - 1].zIndex = zIndex;
				} else {
					let mLeft = list[list.length - 1].mLeft;
					let zIndex = list[list.length - 1].zIndex;
					for (let i = this.swiperList.length - 1; i > 0; i--) {
						this.swiperList[i].mLeft = this.swiperList[i - 1].mLeft
						this.swiperList[i].zIndex = this.swiperList[i - 1].zIndex
					}
					this.swiperList[0].mLeft = mLeft;
					this.swiperList[0].zIndex = zIndex;
				}
				this.direction = ""
				this.swiperList = this.swiperList
			},
		}
	}
</script>

<style>
	.history-main{
		background-color: #C12928;
	}
</style>
