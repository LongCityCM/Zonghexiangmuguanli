<template>
	<view>
		<uni-fab ref="fab" :content="content" @trigger="trigger" />
		<uni-section title="计划项目列表" type="line">
			<uni-list>
				<uni-list-item title="测试项目" clickable @click="navigateToDetail('计划项目','安装工单')" note="项目描述，显示前11个字......"
					showArrow thumb="/static/xiangmu_blue.png" thumb-size="lg">
				</uni-list-item>
			</uni-list>
		</uni-section>
		<uni-section title="进行中的项目" type="line">
			<uni-list>
				<uni-list-item title="测试项目" clickable @click="navigateToDetail('进行中的项目','我起草的工单')" note="项目描述，显示前11个字......"
					thumb="/static/xiangmu_blue.png" thumb-size="lg" showArrow>
				</uni-list-item>
				<uni-list-item title="测试项目" clickable @click="navigateToDetail('进行中的项目','我起草的工单')" note="项目描述，显示前11个字......"
					thumb="/static/xiangmu_yellow.png" thumb-size="lg" showArrow>
				</uni-list-item>
				<uni-list-item title="测试项目" clickable @click="navigateToDetail('进行中的项目','我起草的工单')" note="项目描述，显示前11个字......"
					thumb="/static/xiangmu_red.png" thumb-size="lg" showArrow>
				</uni-list-item>
			</uni-list>
		</uni-section>
		<uni-section title="已归档项目" type="line">
			<uni-list>
				<uni-list-item title="测试项目" clickable @click="navigateToDetail('审批工单','安装工单')" note="项目描述，显示前11个字......"
					thumb="/static/xiangmu_hui.png" thumb-size="lg" showArrow>
				</uni-list-item>
			</uni-list>
		</uni-section>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: [{
						iconPath: '/static/xinjian_renwu.png',
						text: '新建项目',
						clicked: false,
						url: '/pages/Create_characters/Create_characters'
					}
				],
				get_userInfo: '',
				user_permission: '',
			};
		},
		onShow() {
			// This creates a new copy of the array which should cause the fab to rerender
			this.content = [...this.content.map(item => ({
				...item,
				clicked: false
			}))];
		},
		methods: {
			navigateToDetail(type1, type2) {
				// 使用模板字符串来插入变量
				let url = `/pages/Project_details/Project_details?type1=${type1}&type2=${type2}`;
				uni.navigateTo({
					url: url
				});
			},
			trigger(e) {
				if (!this.content[e.index].clicked) {
					this.content[e.index].clicked = true
					uni.navigateTo({
						url: this.content[e.index].url
					})
				}
			},
			navigateTo(url) {
				uni.navigateTo({
					url: url
				})
			},
		}
	};
</script>

<style>
	page {
		background: #f0f0f0;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-bottom: 50rpx;
	}
</style>