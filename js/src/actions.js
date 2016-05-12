import * as request from './request'


export default (dispatch, config) => {
  const actions = {}
  Object.assign(actions, {

    fetchRoots: () => {
      request.get(config.rootsUrl)
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          dispatch('Roots Loaded', (state) => ({
            ...state, roots: data
          }))
        })
    }

  })
  return actions
}
