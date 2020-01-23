<template>
	<view>
	    <web-view :webview-styles="webviewStyles" :src="articleUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleUrl: '',
				webviewStyles: {
					progress: {
						color: '#C12928'
					}
				}
			}
		},
		onLoad() {
			this.articleUrl = getApp().globalData.questionUrl;
		},
		onShow() {
			this.webviewStyles.progress.color = getApp().globalData.PAGE_BG_COLOR;
		}
	}
</script>

<style>
</style>
