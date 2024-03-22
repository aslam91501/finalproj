import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import pb from "./pb";
import { Role } from "./models";

export const useAuth = () => {
    const navigate = useNavigate();
    
    // Attempt Login
    const { mutate: attemptLogin } = useMutation({
        mutationFn: ({ email, password }: { email: string, password: string }) => {
            return pb.collection('users').authWithPassword(email, password);
        },
        onSuccess: () => {
            toast.success('Success', {
                theme: 'colored'
            })
            
            navigate('/')
        },
        onError: () => {
            toast.error('Invalid email or password', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    const { mutate: register } = useMutation({
        mutationFn: ({ email, password, name, role }: { email: string, password: string, name: string, role: Role }) => {
            return pb.collection('users').create({
                email,
                password,
                name,
                role,
                passwordConfirm: password
            })
        },
        onSuccess: () => {
            toast.success('Success', {
                theme: 'colored'
            })
            
            navigate('/login')
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

    const isLoggedIn = pb.authStore.isValid;
    // const loading = authStateLoading || authStateFetching;


    const redirectIfLoggedIn = () => {
        if(isLoggedIn){
            navigate('/home');
        }
    }

    const redirectIfUnauthenticated = () => {
        if(!isLoggedIn){
            navigate('/login');
        }
    }

    const logout = () => {
        pb.authStore.clear();
        navigate('/login');
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