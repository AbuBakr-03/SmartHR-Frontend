import { JobSidebar } from "@/components/job-sidebar";
import Footer from "@/components/layouts/Footer";
import Navbar from "@/components/layouts/navbar/Navbar";
import { Badge } from "@/components/ui/badge";
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
import { useListJobs } from "@/hooks/useJob";
import { Building, CalendarClock, MapPin } from "lucide-react";

const JobBoard = () => {
  const jobs = useListJobs();
  const jobList = jobs.data?.map((job) => {
    return (
      <div className="grid w-full items-center gap-3 rounded-2xl border-2 px-6 py-6">
        <div className="flex items-center space-x-4">
          <img
            className="aspect-square h-12 w-12 rounded-full object-cover"
            src={job.company.logo}
            alt={job.company.name}
          />
          <div className="grid">
            <h3 className="text-xl font-bold">{job.title}</h3>
            <p className="text-slate-600">{job.company.name}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Badge className="h-8">
            {" "}
            <Building /> {job.department.title}
          </Badge>

          <Badge className="h-8">
            {" "}
            <MapPin /> {job.location}
          </Badge>
          <Badge className="h-8">
            {" "}
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
      </div>
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
              <div className="grid"></div>
            </div>
          </div>
          <div className="grid place-items-center bg-white">
            <div className="grid w-10/12 grid-cols-2 items-center justify-items-end gap-4 py-15">
              <div className="grid w-full gap-2">
                <h2 className="text-2xl font-bold text-slate-800">
                  6 Jobs Found
                </h2>
                <p className="text-md text-slate-600">
                  Showing the best oppurtunities for you
                </p>
              </div>
              <div>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fruits</SelectLabel>
                      <SelectItem value="apple">A-Z</SelectItem>
                      <SelectItem value="banana">Z-A</SelectItem>
                      <SelectItem value="blueberry">End Date</SelectItem>
                      <SelectItem value="grapes">End Date</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid w-10/12 place-items-center gap-4 pb-12">
              {jobList}
            </div>
          </div>{" "}
          <Footer></Footer>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};
export default JobBoard;
