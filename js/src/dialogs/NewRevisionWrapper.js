import React from 'react'
import {ControlLabel, Form, FormControl, FormGroup, InputGroup} from 'react-bootstrap'
import {Button, Modal} from 'react-bootstrap'

const validator = new RegExp('^[_a-zA-Z0-9]+$')

export default class NewRevisionWrapper extends React.Component {

  hasSlug() {
    return this.props.state.active.asFolder
  }

  isValid() {
    return this.props.isValid() && (
      !this.hasSlug() || validator.test(this.props.value.slug || '')
    )
  }

  create() {
    if (!this.isValid()){
      return
    }

    const n = this.props.state.nodes[this.props.state.active.path]
    const path = this.hasSlug() ? `${n.path}/${this.props.value.slug}` : n.path
    const comment = this.props.value.comment

    this.props.getResource().then(
      (resource) => this.props.actions.newRevision(
        path, resource, comment
      )
    ).then(()=>
      this.props.actions.fetchNode(n)
    )
    this.props.onChange(null)
    this.props.onClose()
  }

  onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    this.create()
    return false
  }

  setValue(key, value) {
    this.props.onChange({...this.props.value, [key]: value})
  }

  renderSlug() {
    let hasSlug = this.hasSlug()
    let slug = this.props.value.slug
    let path = this.props.state.active.path

    return(
      <FormGroup validationState={hasSlug && slug && validator.test(slug) ? 'error' : null}>
        <ControlLabel>Path</ControlLabel>
        <InputGroup>
          {hasSlug && <InputGroup.Addon>{path}/</InputGroup.Addon>}
          <FormControl
            autoFocus
            type="text"
            value={hasSlug ? slug : path}
            onChange={(e)=>this.setValue('slug', e.target.value)}
            disabled={!hasSlug}
          />
        </InputGroup>
      </FormGroup>
    )
  }

  render() {
    if (!this.props.state.active) {
      return null
    }

    return (
      <Modal
        show={this.props.show}
        onHide={this.props.onClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.onSubmit.bind(this)}>
            {this.props.children}
            {this.renderSlug()}
            <FormGroup>
              <ControlLabel>Comment</ControlLabel>
              <FormControl
                componentClass="textarea"
                value={this.props.value.comment}
                onChange={(e)=>this.setValue('comment', e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Button
                bsStyle="primary"
                disabled={!this.isValid.bind(this)}
                onClick={this.create.bind(this)}
              >
                Commit
              </Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}
