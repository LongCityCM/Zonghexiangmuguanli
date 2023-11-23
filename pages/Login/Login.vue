<template>
	<view class="content">
		<image class="logIn" src="/static/kanbanPMS.png"></image>
		<view class="text-area">
			<text class="title">小移综合项目管理平台</text>
		</view>
		<view class="InputAera">
			<view class="inputAera1">
				<view class="PhoneNumberInput">
					<text>手机号</text>
					<input v-model="phone" class="PhoneNumber" rule="^1[0-9]{10,10}$" placeholder="请输入手机号" maxlength="11"/>
				</view>
			</view>
			<view class="inputAera2">
				<view class="TextInput">
					<text>验证码</text>
					<input class="PhoneNumberTest" required type="number" placeholder="请输入验证码">
					<button class="TestB" size="mini" >{{countdown > 0 ? `${countdown}s` : '获取验证码'}}</button>
				</view>
			</view>
			<view class="Btn">
				<button class="LogInB" @click="navigateToNew()">登录</button>
			</view>
		</view>		
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
			navigateToNew() {
			    // 使用模板字符串来插入变量
			    let url = `/pages/Task_management/Task_management`;
			    uni.navigateTo({
			        url: url
			    });
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url,
					})
					},
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logIn {
		height: 500rpx;
		width: 100%;
		margin-top: 0rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}
	.InputAera{
		flex: flex;
		flex-direction: column;
	}
	.inputAera1{
		width: 600rpx;
		height:100rpx;
		margin-top: 50rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}
	.inputAera2{
		width: 600rpx;
		height:100rpx;

	}
	.TextInput{
		display: flex;
				justify-content: center;
	}
	input{
		/* border: 1px solid #000; */
	}
	.PhoneNumberInput{
		display: flex;
	}
	.PhoneTestInput{
		display: flex;
	}
	.PhoneNumber{
		width: 250rpx;
		margin-bottom: 50rpx;
		margin-left: 20rpx;
	}
	.PhoneNumberTest{
		width: 200rpx;
		margin-left: 20rpx;
	}
	.TestB{
		width: 240rpx;
		height: 60rpx;
		border-radius: 20rpx;
	}
	.LogInB{
		margin-top: 30rpx;
		color: #2b7bf5;
	}
	.submit-btn,
	.cancel-btn {
		display: block;
		margin-top: 20rpx;
		padding: 10rpx;
		font-size: 26rpx;
		color: #ffffff;
		border-radius: 4px;
	}
	
	.submit-btn {
		background-color: #1AAD19;
	}
	
	.cancel-btn {
		color: #353535;
		background-color: #f5f5f5;
	}
</style>
