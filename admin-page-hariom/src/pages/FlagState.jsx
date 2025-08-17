import { useState } from "react";
import { Users, CheckCircle, DollarSign, Settings, Flag, Plus, Download, Search, Eye, Edit, Ship } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import TaskCard from "@/components/TaskCard";
import StatusBadge from "@/components/StatusBadge";

const FlagState = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const stats = [
    {
      title: "TOTAL APPLICATION",
      value: "156",
      change: "+12% this month",
      changeType: "positive" ,
      icon: Users,
      iconBg: "bg-foreground"
    },
    {
      title: "APPROVED",
      value: "89",
      change: "+8% this month",
      changeType: "positive" ,
      icon: CheckCircle,
      iconBg: "bg-foreground"
    },
    {
      title: "UNDER VIEW",
      value: "$45,230",
      change: "+15% this month",
      changeType: "positive" ,
      icon: DollarSign,
      iconBg: "bg-foreground"
    },
    {
      title: "IN TRANSIT",
      value: "67",
      change: "+5% this month",
      changeType: "positive" ,
      icon: Settings,
      iconBg: "bg-foreground"
    }
  ];
  const tasks = [
    {
      title: "UPDATE FLAG STATE DOCUMENTATION SYSTEM",
      description: "",
      assignee: "Captain John Doe",
      date: "Jan 20",
      status: "ongoing" 
    },
    {
      title: "PROCESS FLAG STATE ENDORSEMENT",
      description: "",
      assignee: "Captain John Doe",
      date: "",
      status: "ongoing" 
    }
  ];
  const documentOverview = [
    {
      documentType: "Flag State Endorsement",
      applicant: "Alex Mishra",
      eligibility: "eligible",
      paymentStatus: "paid",
      applicationStatus: "under-review",
      approvalStatus: "pending",
      deliveryStatus: "not-sent"
    },
    {
      documentType: "Certificate of Recognition",
      applicant: "Alex Mishra",
      eligibility: "under-review",
      paymentStatus: "pending",
      applicationStatus: "submitted",
      approvalStatus: "pending",
      deliveryStatus: "not-sent"
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
                  <Ship className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Documentation Administrator - Flag State</h1>
              </div>
              <button className="bg-foreground text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Add New Document
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
              <h2 className="text-lg font-semibold text-foreground mb-4">Task List - Flag State Documentation Administrator</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
              </div>
            </div>
            {/* Flag State Documentation Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Flag State Documentation Overview</h2>
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
                    placeholder="Search document..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-foreground text-white">
                        <th className="text-left p-4 font-medium text-sm">DOCUMENT TYPE</th>
                        <th className="text-left p-4 font-medium text-sm">APPLICANT</th>
                        <th className="text-left p-4 font-medium text-sm">ELIGIBILITY</th>
                        <th className="text-left p-4 font-medium text-sm">PAYMENT STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">APPLICATION STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">APPROVAL STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">DELIVERY STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documentOverview.map((doc, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{doc.documentType}</td>
                          <td className="p-4 text-foreground">{doc.applicant}</td>
                          <td className="p-4">
                            <StatusBadge 
                              status={doc.eligibility === "eligible" ? "Eligible" : "Under Review"} 
                              variant={doc.eligibility }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={doc.paymentStatus === "paid" ? "Paid" : "Pending"} 
                              variant={doc.paymentStatus }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={doc.applicationStatus === "under-review" ? "Under Review" : "Submitted"} 
                              variant={doc.applicationStatus }
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status="Pending" 
                              variant="pending"
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status="Not sent" 
                              variant="not-sent"
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
export default FlagState;