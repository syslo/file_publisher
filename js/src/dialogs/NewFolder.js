import React from 'react'
import {Button, Form, FormControl, FormGroup, InputGroup} from 'react-bootstrap'
import {Modal} from 'react-bootstrap'

const validator = new RegExp('^[_a-zA-Z0-9]+$')

export default class NewFolder extends React.Component {

  create() {
    const n = this.props.state.nodes[this.props.state.active.path]
    this.props.actions.newFolder(
      `${n.path}/${this.props.value}`
    ).then(()=>
      this.props.actions.fetchNode(n)
    )
    this.props.onChange('')
    this.props.onClose()
  }

  onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    if (validator.test(this.props.value)){
      this.create()
    }
    return false
  }

  render() {
    let value = this.props.value || ''
    let active = this.props.state.active || {}
    let valid = validator.test(value)

    return (
      <Modal
        show={this.props.show && active.asFolder}
        onHide={this.props.onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.onSubmit.bind(this)}>
            <FormGroup validationState={value && !valid ? 'error' : null}>
              <InputGroup>
                <InputGroup.Addon>{active.path}/</InputGroup.Addon>
                <FormControl
                  autoFocus
                  type="text"
                  value={value}
                  onChange={(e)=>this.props.onChange(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Button bsStyle="primary" disabled={!valid} onClick={this.create.bind(this)}>
                Create
              </Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}
