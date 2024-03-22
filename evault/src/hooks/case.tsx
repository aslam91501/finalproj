import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import pb from "../config/pb"

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
        onError: () => {
            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    const { mutate: create } = useMutation({
        mutationFn: (data: { title: string, description: string }) => pb.collection('cases').create({ ...data, name:data.title, lawyer: pb.authStore.model!.id }),
        onSuccess: (data) => {
            grantAccess({ case: data.id, user: pb.authStore.model!.id })
        },
        onError: () => {
            toast.error('Something went wrong', {
                theme: 'colored',
                autoClose: 2000
            })
        },
    })

    return {
        create, 
        grantAccess
    }
}