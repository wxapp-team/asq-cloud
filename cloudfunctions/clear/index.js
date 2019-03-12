
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init()

const db = cloud.database()
const _ = db.command
/**
 * 新增记录
 */
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const exams = db.collection('exams');
    const user = db.collection('user');
    await user.where({
      openid: _.neq(-1),
    }).remove();
    return await exams.where({
      openid: _.neq(-1),
    }).remove();
  } catch(e) {
    console.error(e);
  }
}
