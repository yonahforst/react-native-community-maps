import {
  AuthContainerHoc
} from './AuthContainer'

import {
  NotificationContainerHoc
} from './NotificationContainer'

import Settings from '../components/Settings'

export default AuthContainerHoc(
  NotificationContainerHoc(
    Settings
  )
)
