import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		imgPath: "https://mina-img-store-1258554429.cos.ap-shanghai.myqcloud.com/new-year-wish/",
		userInfo: null
	},
	getters: {
		// add happiness 
		defaultAvatarUrl: function(state){
			return state.imgPath + "avatar_happiness_default.png";
		},
		// page 1
		pageBg: function(state) {
			return state.imgPath + "page-bg.png";
		},
		avatarBg: function(state) {
			return state.imgPath + "avatar-circle.png";
		},
		kids: function(state) {
			return state.imgPath + "kids-trans.png";
		},
		greetings: function(state) {
			return state.imgPath + "greetings.png";
		},
		countDown: function(state) {
			return state.imgPath + "count-down.png";
		},
		nextIcon: function(state) {
			return state.imgPath + "next-icon.png";
		},
		// page 2
		mouseHappiness: function(state) {
			return state.imgPath + "mouse-happiness.png";
		},
		bannerWishMouseYear: function(state) {
			return state.imgPath + "banner-wish.png";
		},
		// page 3
		littleYear: function(state) {
			return state.imgPath + "pic-little-year.png";
		},
		bannerWishRec: function(state) {
			return state.imgPath + "banner-wish-rec.png";
		},
		// page 4
		mouse2020: function(state) {
			return state.imgPath + "mouse-2020.png";
		},
		// page 5
		mouseMoney: function(state) {
			return state.imgPath + "mouse-money.png";
		},
		// page 6
		picDinner: function(state) {
			return state.imgPath + "pic-dinner.png";
		},
		// page 7
		pic2020Hot: function(state) {
			return state.imgPath + "pic-2020-hot.png";
		},
		picSpringFestival: function(state) {
			return state.imgPath + "pic-spring-festival.png";
		},
		mouseCute: function(state) {
			return state.imgPath + "mouse-cute.png";
		},
		// page 8
		mouseOnCoin: function(state) {
			return state.imgPath + "mouse-on-coin.png";
		},
		//...
		wishMsg1: function(state) {
			return state.imgPath + "wish-msg-1.png";
		},
		wishMsg2: function(state) {
			return state.imgPath + "wish-msg-2.png";
		},
		wishMsg3: function(state) {
			return state.imgPath + "wish-msg-3.png";
		},
		wishMsg4: function(state) {
			return state.imgPath + "wish-msg-4.png";
		},
		wishMsg5: function(state) {
			return state.imgPath + "wish-msg-5.png";
		},
		wishMsg6: function(state) {
			return state.imgPath + "wish-msg-6.png";
		},
	},
	mutations: {
		saveLoginUserInfo(state, value){
			state.userInfo = value;
		}
	},
	actions: {}
})
export default store
