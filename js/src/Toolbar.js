import React from 'react'

export default class Toolbar extends React.Component {

  setRootPath(path) {
    const node = this.props.state.roots.find((node) => node.path === path)
    this.props.actions.setRoot(node)
  }

  render() {
    return (
      <div>
        <select
          value={this.props.state.root}
          onChange={(e) => this.setRootPath(e.target.value)}
        >
          {(this.props.state.roots || []).map((node) => (
            <option key={node.path} value={node.path}>{node.path+'/'}</option>
          ))}
        </select>
      </div>
    )
  }
}
