import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import JobBoard from "./pages/JobBoard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Layout from "./components/layouts/Layout";
import Dashboard from "./pages/Dashboard";
import ApplicationTable from "./apps/application-tables/ApplicationTable";
import CompanyTable from "./apps/company-tables/CompanyTable";
import DepartmentTable from "./apps/department-tables/DepartmentTable";
import InterviewTable from "./apps/interview-tables/InterviewTable";
import JobTable from "./apps/job-tables/JobTable";
import PredictedTable from "./apps/predicted-tables/PredictedTable";
import { Toaster } from "sonner";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Home />}></Route>
          <Route path="log-in" element={<Login />}></Route>
          <Route path="sign-up" element={<Signup />}></Route>
        </Route>
        <Route path="job/" element={<JobBoard />}></Route>

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRole={"admin"} />}>
            <Route path="dashboard/" element={<Dashboard />}>
              <Route path="applications" element={<ApplicationTable />}></Route>
              <Route path="companies" element={<CompanyTable />}></Route>
              <Route path="departments" element={<DepartmentTable />}></Route>
              <Route path="interviews" element={<InterviewTable />}></Route>
              <Route path="jobs" element={<JobTable />}></Route>
              <Route index={true} element={<PredictedTable />}></Route>
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRole={"Recruiter"} />}>
            <Route path="dashboard/" element={<Dashboard />}>
              <Route path="applications" element={<ApplicationTable />}></Route>
              <Route path="companies" element={<CompanyTable />}></Route>
              <Route path="departments" element={<DepartmentTable />}></Route>
              <Route path="interviews" element={<InterviewTable />}></Route>
              <Route path="jobs" element={<JobTable />}></Route>
              <Route index={true} element={<PredictedTable />}></Route>
            </Route>
          </Route>
          <Route element={<RequireAuth allowedRole={"user"} />}>
            <Route path="dashboard/" element={<Dashboard />}>
              <Route path="applications" element={<ApplicationTable />}></Route>
              <Route path="companies" element={<CompanyTable />}></Route>
              <Route path="departments" element={<DepartmentTable />}></Route>
              <Route path="interviews" element={<InterviewTable />}></Route>
              <Route path="jobs" element={<JobTable />}></Route>
              <Route index={true} element={<PredictedTable />}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
