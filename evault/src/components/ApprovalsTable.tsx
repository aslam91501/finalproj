import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Link } from "@nextui-org/react";
import { Approval, Case, useCaseMutations } from "../hooks/case";
import { useAuth } from "../config/authHooks";

interface Props{
    data: Approval[]
}

export const ApprovalsTable = (props: Props) => {
    const { user } = useAuth();
    const { approve, approveStatus } = useCaseMutations();

    console.log(props?.data[0])
    console.log(user?.userAddress?.toUpperCase().trim())


    return (
    <Table>
        <TableHeader>
            <TableColumn>Case Id</TableColumn>
            <TableColumn>Client Id</TableColumn>
            <TableColumn>Lawyer Id</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
            {props.data ? props.data.map((item, index) => {
                return <TableRow key={index}>
                    <TableCell>{item.caseId}</TableCell>
                    <TableCell>{item.client}</TableCell>
                    <TableCell>{item.lawyer}</TableCell>
                    <TableCell>{item.approved ? "Approved" : "Pending"}</TableCell>
                    <TableCell>
                        <Button color="primary" 
                            isDisabled={
                                (user?.userAddress.toUpperCase().trim() !== item.lawyer.toUpperCase().trim()) 
                                    || 
                                item.approved
                                    ||
                                approveStatus === 'pending'
                            }
                            onClick={() => approve({ caseId: item.caseId, clientId: item.client })}
                        >    
                            Approve
                        </Button>
                    </TableCell>
                </TableRow>;
            }) : <></>}
        </TableBody>
    </Table>
    )
}                                                                                                                                                                                                                               