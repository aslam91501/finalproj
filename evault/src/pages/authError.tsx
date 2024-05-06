import { Button } from "@nextui-org/react"
import authErrorImg from '/authError.svg'
import { useAuth } from "../config/authHooks"

export const AuthErrorPage = () => {
    const { logout } = useAuth();

    return (
        <div className="w-screen h-screen gap-3 flex items-center justify-center">
            <img src={authErrorImg} className="w-64" />
           
            <div className="flex flex-col gap-5">
                <h1 className="text-3xl font-medium text-red-600">Authentication Error</h1>
                <p className="text-lg">Please login again</p>

                <Button color="primary" onClick={logout}>
                    Go to Login Page
                </Button>
            </div>
            
        </div>
    )
}