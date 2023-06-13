import React from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl'

import App from 'App'
import 'bootstrap/scss/bootstrap.scss'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'assets/scss/main.scss'

import en from './lang/en.json'
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <React.StrictMode>
    <IntlProvider messages={en} locale='en' defaultLocale='en'>
      <App />
    </IntlProvider>
  </React.StrictMode>
)
