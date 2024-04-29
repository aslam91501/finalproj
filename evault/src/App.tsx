import { NextUIProvider } from "@nextui-org/react"
import { Navigate, Route, Routes, useNavigate } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './layout.tsx';
import { RegistrationPage } from "./pages/register.tsx";
import { HomePage } from "./pages/home.tsx";
import { ProfilePage } from "./pages/profile.tsx";
import { LandingPage } from "./pages/landing.tsx";
import { ContractsPage } from "./pages/contracts.tsx";

function App() {
	const navigate = useNavigate();

	return (
		<NextUIProvider navigate={navigate}>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/home" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					
				</Route>
				<Route>
					<Route path="/" element={<LandingPage />} />
					<Route path="/contracts" element={<ContractsPage />} />
					<Route path="/register" element={<RegistrationPage />} />
				</Route>
			</Routes>
			<ToastContainer />
		</NextUIProvider>

	)
}

export default App
