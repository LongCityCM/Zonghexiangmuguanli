<template>
	<view class="container">
		<uni-card :title="logDetail.title">
			<view class="log-content">
				{{ logDetail.content }}
			</view>
			<view class="log-images">
				<image v-for="img in logDetail.images" :src="img" mode="widthFix" :key="img" class="log-image"></image>
			</view>
		</uni-card>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logID: '', // 日志 ID
				logDetail: {
					title: '',
					content: '',
					images: []
				}
			};
		},
		onLoad(options) {
			this.logID = options.id;
			this.fetchLogDetail();
		},
		methods: {
			fetchLogDetail() {
				uniCloud.callFunction({
					name: 'getLogDetail', // 确保云函数存在并返回预期的数据格式
					data: {
						id: this.logID
					},
					success: (res) => {
						if (res.result && Array.isArray(res.result.data) && res.result.data.length > 0) {
							this.logDetail = res.result.data[0]; // 确保 res.result.data 是一个非空数组
						} else {
							console.error('No data or empty data returned from the cloud function', res);
							// 这里可以设置一个标志来显示“无数据”或者“加载错误”的提示
						}
					},
					fail: (error) => {
						console.error('Error calling cloud function', error);
						// 处理错误情况
					}
				});
			}
		}
	};
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.log-content {
		margin: 10rpx 0;
	}

	.log-images {
		display: flex;
		flex-wrap: wrap;
	}

	.log-image {
		width: 100%;
		margin-bottom: 10rpx;
	}
</style>