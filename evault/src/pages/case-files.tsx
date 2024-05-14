import { useParams } from "react-router-dom";
import { Approval, getApprovals } from "../hooks/case"
import { useEffect, useRef, useState } from "react"
import { ApprovalsTable } from "../components/ApprovalsTable";
import { Button, Link } from "@nextui-org/react";
import { FilesTable } from "../components/FilesTable";
import { IoAddOutline } from "react-icons/io5";
import { getFiles, useFiles } from "../hooks/file";

export const CaseFilesPage = () => {
    const { id } = useParams();

    const { data, isError, isLoading } = getFiles();

    const ref = useRef<HTMLInputElement>(null);

    // const [approvals, setApprovals] = useState<Approval[] | null>(null);

    const { uploadFile, uploadStatus } = useFiles();

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
    }, [data])

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
          const file = event.target.files[0];
        //   setSelectedFile(file);

            uploadFile(file);
        }
    };


    
    if(isLoading) return "Loading..."
    if(isError) { return "Something went wrong"}
    
    return (
    <div className="w-full pt-10 px-20">
        <div className="flex items-center gap-4 py-5">
            <Button as={Link} href={`/cases/${id}/approvals`} >Approvals</Button>
            <Button as={Link} href={`/cases/${id}/access-list`}>Access List</Button>
            <Button color="primary" >Files</Button>
        </div>


        <h1 className="font-medium text-3xl text-primary">Case Files</h1>

        <input onChange={handleFileChange} ref={ref} type="file" name="asdf" className="hidden" id="asdf" />
        <Button isLoading={uploadStatus === 'pending'} isDisabled={uploadStatus === 'pending'} className="mt-4" startContent={<IoAddOutline size={25} />} color="primary" onClick={() => ref.current?.click() }>Upload File</Button>

        <div className="mt-5">
            <FilesTable data={data!} />
        </div>
    </div>
    )
}