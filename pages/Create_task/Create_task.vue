<template>
	<view class="container">
		<uni-section title="子任务基础信息" type="line">
			<view class="example">
				<uni-forms ref="baseForm" :modelValue="baseFormData">
					<uni-forms-item label="子任务编号" required name="task_ID" label-width="90px">
						<uni-easyinput v-model="baseFormData.task_ID" placeholder="请输入子任务编号" disabled />
					</uni-forms-item>
					<uni-forms-item label="子任务名称" required name="task_name" label-width="90px">
						<view class="location-input">
							<uni-easyinput v-model="baseFormData.task_name" placeholder="请输入子任务的详细名称" />
						</view>
					</uni-forms-item>
					<uni-forms-item label="开始时间" required name="Start_time" label-width="90px">
						<uni-datetime-picker type="datetime" return-type="timestamp"
							v-model="baseFormData.Start_time" />
					</uni-forms-item>
					<uni-forms-item label="结束时间" required name="Latest_date" label-width="90px">
						<uni-datetime-picker type="datetime" return-type="timestamp"
							v-model="baseFormData.Latest_date" />
					</uni-forms-item>
					<uni-forms-item label="子任务描述" required name="task_information" label-width="90px">
						<uni-easyinput type="textarea" v-model="baseFormData.task_information"
							placeholder="请输入子任务描述的内容" />
					</uni-forms-item>
					<uni-forms-item label="任务指派" required name="task_assignment" label-width="90px">
						<uni-data-select v-model="baseFormData.task_assignment" :localdata="sg_personnel_List">
						</uni-data-select>
					</uni-forms-item>
				</uni-forms>
			</view>
		</uni-section>

		<uni-section title="事项清单" type="line">
			<template v-slot:right>
				<text class="add-subtask" @click="add_Matters">&#43;</text> <!-- 修改后的加号按钮 -->
			</template>
			<uni-forms-item v-for="(item,index) in dynamicLists" :key="item.id" :label="item.label+' '+index" required
				:rules="item.rules" :name="'domains[' + item.id + ']'">
				<view class="form-item">
					<uni-easyinput v-model="dynamicFormData.domains[item.id]" placeholder="请输入事项" />
					<button class="button" size="mini" type="default" @click="del_Matters(item.id)">删除</button>
				</view>
			</uni-forms-item>
		</uni-section>
		<view class="button-group">
			<button class="button" type="primary" size="mini" @click="submitForm">提交</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				baseFormData: {
					task_ID: '',
					task_name: '',
					Start_time: Date.now(),
					Latest_date: Date.now() + 24 * 60 * 60 * 1000,
					task_information: '',
					task_assignment: '',
				},
				sg_personnel_List: [],
				addSubtaskDialogVisible: false, // 控制添加子任务对话框的显示
				newSubtask: {
					name: '',
					id: '',
					// 其他可能需要的子任务信息字段
				},
				dynamicFormData: {
					matters: '',
					domains: {}
				},
				dynamicLists: [],
			};
		},
		async created() {
			let currentTimestamp = Date.now();
			this.baseFormData.Start_time = currentTimestamp;
			this.baseFormData.task_ID = await this.generateWorkOrderID(currentTimestamp);
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
						this.sg_personnel_List = res.result.data.map(item => {
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
			add_Matters() {
				this.dynamicLists.push({
					label: '事项',
					rules: [{
						'required': true,
						errorMessage: '事项为必填项'
					}],
					id: Date.now()
				})
			},
			del_Matters(id) {
				let index = this.dynamicLists.findIndex(v => v.id === id)
				this.dynamicLists.splice(index, 1)
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
			justify-content: space-around;
			/* 按钮组使用flex布局并在周围留有空间 */

			.button {
				display: flex;
				align-items: center;
				height: 35px;
				margin-left: 10px;
				/* 可以在这里添加更多按钮的样式 */
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

	.form-item {
		display: flex;
		align-items: center;
	}
</style>