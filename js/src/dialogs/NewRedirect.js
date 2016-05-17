import React from 'react'
import {ControlLabel, FormControl, FormGroup} from 'react-bootstrap'

import NewRevisionWrapper from './NewRevisionWrapper'

export default class NewRedirect extends React.Component {

  getResource() {
    console.log('juuu')
    return this.props.actions.newRedirect(
      this.props.value.name, this.props.value.url,
    )
  }

  setValue(key, value) {
    this.props.onChange({...this.props.value, [key]: value})
  }

  isValid() {
    return this.props.value.name && this.props.value.url
  }

  render() {
    let value = this.props.value || {}
    return (
      <NewRevisionWrapper
        {...this.props}
        isValid={this.isValid.bind(this)}
        getResource={this.getResource.bind(this)}
        title='New Redirect'
        value={value}
      >
        <FormGroup>
          <ControlLabel>Name</ControlLabel>
          <FormControl
            type="text"
            value={value.name}
            onChange={(e)=>this.setValue('name', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Destination</ControlLabel>
          <FormControl
            type="text"
            value={value.url}
            onChange={(e)=>this.setValue('url', e.target.value)}
          />
        </FormGroup>
      </NewRevisionWrapper>
    )
  }
}
