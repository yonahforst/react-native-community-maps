import React from 'react';

import {
  DataContainerHoc
} from './DataContainer'

import {
  connectActionSheet,
} from '@expo/react-native-action-sheet';

import ItemScreen from '../components/ItemScreen'

export default DataContainerHoc(
  connectActionSheet(
    ItemScreen
  )
)
