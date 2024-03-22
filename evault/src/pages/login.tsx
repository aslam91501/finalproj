import { Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useAuth } from "../config/authHooks";

export const LoginPage = () => {
    const auth = useAuth();

    useEffect(() => {
        auth.redirectIfLoggedIn();
    }, [])

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
   
    const handleChange = (name: string, value: string) => {
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

     
    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        auth.attemptLogin({ email: formData.email, password: formData.password })
    };

    // if(auth.loading) return <>Loading...</>
    
    return <>
        <div className="w-screen h-screen flex items-center justify-center bg-neutral-200">
            <form onSubmit={handleSubmit} className="bg-white w-1/3 shadow-md rounded px-8 pt-10 pb-8 mb-4 gap-5 flex flex-col">
                <h1 className="text-2xl font-medium">Login</h1>

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                />
                <Button type="submit" color="primary"  className='w-fit' disabled={formData.email === '' || formData.password === ''}>
                    Login
                </Button>
            </form>
        </div>
    </>
}