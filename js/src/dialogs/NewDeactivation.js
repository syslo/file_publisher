import React from 'react'

import NewRevisionWrapper from './NewRevisionWrapper'

export default class NewDeactivation extends React.Component {

  getResource() {
    return new Promise((resolve) => resolve(null))
  }

  render() {
    return (
      <NewRevisionWrapper
        {...this.props}
        isValid={() => true}
        getResource={this.getResource.bind(this)}
        title='Deactivate'
        value={this.props.value || {}}
      />
    )
  }
}
