import * as request from './request'


export default (dispatch, config) => {
  const actions = {}
  Object.assign(actions, {

    fetchRoots: (initial=false) => {
      request.get(config.rootsUrl)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          dispatch('Roots Loaded', (state) => ({
            ...state, roots: data
          }))
          if (initial && data.length >= 0) {
            actions.setRoot(data[0])
          }
        })
    },

    setRoot: (node) => {
      dispatch('Set Root', (state) => ({
        ...state, root: node.path
      }))
      actions.openFolder(node)
    },

    fetchNode: (node) => {
      request.get(node.url)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          data.revisions.reverse()
          dispatch('Node Loaded', (state) => ({
            ...state, nodes: {...state.nodes, [node.path]: data}
          }))
        })
    },

    activateNode: (node, asFolder) => {
      dispatch('Activate Node', (state) => ({
        ...state, active: {path: node.path, asFolder: asFolder}
      }))
    },

    openFolder: (node) => {
      actions.activateNode(node, true)
      actions.fetchNode(node)
    },

    openFile: (node) => {
      actions.activateNode(node, false)
      actions.fetchNode(node)
    },

    showDialog: (key) => {
      dispatch('Show Dialog', dialogSetter(key, 'visible', true))
    },

    hideDialog: (key) => {
      dispatch('Hide Dialog', dialogSetter(key, 'visible', false))
    },

    dialogDispatch: (key, value) => {
      dispatch('Dialog Dispatch', dialogSetter(key, 'value', value))
    },

    newFolder: (path) => {
      return request.postJson(
        config.newFolderUrl, {path},
      ).then(
        (response) => response.json()
      )
    },

    newRedirect: (name, url) => {
      return request.postJson(
        config.newRedirectResourceUrl,
        {name: name, destination: url},
      ).then(
        (response) => response.json()
      )
    },

    newFile: (file) => {
      let data = new FormData()
      data.append('file', file)
      return request.postForm(
        config.newFileResourceUrl, data
      ).then(
        (response) => response.json()
      )
    },

    newRevision: (path, resource, comment) => {
      return request.postJson(
        config.newRevisionUrl,
        {
          path: path,
          resource: resource && resource.id,
          comment: comment || ''
        },
      ).then(
        (response) => response.json()
      )
    },

  })
  return actions
}

const dialogSetter = (key, prop, value) => (state) => ({
  ...state, dialogs: {...state.dialogs, [key]: {...state.dialogs[key], [prop]: value}}
})
