<template>
	<view>
	    <web-view :webview-styles="webviewStyles" :src="articleUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleUrl: 'https://mp.weixin.qq.com/s?__biz=MzU3NTA4NjIwMw==&tempkey=MTA0M19WQnVPWE5kMXY3TkFBRU02ZXIzUXFCazhuTjNJSmZSNXJNOGthbDUyZWo1YWpQbXZCXzhIRV83RmpjVFF2NHQzSXJlelBQQk5SZXprbUpyV3N5WlBEREpZV2EybmVjUGJTMEFSelpUZ2lkeFBfTHRTZnkxdUNEeXZIa0ZZRGMxM2lXWElPUGcwdU1HQnRsTXBLeWlYYXlPQTh2TnFsUXRmQjhFUFhRfn4%3D&chksm=7d2a8e724a5d0764e2be281f092be0a3294467c081c1c207c694c046d9d25272b16cd59f1a7d&mpshare=1&scene=1&srcid=0113OCMefjgpQvzEiX98yppU&sharer_sharetime=1578898894629&sharer_shareid=15ee934cc1c990ab4124c0090c22f450#wechat_redirect',
				webviewStyles: {
					progress: {
						color: '#C12928'
					}
				}
			}
		},
		onShow() {
			this.webviewStyles.progress.color = getApp().globalData.PAGE_BG_COLOR;
		}
	}
</script>

<style>
</style>
