import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const qc = new QueryClient({
	defaultOptions:{
		queries:{
			
		}
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    	<QueryClientProvider client={qc}>
			<BrowserRouter>
				<App />			
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
  </React.StrictMode>,
)
