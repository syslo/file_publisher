import React from 'react'
import {Breadcrumb, DropdownButton, FormControl, MenuItem} from 'react-bootstrap'

export default class Toolbar extends React.Component {

  getNode() {
    if (!this.props.state.active){
      return null
    }
    return this.props.state.nodes[this.props.state.active.path] || null
  }

  getRoot() {
    const state = this.props.state
    if (!state.root || !state.roots)
      return null
    return state.roots.find((n) => n.path === state.root) || null
  }

  getBreadcrumbs() {
    const node = this.getNode()
    if (!node) {
      return []
    }
    return node.predecessors.reverse()
  }

  render() {
    const state = this.props.state
    const node = this.getNode()
    return (
      <div>
        <Breadcrumb>
          {this.renderRootSelector()}
          {this.getBreadcrumbs().map((n, i) => (
            <Breadcrumb.Item
              key={n.path}
              onClick={() => this.props.actions.openFolder(n)}
              active={node.path === n.path || n.path.indexOf(state.root) !== 0}
            >
              {n.path ?  n.name : 'root:'}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    )
  }

  renderRootSelector(){
    return (
      <DropdownButton
        id="file-publisher-root-select"
        title=""
        bsStyle="link"
      >
        {(this.props.state.roots || []).map((n) => (
          <MenuItem
            key={n.path}
            onClick={() => this.props.actions.setRoot(n)}
          >
            {n.path || '(root)'}
          </MenuItem>
        ))}
      </DropdownButton>
    )
  }
}
