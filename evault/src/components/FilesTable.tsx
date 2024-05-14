import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { useAuth, User } from "../config/authHooks";
import { Approval, Case, getCaseById, useCaseMutations } from "../hooks/case";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props{
    data: Approval[]
}

export const FilesTable = (props: Props) => {
    const { user } = useAuth();
    const { revoke, revokeStatus } = useCaseMutations();

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
            <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
            {props.data ? props.data.map((user, index) => {
                return <TableRow key={index}>
                    <TableCell>{user.approved}</TableCell>
                    <TableCell>
                        <Button color="danger" 
                            isDisabled={ revokeStatus === 'pending'  }
                            // onClick={() => revoke({ caseId: id!, clientId: user })}
                        >    
                            Revoke Access
                        </Button>
                    </TableCell>
                </TableRow>;
            }) : <></>}
        </TableBody>
    </Table>
    )
}                                                                                                                                                                                                                               