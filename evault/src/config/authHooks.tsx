import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import pb from "./pb";
import { Role } from "./models";
import { authenticate, registerUser } from "../services/auth";
import { useSDK } from "@metamask/sdk-react";
import { ethers } from "ethers";
import { abi } from "./vars";
import { useContract } from "../hooks/contract";

export const useAuth = () => {
    const navigate = useNavigate();
    

    const setToken = () => {
        sessionStorage.setItem('authStatus', 'authenticated');
    }

    const unsetToken = () => {
        sessionStorage.removeItem('authStatus');
    }

    // Attempt Login
    const { mutate: attemptLogin } = useMutation({
        mutationFn: () => authenticate(),
        onSuccess: (result) => {
            if(!!result){
                toast.success('Success', {
                    theme: 'colored'
                })
                
                setToken();

                navigate('/home')
            } else {
                toast.info('Account not found. Please register.', {
                    theme: 'colored',
                    autoClose: 2000
                })

                navigate('/register')
            }
        },
        onError: (err) => {
            console.log(err)

            toast.error('Something went wrong.', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    const { getContractId } = useContract();

    async function authenticate(){
        const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');
        
        const user = await sdk?.connect();

        const contract = new ethers.Contract(getContractId()!, abi, provider);

        const isRegistered = await contract.getIsRegistered(user[0]);

        console.log('Is regisered value ', isRegistered)
        
        return isRegistered;
    }

    const { mutate: register } = useMutation({
        mutationFn: ({ email, name, role }: { email: string, name: string, role: Role }) => {
            return registerUser({ email, name, role });
        },
        onSuccess: () => {
            toast.success('Success', {
                theme: 'colored'
            })
            
            setToken();

            navigate('/home')
        },
        onError: (err) => {
            console.log(err)

            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })
    
    async function registerUser({ email, name, role }: { email: string, name: string, role: Role }){
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        console.log(name, email, role)

        await contract.registerUser(name, email, role === 'lawyer');
    }

    const { connected, sdk  } = useSDK();


    const isLoggedIn = sessionStorage.getItem('authStatus') === 'authenticated';
    // const loading = authStateLoading || authStateFetching;


    const redirectIfLoggedIn = () => {
        if(isLoggedIn){
            navigate('/home');
        }
    }

    const redirectIfUnauthenticated = () => {        
        if(!isLoggedIn){
            navigate('/');
        }
    }

    const logout = () => {
        // pb.authStore.clear();

        sdk?.terminate();
        unsetToken();
        navigate('/');
    }

    return {
        attemptLogin,
        isLoggedIn,
        redirectIfLoggedIn,
        redirectIfUnauthenticated,
        logout,
        register
        // loading,
    }
}