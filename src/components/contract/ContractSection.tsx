import { ContracFormType, ContractTableType } from "@/types/types";
import useAppStore from "@/zustand/app.slice";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { memo, useMemo } from "react";
import IconSvg from "../IconSvg";

const VISIBLE_FIELD: Array<keyof ContracFormType> = [
    'customer_fullname',
    'customer_id',
    'customer_dob',
    'customer_address',
]
const ContractSection = (): JSX.Element => {
    const { contractInfo } = useAppStore();

    const dataTable = useMemo(() => {
        if(!contractInfo) return;
        return contractInfo.filter(v => VISIBLE_FIELD.includes(v.infoKey));
    }, [contractInfo])

    return (
        <div className="w-full h-full bg-white card p-0 lg:p-3">
            <DataTable<ContractTableType[]>
                value={dataTable} 
                removableSort
                showGridlines
                size="small"
                className="border border-solid border-gray-4 rounded-md overflow-auto relative"
                stripedRows>
                <Column field="infoKey" header="infoKey" sortable className="text-xs lg:text-base"></Column>
                <Column field="infoValue" header="infoValue" sortable className="text-xs lg:text-base"></Column>
                <Column 
                    field="isValidated" 
                    header="isValidated" 
                    sortable 
                    className="text-xs lg:text-base"
                    body={(data) => (
                        <>
                        {
                            data.isValidated ? 
                            <IconSvg name="check-circle" className="text-success-7 h-5 w-5"/> :
                            <IconSvg name="x-circle" className="text-danger-7 h-5 w-5"/>
                        }
                        </>
                    )}></Column>
            </DataTable>
        </div>
    )
}

export default memo(ContractSection);