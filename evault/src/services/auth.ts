import { ethers } from "ethers";
import { Role } from "../config/models";
import { abi } from "../config/vars";

export async function authenticate(data: { user: string, contract: string }){
    const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');
    
    const contract = new ethers.Contract(data.contract, abi, provider);
    
    

    provider.getSigner()
    
    return false;
}

export async function registerUser({ email, name, role }: { email: string, name: string, role: Role }){
    return new Promise((resolve) => {
        resolve({ email, name, role });
    });
}