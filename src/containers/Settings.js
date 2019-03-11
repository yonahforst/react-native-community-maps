import {
  AuthContainerHoc
} from './AuthContainer'

import {
  NotificationContainerHoc
} from './NotificationContainer'

import {
  connectActionSheet,
} from '@expo/react-native-action-sheet';

import Settings from '../components/Settings'

export default AuthContainerHoc(
  NotificationContainerHoc(
    connectActionSheet(
      Settings
    )
  )
)
