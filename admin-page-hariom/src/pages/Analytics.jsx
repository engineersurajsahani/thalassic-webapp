import { useState } from "react";
import { Users, CheckCircle, DollarSign, Award, UserCheck, Plus, Download, Search, Eye, Edit } from "lucide-react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatCard from "@/components/StatCard";
import TaskCard from "@/components/TaskCard";
import StatusBadge from "@/components/StatusBadge";

const Analytics = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const stats = [
    {
      title: "TOTAL USERS",
      value: "1,234",
      change: "+18% this month",
      changeType: "positive" ,
      icon: Users,
      iconBg: "bg-foreground"
    },
    {
      title: "ACTIVE SESSIONS",
      value: "892",
      change: "+12% this month",
      changeType: "positive" ,
      icon: CheckCircle,
      iconBg: "bg-foreground"
    },
    {
      title: "MONTHLY REVENUE",
      value: "$78,450",
      change: "+22% this month",
      changeType: "positive" ,
      icon: DollarSign,
      iconBg: "bg-foreground"
    },
    {
      title: "COMPLETION RATE",
      value: "87%",
      change: "+3% this month",
      changeType: "positive" ,
      icon: Award,
      iconBg: "bg-foreground"
    }
  ];
  const tasks = [
    {
      title: "ANALYZE USER ENGAGEMENT METRICS",
      description: "",
      assignee: "Data Analyst",
      date: "Jan 22",
      status: "ongoing" 
    },
    {
      title: "GENERATE MONTHLY PERFORMANCE REPORT",
      description: "",
      assignee: "System Admin",
      date: "Jan 25",
      status: "pending" 
    }
  ];
  const analyticsData = [
    {
      metric: "Page Views",
      value: "45,672",
      change: "+15%",
      status: "increased",
      period: "Last 30 days"
    },
    {
      metric: "User Retention",
      value: "82.5%",
      change: "+8%",
      status: "improved",
      period: "Last 30 days"
    },
    {
      metric: "Course Completion",
      value: "91.2%",
      change: "+5%",
      status: "improved",
      period: "Last 30 days"
    },
    {
      metric: "System Uptime",
      value: "99.8%",
      change: "0%",
      status: "stable",
      period: "Last 30 days"
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
                  <UserCheck className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-semibold text-foreground">Analytics Dashboard</h1>
              </div>
              <button className="bg-foreground text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-foreground/90">
                <Plus className="h-4 w-4" />
                Generate Report
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
              <h2 className="text-lg font-semibold text-foreground mb-4">Task List - Analytics Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
              </div>
            </div>
            {/* Analytics Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Performance Analytics</h2>
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
                    placeholder="Search analytics..."
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-foreground text-white">
                        <th className="text-left p-4 font-medium text-sm">METRIC</th>
                        <th className="text-left p-4 font-medium text-sm">VALUE</th>
                        <th className="text-left p-4 font-medium text-sm">CHANGE</th>
                        <th className="text-left p-4 font-medium text-sm">STATUS</th>
                        <th className="text-left p-4 font-medium text-sm">PERIOD</th>
                        <th className="text-left p-4 font-medium text-sm">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.map((item, index) => (
                        <tr key={index} className="border-b border-border hover:bg-muted/50">
                          <td className="p-4 font-medium text-foreground">{item.metric}</td>
                          <td className="p-4 text-foreground font-semibold">{item.value}</td>
                          <td className="p-4">
                            <span className={`text-sm font-medium ${
                              item.change.startsWith('+') ? 'text-status-confirmed' : 
                              item.change.startsWith('-') ? 'text-destructive' : 
                              'text-muted-foreground'
                            }`}>
                              {item.change}
                            </span>
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={
                                item.status === "increased" ? "Increased" :
                                item.status === "improved" ? "Improved" :
                                "Stable"
                              } 
                              variant={
                                item.status === "increased" || item.status === "improved" ? "confirmed" : "pending"
                              }
                            />
                          </td>
                          <td className="p-4 text-muted-foreground">{item.period}</td>
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
export default Analytics;