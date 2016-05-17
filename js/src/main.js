import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

const rootElement = document.getElementById('file_publisher_app')

const body = (
  <App config={rootElement.dataset} />
)

ReactDOM.render(body, rootElement)
