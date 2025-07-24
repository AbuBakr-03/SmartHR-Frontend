import { useListDepartmentsPrivate } from "@/hooks/useDepartment";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const CompanyTable = () => {
  const listDepartments = useListDepartmentsPrivate();
  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Departments</h1>
      <DataTable columns={columns} data={listDepartments.data ?? []} />
    </div>
  );
};

export default CompanyTable;
