'use strict';
// 云函数入口文件
exports.main = async (event, context) => {
  const { name, id } = event; // 从event中解构出子任务的名称和编号
  if (!name || !id) {
    return { success: false, message: '缺少必要的子任务信息' };
  }

  // 初始化云数据库
  const db = uniCloud.database();
  const collection = db.collection('subtasks'); // 假设你的集合名称为 subtasks

  try {
    // 将子任务数据添加到数据库
    const result = await collection.add({
      name,
      id,
      // 可以添加其他相关信息，如创建时间等
      createTime: new Date(),
    });

    // 返回成功的响应
    return { success: true, data: result.id }; // result.id 是添加到数据库的记录的ID
  } catch (error) {
    // 如果出现错误，返回失败的响应
    return { success: false, message: error.message };
  }
};
