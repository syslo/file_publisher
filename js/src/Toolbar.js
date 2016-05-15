import React from 'react'

export default class Toolbar extends React.Component {

  setRootPath(path) {
    const node = this.props.state.roots.find((node) => node.path === path)
    this.props.actions.setRoot(node)
  }

  render() {
    const state = this.props.state
    const node = (state.active && state.nodes[state.active.path]) || null
    return (
      <div>
        <select
          value={state.root}
          onChange={(e) => this.setRootPath(e.target.value)}
        >
          {(state.roots || []).map((n) => (
            <option key={n.path} value={n.path}>{n.path+'/'}</option>
          ))}
        </select>
        {node && (<ul>
          {node.predecessors.filter((n) => n.path.indexOf(state.root) === 0).reverse().map((n) => (
            <li key={n.path}><a href='#' onClick={() => this.props.actions.openFolder(n)}>{n.name}</a></li>
          ))}
        </ul>)}
      </div>
    )
  }
}
