import React from 'react'

import Toolbar from './Toolbar'
import generate_actions from './actions'

export default class App extends React.Component {

  componentWillMount() {
    this.actions = generate_actions(this.dispatch.bind(this), this.props.config)
    this.dispatch("Initial State", (state) => ({
      roots: [],
    }))
    this.actions.fetchRoots()
  }

  dispatch(msg, fn) {
    console.log(`Dispatch: ${msg}`)
    this.setState(fn)
  }

  render() {
    let props = {
      actions: this.actions,
      config: this.props.config,
      dispatch: this.dispatch.bind(this),
      state: this.state,
    }

    return (
      <div>
        <Toolbar {...props} />
      </div>
    )
  }
}
