import React from 'react'
import {Breadcrumb, DropdownButton, FormControl, MenuItem, SplitButton} from 'react-bootstrap'

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
    return node.predecessors.filter(
      (n) => n.path.indexOf(this.props.state.root) === 0
    ).reverse()
  }

  render() {
    const state = this.props.state
    const node = this.getNode()
    return (
      <div>
        <Breadcrumb>
          {this.getBreadcrumbs().map((n, i) => {
            const props = {
              key: n.path,
              onClick: () => this.props.actions.openFolder(n),
              active: node.path === n.path,
            }
            if (i==0){
              return this.renderFirstBreadcrumb(props, n)
            } else {
              return (<Breadcrumb.Item {...props}>{n.name}</Breadcrumb.Item>)
            }
          })}
        </Breadcrumb>
      </div>
    )
  }

  renderFirstBreadcrumb(props, node){
    return (
      <Breadcrumb.Item key={props.key} active>
        <SplitButton
          id="file-publisher-root-select"
          title={node.path || '(root)'}
          bsStyle="link"
          onClick={props.onClick}
        >
          {(this.props.state.roots || []).map((n) => (
            <MenuItem
              key={n.path}
              onClick={() => this.props.actions.setRoot(n)}
            >
              {n.path || '(root)'}
            </MenuItem>
          ))}
        </SplitButton>
      </Breadcrumb.Item>
    )
  }
}
