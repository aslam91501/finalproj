import { NextUIProvider } from "@nextui-org/react"
import { Route, Routes, useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout.tsx';
import { RegistrationPage } from "./pages/register.tsx";
import { HomePage } from "./pages/home.tsx";
import { ProfilePage } from "./pages/profile.tsx";
import { LandingPage } from "./pages/landing.tsx";
import { ContractsPage } from "./pages/contracts.tsx";
import { CaseApprovalsPage } from "./pages/approvals.tsx";
import { AuthErrorPage } from "./pages/authError.tsx";
import { AccessListPage } from "./pages/access-list.tsx";
import { CaseFilesPage } from "./pages/case-files.tsx";

function App() {
	const navigate = useNavigate();

	return (
		<NextUIProvider navigate={navigate}>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/home" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					
					<Route path="/cases/:id/approvals" element={<CaseApprovalsPage />} />
					<Route path="/cases/:id/access-list" element={<AccessListPage />} />
					<Route path="/cases/:id/files" element={<CaseFilesPage />} />
					
				</Route>
				<Route>
					<Route path="/" element={<LandingPage />} />
					<Route path="/contracts" element={<ContractsPage />} />
					<Route path="/register" element={<RegistrationPage />} />
					
					<Route path="/auth-error" element={<AuthErrorPage />} />
				</Route>
			</Routes>
			<ToastContainer />
		</NextUIProvider>

	)
}

export default App
