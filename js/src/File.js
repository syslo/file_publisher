import React from 'react'

export default class Folder extends React.Component {
  render() {
    return (
      <div>
        <p>File: {this.props.node.path}</p>
      </div>
    )
  }
}
