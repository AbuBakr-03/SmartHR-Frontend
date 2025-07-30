// File: smarthr-frontend/src/pages/JobBoard.tsx
import { JobSidebar } from "@/components/job-sidebar";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/navbar/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useFilter } from "@/contexts/FilterProvider";
import { useSearch } from "@/contexts/SearchProvider";
import { useListJobs } from "@/hooks/useJob";
import {
  Building,
  CalendarClock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useMemo } from "react";
import * as React from "react";
import { Link } from "react-router-dom";

const JobBoard = () => {
  const filterData = useFilter();
  const { company, department } = filterData;
  const [sortBy, setSortBy] = React.useState<string>("none");
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [itemsPerPage] = React.useState<number>(5);

  // Pass the current filter values to the hook
  const jobs = useListJobs();
  const querydata = useSearch();

  // Apply search, filters, and sorting
  const filteredAndSortedJobs = useMemo(() => {
    if (!jobs.data) return [];

    let filtered = [...jobs.data];

    // Apply search filter
    if (querydata.query.trim()) {
      const searchTerm = querydata.query.toLowerCase().trim();
      filtered = filtered.filter((job) =>
        job.title.toLowerCase().includes(searchTerm),
      );
    }

    // Apply company filter
    if (company) {
      filtered = filtered.filter((job) => job.company.name === company);
    }

    // Apply department filter
    if (department) {
      filtered = filtered.filter((job) => job.department.title === department);
    }

    // Apply sorting
    if (sortBy !== "none") {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "title-asc":
            return a.title.localeCompare(b.title);
          case "title-desc":
            return b.title.localeCompare(a.title);
          case "date-asc":
            return (
              new Date(a.end_date).getTime() - new Date(b.end_date).getTime()
            );
          case "date-desc":
            return (
              new Date(b.end_date).getTime() - new Date(a.end_date).getTime()
            );
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [jobs.data, querydata.query, company, department, sortBy]);

  // Calculate pagination
  const totalItems = filteredAndSortedJobs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentJobs = filteredAndSortedJobs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [querydata.query, company, department, sortBy]);

  const jobList = currentJobs?.map((job) => {
    return (
      <Link
        to={`about-job/${job.id}`}
        key={job.id}
        className="grid w-full items-center gap-3 rounded-2xl border-2 px-6 py-6"
      >
        <div className="flex items-center space-x-4">
          <img
            className="aspect-square h-12 w-12 rounded-full object-cover"
            src={job.company.logo}
            alt={job.company.name}
          />
          <div className="grid">
            <h3 className="text-xl font-bold text-slate-900">{job.title}</h3>
            <p className="text-slate-600">{job.company.name}</p>
          </div>
        </div>
        <div className="flex space-x-3 max-sm:flex-col max-sm:space-y-2">
          <Badge className="h-8 bg-slate-900">
            <Building /> {job.department.title}
          </Badge>
          <Badge className="h-8 bg-slate-900">
            <MapPin /> {job.location}
          </Badge>
          <Badge className="h-8 bg-slate-900">
            <CalendarClock />
            Last Date:{" "}
            {job.end_date
              .toISOString()
              .slice(0, job.end_date.toISOString().indexOf("T"))}
          </Badge>
          {job.recruiter?.username && (
            <Badge className="h-8">{job.recruiter?.username}</Badge>
          )}
        </div>
      </Link>
    );
  });

  return (
    <>
      <SidebarProvider>
        <JobSidebar />
        <SidebarInset>
          <div className="md:hidden">
            <Navbar sidebar={true}></Navbar>
          </div>
          <div className="grid place-items-center bg-slate-50">
            <div className="grid w-10/12 place-items-center gap-4 py-20">
              <h1 className="text-center text-4xl font-bold text-slate-800">
                Find Your Dream Job
              </h1>
              <p className="text-center text-xl text-slate-600">
                Discover thousands of job opportunities from top companies
                around the world
              </p>
            </div>
          </div>
          <div className="grid place-items-center bg-white">
            <div className="grid w-10/12 grid-cols-2 items-center gap-4 py-15">
              <div className="grid w-full gap-2">
                <h2 className="text-2xl font-bold text-slate-800">
                  {totalItems} Jobs Found
                </h2>
                <p className="text-md text-slate-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
                  {totalItems} jobs
                </p>
              </div>

              <div className="flex justify-end">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Sort Options</SelectLabel>
                      <SelectItem value="none">Default</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="date-asc">Date (Earliest)</SelectItem>
                      <SelectItem value="date-desc">Date (Latest)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid w-10/12 place-items-center gap-4 pb-4">
              {jobList}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex w-10/12 items-center justify-between pb-12">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <Footer></Footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default JobBoard;
