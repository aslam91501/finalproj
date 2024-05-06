import { useEffect, useRef } from 'react';
import { Modal, Input, Button, useDisclosure, ModalContent, ModalHeader, ModalBody, ModalFooter, Textarea } from '@nextui-org/react';
import { useCaseMutations } from '../hooks/case';
import { useAuth } from '../config/authHooks';

export const CreateCaseModal = () => {
    const title = 'Create Case';

    const { onClose, onOpen, isOpen, onOpenChange } = useDisclosure();
    const submitButtonRef = useRef<HTMLButtonElement>(null);
    
    const formRef = useRef<HTMLFormElement>(null);

    const { create, createStatus } = useCaseMutations({ onComplete: onClose });

    const { user } = useAuth();

    useEffect(() => {
        if(createStatus === 'success'){
            onClose();
        }
    }, [createStatus])

    function handleSubmit(e: any){
        e.preventDefault();

        const formData = new FormData(formRef.current!);

        create({
            title: formData.get('title') as string,
            description: formData.get('description') as string
        })
    }
    
    return <>
        <Button variant="flat" className="bg-primary text-white" onPress={onOpen} isDisabled={!user || !user.isLawyer}>
            New Case
        </Button>

        <Modal
            isOpen={isOpen}
            onClose={onClose}
            onOpenChange={onOpenChange}
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
                                label="Title"
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
                        <Button color="danger" 
                            isDisabled={createStatus === 'pending'}
                            variant="light" onPress={onClose}>
                            Close
                        </Button>
                        <Button color="primary" 
                            isDisabled={createStatus === 'pending'}
                            isLoading={createStatus === 'pending'}
                            onPress={() => {submitButtonRef.current?.click();}}>
                            Create Case
                        </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
        </Modal>
    </>
};
    