import { useListApplicationsPrivate } from "@/hooks/useApplication";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const MenuTable = () => {
  const listApplications = useListApplicationsPrivate();
  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Applications</h1>
      <DataTable columns={columns} data={listApplications.data ?? []} />
    </div>
  );
};

export default MenuTable;
