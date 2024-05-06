import { useEffect } from "react";
import { useAuth } from "../config/authHooks";  
import { Outlet } from "react-router-dom";
import { Button, Link, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { IoHomeOutline } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { FaRegUser } from "react-icons/fa";
import { useContract } from "../hooks/contract";
import { LuBookMinus } from "react-icons/lu";

const Layout = () => {
    const { ensureContractSelected } = useContract();
    const { redirectIfUnauthenticated, logout, user } = useAuth();



    useEffect(() => { 
        redirectIfUnauthenticated();

        ensureContractSelected();
    }, [])

    if(!user) return <>Loading...</>

    return (
        <div className="flex flex-col min-h-screen max-w-full w-screen bg-slate-50">
            <nav className="border-b-1 flex items-center justify-center gap-8 h-16 text-sm bg-white font-mono uppercase">
                {/* <Tooltip showArrow placement="bottom" content="Home" color="primary"> */}
                    <Link href="/" color="foreground">
                        <IoHomeOutline size={20} />
                    </Link>

                    <Link href="/home" color="foreground">
                        <LuBookMinus size={20} />
                    </Link>
                {/* </Tooltip> */}
                
                <Link href="/profile" color="foreground">
                    <FaRegUser size={18} />
                </Link>
                <Popover placement="right">
                    <PopoverTrigger>
                        <div>
                        {/* <Tooltip content={"Logout"} placement="bottom" color="danger" showArrow> */}
                            <p>
                                <IoIosLogOut size={20} />
                            </p>
                        {/* </Tooltip> */}
                        </div>
                    </PopoverTrigger>
                    <PopoverContent>
                        <div className="px-3 py-3">
                            <div className="font-bold">Are you sure?</div>
                            <Button color="danger" className="mt-2 ml-2"
                                onClick={logout}>Log Out</Button>
                        </div>
                    </PopoverContent>
                </Popover>

               
            </nav>
            <Outlet></Outlet>
        </div>
    )
}

export default Layout