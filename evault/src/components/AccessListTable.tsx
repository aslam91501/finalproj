import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { useAuth, User } from "../config/authHooks";
import { Case, getCaseById, useCaseMutations } from "../hooks/case";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface Props{
    users: User[]
}

export const AccessListTable = (props: Props) => {
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
            <TableColumn>User Id</TableColumn>
            <TableColumn>Name</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Is Lawyer</TableColumn>
            <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
            {props.users ? props.users.map((user, index) => {
                return <TableRow key={index}>
                    <TableCell>{user.userAddress}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.isLawyer ? "Yes" : "No"}</TableCell>
                    <TableCell>
                        <Button color="danger" 
                            isDisabled={ revokeStatus === 'pending'  }
                            onClick={() => revoke({ caseId: id!, clientId: user.userAddress })}
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