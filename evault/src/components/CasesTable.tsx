import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem, Link } from "@nextui-org/react";
import { Case, useCaseMutations } from "../hooks/case";
import { useAuth } from "../config/authHooks";

interface Props{
    data: Case[]
}

export const CasesTable = (props: Props) => {
    const { user } = useAuth();
    const { requestAccessStatus, requestAcc } = useCaseMutations();

 
 
    return (
    <Table >
        <TableHeader>
            <TableColumn>Id</TableColumn>
            <TableColumn>Title</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
            { props.data.map((item, index) => {
                return <TableRow key={index}>
                    <TableCell>{item.caseId}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>
                        { (item.access.includes(user?.userAddress.toUpperCase()!) || item.lawyer.toUpperCase() === user?.userAddress?.toUpperCase()) ? 
                            <Button 
                                isDisabled={requestAccessStatus === 'pending'} 
                                isLoading={requestAccessStatus === 'pending'} 
                                as={Link} href={`/cases/${item.caseId}/approvals`} 
                                color="primary">
                                    View Case
                            </Button> 
                            :
                            <Button 
                                isDisabled={requestAccessStatus === 'pending'} 
                                isLoading={requestAccessStatus === 'pending'} 
                                onClick={() => requestAcc(item.caseId)}>
                                    Request Access
                            </Button>
                        }
                    </TableCell>
                </TableRow>;
            })} 
        </TableBody>
    </Table>
    )
}                                                                                                                                                                                                                               