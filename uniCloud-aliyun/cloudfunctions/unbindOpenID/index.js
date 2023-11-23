'use strict';
const db = uniCloud.database()
const userCollection = db.collection('users')

exports.main = async (event, context) => {
  const { openID } = event
  const openid = openID.openid;
  await userCollection.where({ openid }).update({ openid: '' });
}