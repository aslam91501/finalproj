import { Role } from "../config/models";

export async function authenticate(addr: string){
    return false;
}

export async function registerUser({ email, name, role }: { email: string, name: string, role: Role }){
    return new Promise((resolve) => {
        resolve({ email, name, role });
    });
}