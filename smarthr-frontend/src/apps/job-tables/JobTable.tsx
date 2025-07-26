import { useListJobsPrivate } from "@/hooks/useJob";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useAuth } from "@/contexts/AuthProvider";

const JobTable = () => {
  const listJobs = useListJobsPrivate();
  const authContext = useAuth();
  const { auth } = authContext;

  // Define which roles can perform actions
  const canPerformActions =
    auth?.role === "admin" || auth?.role === "Recruiter";

  // Filter columns based on permissions
  const tableColumns = canPerformActions
    ? columns
    : columns.filter((col) => col.id !== "actions");

  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Jobs</h1>
      <DataTable columns={tableColumns} data={listJobs.data ?? []} />
    </div>
  );
};

export default JobTable;
