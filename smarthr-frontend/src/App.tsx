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
import AboutJob from "./pages/aboutjob/Aboutjob";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import InterviewQuestions from "./components/interview_questions";

const allowed = ["user", "admin", "Recruiter"];
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} element={<Home />}></Route>
          <Route path="log-in" element={<Login />}></Route>
          <Route path="sign-up" element={<Signup />}></Route>
          <Route path="forgot-password" element={<ForgotPassword />}></Route>
          <Route
            path="reset-password/:uid/:token"
            element={<ResetPassword />}
          ></Route>
        </Route>
        <Route path="job/" element={<JobBoard />}></Route>

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRole={allowed} />}>
            <Route path="/" element={<Layout />}>
              <Route path="job/about-job/:id" element={<AboutJob />}></Route>
            </Route>
            <Route path="dashboard/" element={<Dashboard />}>
              <Route path="applications" element={<ApplicationTable />}></Route>
              <Route path="companies" element={<CompanyTable />}></Route>
              <Route path="departments" element={<DepartmentTable />}></Route>
              <Route path="interviews" element={<InterviewTable />}></Route>
              <Route
                path="interviews/:id/questions/"
                element={<InterviewQuestions />}
              ></Route>
              <Route path="jobs" element={<JobTable />}></Route>
              <Route index={true} element={<PredictedTable />}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
      <Toaster theme="dark" />
    </>
  );
}

export default App;
