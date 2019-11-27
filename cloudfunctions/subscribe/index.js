const cloud = require('wx-server-sdk');
cloud.init();
const db = cloud.database();

exports.main = async (e, context) => {
  try {
    console.log(e)
    const {OPENID} = cloud.getWXContext();
    // 在云开发数据库中存储用户订阅的课程
    /* const result = await db.collection('messages').add({
      data: {
        touser: OPENID,
        taskId: e.taskId,
        page: '/pages/taskDetail/taskDetail', // 点开卡片要打开的页面 要 通过 id= 任务id来生成
        data: e.data, // 模板的消息
        templateId: e.templateId,
        done: false, // 消息发送状态设置为 false
      },
    }); */
    const result = await db.collection('demo')
      .doc(e.taskId)
      .update({
        // data 传入需要局部更新的数据
        data: {
          touser: OPENID,
          message: e.message,
          templateId: e.templateId,
          notice: e.isNotice
        }
      })
    return result;
  } catch (err) {
    console.log(err);
    return err;
  }
};
