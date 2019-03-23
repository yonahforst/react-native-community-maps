import { 
  DefaultTheme,
} from 'react-native-paper'

import * as deepmerge from 'deepmerge'

import options from './options'

export default deepmerge.default(DefaultTheme, options.theme || {})