import { useQuery } from "@tanstack/react-query"
import { CasesTable } from "../components/CasesTable"
import { CreateCaseModal } from "../components/CreateCaseModal"
import pb from "../config/pb"
import { CaseAccess } from "../config/models"

export const HomePage = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['getCasesWithAccess'],
        queryFn: () => pb.collection('case_access').getFullList({ expand: 'case', filter: `user="${pb.authStore.model!.id}"` })
    })

    if(isLoading) return "Loading..."
    if(isError) return "Something went wrong"
    
    return (
    <div className="w-full pt-10 px-20">
        <h1 className="font-medium text-3xl text-primary">Cases</h1>

        <div className="mt-5">
            <CreateCaseModal />
        </div>

        <div className="mt-5">
            <CasesTable data={data as unknown as CaseAccess[]} />
        </div>
    </div>
    )
}