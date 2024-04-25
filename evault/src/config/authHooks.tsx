import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import pb from "./pb";
import { Role } from "./models";
import { authenticate, registerUser } from "../services/auth";
import { useSDK } from "@metamask/sdk-react";

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
        mutationFn: ({ addr }: { addr: string }) => authenticate(addr),
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
        onError: () => {
            toast.error('Something went wrong.', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

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
        onError: () => {
            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })
    
    // const { data: loginStateInfo, isLoading: authStateLoading, isFetching: authStateFetching } = useQuery({
    //     queryKey: ['isLoggedIn'],
    //     retry: 1,
    //     queryFn: () => pb.authStore.isValid,
    // })

    const { connected, sdk  } = useSDK();


    const isLoggedIn = !!connected && sessionStorage.getItem('authStatus') === 'authenticated';
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