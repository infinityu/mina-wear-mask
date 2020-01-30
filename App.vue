<script>
	import Vue from 'vue'
	let sysInfo = uni.getSystemInfoSync();
	let WINDOW_HEIGHT = sysInfo.windowHeight;
	let IS_ANDROID = !sysInfo.model.includes('iPhone');
	let envId = 'ncov-production-wwomb';
	let collectionName = 'mp_launch_config';
	let docId = 'mp_launch_config_doc';
	export default {
		globalData: {  
		    WINDOW_HEIGHT: WINDOW_HEIGHT,
			IS_ANDROID: IS_ANDROID,
			cropImageFilePath: '',
			rapaintAfterCrop: false,
			PAGE_BG_COLOR: '#C12928',
			enableSecurityCheck: true,
			userAvatarUrl: null,
			userAvatarFilePath: null
			
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
			
			const db = wx.cloud.database({
				env: envId,
				traceUser: true
			});
			
			db.collection(collectionName).doc(docId).get().then(res => {
				getApp().globalData.enableSecurityCheck = res.data.enableSecurityCheck;
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
