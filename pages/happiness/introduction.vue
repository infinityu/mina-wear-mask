<template>
	<view>
	    <web-view :webview-styles="webviewStyles" :src="articleUrl"></web-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				articleUrl: 'https://mp.weixin.qq.com/s?__biz=MzU3NTA4NjIwMw==&tempkey=MTA0NF90U1NRZ3FwaXlSeVNDRHJVT2Z1THNFN3cybjFWZlBxNHlmemVOdXRBLTBXQlJtZjE3d0dXNTFYQnd1WjBzb0pyenFBN0dZWHEyRmVSUW8zbHhyRk9uMXB4MHluSi13YnNwSXJTVU4wWGMzZnM0UXpTM0VQLTUzTEY0QU40emVuU3JnbmdTclNZeEJFYU83OTdVNjUteDFOUHdxQ1FpanlPaW9Rb2RBfn4%3D&chksm=7d2a8d364a5d04208f1e04fdfaa2b491fdc83ee401a0ddfd55623b495010dc52dd937ea46dcb&mpshare=1&scene=1&srcid=0121GtSmfTihtt3KihzSx1t7&sharer_sharetime=1579607156661&sharer_shareid=15ee934cc1c990ab4124c0090c22f450#wechat_redirect',
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
