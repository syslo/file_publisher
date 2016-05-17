import 'whatwg-fetch'
import Cookies from 'cookies-js'


const getHeaders = () => ({
  Accept: 'application/json',
})

const postHeaders = () => ({
  ...getHeaders(),
  'X-CSRFToken': Cookies.get('csrftoken')
})

export const get = (url) => fetch(url, {
  method: 'GET',
  credentials: 'same-origin',
  headers: getHeaders(),
})

export const postJson = (url, data) => fetch(url, {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    ...postHeaders(),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data),
})

export const postForm = (url, data) => fetch(url, {
  method: 'POST',
  credentials: 'same-origin',
  headers: {
    ...postHeaders(),
  },
  body: data,
})
