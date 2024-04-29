import { Button, Listbox, ListboxItem, useDisclosure } from '@nextui-org/react';
import { CreateContractModal } from '../components/CreateContractModal';
import contractSvg from '/selectContract.svg';
import { Contract, useContract } from '../hooks/contract';
import { useEffect, useState } from 'react';

export const ContractsPage = () => {
    const { status, getAllContracts, createContract, setContractId, getContractId } = useContract();

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

    const { onClose, onOpen, isOpen } = useDisclosure();

    useEffect(() => {
        if(!!selectedContractId)
            setContractId(selectedContractId);
    }, [selectedContractId])


    useEffect(() => {
        setContracts(getAllContracts());

        if(!!getContractId()){
            setSelectedContractId(getContractId());
        }
    }, [])

    const handleCreateContract = (name: string, description: string) => {
        createContract({ name, description });
        setContracts(getAllContracts());
    }


    return <>
        <div className="h-screen w-screen flex gap-20 items-center p-20">
            <img src={ contractSvg } alt="logo" className="w-1/4" />

            <div className="flex flex-col gap-8 pl-32">
                <h1 className="text-5xl font-bold">Select Contract</h1>

                <CreateContractModal 
                    isOpen={isOpen}
                    onClose={onClose}
                    onOpen={onOpen}
                    loading={status === 'pending'}
                    handleSubmit={handleCreateContract} />

                <Button color='default' isDisabled={selectedContractId === null}>Proceed</Button>
                
                { contracts.length === 0 && <p>No contracts found. Please create one to be listed here.</p> }

                { contracts.length !== 0 &&
                <Listbox selectionBehavior='replace' selectionMode='single' selectedKeys={new Set([selectedContractId ?? ""])}>
                    { contracts.map(contract => (
                        <ListboxItem 
                            key={contract.address} 
                            onClick={() => setSelectedContractId(contract.address)}
                            description={contract.description}>{ contract.name }</ListboxItem>
                    ))}
                </Listbox>
                }
            </div>
        </div>

    </>
}