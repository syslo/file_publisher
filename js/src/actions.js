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

  })
  return actions
}
