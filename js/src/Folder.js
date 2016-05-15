import React from 'react'

export default class Folder extends React.Component {
  render() {
    return (
      <div>
        <p>Folder: {this.props.node.path}</p>
      </div>
    )
  }
}
