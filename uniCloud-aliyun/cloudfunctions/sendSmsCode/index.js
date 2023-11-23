'use strict';
const crypto = require('crypto');
const axios = require('axios');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name in interfaces) {
    const iface = interfaces[name];
    for (const ifaceInfo of iface) {
      if (ifaceInfo.family === 'IPv4' && !ifaceInfo.internal) {
        return ifaceInfo.address;
      }
    }
  }
  return null;
}

const localIP = getLocalIP();
console.log('服务器本地 IP 地址:', localIP);

exports.main = async (event, context) => {
  const sourceid = '044018';
  const sourcekey = 'ZtrT849uK4fQRicP';
  const sendSmsCodeUrl = 'https://moss.cmpassport.com/api/sendSmsCode';
  
  function hmacsha256(secret, data) {
    const dataHash = crypto
      .createHash('md5')
      .update(data, 'utf8')
      .digest();
  
    const secretHash = crypto
      .createHash('md5')
      .update(secret, 'utf8')
      .digest();
  
    const hmac = crypto.createHmac('sha256', secretHash);
    const doFinal = hmac.update(dataHash).digest();
  
    return doFinal.toString('hex').toLowerCase();
  }
  
  function getMac(header, body) {
    const requestHeader = new Map(Object.entries(body));
    const requestData = new Map(Object.entries(header));

    const sortedHeader = new Map([...requestData].sort());
    const sortedBody = new Map([...requestHeader].sort());
  
    const sortedData = {
		body: fromEntries(sortedBody),
		header: fromEntries(sortedHeader),
    };
  
    const data = JSON.stringify(sortedData);
    const mac = hmacsha256(sourcekey, data);
  
    sortedHeader.set('mac', mac);
  
    const httpBody = JSON.stringify({
      header: fromEntries(sortedHeader),
      body: fromEntries(sortedBody),
    });
  
    console.log(
      `参与计算mac的json串: ${data}\n得到mac: ${mac}\nhttp请求参数:\n${httpBody}`
    );
    return mac;
  }
  
  function fromEntries(iterable) {
    const obj = {};
    for (const [key, value] of iterable) {
      obj[key] = value;
    }
    return obj;
  }
  
  async function sendSmsCode(msisdn) {
    const msgid = context.requestId;
    const systemtime = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 17);
    const version = '1.0';
    const apptype = '2';
    const userip = '47.92.207.183';

    const header = {
      msgid,
      systemtime,
      version,
      sourceid,
      apptype,
      userip,
    };

    const body = {
      msisdn,
    };

    const macs = getMac(header, body);
	try {
		const requestData = {
			body: {
				msisdn: body.msisdn,
			},
			header: {
				apptype: header.apptype,
				mac: macs,
				msgid: header.msgid,
				sourceid: header.sourceid,
				systemtime: header.systemtime,
				userip: header.userip,
				version: header.version,
			},
		};

    const text = JSON.stringify(requestData);
    const headers = {
      'Content-Type': 'application/json',
    };
	console.log('requestData信息',text);
	
    const response = await uniCloud.httpProxyForEip.post(sendSmsCodeUrl, text, headers);
    
    if (response) {
      const resultcode = response.body.header.resultcode;
      if (resultcode === '104000') {
        console.log('请求接口 /api/sendSmsCode 成功');
        return response.body.header.resultdesc;
      } else {
        console.log('请求接口 /api/sendSmsCode 失败', resultcode, requestData, response);
        return null;
      }
    } else {
      console.log('响应异常: response.data 未定义', response);
      return null;
    }
  } catch (error) {
    console.log('请求异常', error);
    return null;
  }
  }

  const msisdn = event.msisdn;
  const result = await sendSmsCode(msisdn);
  return result;
};