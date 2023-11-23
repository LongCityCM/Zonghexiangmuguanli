<template>
	<view class="container">
		<uni-section title="项目基础信息" type="line">
			<view class="example">
				<uni-forms ref="baseForm" :modelValue="baseFormData">
					<uni-forms-item label="项目编号" required name="project_ID" label-width="75px">
						<uni-easyinput v-model="baseFormData.project_ID" placeholder="请输入项目编号" disabled />
					</uni-forms-item>
					<uni-forms-item label="项目专业" required name="project_specialization" label-width="75px">
						<uni-data-select v-model="baseFormData.project_specialization_type" :localdata="professionList">
						</uni-data-select>
					</uni-forms-item>
					<uni-forms-item label="项目类型" required name="project_type_subtasks" label-width="75px">
						<uni-data-checkbox v-model="baseFormData.project_type" :localdata="project_types"
							@change="handleProjectTypeChange" />
					</uni-forms-item>
					<uni-forms-item label="项目名称" required name="project_name" label-width="75px">
						<view class="location-input">
							<uni-easyinput v-model="baseFormData.project_name" placeholder="请输入项目的详细名称" />
						</view>
					</uni-forms-item>
					<uni-forms-item label="开始时间" required name="Start_time" label-width="75px">
						<uni-datetime-picker type="datetime" return-type="timestamp"
							v-model="baseFormData.Start_time" />
					</uni-forms-item>
					<uni-forms-item label="结束时间" required name="Latest_date" label-width="75px">
						<uni-datetime-picker type="datetime" return-type="timestamp"
							v-model="baseFormData.Latest_date" />
					</uni-forms-item>
					<uni-forms-item label="项目描述" required name="project_information" label-width="75px">
						<uni-easyinput type="textarea" v-model="baseFormData.project_information"
							placeholder="请输入项目描述的内容" />
					</uni-forms-item>
					<uni-forms-item label="项目分配方式" required name="tasks_assigned" label-width="105px">
						<uni-data-checkbox v-model="baseFormData.tasks_assigned" :localdata="tasks_assigneds" />
					</uni-forms-item>
					<uni-forms-item label="项目施工方" required name="project_constructor" label-width="90px"
						v-if="baseFormData.tasks_assigned === 0">
						<uni-data-select v-model="baseFormData.project_specialization_type" :localdata="professionList">
						</uni-data-select>
					</uni-forms-item>
				</uni-forms>
			</view>
		</uni-section>

		<uni-section title="子任务清单" type="line" v-if="showSubTasks">
			<uni-list-chat :avatar-circle="true" title="子任务名称" avatar="/static/zirenwu.png" note="项目描述:此处对子任务进行描述"
				time="2023-09-15 20:20" @click="goToTaskDetails" clickable="true"></uni-list-chat>
			<uni-list-chat :avatar-circle="true" title="子任务名称2" avatar="/static/zirenwu.png" note="项目描述:此处对子任务进行描述"
				time="2023-09-15 20:20" @click="goToTaskDetails" clickable="true"></uni-list-chat>
			<uni-list-chat :avatar-circle="true" title="子任务名称2" avatar="/static/zirenwu.png" note="项目描述:此处对子任务进行描述"
				time="2023-09-15 20:20" @click="goToTaskDetails" clickable="true"></uni-list-chat>
		</uni-section>
		<view class="button-group">
			<button class="button" type="primary" size="mini" @click="submitForm">编辑</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseFormData: {
					project_ID: '',
					project_specialization_type: '',
					project_type: 0,
					project_name: '',
					Start_time: Date.now(),
					Latest_date: Date.now() + 24 * 60 * 60 * 1000,
					project_information: '',
					tasks_assigned: 0,
				},
				professionList: [],
				project_types: [{
					text: '有子任务',
					value: 0
				}, {
					text: '无子任务',
					value: 1
				}],
				tasks_assigneds: [{
					text: '指定工队',
					value: 0
				}, {
					text: '抢单',
					value: 1
				}],
				addSubtaskDialogVisible: false, // 控制添加子任务对话框的显示
				newSubtask: {
					name: '',
					id: '',
					// 其他可能需要的子任务信息字段
				},
			};
		},
		computed: {
			selectedproject_specialization_type() {
				return this.professionList.filter(ticket => this.baseFormData.project_specialization_type.includes(ticket
					.value)).map(ticket => ticket.text);
			},
			selectedproject_type() {
				return this.project_types.filter(types => this.baseFormData.project_type.includes(types.value)).map(
					ctdata => ctdata
					.text);
			},
			selectedtasks_assigned() {
				return this.tasks_assigneds.filter(types => this.baseFormData.tasks_assigned.includes(assigneds.value))
					.map(
						ctdata => ctdata
						.text);
			},
			showSubTasks() {
				return this.baseFormData.project_type === 0;
			},
		},
		async created() {
			let currentTimestamp = Date.now();
			this.baseFormData.Start_time = currentTimestamp;
			this.baseFormData.project_ID = await this.generateWorkOrderID(currentTimestamp);
		},
		onLoad() {
			this.loadProfessionList();
		},
		methods: {
			async loadProfessionList() {
				try {
					const res = await uniCloud.callFunction({
						name: 'getProfessionList'
					});
					if (res.result && res.result.data && res.result.data.length > 0) {
						this.professionList = res.result.data.map(item => {
							return {
								text: item.xiangmuzhuanye_name,
								value: item._id
							}
						});
					}
				} catch (error) {
					console.error("获取项目类型错误", error);
				}
			},
			async generateWorkOrderID(timestamp) {
				const date = new Date(timestamp);
				let month = (date.getMonth() + 1).toString().padStart(2, '0');
				let day = date.getDate().toString().padStart(2, '0');
				let hours = date.getHours().toString().padStart(2, '0');
				let minutes = date.getMinutes().toString().padStart(2, '0');
				let seconds = date.getSeconds().toString().padStart(2, '0');
				let milliseconds = date.getMilliseconds().toString().padStart(3, '0');
				// 构建工单号：'TY' + 年 + 月 + 日 + 时 + 分 + 秒 + 毫秒
				return date.getFullYear() + month + day + hours + minutes + seconds + milliseconds;
			},
			submitForm() {
				let baseFormData = this.baseFormData;

				if (!baseFormData.project_specialization_type) {
					this.showToast('请输入项目专业');
					return false;
				}

				const formData = {
					...baseFormData,
					project_specialization_type: this.selectedproject_specialization_type,
					project_type: this.selectedproject_type,
					tasks_assigned: this.selectedtasks_assigned,
				};

				console.log('Submitting form data:', formData);

				uniCloud.callFunction({
					name: 'addTicket',
					data: formData,
					success: (res) => {
						if (res.result.status === 'success') {
							uni.showToast({
								title: `提交成功`,
								complete: () => {
									setTimeout(() => {
										uni.reLaunch({
											url: '/pages/Ticket_process/Ticket_process'
										});
									}, 2000);
								}
							})
						} else {
							uni.showModal({
								title: '提交失败',
								content: res.result.msg,
								showCancel: false
							});
						}
					},
					fail: (err) => {
						uni.showModal({
							title: '提交失败',
							content: '无法连接到服务器',
							showCancel: false
						});
					}
				});
			},
			showToast(msg) {
				uni.showModal({
					title: '提示',
					content: msg,
					showCancel: false,
				});
			},
			handleProjectTypeChange(value) {

			},
			goToTaskDetails() {
				uni.navigateTo({
					url: '/pages/Task_details/Task_details'
				});
			},
		}
	}
</script>

<style lang="scss">
	.container {
		.example {
			padding: 15px;
			background-color: #fff;
			/* 背景颜色设置为白色 */
		}

		.button-group {
			margin-top: 15px;
			display: flex;
			justify-content: center;
			/* 更新此行为 center */

			.button {
				display: flex;
				align-items: center;
				height: 35px;
				/* 其他样式保持不变 */
			}
		}
	}

	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		/* 样式为标题 */
	}

	.add-subtask {
		/* 样式为加号按钮 */
	}
</style>