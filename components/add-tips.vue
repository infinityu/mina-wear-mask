<template>
	<view>
		<view class="box" :style="{top: statusBarHeight+30+'px' }" v-if="SHOW_TOP">
			<view class='arrow'></view>
			<view class='body' @click='showModal'>
				<text>{{text}}</text>
			</view>
		</view>

		<!-- modal -->
		<view class='modal' v-if="SHOW_MODAL">
			<view style='flex-direction: row;align-items:center; margin-top: 40px;'>
				<text>1. 点击</text>
				<image src='/static/image/addTips/fav-1.jpg' style='width:100px;height:40px;'></image>
			</view>
			<view>
				<text>2. 点击「添加到我的小程序」</text>
				<image src='/static/image/addTips/fav-2.jpg' mode="widthFix" style='width: 650rpx;'></image>
			</view>
			<view>
				<text>3. 微信首页下拉，快速进入小程序</text>
				<!-- <image src='/static/image/addTips/fav-3.jpg' style='width:100%;height:150px;'></image> -->
			</view>

			<!-- 知道了 -->
			<view class='ok-btn' hover-class='btn-hover' @click='okHandler'>
				<view>
					<text>我知道了！</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY'
	export default {
		name: "add-tips",
		/**
		 * 组件的初始数据
		 */
		data() {
			return {
				SHOW_TOP: true,
				SHOW_MODAL: false
			}
		},
		props: {
			// 提示文字
			text: {
				type: String,
				default: '点击「添加小程序」，下次访问更便捷 >'
			},
			// 多少秒后关闭
			duration: {
				type: Number,
				default: 5
			},
			statusBarHeight: {
				type: Number,
				default: 0
			}
		},
		/**
		 * 组件的方法列表
		 */
		methods: {
			// 显示全屏添加说明
			showModal: function() {
				this.SHOW_MODAL = true;
				this.SHOW_TOP = false;
			},

			okHandler: function() {
				this.SHOW_MODAL = false;
				uni.setStorage({
					key: STORAGE_KEY,
					data: +new Date,
				});
			}
		}
	}
</script>

<style>
	.box {
		position: fixed;
		/* top: 50px; */
		/* left: 0; */
		right: 0;
		z-index: 999;
		display: flex;
		justify-content: flex-end;
		align-items: flex-end;
		flex-direction: column;
		width: 600rpx;
	}

	.arrow {
		width: 0;
		height: 0;
		margin-right: 120rpx;
		border-width: 20rpx;
		border-style: solid;
		border-color: transparent transparent #34b5e2 transparent;
	}

	.body {
		background-color: #34b5e2;
		box-shadow: 0 10rpx 20rpx -10rpx #34b5e2;
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 84rpx;
		padding: 0 20rpx;
		margin-right: 40rpx;
	}

	.body>text {
		color: #FFF;
		font-size: 28rpx;
		font-weight: 400;
	}

	.modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 999;
		background-color: rgba(255, 255, 255, 0.9);
		padding: 20px;
	}
	
	.modal>view {
		margin: 10px 0;
		display: flex;
		/* align-items: center; */
		flex-direction: column;
	}

	.modal>view>text {
		font-size: 16px;
		font-weight: 400;
		margin-bottom: 5px;
		color: #333;
	}

	.modal>view>image {
		border-radius: 10px;
	}

	.ok-btn {
		width: 100%;
		margin-top: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.ok-btn>view {
		height: 40px;
		width: 120px;
		background-color: #34b5e2;
		box-shadow: 0 5px 10px -px #34b5e2;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 40px;
	}

	.ok-btn>view>text {
		font-size: 14px;
		color: #fff;
		font-weight: 400;
	}

	.btn-hover {
		opacity: 0.6;
	}
</style>
