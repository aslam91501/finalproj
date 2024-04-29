import { useEffect, useRef } from 'react';
import { Modal, Input, Button, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from '@nextui-org/react';

interface Props{
    handleSubmit: (name: string, description: string) => void;
    loading: boolean;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

export const CreateContractModal = (props: Props) => {
    const title = 'Create Contract';

    const submitButtonRef = useRef<HTMLButtonElement>(null);
    
    const formRef = useRef<HTMLFormElement>(null);

    const { onClose, onOpen, isOpen } = props;

    function handleSubmit(e: any){
        e.preventDefault();

        const formData = new FormData(formRef.current!);

        props.handleSubmit(
            formData.get('title') as string, 
            formData.get('description') as string
        );

        if(!props.loading)
            onClose();
    }

    useEffect(() => {
        if(!props.loading)
            onClose();
    }, [props.loading])
    
    return <>
        <Button variant="flat" className="bg-primary text-white" onPress={onOpen}>
            New Contract
        </Button>

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className='max-h-screen overflow-y-auto'
        >
            <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalBody>
                        <form ref={formRef} className='flex flex-col gap-5' onSubmit={handleSubmit}>
                            <Input
                                label="Contract Name"
                                name='title'
                                isRequired required
                            />
                            <Textarea
                                label="Description"
                                name='description'
                                isRequired required
                            />
                            <button type="submit" value="asdf" className='invisible h-0 w-0' ref={submitButtonRef} />
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button isDisabled={props.loading} color="primary" onPress={() => {submitButtonRef.current?.click();}}>
                            Deploy Contract
                        </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
        </Modal>
    </>
};
    