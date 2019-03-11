import React from 'react'

import { 
  createStackNavigator, 
  createAppContainer,
} from 'react-navigation'

import { 
  Appbar,
} from 'react-native-paper'

import MapScreen from './MapScreen'
import ItemScreen from './ItemScreen'
import AddTimescren from './AddItemScreen'
import Settings from './Settings'
import ConvertAnonymousUser from './ConvertAnonymousUser';

const noop = () => {}

const appStack = createStackNavigator({
  MapScreen: {
    screen: MapScreen,
    navigationOptions: ({ navigation }) => ({
      header: (
        <Appbar.Header>
        <Appbar.Content />
          <Appbar.Action icon='settings' onPress={navigation.getParam('onShowSettings') || noop} />
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
          <Appbar.Action icon="more-vert" onPress={navigation.getParam('onMore') || noop} />
        </Appbar.Header>
      ),
    })
  },
  ConvertAnonymousUser: {
    screen: ConvertAnonymousUser,
    navigationOptions: ({ navigation}) => ({
      header: (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
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

export default createAppContainer(appStack)