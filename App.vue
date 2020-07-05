<script>
	import Vue from 'vue'
	let sysInfo = uni.getSystemInfoSync();
	let windowHeight = sysInfo.windowHeight;
	let IS_ANDROID = !sysInfo.model.includes('iPhone');
	let statusBarHeight = sysInfo.statusBarHeight;
	const STORAGE_KEY = 'PLUG-ADD-MYAPP-KEY';
	const envId = 'ncov-production-wwomb';
	// const collectionName = 'mp_launch_config';
	const collectionName = 'config_jill';
	const docId = 'mp_launch_config_doc';
	export default {
		globalData: {  
			IS_ANDROID: IS_ANDROID,
		    windowHeight: windowHeight,
			statusBarHeight: statusBarHeight,
			SHOW_TIP: false,
			duration: 20,
			cropImageFilePath: '',
			rapaintAfterCrop: false,
			PAGE_BG_COLOR: '#C12928',
			enableSecurityCheck: true,
			userAvatarUrl: null,
			userAvatarFilePath: null,
			maskAvatarSavedTempPath: null
			
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
				console.log("enableSecurityCheck", getApp().globalData.enableSecurityCheck);
			})
			
			Vue.prototype.ColorList = [{
						title: '嫣红',
						name: 'red',
						color: '#e54d42'
					},
					{
						title: '桔橙',
						name: 'orange',
						color: '#f37b1d'
					},
					{
						title: '明黄',
						name: 'yellow',
						color: '#fbbd08'
					},
					{
						title: '橄榄',
						name: 'olive',
						color: '#8dc63f'
					},
					{
						title: '森绿',
						name: 'green',
						color: '#39b54a'
					},
					{
						title: '天青',
						name: 'cyan',
						color: '#1cbbb4'
					},
					{
						title: '海蓝',
						name: 'blue',
						color: '#0081ff'
					},
					{
						title: '姹紫',
						name: 'purple',
						color: '#6739b6'
					},
					{
						title: '木槿',
						name: 'mauve',
						color: '#9c26b0'
					},
					{
						title: '桃粉',
						name: 'pink',
						color: '#e03997'
					},
					{
						title: '棕褐',
						name: 'brown',
						color: '#a5673f'
					},
					{
						title: '玄灰',
						name: 'grey',
						color: '#8799a3'
					},
					{
						title: '草灰',
						name: 'gray',
						color: '#aaaaaa'
					},
					{
						title: '墨黑',
						name: 'black',
						color: '#333333'
					},
					{
						title: '正红',
						name: 'redNormal',
						color: '#ff0000'
					},
				]
			
			
			
		},
		onShow: function() {
			console.log('App Show');
			// 判断是否已经显示过
			let cache = uni.getStorageSync(STORAGE_KEY);
			console.log('cache', cache);
			if (!cache) {
				// 没显示过，则进行展示
				this.globalData.SHOW_TIP = true;
				let _this = this;
				console.log('SHOW_TIP', _this.globalData.SHOW_TIP);
				// 关闭时间
				setTimeout(() => {
					_this.globalData.SHOW_TIP = false;
				}, _this.globalData.duration * 1000);
			}
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
