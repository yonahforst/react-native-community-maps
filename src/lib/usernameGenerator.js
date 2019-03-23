
import {
  randomUsernameGeneratorUrl,
} from './options'

const random = array => array[Math.floor(Math.random() * array.length)]
const upcase = str => str.charAt(0).toUpperCase() + str.slice(1)
export default {
  generate: async () => {
    const res = await fetch(randomUsernameGeneratorUrl)
    const json = await res.json()
    const name = Array.isArray(json)
      ? random(json)
      : json
    return name
      .replace(/[^a-z]/gi, ' ')
      .split(' ')
      .map(upcase)
      .join('')
  }
}
