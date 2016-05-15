import React from 'react'

export default class Folder extends React.Component {

  render() {
    const node = this.props.node
    return (
      <div>
        <h2>Folder: {node.name}</h2>
        <h3>Subfolders</h3>
        <ul>
          {node.kids.filter((n) => n.is_folder).map((n) => (
            <li key={n.path}>
              <a href="#" onClick={() => this.props.actions.openFolder(n)}>
                {n.name}
              </a>
            </li>
          ))}
        </ul>
        <h3>Files</h3>
        <ul>
          {node.kids.filter((n) => n.is_file).map((n) => (
            <li key={n.path}>
              <a href="#" onClick={() => this.props.actions.openFile(n)}>
                {n.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}
