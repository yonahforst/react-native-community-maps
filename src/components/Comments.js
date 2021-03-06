import React from 'react'

import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native'

import { 
  Text,
  Caption,
  Button,
  TextInput,
  List,
} from 'react-native-paper';

import {
  newMsgPlaceholder
} from '../lib/options'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const randomPlaceholder = () => newMsgPlaceholder[Math.floor(Math.random() * newMsgPlaceholder.length)]

export default class Comments extends React.Component {
  state={
    loading: false,
    error: null,
    body: ''
  }

  onSubmit = async () => {
    try {
      const {
        onSubmit,
      } = this.props

      const {
        body,
      } = this.state

      this.setState({
        loading: true,
      })

      await onSubmit(body)

      this.setState({
        loading: false,
        error: null,
        body: '',
      })
      this.scrollToEnd()
    } catch (error) {
      console.log(error)

      this.setState({
        loading: false,
        error,
      })
    }
  }

  onChangeText = body => {
    this.setState({
      body
    })
  }

  scrollToEnd = async () => {
    await sleep(300)
    this.listRef.scrollToEnd()
  }

  renderItem = ({ item }) => {
    const {
      users,
    } = this.props
    
    const { 
      username='Anonymous',
    } = users[item.userId] || {}

    return (
      <List.Item 
      style={styles.comment} 
      title={item.body} 
      description={username} />
    )

  }

  render() {
    const {
      body,
      loading,
    } = this.state

    const {
      messages,
      style,
    } = this.props

    return (
      <SafeAreaView 
      style={style}>
        <FlatList
        ref={r => this.listRef = r}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={this.renderItem}/>

        <View
        style={styles.newMessageRow}>
          <TextInput
            mode='none'
            enablesReturnKeyAutomatically
            style={styles.bodyInput}
            value={body}
            onFocus={this.scrollToEnd}
            disabled={loading}
            placeholder={randomPlaceholder()}
            onChangeText={this.onChangeText}
          />
          <Button
          style={styles.sendButton}
          compact
          uppercase={false}
          disabled={loading || body.length == 0}
          onPress={this.onSubmit}>
            Send
          </Button>
        </View>
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  newMessageRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: 'grey',
  },
  bodyInput: {
    flex: 1,
  },
  sendButton: {
    justifyContent: 'center',
  },
  displayName: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  body: {
    fontWeight: 'normal',
    marginHorizontal: 20,
  },
  comment: {
    padding: 0,
  }
})