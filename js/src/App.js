import React from 'react'

import Toolbar from './Toolbar'
import Folder from './Folder'
import File from './File'
import Loading from './Loading'
import NoAccess from './NoAccess'

import generate_actions from './actions'

import {renderDialogs, getDialogsState} from './dialogs'

export default class App extends React.Component {

  componentWillMount() {
    this.actions = generate_actions(this.dispatch.bind(this), this.props.config)
    this.dispatch("Initial State", (state) => ({
      ...getDialogsState(),
      roots: null,
      nodes: {},
    }))
    this.actions.fetchRoots(true)
  }

  dispatch(msg, fn) {
    this.setState((state) => {
      console.log(`Dispatching: ${msg}`)
      state = fn(state)
      console.log(state)
      return state
    })
  }

  renderBody(props) {
    const {roots, nodes, active} = this.state
    if (!roots) {
      // Roots not fetched yet
      return (<Loading />)
    }
    if (roots.length === 0) {
      // No roots fetched
      return (<NoAccess />)
    }
    if (!(active && active.path in nodes)) {
      // Current node not loaded yet
      return (<Loading />)
    }

    const Node = active.asFolder ? Folder : File
    return (
      <Node
        node={nodes[active.path]}
        actions={this.actions}
      />
    )
  }

  render() {
    const props = {
      actions: this.actions,
      config: this.props.config,
      dispatch: this.dispatch.bind(this),
      state: this.state,
    }

    return (
      <div>
        {renderDialogs(this.state, this.actions)}
        <Toolbar {...props} />
        {this.renderBody()}
      </div>
    )
  }
}
