import React from 'react'

import NewFolder from './NewFolder'

import NewDeactivation from './NewDeactivation'
import NewRedirect from './NewRedirect'

import {objectify} from '../helpers'

const dialogsList = [
  {
    key: 'newFolder',
    Component: NewFolder,
  },
  {
    key: 'newDeactivation',
    Component: NewDeactivation,
  },
  {
    key: 'newRedirect',
    Component: NewRedirect,
  },
]

export const dialogs = objectify(dialogsList)

export function getDialogsState() {
  let result = {}
  dialogsList.map((d) => result[d.key] = {visible: false, value: null})
  return {dialogs: result}
}

export function renderDialogs(state, actions) {
  return dialogsList.map((d) => {
    return (
      <d.Component
        key={d.key}
        show={state.dialogs[d.key].visible}
        onClose={() => actions.hideDialog(d.key)}
        value={state.dialogs[d.key].value}
        onChange={(value) => actions.dialogDispatch(d.key, value)}
        state={state}
        actions={actions}
      />
    )
  })
}
