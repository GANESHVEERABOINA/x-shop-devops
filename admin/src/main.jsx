import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'

// BASE_URL is '/' in local development and '/admin/' in the production build.
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '')

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={routerBasename}>
    <App />
  </BrowserRouter>,
)
