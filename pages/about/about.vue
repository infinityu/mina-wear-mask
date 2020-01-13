<template>
	<view class="main" :style="{height:windowHeight+'px'}"  style="overflow: hidden">
        <!-- <web-view :webview-styles="webviewStyles" src="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU3NTA4NjIwMw==&scene=124#wechat_redirect"></web-view> -->
		<!-- <image class="page-bg"  mode="aspectFill" :src="pageBg"></image> -->
		<view class="cu-list menu aboutContent" :class="[menuBorder?'sm-border':'',menuCard?'card-menu margin-top':'']">
			<!-- <view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-btn text-green"></text>
					<text class="text-grey">申请公众号关联小程序</text>
				</view>
			</view> -->
			<view class="cu-item" :class="menuArrow?'arrow':''" @click="tucao">
				<view class="content">
					<text class="cuIcon-comment text-green"></text>
					<text class="text-grey">意见反馈</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm"></text>
				</view>
			</view>
			<!-- <view class="cu-item" :class="menuArrow?'arrow':''">
				<view class="content">
					<text class="cuIcon-more text-red  margin-right-xs"></text>
					<text class="text-grey">更多小程序</text>
				</view>
				<view class="action">
					<text class="text-grey text-sm"> 敬请期待！</text>
				</view>
			</view> -->
			<!-- <view class="cu-item">
				<view class="content padding-tb-sm">
					<view>
						<text class="cuIcon-clothesfill text-blue margin-right-xs"></text> 多行Item</view>
					<view class="text-gray text-sm">
						<text class="cuIcon-infofill margin-right-xs"></text> 小目标还没有实现！</view>
				</view>
				<view class="action">
					<switch class="switch-sex" @change="SwitchSex" :class="skin?'checked':''" :checked="skin?true:false"></switch>
				</view>
			</view> -->
		</view>
		<view class="margin-top-xl grid justify-around" @click="showModal" data-target="Modal">
			<view class="grid col-1">
				<image style="width: 450rpx; height: 450rpx;" mode="aspectFill" :src="officialAccountUrl"></image>
			</view>
			<view class="grid col-1">
				<text class="text-grey margin-top">   更多精彩，请关注公众号【人文之窗】 </text>
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
			...mapGetters(["pageBg", "defaultAvatarUrl"]),
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
			}
		}
    }
</script>

<style>
	.main{
		background-color: #C12928;
		height: 1334rpx;
		width: 750rpx;
		padding-top: 50px;
	}
	
	.aboutContent{
		width: 690rpx;
		/* margin-top: 75px; */
	}
</style>