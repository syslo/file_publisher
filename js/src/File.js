import React from 'react'
import {ControlLabel, Form, FormControl, FormGroup, InputGroup} from 'react-bootstrap'
import {Button, ButtonToolbar, Panel, ListGroup, ListGroupItem} from 'react-bootstrap'
import {Col, Glyphicon, Grid, Row} from 'react-bootstrap'

import copy from 'copy-to-clipboard'
import moment from 'moment'

import {getResourceType, resourceTypes} from './helpers'
import {dialogs} from './dialogs'

export default class File extends React.Component {

  render() {
    const node = this.props.node
    const downloadUrl = node.predecessors[0].download_url
    const actions = this.props.actions
    const shrink = {whiteSpace: "nowrap", width: "1px"}

    const header = (
      <div>
        <ButtonToolbar className='pull-right'>
          <Button onClick={() => window.open(downloadUrl)} bsSize="xs">
            <Glyphicon glyph="save" />
          </Button>
          <Button onClick={() => actions.showDialog(dialogs.newDeactivation.key)} bsSize="xs">
            <Glyphicon glyph="arrow-right" />
            {resourceTypes.disabled.glyphicon}
          </Button>
          <Button onClick={() => actions.showDialog(dialogs.newFile.key)} bsSize="xs">
            <Glyphicon glyph="arrow-right" />
            {resourceTypes.file.glyphicon}
          </Button>
          <Button onClick={() => actions.showDialog(dialogs.newRedirect.key)} bsSize="xs">
            <Glyphicon glyph="arrow-right" />
            {resourceTypes.redirect.glyphicon}
          </Button>
        </ButtonToolbar>
        <span><Glyphicon glyph="file" />&nbsp;{node.name}</span>
      </div>
    )

    return (
      <Panel header={header}>
        <Form horizontal>
          <FormGroup>
            <Col componentClass={ControlLabel} sm={1}>
              Link
            </Col>
            <Col sm={11}>
              <InputGroup>
                <FormControl value={downloadUrl} type="text" disabled />
                <InputGroup.Button>
                  <Button onClick={() => copy(downloadUrl)}><Glyphicon glyph="copy" /></Button>
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </FormGroup>
        </Form>

        <ListGroup>
          {node.revisions.map((rev) => {
            const type = getResourceType(rev)

            const subHeader = (
              <div>
                <ButtonToolbar className='pull-right'>
                  { rev.resource && (
                    <Button onClick={() => window.open(rev.resource.download_url)} bsSize="xs">
                      <Glyphicon glyph="save" />
                    </Button>
                  )}
                  <Button onClick={() => {}} bsSize="xs">
                    <Glyphicon glyph="refresh" />
                  </Button>
                </ButtonToolbar>
                <strong>
                  <Glyphicon glyph={type.glyph} />&nbsp;
                  {rev.resource ? rev.resource.name : '---'}
                </strong>
              </div>
            )

            return (
              <ListGroupItem key={rev.id}>
                <Grid fluid>
                  <Row><Col sm={12}>{subHeader}</Col></Row>
                  { type.key === 'redirect' && (
                    <Row><Col sm={12}>
                      <Glyphicon glyph="globe" />&nbsp;
                      {rev.resource.path}
                    </Col></Row>
                  )}
                  <Row>
                    <Col sm={6}>
                      <Glyphicon glyph="calendar" />&nbsp;
                      {moment(rev.created).format('YYYY-MM-DD hh:mm')}
                    </Col>
                    { rev.author && (
                      <Col sm={6}>
                        <Glyphicon glyph="user" />&nbsp;
                        {`${rev.author.first_name} ${rev.author.last_name} (${rev.author.username})`}
                      </Col>
                    )}
                  </Row>
                  { rev.comment && (
                    <Row><Col sm={12}><p>
                      <Glyphicon glyph="comment" />&nbsp;
                      {rev.comment}
                    </p></Col></Row>
                  )}
                </Grid>
              </ListGroupItem>
            )
          })}
        </ListGroup>
      </Panel>
    )
  }
}
