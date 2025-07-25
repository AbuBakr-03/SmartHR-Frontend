import { useListPredictionsPrivate } from "@/hooks/usePredicted";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const PredictedTable = () => {
  const listPredicted = useListPredictionsPrivate();
  return (
    <div className="container mx-auto rounded-xl border-1 px-5 py-5">
      <h1 className="pb-4 text-2xl font-semibold">Predicted Candidates</h1>
      <DataTable columns={columns} data={listPredicted.data ?? []} />
    </div>
  );
};

export default PredictedTable;
