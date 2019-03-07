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
  Appbar,
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
      header: (
        <Appbar.Header>
          <Appbar.Action icon='menu' onPress={navigation.getParam('onShowSettings') || noop} />
        </Appbar.Header>
      ),
    })
  },
  Settings: {
    screen: Settings,
    navigationOptions: ({ navigation}) => ({
      header: (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title='Settings' />
        </Appbar.Header>
      ),
    })
  },
  ItemScreen: {
    screen: ItemScreen,
    navigationOptions: ({ navigation }) => ({
      header: (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content />
          <Appbar.Action icon="more-vert" onPress={navigation.getParam('onMore') || noop} />
        </Appbar.Header>
      ),
    })
  },
  AddItemScreen: {
    screen: AddTimescren,
    navigationOptions: ({ navigation }) => ({
      header: (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content />
          <Appbar.Action
          icon="save" 
          disabled={!navigation.getParam('canSave')}
          onPress={navigation.getParam('onSave') || noop} />
        </Appbar.Header>
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