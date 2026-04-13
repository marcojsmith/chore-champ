import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/react'
import { ConvexClerkProvider } from './components/AppProviders/ConvexClerkProvider'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <BrowserRouter>
        <ConvexClerkProvider>
          <App />
        </ConvexClerkProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
)