import { useParams } from "react-router-dom";
import { getCaseAccessList } from "../hooks/case"
import { useEffect } from "react"
import { Button, Link } from "@nextui-org/react";
import { AccessListTable } from "../components/AccessListTable";

export const AccessListPage = () => {
    const { id } = useParams();

    const { data, isError, isLoading, error } = getCaseAccessList(id!);

    // const [approvals, setApprovals] = useState<Approval[] | null>(null);

    useEffect(() => {
        // console.log(approvals)
        console.log(data)

        // if(data){
        // const mappedApprovals: Approval[] = data.map((c: any) => {
        //     return {
        //         caseId: c[0],
        //         client: c[1],
        //         lawyer: c[2],
        //         approved: c[3]
        //     }
        // })

        // setApprovals(mappedApprovals);
        // }

        if(error) console.log(error) 
    }, [data, error])

    if(isLoading) return "Loading..."
    if(isError) { return "Something went wrong"}
    
    return (
    <div className="w-full pt-10 px-20">
        <div className="flex items-center gap-4 py-5">
            <Button as={Link} href={`/cases/${id}/approvals`}>Approvals</Button>
            <Button color="primary">Access List</Button>
            <Button as={Link} href={`/cases/${id}/files`}>Files</Button>
        </div>

        <h1 className="font-medium text-3xl text-primary">Case Access List</h1>

        <div className="mt-5">
            <AccessListTable users={data!} />
        </div>
    </div>
    )
}