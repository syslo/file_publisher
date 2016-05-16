import React from 'react'
import {Button, ButtonToolbar, Glyphicon, Panel, Table} from 'react-bootstrap'

import copy from 'copy-to-clipboard'

export default class Folder extends React.Component {

  render() {
    const node = this.props.node
    const shrink = {whiteSpace: "nowrap", width: "1px"}

    const header = (
      <div>
        <ButtonToolbar className="pull-right">
          <Button onClick={() => {}} bsSize="xs">
            <Glyphicon glyph="plus" />
            <Glyphicon glyph="folder-open" />
          </Button>
          <Button onClick={() => {}} bsSize="xs">
            <Glyphicon glyph="plus" />
            <Glyphicon glyph="file" />
          </Button>
        </ButtonToolbar>
        <span className="text-left-lg"><Glyphicon glyph="folder-open" />&nbsp;&nbsp;{node.name}</span>
      </div>
    )

    return (
      <Panel header={header}>
        <Table hover condensed>
          <tbody>
            {node.kids.filter((n) => n.is_folder).map((n) => (
              <tr key={n.path} onClick={() => this.props.actions.openFolder(n)}>
                <td style={shrink}><Glyphicon glyph="folder-open" /></td>
                <td colspan>{n.name}</td>
                <td style={shrink}></td>
                <td style={shrink}></td>
              </tr>
            ))}
            {node.kids.filter((n) => n.is_file).map((n) => (
              <tr key={n.path}>
                <td
                  style={shrink}
                  onClick={() => this.props.actions.openFile(n)}
                ><Glyphicon glyph="file" /></td>
                <td
                  onClick={() => this.props.actions.openFile(n)}
                >{n.name}</td>
                <td
                  style={shrink}
                  onClick={() => window.open(n.download_url)}
                ><Glyphicon glyph="save" /></td>
                <td
                  style={shrink}
                  onClick={() => copy(n.download_url)}
                ><Glyphicon glyph="copy" /></td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Panel>
    )
  }
}
