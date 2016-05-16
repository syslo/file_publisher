export const resourceTypes = {
  disabled: {
    key: 'disabled',
    value: 0,
    glyph: 'remove',
  },
  file: {
    key: 'file',
    value: 1,
    glyph: 'paperclip',
  },
  redirect: {
    key: 'redirect',
    value: 2,
    glyph: 'link'
  },
}

export function getResourceType(revision) {
  if (!revision.resource) {
    return resourceTypes.disabled
  }
  const key = Object.keys(resourceTypes).find((key) => (
    resourceTypes[key].value === revision.resource.type
  ))
  if (!key) {
    return resourceTypes.disabled
  }
  return resourceTypes[key]
}
