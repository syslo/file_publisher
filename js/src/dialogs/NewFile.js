import React from 'react'
import {ControlLabel, FormControl, FormGroup} from 'react-bootstrap'

import NewRevisionWrapper from './NewRevisionWrapper'

export default class NewFile extends React.Component {

  getResource() {
    return this.props.actions.newFile(
      this.props.value.file
    )
  }

  setValue(key, value) {
    this.props.onChange({...this.props.value, [key]: value})
  }

  isValid() {
    return this.props.value.file
  }

  render() {
    let value = this.props.value || {}
    return (
      <NewRevisionWrapper
        {...this.props}
        isValid={this.isValid.bind(this)}
        getResource={this.getResource.bind(this)}
        title='New File'
        value={value}
      >
        <FormGroup>
          <ControlLabel>File</ControlLabel>
          <FormControl
            type="file"
            onChange={(e)=>this.setValue('file', e.target.files[0])}
          />
        </FormGroup>
      </NewRevisionWrapper>
    )
  }
}
