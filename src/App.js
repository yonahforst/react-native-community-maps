import React from 'react'
import { 
  Button,
} from 'react-native'

import { createStackNavigator } from 'react-navigation'

import {
  ActionSheetProvider,
} from '@expo/react-native-action-sheet'

import { 
  Provider as PaperProvider, 
} from 'react-native-paper'

import AuthContainer from './containers/AuthContainer'
import DataContainer from './containers/DataContainer'
import NotificationContainer from './containers/NotificationContainer'

import MapScreen from './containers/MapScreen'
import ItemScreen from './containers/ItemScreen'
import AddTimescren from './containers/AddItemScreen'
import Settings from './containers/Settings'

import theme from './lib/theme'

const noop = () => {}

const Navigator = createStackNavigator({
  MapScreen: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <Button
          onPress={navigation.getParam('onShowSettings') || noop}
          title="Settings"
        />
      ),
    })
  },
  Settings: {
    screen: Settings
  },
  ItemScreen: {
    screen: ItemScreen,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <Button
          onPress={navigation.getParam('onMore') || noop}
          title="More"
        />
      ),
    })
  },
  AddItemScreen: {
    screen: AddTimescren,
    navigationOptions: ({ navigation }) => ({
      headerRight: (
        <Button
          disabled={!navigation.getParam('canSave')}
          onPress={navigation.getParam('onSave') || noop}
          title="Save"
        />
      ),
    })
  },
}, {
  initialRouteName: 'MapScreen',
});

export default () => (
  <AuthContainer>
    <DataContainer>
      <NotificationContainer>
        <PaperProvider theme={theme}>
          <ActionSheetProvider>
            <Navigator />
          </ActionSheetProvider>
        </PaperProvider>
      </NotificationContainer>
    </DataContainer>
  </AuthContainer>
)