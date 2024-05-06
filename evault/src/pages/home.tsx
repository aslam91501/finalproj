import { CasesTable } from "../components/CasesTable";
import { CreateCaseModal } from "../components/CreateCaseModal"
import { Case, getAllCases } from "../hooks/case"
import { useEffect, useState } from "react"
import { useEventLogs } from "../hooks/contract";

export const HomePage = () => {
    const { data, isError, isLoading } = getAllCases();

    const [cases, setCases] = useState<Case[] | null>(null);


    useEffect(() => {
        if(data !== undefined && data !== null){
            if(data.length === 0) return setCases([]);

            const mappedCases: Case[] = data.map((c: any) => {
                return {
                    caseId: c[0],
                    name: c[1],
                    description: c[2],
                    lawyer: c[3],
                    access: c[4]
                }
            })

            setCases(mappedCases);
        }
    }, [data])

    if(isLoading || cases === null) return "Loading..."
    if(isError) { return "Something went wrong"}
    
    return (
    <div className="w-full pt-10 px-20">
        <h1 className="font-medium text-3xl text-primary">Cases</h1>

        <div className="mt-5">
            <CreateCaseModal />
        </div>

        <div className="mt-5">
            <CasesTable data={cases} />
        </div>
    </div>
    )
}