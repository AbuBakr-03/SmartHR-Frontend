import { useListCompaniesPrivate } from "@/hooks/useCompany";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const CompanyTable = () => {
  const listCompanies = useListCompaniesPrivate();
  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Companies</h1>
      <DataTable columns={columns} data={listCompanies.data ?? []} />
    </div>
  );
};

export default CompanyTable;
