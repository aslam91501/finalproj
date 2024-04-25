import { Button, Link } from "@nextui-org/react"
import authSvg from '/authenticate.svg';
import { Fingerprint } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import { useAuth } from "../config/authHooks";

export const LandingPage = () => {
    const [noMetamask, setNoMetamask] = useState(false);
    const { attemptLogin, isLoggedIn } = useAuth();
    const { sdk, connected, connecting  } = useSDK();

    useEffect(() => {
        if(!Boolean(window.ethereum))        
            setNoMetamask(true);
    }, [])

    const handleAuthenticate = async ()  => {
        const result = await sdk?.connect();

        attemptLogin(result);
    }


    return (
        <div className="h-screen w-screen flex gap-20 items-center p-10">
            <img src={ authSvg } alt="logo" className="w-2/5" />

            <div className="flex flex-col gap-8 pl-32">
                <h1 className="text-5xl font-bold">Welcome to eVault</h1>
                <p className="text-lg text-black/90 font-light">A secure and reliable platform for storing your legal documents</p>

                {noMetamask && <p className="text-red-500">Please install Metamask to continue</p>}

                {!noMetamask && !connected && 
                <Button
                    onClick={handleAuthenticate}
                    startContent={
                        connecting ? undefined : <Fingerprint size={20} />
                    } 
                    className="bg-primary text-lg text-white" size="lg">Authenticate</Button>
                }

                {connected && isLoggedIn && <Button as={Link} href="/home" className="bg-primary text-lg text-white" size="lg">Go to Dashboard</Button>}
                {connected && !isLoggedIn && <Button as={Link} href="/register" className="bg-primary text-lg text-white" size="lg">Register</Button>}
            </div>
        </div>

        // <div className="h-screen bg-neutral-100 flex items-center justify-center gap-10">
        //     <Button as={Link} href="/login">Login</Button>
        //     <Button as={Link} href="/register">Register</Button>
        // </div>
    )
}