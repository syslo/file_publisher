import React from 'react'

export default class Toolbar extends React.Component {

  render() {
    const roots = this.props.state.roots
    return (
      <div>
        <select>
          {roots.map((node) => (
            <option key={node.path}>{node.path+'/'}</option>
          ))}
        </select>
      </div>
    )
  }
}
