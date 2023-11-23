'use strict';
exports.main = async (event, context) => {
	try {
		const db = uniCloud.database();
		// 这里以 renwu_ID 作为查询条件，您可以根据实际情况调整
		const {
			id
		} = event;
		const res = await db.collection('task_log_list')
			.where({
				id: id
			})
			.get();
		return res;
	} catch (error) {
		return {
			status: -1,
			msg: error.message
		}
	}
}