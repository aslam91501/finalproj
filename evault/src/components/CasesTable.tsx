import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { format } from "timeago.js";
import pb from "../config/pb";
import { CaseAccess } from "../config/models";

interface Props{
    data: CaseAccess[]
}

export const CasesTable = (props: Props) => {
    return (
    <Table>
        <TableHeader>
            <TableColumn>Title</TableColumn>
            <TableColumn>Description</TableColumn>
            <TableColumn>Created</TableColumn>
            <TableColumn>Updated</TableColumn>
            <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody>
            {props.data ? (props.data as unknown as CaseAccess[]).map((item, index) => {
                return <TableRow key={index}>
                    <TableCell>{item.expand.case.name}</TableCell>
                    <TableCell>{item.expand.case.description}</TableCell>
                    <TableCell>{format(item.expand.case.created)}</TableCell>
                    <TableCell>{format(item.expand.case.updated)}</TableCell>
                    <TableCell>
                        {/* <EditProjectModal 
                            data={item}
                            onClose={() => toggleEditModal(item.id)}
                            isOpen={editModalOpen.get(item.id) ?? false} />

                        <ProjectDeleteModal 
                            data={item}
                            onClose={() => toggleDeleteModal(item.id)}
                            isOpen={deleteModalOpen.get(item.id) ?? false} /> */}

                        <Dropdown>
                            <DropdownTrigger>
                                <Button color="default">Actions</Button>
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem href={`/p/${item.id}`}>View</DropdownItem>
                                {/* <DropdownItem onClick={() => toggleEditModal(item.id)}>Edit</DropdownItem> */}
                                <DropdownItem 
                                    // onClick={() => toggleDeleteModal(item.id)}
                                    color="danger" 
                                    className="text-danger">Delete</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </TableCell>
                </TableRow>;
            }) : <></>}
        </TableBody>
    </Table>
    )
}