const cloud = require('wx-server-sdk');

exports.main = async (event, context) => {
  cloud.init();
  const db = cloud.database();
  const _ = db.command
  const $ = db.command.aggregate
  console.log('--通知调用--');
  const Timestamp = +new Date()
  /* const preMin = (Timestamp - 600000)
  const nextMin = (Timestamp + 600000) */
  // console.log(Timestamp, preMin);
  
  // var d = new Date('2019-10-01'), d2 = new Date('2019-11-01 12:00:00')
  // var preMin = new Date(Timestamp - 600000), nextMin = new Date(Timestamp + 600000)
  /* var preMin = new Date('2019-11-29'), nextMin = new Date('2019-11-30')
  var a = $.dateFromString({
      dateString: preMin.toJSON()
  }), a2 = $.dateFromString({
      dateString: nextMin.toJSON()
  })
  console.log(new Date(db.serverDate()).toLocaleString()); */
  


  try {
    // 从云开数据库中查询等待发送的消息列表
    /* const messages = await db.collection('demo').aggregate()
    .match({
      done: false,
      // notice: true
    })
    .addFields({
        matched: $.and([$.gte(['$remindDate', a]), $.lte(['$remindDate', a2])]),
    })
    .match({
        matched: true
    })
    .end();
    console.log(messages); */
    
    const messages = await db
      .collection('demo')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
        done: false,
        notice: true,
        // remindDate: _.gte(preMin).and(_.lte(nextMin))
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async res => {
      try {
        // 发送订阅消息
        console.log(res);
        await cloud.openapi.subscribeMessage.send({
          touser: res.touser,
          page: res.page,
          data: res.message,
          // templateId: 'lpT7pYMb_irS75lxytdtb1JbhyTR75noRtbFST-DZwk',
          templateId: res.templateId,
        });
        // 发送成功后将消息的通知关闭
        return db
          .collection('demo')
          .doc(res._id)
          .update({
            data: {
              notice: false,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  }
  /* try {
    // 从云开数据库中查询等待发送的消息列表
    const messages = await db
      .collection('messages')
      // 查询条件这里做了简化，只查找了状态为未发送的消息
      // 在真正的生产环境，可以根据开课日期等条件筛选应该发送哪些消息
      .where({
        done: false,
      })
      .get();

    // 循环消息列表
    const sendPromises = messages.data.map(async message => {
      try {
        // 发送订阅消息
        console.log(message);
        await cloud.openapi.subscribeMessage.send({
          touser: message.touser,
          page: message.page,
          data: message.data,
          templateId: message.templateId,
        });
        // 发送成功后将消息的状态改为已发送
        return db
          .collection('messages')
          .doc(message._id)
          .update({
            data: {
              done: true,
            },
          });
      } catch (e) {
        return e;
      }
    });

    return Promise.all(sendPromises);
  } catch (err) {
    console.log(err);
    return err;
  } */
};