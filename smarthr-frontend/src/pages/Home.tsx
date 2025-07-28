import sarah_dataentry from "@/assets/sarah_dataentry.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  UserCheck,
  Star,
  Briefcase,
  FileText,
  MessageCircle,
  Calendar,
  BriefcaseBusiness,
  Scan,
  Target,
  BarChart3,
  Building2,
  User,
  Brain,
  Video,
  HelpCircle,
  TrendingUp,
  Upload,
  Percent,
} from "lucide-react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <>
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto w-11/12 px-4 md:w-10/12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl leading-tight font-bold text-slate-800">
                  Smart Hiring with AI. <br />
                  <span className="text-slate-700">Find Better Talent.</span>
                </h1>
                <p className="text-xl leading-relaxed text-slate-600">
                  SmartHR connects recruiters with qualified candidates through
                  AI-powered resume screening, interview analysis, and
                  predictive hiring insights.
                </p>
              </div>
              <div className="flex flex-row gap-4 max-lg:grid max-md:w-full">
                <Link className="cursor-pointer max-md:w-full" to={"job"}>
                  <Button
                    size="lg"
                    className="bg-slate-900 px-8 py-6 text-lg text-white hover:bg-black max-md:w-full"
                  >
                    Find a Job
                  </Button>
                </Link>
                <Link className="cursor-pointer max-md:w-full" to={"dashboard"}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-slate-300 bg-transparent px-8 py-6 text-lg text-slate-700 hover:bg-slate-50 max-md:w-full"
                  >
                    Post a Job
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl bg-white p-2 shadow-2xl">
                <img
                  src={sarah_dataentry}
                  alt="AI recruiting dashboard"
                  className="aspect-video w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="grid bg-white py-20 max-md:justify-center md:place-items-center"
      >
        <div className="container mx-auto w-11/12 px-4 md:w-10/12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-800">
              How It Works
            </h2>
            <p className="text-xl text-slate-600">
              AI-powered hiring for recruiters and job seekers
            </p>
          </div>

          <div className="grid gap-16 md:grid-cols-2">
            {/* For Recruiters */}
            <div className="grid space-y-8">
              <h3 className="text-center text-2xl font-bold text-slate-700">
                For Recruiters
              </h3>
              <div className="grid justify-center space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <BriefcaseBusiness className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Post Job Requirements
                    </h4>
                    <p className="text-slate-600">
                      Define qualifications, responsibilities, and requirements
                      for your position.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <Scan className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      AI Screens Resumes
                    </h4>
                    <p className="text-slate-600">
                      Our AI automatically scores and ranks candidates based on
                      job fit.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <UserCheck className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Interview & Hire
                    </h4>
                    <p className="text-slate-600">
                      Use AI-generated questions and confidence analysis to make
                      better decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Candidates */}
            <div className="space-y-8">
              <h3 className="text-center text-2xl font-bold text-slate-700">
                For Candidates
              </h3>
              <div className="grid justify-center space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <FileText className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Submit Application
                    </h4>
                    <p className="text-slate-600">
                      Upload your resume and apply to positions that match your
                      skills.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <Target className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Get Matched by AI
                    </h4>
                    <p className="text-slate-600">
                      AI analyzes your resume and provides match scores with job
                      requirements.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <BarChart3 className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Track Progress
                    </h4>
                    <p className="text-slate-600">
                      Monitor your application status and interview feedback.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Target Segments */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto w-11/12 px-4 md:w-10/12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-800">
              Who Is SmartHR For?
            </h2>
            <p className="text-xl text-slate-600">
              Empowering recruiters and job seekers with intelligent hiring
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="border-slate-200 p-8 text-center transition-shadow hover:shadow-lg">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-4">
                  <Briefcase className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  HR Teams & Recruiters
                </h3>
                <p className="text-slate-600">
                  Streamline your hiring process with AI-powered screening,
                  interview analysis, and candidate prediction tools.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 p-8 text-center transition-shadow hover:shadow-lg">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-4">
                  <Building2 className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Companies & Startups
                </h3>
                <p className="text-slate-600">
                  Find the right talent faster with intelligent resume matching
                  and objective candidate evaluation systems.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 p-8 text-center transition-shadow hover:shadow-lg">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-4">
                  <User className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Job Seekers
                </h3>
                <p className="text-slate-600">
                  Track your applications, get matched with relevant positions,
                  and receive feedback on your interview performance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section className="bg-white py-20">
        <div className="container mx-auto w-11/12 px-4 md:w-10/12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-800">
              Features Overview
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need for intelligent hiring
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* For Recruiters */}
            <div>
              <h3 className="mb-8 text-center text-2xl font-bold text-slate-700">
                For Recruiters
              </h3>
              <div className="grid gap-6 max-sm:justify-center sm:grid-cols-2">
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Brain className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      AI Resume Screening
                    </h4>
                    <p className="text-sm text-slate-600">
                      Automatic scoring and ranking of candidates
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Video className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Interview Analysis
                    </h4>
                    <p className="text-sm text-slate-600">
                      AI-powered confidence and performance evaluation
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <HelpCircle className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Question Generation
                    </h4>
                    <p className="text-sm text-slate-600">
                      Tailored interview questions based on resumes
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <TrendingUp className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Candidate Prediction
                    </h4>
                    <p className="text-sm text-slate-600">
                      Predict successful hires with AI insights
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Job Seekers */}
            <div>
              <h3 className="mb-8 text-center text-2xl font-bold text-slate-700">
                For Job Seekers
              </h3>
              <div className="grid gap-6 max-sm:justify-center sm:grid-cols-2">
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Upload className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Easy Application
                    </h4>
                    <p className="text-sm text-slate-600">
                      Simple resume upload and application process
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Percent className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Match Scoring
                    </h4>
                    <p className="text-sm text-slate-600">
                      See how well you match job requirements
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Calendar className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Application Tracking
                    </h4>
                    <p className="text-sm text-slate-600">
                      Monitor status and progress in real-time
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <MessageCircle className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Interview Feedback
                    </h4>
                    <p className="text-sm text-slate-600">
                      Get insights on your interview performance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto w-11/12 px-4 md:w-10/12">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-slate-800">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600">
              Real experiences from recruiters and job seekers
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Recruiter Testimonials */}
            <div className="space-y-6">
              <h3 className="text-center text-2xl font-semibold text-slate-700">
                Recruiters
              </h3>
              <Card className="border-slate-200 p-8">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg text-slate-700 italic">
                    "SmartHR reduced our screening time by 80%. The AI match
                    scores are incredibly accurate and save us hours!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <span className="font-semibold text-slate-700">S</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Sarah</p>
                      <p className="text-sm text-slate-600">HR Manager</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Candidate Testimonials */}
            <div className="space-y-6">
              <h3 className="text-center text-2xl font-semibold text-slate-700">
                Job Seekers
              </h3>
              <Card className="border-slate-200 p-8">
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-orange-400 text-orange-400"
                      />
                    ))}
                  </div>
                  <p className="text-lg text-slate-700 italic">
                    "Got matched with my dream job! The AI feedback helped me
                    understand exactly what employers were looking for."
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <span className="font-semibold text-slate-700">D</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">David</p>
                      <p className="text-sm text-slate-600">
                        Software Engineer
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="bg-slate-800 py-20">
        <div className="container mx-auto w-11/12 px-4 text-center md:w-10/12">
          <div className="mx-auto max-w-3xl space-y-8">
            <h2 className="text-4xl font-bold text-white">
              Ready to Hire Smarter?
            </h2>
            <p className="text-xl text-slate-300">
              Join companies using SmartHR to transform their recruitment with
              AI-powered hiring.
            </p>
            <Link className="cursor-pointer" to={"dashboard"}>
              <Button
                size="lg"
                className="bg-white px-8 py-6 text-lg text-slate-900 hover:bg-slate-50"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
