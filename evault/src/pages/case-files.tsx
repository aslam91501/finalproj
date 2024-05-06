import { useParams } from "react-router-dom";
import { Approval, getApprovals } from "../hooks/case"
import { useEffect, useState } from "react"
import { ApprovalsTable } from "../components/ApprovalsTable";
import { Button, Link } from "@nextui-org/react";

export const CaseFilesPage = () => {
    const { id } = useParams();

    const { data, isError, isLoading } = getApprovals(id!);

    const [approvals, setApprovals] = useState<Approval[] | null>(null);

    useEffect(() => {
        console.log(approvals)
        console.log(data)

        if(data){
        const mappedApprovals: Approval[] = data.map((c: any) => {
            return {
                caseId: c[0],
                client: c[1],
                lawyer: c[2],
                approved: c[3]
            }
        })

        setApprovals(mappedApprovals);
        }
    }, [data])

    if(isLoading || approvals === null) return "Loading..."
    if(isError) { return "Something went wrong"}
    
    return (
    <div className="w-full pt-10 px-20">
        <div className="flex items-center gap-4 py-5">
            <Button as={Link} href={`/cases/${id}/approvals`} >Approvals</Button>
            <Button as={Link} href={`/cases/${id}/access-list`}>Access List</Button>
            <Button color="primary" >Files</Button>
        </div>

        <h1 className="font-medium text-3xl text-primary">Case Files</h1>

        <div className="mt-5">
            <ApprovalsTable data={approvals} />
        </div>
    </div>
    )
}