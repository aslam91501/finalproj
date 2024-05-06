import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import pb from "../config/pb"
import { ethers } from "ethers";
import { useContract } from "./contract";
import { abi } from "../config/vars";
import ShortUniqueId from 'short-unique-id'


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

    return {
        create, 
        grantAccess,
        createStatus,
        requestAcc,
        requestAccessStatus
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

        return (await contract.getAllCases());
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