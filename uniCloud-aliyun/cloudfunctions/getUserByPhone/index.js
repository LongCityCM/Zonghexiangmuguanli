'use strict';
const db = uniCloud.database()
const userCollection = db.collection('users')

exports.main = async (event, context) => {
  const { openID } = event
  const openid = openID.openid;
  const user = await userCollection.where({ openid }).get()
  if (user.data.length > 0) {
    return user.data[0]
  } else {
	  return null
  }
}