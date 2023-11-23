// cloudfunctions/your_cloud_function_name/index.js
const db = uniCloud.database();

exports.main = async (event, context) => {
	if (event.action === 'fetchTasks') {
		const tasksCollection = db.collection('renwu_list');
		const res = await tasksCollection.where({ renwu_zhuangtai: event.status }).get();
		return res;
	}

	return {
		code: 404,
		message: 'Unknown action'
	};
};
