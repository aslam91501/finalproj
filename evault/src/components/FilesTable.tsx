import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Link } from "@nextui-org/react";
import { useAuth, User } from "../config/authHooks";
import { Approval, Case, getCaseById, useCaseMutations } from "../hooks/case";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CaseFile } from "../hooks/file";
import { pinataGateway } from "../config/vars";

interface Props{
    data: CaseFile[]
}

export const FilesTable = (props: Props) => {
    const { user } = useAuth();

    const { id } = useParams();

    // get case by id
    const { data , isError, isLoading } = getCaseById(id!);

    const [caseDetails, setCaseDetails] = useState<Case | null>(null);

    
    useEffect(() => {
        if(!isLoading && !isError)
            setCaseDetails(data!);
    }, [isLoading])

    if(isLoading || caseDetails === null) return "Loading...";
    if(isError) return "Something went wrong";

    return (
    <Table>
        <TableHeader>
            <TableColumn>File Name</TableColumn>
            <TableColumn>IPFS Hash</TableColumn>
            <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
            {props.data ? props.data.map((file, index) => {
                return <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{file.ipfsHash}</TableCell>
                    <TableCell>
                        <Button color="primary" 
                            // onClick={() => revoke({ caseId: id!, clientId: user })}
                            as={Link}
                            href={`${pinataGateway}/${file.ipfsHash}`}
                            target="_blank"
                        >    
                            View
                        </Button>
                    </TableCell>
                </TableRow>;
            }) : <></>}
        </TableBody>
    </Table>
    )
}                                                                                                                                                                                                                               