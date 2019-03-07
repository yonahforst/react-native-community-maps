const axios = require('axios')

const PUSH_URL = 'https://exp.host/--/api/v2/push/send'

module.exports.sendPushNotification = payload => {
  return axios({
    url: PUSH_URL,
    method: 'POST',
    data: payload,
    responseType: 'json'
  })
}