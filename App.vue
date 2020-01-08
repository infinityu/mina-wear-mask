<script>
	import Vue from 'vue'
	export default {
		globalData: {  
		            currentNewsInfo: {}  
		},
		onLaunch: function() {
			console.log('App Launch');
			uni.getSystemInfo({
					success: function(e) {
						// #ifdef MP-WEIXIN
						Vue.prototype.StatusBar = e.statusBarHeight;
						let custom = wx.getMenuButtonBoundingClientRect();
						Vue.prototype.Custom = custom;
						Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
						// #endif		
					}
				})
		},
		onShow: function() {
			console.log('App Show');
			
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/uni.css';
	@import "colorui/animation.css";
	@import "colorui/main.css";
	@import "colorui/icon.css";
	@import "app.css";
	
</style>
