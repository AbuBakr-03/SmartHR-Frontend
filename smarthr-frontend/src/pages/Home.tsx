import sarah_dataentry from "@/assets/data-entry.webp";
import dog_walking from "@/assets/dog-walking.webp";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Search,
  DollarSign,
  Edit3,
  UserCheck,
  Star,
  Briefcase,
  Instagram,
  GraduationCap,
  MapPin,
  FileText,
  Bell,
  MessageCircle,
  StarIcon,
  Calendar,
  CalendarIcon,
} from "lucide-react";
const Home = () => {
  return (
    <>
      <section className="bg-slate-50 py-20">
        <div className="container mx-auto w-11/12 px-4 md:w-10/12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl leading-tight font-bold text-slate-800">
                  Find Flexible Gigs. <br />
                  <span className="text-slate-700">Hire Fast Help.</span>
                </h1>
                <p className="text-xl leading-relaxed text-slate-600">
                  Tempi connects university students with temporary jobs — from
                  events to admin tasks and home business support.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="bg-orange-500 px-8 py-6 text-lg text-white hover:bg-orange-600"
                >
                  Find a Job
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 bg-transparent px-8 py-6 text-lg text-slate-700 hover:bg-slate-50"
                >
                  Post a Job
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rotate-2 transform rounded-2xl bg-white p-8 shadow-2xl">
                <img
                  src={sarah_dataentry}
                  alt="Student working on laptop"
                  className="aspect-video h-64 w-full rounded-lg object-cover"
                />
                <div className="mt-4 text-center">
                  <Badge className="border border-slate-200 bg-slate-100 text-slate-700">
                    Admin Task
                  </Badge>
                  <p className="mt-2 font-medium">
                    Sarah completing data entry
                  </p>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 -rotate-2 transform rounded-2xl bg-white p-6 shadow-2xl">
                <img
                  src={dog_walking}
                  alt="Student walking a dog"
                  className="aspect-square h-40 w-full rounded-lg object-cover"
                />
                <div className="mt-3 text-center">
                  <Badge className="border border-orange-200 bg-orange-100 text-orange-700">
                    Care Gig
                  </Badge>
                  <p className="mt-1 text-sm font-medium">Sam walking a dog</p>
                </div>
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
              Simple steps for students and job posters
            </p>
          </div>

          <div className="grid gap-16 md:grid-cols-2">
            {/* For Students */}
            <div className="grid space-y-8">
              <h3 className="text-center text-2xl font-bold text-slate-700">
                For Students
              </h3>
              <div className="grid justify-center space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <Users className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Create a Profile
                    </h4>
                    <p className="text-slate-600">
                      Add your skills, verify your ID, and set your
                      availability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <Search className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Browse Gigs
                    </h4>
                    <p className="text-slate-600">
                      Search jobs by category, time, or location.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <DollarSign className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Apply and Get Paid
                    </h4>
                    <p className="text-slate-600">
                      Do the job, get rated, and earn flexibly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Posters */}
            <div className="space-y-8">
              <h3 className="text-center text-2xl font-bold text-slate-700">
                For Posters
              </h3>
              <div className="grid justify-center space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <Edit3 className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Post Your Task
                    </h4>
                    <p className="text-slate-600">
                      Admin help, deliveries, or event staff in minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <UserCheck className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Pick the Right Student
                    </h4>
                    <p className="text-slate-600">
                      Browse profiles, shortlist, and chat.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 rounded-full bg-slate-100 p-3">
                    <Star className="h-6 w-6 text-slate-700" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Rate and Review
                    </h4>
                    <p className="text-slate-600">
                      After completion, share your experience.
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
              Who Is Tempi For?
            </h2>
            <p className="text-xl text-slate-600">
              Connecting the right people for the right tasks
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border-slate-200 p-8 text-center transition-shadow hover:shadow-lg">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-4">
                  <Briefcase className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Admin Gigs
                </h3>
                <p className="text-slate-600">
                  Help for startups and professionals with data entry, research,
                  and administrative tasks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 p-8 text-center transition-shadow hover:shadow-lg">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-4">
                  <Instagram className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Instagram/Home Businesses
                </h3>
                <p className="text-slate-600">
                  Delivery, packaging, and customer service support for growing
                  online businesses.
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200 p-8 text-center transition-shadow hover:shadow-lg">
              <CardContent className="space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 p-4">
                  <CalendarIcon className="h-8 w-8 text-slate-700" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Event Gigs
                </h3>
                <p className="text-slate-600">
                  Pop-up helpers, ushers, event setup, and coordination for
                  memorable experiences.
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
              Everything you need for successful gig matching
            </p>
          </div>

          <div className="grid gap-16 lg:grid-cols-2">
            {/* For Students */}
            <div>
              <h3 className="mb-8 text-center text-2xl font-bold text-slate-700">
                For Students
              </h3>
              <div className="grid gap-6 max-sm:justify-center sm:grid-cols-2">
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <GraduationCap className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Verified University Profiles
                    </h4>
                    <p className="text-sm text-slate-600">
                      Build trust with verified student status
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <MapPin className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Location-Based Filtering
                    </h4>
                    <p className="text-sm text-slate-600">
                      Find gigs near your campus or home
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <FileText className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Resume & Skill Showcase
                    </h4>
                    <p className="text-sm text-slate-600">
                      Highlight your abilities and experience
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Bell className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Real-Time Job Alerts
                    </h4>
                    <p className="text-sm text-slate-600">
                      Never miss the perfect opportunity
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Job Posters */}
            <div>
              <h3 className="mb-8 text-center text-2xl font-bold text-slate-700">
                For Job Posters
              </h3>
              <div className="grid gap-6 max-sm:justify-center sm:grid-cols-2">
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Edit3 className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Easy Job Posting
                    </h4>
                    <p className="text-sm text-slate-600">
                      Create listings in minutes with templates
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <MessageCircle className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Direct Messaging
                    </h4>
                    <p className="text-sm text-slate-600">
                      Chat with candidates before hiring
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <Calendar className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Schedule & Status Tracking
                    </h4>
                    <p className="text-sm text-slate-600">
                      Manage timelines and progress easily
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 rounded-lg p-4 transition-colors hover:bg-slate-50">
                  <StarIcon className="h-8 w-8 flex-shrink-0 text-slate-700" />
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      Ratings & Reviews System
                    </h4>
                    <p className="text-sm text-slate-600">
                      Build a trusted community network
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
              What Our Community Says
            </h2>
            <p className="text-xl text-slate-600">
              Real experiences from students and job posters
            </p>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Student Testimonials */}
            <div className="space-y-6">
              <h3 className="text-center text-2xl font-semibold text-slate-700">
                Students
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
                    "Tempi helped me earn during finals without long-term
                    commitment. Perfect for my busy schedule!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <span className="font-semibold text-slate-700">S</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Sarah</p>
                      <p className="text-sm text-slate-600">AUB Student</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Poster Testimonials */}
            <div className="space-y-6">
              <h3 className="text-center text-2xl font-semibold text-slate-700">
                Job Posters
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
                    "Got 3 reliable helpers for my pop-up in under a day. The
                    quality of students is amazing!"
                  </p>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <span className="font-semibold text-slate-700">D</span>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">Dina</p>
                      <p className="text-sm text-slate-600">
                        Home Business Owner
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
              Ready to Work or Hire?
            </h2>
            <p className="text-xl text-slate-300">
              Join hundreds of students and small businesses using Tempi to get
              things done.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-orange-500 px-8 py-6 text-lg text-white hover:bg-orange-600"
              >
                Find a Job
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 bg-transparent px-8 py-6 text-lg text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                Post a Job
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default Home;
