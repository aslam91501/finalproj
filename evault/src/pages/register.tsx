import { Button, Input, Switch } from "@nextui-org/react"
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../config/authHooks";
import registerSvg from '/signup.svg';
import { useContract } from "../hooks/contract";

export const RegistrationPage = () => {
    const [isLawyer, setIsLawyer] = useState(true);
    const { register } = useAuth();

    const formRef = useRef<HTMLFormElement>(null);
    const { ensureContractSelected } = useContract();

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const formData = new FormData(formRef.current!);

        register({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: isLawyer ? 'lawyer' : 'other'
        })
    }

    useEffect(() => ensureContractSelected() , [])

    return (
        <div className="h-screen w-screen flex gap-20 items-center p-10">
            <img src={ registerSvg } alt="logo" className="w-1/3" />

                <form ref={formRef} onSubmit={handleSubmit} className="pl-32 w-[460px] pt-10 pb-8 mb-4 gap-8 flex flex-col">
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
                    {/* <Input
                        label="Password"
                        name="password"
                        type="password"
                        isRequired
                        required
                    /> */}

                    <Switch isSelected={isLawyer} onValueChange={setIsLawyer} name="isLawyer">Are you a lawyer?</Switch>

                    <Button type="submit" color="primary"  className='w-fit'>
                        Register
                    </Button>
                </form>
        </div>
    )
}