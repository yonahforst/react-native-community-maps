const axios = require('axios')

const PUSH_URL = 'https://exp.host/--/api/v2/push/send'

module.exports.sendPushNotification = payload => {
  return got(PUSH_URL, {
    method: 'post',
    data: payload,
    responseType: 'json'
  })
}