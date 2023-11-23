<template>
	<view>
		<uni-navbar title="工程日志"></uni-navbar>
		<uni-section title="日志列表" type="line">
			<uni-list>
				<uni-list-item v-for="log in logList" :key="log.id" :title="log.title" clickable
					@click="navigateToLogDetail(log.id)" :note="log.date + ' - ' + log.previewContent"
					:thumb="log.thumbnail" thumb-size="lg" showArrow>
				</uni-list-item>
			</uni-list>
		</uni-section>
		<uni-fab content="上报日志" @trigger="triggerReportLog" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				logList: [],
				renwuID: 'task001' // 从上一个页面获取或设定
			};
		},
		onShow() {
			this.fetchLogList();
		},
		methods: {
			fetchLogList() {
				uniCloud.callFunction({
					name: 'getLogList',
					data: {
						renwuID: this.renwuID
					},
					success: (res) => {
						if (res.result && res.result.data) {
							// 确保 res.result.data 是一个数组
							this.logList = res.result.data.sort((a, b) => new Date(b.date) - new Date(a.date));
						} else {
							// 处理错误或空结果的情况
							console.error('No data returned from the cloud function', res);
						}
					},
					fail: (error) => {
						console.error('Error calling cloud function', error);
					}
				});
			},
			navigateToLogDetail(logId) {
				uni.redirectTo({
					url: `/pages/LogDetail/LogDetail?id=${logId}`
				});
			},
			triggerReportLog() {
				uni.redirectTo({
					url: '/pages/ReportLog/ReportLog'
				});
			}
		}
	};
</script>

<style>
	page {
		background-color: #f0f0f0;
		/* 设置页面背景颜色 */
	}

	.uni-list-item {
		margin-bottom: 10px;
		/* 列表项之间的间距 */
		border-radius: 8px;
		/* 列表项的圆角 */
		background-color: #ffffff;
		/* 列表项的背景颜色 */
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
		/* 列表项的阴影效果 */
	}

	.uni-list-item-title {
		font-size: 16px;
		/* 标题字体大小 */
		color: #333333;
		/* 标题字体颜色 */
	}

	.uni-list-item-note {
		font-size: 14px;
		/* 说明文字字体大小 */
		color: #666666;
		/* 说明文字字体颜色 */
	}

	.uni-fab {
		background-color: #007AFF;
		/* 悬浮按钮的背景颜色 */
		color: white;
		/* 悬浮按钮的文字颜色 */
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
		/* 悬浮按钮的阴影效果 */
	}
</style>