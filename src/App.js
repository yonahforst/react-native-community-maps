import React from 'react'
import {
  ActionSheetProvider,
} from '@expo/react-native-action-sheet'

import { 
  Provider as PaperProvider, 
} from 'react-native-paper'

import AuthContainer from './containers/AuthContainer'
import DataContainer from './containers/DataContainer'
import NotificationContainer from './containers/NotificationContainer'
import Navigator from './containers/Navigator'
import theme from './lib/theme'

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