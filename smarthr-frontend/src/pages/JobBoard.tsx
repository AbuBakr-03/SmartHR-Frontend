import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "@/components/data-table-faceted-filter";

const JobBoard = () => {
  return (
    <div className="grid place-items-center gap-4 bg-slate-50 py-20">
      <h1 className="text-center text-4xl font-bold text-slate-800">
        Find Your Dream Job
      </h1>
      <p className="text-xl text-slate-600">
        Discover thousands of job opportunities from top companies around the
        world
      </p>
      <div className="grid"></div>
    </div>
  );
};
export default JobBoard;
