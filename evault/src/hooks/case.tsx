import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import pb from "../config/pb"
import { ethers } from "ethers";
import { useContract } from "./contract";
import { abi } from "../config/vars";
import ShortUniqueId from 'short-unique-id'
import { User } from "../config/authHooks";


export const useCaseMutations = (props?: { onComplete?: Function }) => {
    const qc = useQueryClient();

    const { mutate: grantAccess } = useMutation({
        mutationFn: (data: { case: string, user: string }) => pb.collection('case_access').create(data),
        onSuccess: () => {
            toast.success('Success', {
                theme: 'colored'
            })  

            qc.invalidateQueries({ queryKey: ['getCasesWithAccess'] })

            if(props?.onComplete) 
                props.onComplete();
        },
        onMutate: () => {
            toast.info('Creating. Please wait...')
        },
        onError: () => {
            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    const queryClient = useQueryClient();

    const { mutate: create, status: createStatus } = useMutation({
        mutationFn: (data: { title: string, description: string }) => createCase(data),
        onSuccess: (data) => {
            toast.success('Case Created');

            queryClient.invalidateQueries({ queryKey: ['getAllCases'] });
        },
        onError: (err) => {
            console.log(err)

            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    const { getContractId } = useContract();

    async function createCase(data: { title: string, description: string }) {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        const uid = new ShortUniqueId({ length: 10 }).rnd();

        await contract.createCase(uid, data.title, data.description);
    }


    const { mutate: requestAcc, status: requestAccessStatus } = useMutation({
        mutationFn: (caseId: string) => requestAccess({ caseId }),
        onSuccess: (data) => {
            toast.success('Requested Access');

            queryClient.invalidateQueries({ queryKey: ['getAllCases'] });
        },
        onError: (err) => {
            console.log(err)

            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    async function requestAccess(data: {caseId: string }) {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        await contract.requestAccess(data.caseId);
    }

    const { mutate: approve, status: approveStatus } = useMutation({
        mutationFn: ({ caseId, clientId } : { caseId: string, clientId: string }) => approveRequest({ caseId, clientId }),
        onSuccess: (data) => {
            toast.success('Approved');

            queryClient.invalidateQueries({ queryKey: ['getAllCases'] });
        },
        onError: (err) => {
            console.log(err)

            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    async function approveRequest(data: {caseId: string, clientId: string }) {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        await contract.approveAccess(data.caseId, data.clientId);
    }

    const { mutate: revoke, status: revokeStatus } = useMutation({
        mutationFn: ({ caseId, clientId } : { caseId: string, clientId: string }) => revokeAccess({ caseId, clientId }),
        onSuccess: (data) => {
            toast.success('Revoked Access');

            queryClient.invalidateQueries({ queryKey: ['getAllCases'] });
        },
        onError: (err) => {
            console.log(err)

            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    async function revokeAccess(data: {caseId: string, clientId: string }) {
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        await contract.revokeAccess(data.caseId, data.clientId);
    }

    return {
        create, 
        grantAccess,
        createStatus,
        requestAcc,
        requestAccessStatus,
        approve,
        approveStatus,
        revoke,
        revokeStatus
    }
}

export interface Case{
    caseId: string,
    name: string,
    description: string,
    lawyer: string,
    access: string[]
}


export const getAllCases = () => {
    const { getContractId } = useContract();

    const { data: data, isLoading, isError } = useQuery({
        queryKey: ['getAllCases'],
        queryFn: getCases,
        refetchOnWindowFocus: false
    })

    async function getCases(){
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        const data=  (await contract.getAllCases());

        console.log(data);

        return data;
    }

    return {
        data,
        isLoading,
        isError
    }
}

export interface Approval{
    caseId: string,
    client: string,
    lawyer: string,
    approved: boolean
}


export const getApprovals = (caseId: string) => {
    const { getContractId } = useContract();

    const { data: data, isLoading, isError } = useQuery({
        queryKey: ['getApprovals', caseId],
        queryFn: getApprovals,
        refetchOnWindowFocus: false
    })

    async function getApprovals(){
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        return (await contract.getApprovalRequests(caseId));
    }

    return {
        data,
        isLoading,
        isError
    }
}


export const getCaseAccessList = (caseId: string) => {
    const { getContractId } = useContract();

    const { data: data, isLoading, isError, error } = useQuery({
        queryKey: ['getCaseAccessList', caseId],
        queryFn: getCaseAccessList,
        refetchOnWindowFocus: false,
        enabled: !!caseId
    })

    async function getCaseAccessList(){
        console.log(caseId);

        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        const c = await contract.getCase(caseId);
        
        console.log(c);

        const caseDetails: Case = {
            caseId: c[0],
            name: c[1],
            description: c[2],
            lawyer: c[3],
            access: c[4]
        }

        console.log(caseDetails);

        let users: User[] = [];
        
        for(let i = 0; i < caseDetails.access.length; i++){
            const userData = await contract.getUser(caseDetails.access[i]);

            console.log(userData);

            users.push({ userAddress: userData[0], name: userData[1], email: userData[2], isLawyer: userData[3] })
        }

        users = users.filter(u => u.userAddress !== caseDetails.lawyer)

        console.log(users);

        return users;
    }

    return {
        data,
        isLoading,
        isError,
        error
    }
}

export const getCaseById = (caseId: string) => {
    const { getContractId } = useContract();

    const { data: data, isLoading, isError, error } = useQuery({
        queryKey: ['getCaseById', caseId],
        queryFn: getCaseById,
        refetchOnWindowFocus: false,
        enabled: !!caseId
    })

    async function getCaseById(){
        const provider = new ethers.BrowserProvider(window.ethereum!);
        
        const contract = new ethers.Contract(getContractId()!, abi, (await provider.getSigner()));

        const c = await contract.getCase(caseId);
        
        const caseDetails: Case = {
            caseId: c[0],
            name: c[1],
            description: c[2],
            lawyer: c[3],
            access: c[4]
        }

        return caseDetails;
    }

    return {
        data,
        isLoading,
        isError,
        error
    }
}