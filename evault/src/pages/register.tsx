import { Button, Input, Switch } from "@nextui-org/react"
import { useRef, useState } from "react";
import { useAuth } from "../config/authHooks";

export const RegistrationPage = () => {
    const [isLawyer, setIsLawyer] = useState(true);
    const { register } = useAuth();

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData(formRef.current!);

        register({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            password: formData.get('password') as string,
            role: isLawyer ? 'lawyer' : 'other'
        })
    }

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-neutral-200">
            <form ref={formRef} onSubmit={handleSubmit} className="bg-white w-1/3 shadow-md rounded px-8 pt-10 pb-8 mb-4 gap-5 flex flex-col">
                <h1 className="text-2xl font-medium">Register</h1>

                <Input
                    label="Name"
                    name="name"
                    type="text"
                    isRequired
                    required
                />

                <Input
                    label="Email"
                    name="email"
                    type="email"
                    isRequired
                    required
                />
                <Input
                    label="Password"
                    name="password"
                    type="password"
                    isRequired
                    required
                />

                <Switch isSelected={isLawyer} onValueChange={setIsLawyer} name="isLawyer">Are you a lawyer?</Switch>

                <Button type="submit" color="primary"  className='w-fit'>
                    Register
                </Button>
            </form>
        </div>
    )
}