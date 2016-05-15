import React from 'react'

export default class Folder extends React.Component {
  render() {
    return (
      <div>
        <h2>File: {this.props.node.name}</h2>
      </div>
    )
  }
}
