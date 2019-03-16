export default setState => func => async params => {
  try {
    setState({ 
      loading: true
    })

    await func(params)

    setState({
      loading: false,
      error: null,
    })
    return true
  } catch (error) {
    console.log(error)
    setState({
      loading: false,
      error,
    })
    return false
  }
}