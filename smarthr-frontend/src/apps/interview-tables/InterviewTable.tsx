import { useListInterviewsPrivate } from "@/hooks/useInterview";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const DepartmentTable = () => {
  const listInterviews = useListInterviewsPrivate();
  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Interviews</h1>
      <DataTable columns={columns} data={listInterviews.data ?? []} />
    </div>
  );
};

export default DepartmentTable;
