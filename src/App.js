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
  <PaperProvider theme={theme}>
    <AuthContainer>
      <DataContainer>
        <NotificationContainer>
          <ActionSheetProvider>
            <Navigator />
          </ActionSheetProvider>
        </NotificationContainer>
      </DataContainer>
    </AuthContainer>
  </PaperProvider>
)