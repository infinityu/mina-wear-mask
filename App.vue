<script>
	import Vue from 'vue'
	let sysInfo = uni.getSystemInfoSync();
	let WINDOW_HEIGHT = sysInfo.windowHeight;
	export default {
		globalData: {  
		    WINDOW_HEIGHT: WINDOW_HEIGHT,
			PAGE_BG_COLOR: '#C12928'
		},
		onLaunch: function() {
			console.log('App Launch');
			if (!wx.cloud) {
				console.error('请使用 2.2.3 或以上的基础库以使用云能力');
			} else {
				wx.cloud.init({
					traceUser: true
				});
			}
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
