import React from 'react'

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  SafeAreaView,
} from 'react-native'

import {
  placeholders
} from '../lib/options'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const randomPlaceholder = () => placeholders[Math.floor(Math.random() * placeholders.length)]

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
      <Text style={styles.displayName}>
        { username + ': ' }
        <Text style={styles.body}>
          {item.body}
        </Text>
      </Text>
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
            multiline
            enablesReturnKeyAutomatically
            style={styles.bodyInput}
            value={body}
            onFocus={this.scrollToEnd}
            disabled={loading}
            placeholder={randomPlaceholder()}
            onChangeText={this.onChangeText}
          />
          <Button
          title='Send'
          disabled={loading || body.length == 0}
          onPress={this.onSubmit}
          />
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
    padding: 5, 
    backgroundColor: 'white',
  },
  displayName: {
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  body: {
    fontWeight: 'normal',
    marginHorizontal: 20,
  }
})