import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { abi, bytecode } from "../config/vars";

export interface Contract{
    address: string;
    name: string;
    description: string;
    created: Date;
}




export const useContract = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    async function deployContract(data: {
        name: string;
        description: string;
    }){
        setLoading(true);
    
        const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');

        
        const privateKey = '0xb72ab9bac2f39d345752eb3bbd887447c44244ba27e2566061ec9cce391ae199';
        const publicKey = '0x6d615faEa510b693c46B0bD9220B19256e2C35D0';

        const wallet = new ethers.Wallet(privateKey, provider);

        const factory = new ethers.ContractFactory(abi, bytecode, wallet);

        console.log(factory);

        const contractInstance = await factory.deploy(data.name, data.description);

        await contractInstance.waitForDeployment()

        const contracts = getAllContracts();

        console.log(contractInstance);

        contracts.push({
            address: await contractInstance.getAddress(),
            name: data.name,
            description: data.description,
            created: new Date()
        });

        sessionStorage.setItem('contracts', JSON.stringify(contracts));
    
        setLoading(false);
    }


    const { status, mutate: createContract } =  useMutation({
        mutationFn: (data: { name: string, description: string }) => deployContract(data),
        onSuccess: () => toast.success('Contract created successfully'),
        onError: (error) => { toast.error("Error deploying contract"); console.error(error) }
    })



    function getAllContracts(){
        return JSON.parse(sessionStorage.getItem('contracts') || '[]');
    }

    function isContractSelected(){
        // return !!sessionStorage.getItem('contractId');
        return true;
    }

    function getContractId(){
        // return sessionStorage.getItem('contractId');
        return '0x9C39419f1998599d650e065c0077053C37C926FB';
    }

    function setContractId(contractId: string){
        sessionStorage.setItem('contractId', contractId);
    }

    function ensureContractSelected(){
        if(!isContractSelected()){
            navigate('/contracts')
        }
    }

    return { status, getContractId, setContractId, isContractSelected, getAllContracts, createContract, ensureContractSelected };
}

export const useEventLogs = () => {
    const { getContractId } = useContract();

    const { data } = useQuery({
        queryKey: ['logs'],
        queryFn: () => getAllLogs(getContractId()!),
        enabled: getContractId() !== null
    })

    async function getAllLogs(contractAddress: string){
        const provider = new ethers.JsonRpcProvider('HTTP://127.0.0.1:7545');

        const filter = {
            address: contractAddress,
        };

        return provider.getLogs(filter);
    }

    return { logs: data }
}