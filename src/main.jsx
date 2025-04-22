import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux" 
import store, { persistor } from './redux/store.js'
import { Toaster } from 'react-hot-toast'
import { PersistGate } from 'redux-persist/lib/integration/react.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <Toaster/>
    <App />
    </PersistGate>
  </Provider>,
)
