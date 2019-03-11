import React from 'react';

import {
  AuthContainerHoc
} from './AuthContainer'

import ConvertAnonymousUser from '../components/ConvertAnonymousUser'

export default AuthContainerHoc(
  ConvertAnonymousUser
)
