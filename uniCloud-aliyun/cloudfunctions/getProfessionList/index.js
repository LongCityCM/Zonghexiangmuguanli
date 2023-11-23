'use strict';

exports.main = async (event, context) => {
	try {
		const db = uniCloud.database();
		const res = await db.collection('xiangmuzhuanye_list').get();
		return res;
	} catch (error) {
		return {
			status: -1,
			msg: error.message
		}
	}
}