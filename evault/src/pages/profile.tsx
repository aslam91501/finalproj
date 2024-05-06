import { Avatar, Card } from "@nextui-org/react"
import { useAuth } from "../config/authHooks";

export const ProfilePage = () => {
    const { user } = useAuth();

    return (
        <div className="py-10 px-32 flex flex-col items-center gap-4 w-full">
            <Avatar className="w-32 h-32" />

            <h1 className="text-3xl font-light mt-">{ user?.name }</h1>

            <Card className="mt-4 flex flex-col gap-6 w-2/5 py-4 px-6 text-sm" radius="sm" shadow="sm">
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Id</span>
                    <span>{ user?.userAddress }</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold">Email</span>
                    <span>{ user?.email }</span>
                </div>
                <div className="flex justify-between items-center ">
                    <span className="font-semibold">User Type</span>
                    <span className="capitalize">{ user?.isLawyer ? 'Lawyer' : 'Non-Lawyer User' }</span>
                </div>
            </Card>
        </div>
    )
}