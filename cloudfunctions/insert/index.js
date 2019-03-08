
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
    const {userInfo, datalist} = event
    const wxContext = cloud.getWXContext()
    console.log(datalist)
    // 先删除老数据
    const exams = db.collection('exams');
    await exams.where({
      openid: wxContext.OPENID,
    }).remove();
    // 插入新的
    for (let i=0; i<datalist.length; i++) {
      await exams.add({
        data: datalist[i]
      })
    }

    return true;
  } catch(e) {
    console.error(e);
  }
}
