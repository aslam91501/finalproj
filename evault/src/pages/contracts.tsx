import { Button, Input, Link, Listbox, ListboxItem, useDisclosure } from '@nextui-org/react';
import { CreateContractModal } from '../components/CreateContractModal';
import contractSvg from '/selectContract.svg';
import { Contract, useContract } from '../hooks/contract';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const ContractsPage = () => {
    const { status, getAllContracts, createContract, setContractId, getContractId } = useContract();

    const [contracts, setContracts] = useState<Contract[]>([]);
    const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');

    const { onClose, onOpen, isOpen } = useDisclosure();


    const authenticate = () => {
        if(password === 'adminpass'){
            setAuthenticated(true);
        }
        else{
            toast.error('Invalid password');
        }
    
    }

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

    useEffect(() => {
        if(status === 'success'){
            setContracts(getAllContracts());
            onClose();
        }
    }, [status])

    const handleCreateContract = (name: string, description: string) => {
        createContract({ name, description });
        setContracts(getAllContracts());
    }

    if(!authenticated){
        return (
            <div className="h-screen w-screen flex items-center justify-center px-64 gap-5 flex-col">
                <Input type='password' onChange={(e) => setPassword(e.target.value)} size='lg' className='w-96' label='Admin Password' />
                <Button size='lg' color='primary' isDisabled={password === ''} onClick={authenticate}>Authenticate</Button>
            </div>
        )
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

                <Button as={Link} href='/' color='default' isDisabled={selectedContractId === null} isLoading={status === 'pending'}>Proceed</Button>
                
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