import React from 'react'

import Toolbar from './Toolbar'
import Folder from './Folder'
import File from './File'
import Loading from './Loading'
import NoAccess from './NoAccess'

import generate_actions from './actions'

export default class App extends React.Component {

  componentWillMount() {
    this.actions = generate_actions(this.dispatch.bind(this), this.props.config)
    this.dispatch("Initial State", (state) => ({
      roots: null,
      nodes: {},
    }))
    this.actions.fetchRoots(true)
  }

  dispatch(msg, fn) {
    console.log(`Dispatch: ${msg}`)
    this.setState(fn)
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
        <Toolbar {...props} />
        {this.renderBody()}
      </div>
    )
  }
}
