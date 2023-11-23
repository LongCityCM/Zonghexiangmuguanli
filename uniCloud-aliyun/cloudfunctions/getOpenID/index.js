'use strict';
const https = require("https");
exports.main = async (event, context) => {
  const { code } = event
  if (!code) {
    return {
      code: 500,
      msg: '缺少 code 参数'
    }
  }
  // 微信小程序 AppID 和 AppSecret
  const appId = 'wx62cd4b1fe56fa2e2'
  const appSecret = 'f639e69a1afae5d663a49efe4aa17541'
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecret}&js_code=${code}&grant_type=authorization_code`
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          if (parsedData.errcode) {
            reject({ code: parsedData.errcode, msg: parsedData.errmsg });
          } else {
            resolve({ openid: parsedData.openid });
          }
        } catch (error) {
          reject({ code: 500, msg: "解析响应数据失败" });
        }
      });
    }).on("error", (error) => {
      reject({ code: 500, msg: error.message });
    });
  });
}