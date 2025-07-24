import { useListJobsPrivate } from "@/hooks/useJob";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const JobTable = () => {
  const listJobs = useListJobsPrivate();
  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Jobs</h1>
      <DataTable columns={columns} data={listJobs.data ?? []} />
    </div>
  );
};

export default JobTable;
