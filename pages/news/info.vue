<template>
	<view class="content">
		<view class="title">
			{{title}}
		</view>
		<view>
			<rich-text :nodes="content"></rich-text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title:'',
				content:''
			}
		},
		methods: {
			
		},
		onLoad:function(){
			this.title = getApp().globalData.currentNewsInfo.title;
			this.content = getApp().globalData.currentNewsInfo.content;
			console.log(getApp().globalData.currentNewsInfo);
		}
	}
</script>

<style>
.content{
	padding: 10upx 2%;
	width: 96%;
	flex-wrap: wrap;
}

.title{
	line-height: 2em;
	font-weight: 700;
	font-size: 38upx;
}
	
</style>
