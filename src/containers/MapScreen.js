import {
  DataContainerHoc
} from '../containers/DataContainer'

import {
  AuthContainerHoc
} from './AuthContainer'

import MapScreen from '../components/MapScreen'

export default AuthContainerHoc(
  DataContainerHoc(
    MapScreen
  )
)
