import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { MetaMaskProvider } from '@metamask/sdk-react'

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
			<MetaMaskProvider debug={false} sdkOptions={{
				logging:{
					developerMode: false,
					},
					communicationServerUrl: '',
					checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
					dappMetadata: {
						name: "Demo React App",
						url: window.location.host,
					}
				}}>
				<App />								
			</MetaMaskProvider>
			</BrowserRouter>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
  </React.StrictMode>,
)
