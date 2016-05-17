import React from 'react'
import {Glyphicon} from 'react-bootstrap'


export function objectify(list){
  return list.reduce((res, x) => ({...res, [x.key]: x}), {})
}

const resourceTypesList = [
  {
    key: 'disabled',
    value: 0,
    glyph: 'remove',
  },
  {
    key: 'file',
    value: 1,
    glyph: 'file',
  },
  {
    key: 'redirect',
    value: 2,
    glyph: 'link'
  },
]

export const resourceTypes = objectify(resourceTypesList.map(
  (t) => ({...t, glyphicon: (<Glyphicon glyph={t.glyph} />)})
))

export function getResourceType(revision) {
  if (!revision.resource) {
    return resourceTypes.disabled
  }
  const res = resourceTypesList.find((t) => (t.value === revision.resource.type))
  if (!res) {
    return resourceTypes.disabled
  }
  return res
}
