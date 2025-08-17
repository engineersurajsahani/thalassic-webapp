import { useState } from "react";
import { Users, CheckCircle, DollarSign, Award, Search, Plus, Download, Eye, Edit, MoreHorizontal, BookOpen } from "lucide-react";
import Header from "@/components/Header.jsx";
import Sidebar from "@/components/Sidebar.jsx";
import StatCard from "@/components/StatCard.jsx";
import TaskCard from "@/components/TaskCard.jsx";
import StatusBadge from "@/components/StatusBadge.jsx";
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const stats = [
    {
      title: "TOTAL BOOKINGS",
      value: "156",
      change: "+12% this month",
      changeType: "positive" ,
      icon: Users,
      iconBg: "bg-foreground"
    },
    {
      title: "COMPLETED COURSES",
      value: "89",
      change: "+8% this month",
      changeType: "positive" ,
      icon: CheckCircle,
      iconBg: "bg-foreground"
    },
    {
      title: "REVENUE",
      value: "$45,230",
      change: "+15% this month",
      changeType: "positive" ,
      icon: DollarSign,
      iconBg: "bg-foreground"
    },
    {
      title: "CERTIFICATES ISSUED",
      value: "67",
      change: "+5% this month",
      changeType: "positive" ,
      icon: Award,
      iconBg: "bg-foreground"
    }
  ];
  const tasks = [
    {
      title: "REVIEW BASIC SAFETY TRAINING APPLICATION",
      description: "",
      assignee: "Captain John Doe",
      date: "Jan 20",
      status: "ongoing" 
    },
    {
      title: "GENERATE CERTIFICATE FOR COURSES",
      description: "",
      assignee: "Johnny Doe",
      date: "Jan 20",
      status: "ongoing" 
    }
  ];
  const courseBookings = [
    {
      courseName: "Basic Safety Training (BST)",
      student: "Alex Mishra",
      bookingStatus: "confirmed",
      paymentStatus: "paid",
      eLearningStatus: "inprogress",
      examStatus: "scheduled",
      certificateStatus: "not-generated"
    },
    {
      courseName: "Advance Firefighting Training (AFF)",
      student: "Alex Mishra",
      bookingStatus: "pending",
      paymentStatus: "pending",
      eLearningStatus: "not-started",
      examStatus: "not-taken",
      certificateStatus: "not-generated"
    }
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <Header onToggleSidebar={toggleSidebar} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 min-h-screen lg:ml-72 pt-24">
          <main className="p-8">
            {/* Task Status Filters */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <button className="bg-foreground text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                All Tasks
              </button>
              <button className="text-muted-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-muted">
                <span className="w-1.5 h-1.5 bg-status-pending rounded-full"></span>
                Upcoming
              </button>
              <button className="text-muted-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-muted">
                <span className="w-1.5 h-1.5 bg-status-inprogress rounded-full"></span>
                Ongoing
              </button>
              <button className="text-muted-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-muted">
                <span className="w-1.5 h-1.5 bg-status-pending rounded-full"></span>
                Pending
              </button>
              <button className="text-muted-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-muted">
                <span className="w-1.5 h-1.5 bg-status-completed rounded-full"></span>
                Completed
              </button>
            </div>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Course Booking Manager</h1>
              </div>
              <button className="bg-foreground text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add New Booking
              </button>
            </div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>
            {/* Task List Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Task List - Course Booking Manager</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
              </div>
            </div>
            {/* Course Bookings Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Course Bookings Overview</h2>
                <button className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-foreground text-white">
                        <th className="text-left p-4 font-medium text-sm">COURSE NAME</th>
                        <th className="text-left p-4 font-medium text-sm">STUDENT</th>
                        <th className="text-left p-4 font-medium text-sm">BOOKING STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">PAYMENT STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">E-LEARNING STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">EXAM STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">CERTIFICATE STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseBookings.map((booking, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{booking.courseName}</td>
                          <td className="p-4 text-foreground">{booking.student}</td>
                          <td className="p-4">
                            <StatusBadge 
                              status={booking.bookingStatus === "confirmed" ? "Confirmed" : "Pending"} 
                              variant={booking.bookingStatus }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={booking.paymentStatus === "paid" ? "Paid" : "Pending"} 
                              variant={booking.paymentStatus }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={booking.eLearningStatus === "inprogress" ? "In progress" : "Not Started"} 
                              variant={booking.eLearningStatus }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={booking.examStatus === "scheduled" ? "Scheduled" : "Not Taken"} 
                              variant={booking.examStatus }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status="Not generated" 
                              variant="not-generated"
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1 hover:bg-muted rounded">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <button className="p-1 hover:bg-muted rounded">
                                <Edit className="h-4 w-4 text-muted-foreground" />
                              </button>
                              <button className="p-1 hover:bg-muted rounded">
                                <Download className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;