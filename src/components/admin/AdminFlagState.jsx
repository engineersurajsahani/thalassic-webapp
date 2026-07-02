import { Users, CheckCircle, DollarSign, Settings, Ship, Plus, Download, Search, Eye, Edit } from "lucide-react";
import StatCard from "./StatCard";
import TaskCard from "./TaskCard";
import StatusBadge from "./StatusBadge";

const AdminFlagState = () => {
  
  const stats = [
    {
      title: "TOTAL APPLICATION",
      value: "156",
      change: "+12% this month",
      changeType: "positive",
      icon: Users,
      iconBg: "bg-gray-800"
    },
    {
      title: "APPROVED",
      value: "89",
      change: "+8% this month",
      changeType: "positive",
      icon: CheckCircle,
      iconBg: "bg-gray-800"
    },
    {
      title: "UNDER VIEW",
      value: "45",
      change: "+15% this month",
      changeType: "positive",
      icon: DollarSign,
      iconBg: "bg-gray-800"
    },
    {
      title: "IN TRANSIT",
      value: "67",
      change: "+5% this month",
      changeType: "positive",
      icon: Settings,
      iconBg: "bg-gray-800"
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
    <main className="p-8">
            {/* Task Status Filters */}
            <div className="flex items-center gap-2 mb-6 flex-wrap">
              <button className="bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                All Tasks
              </button>
              <button className="text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                Upcoming
              </button>
              <button className="text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Ongoing
              </button>
              <button className="text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100">
                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>
                Pending
              </button>
              <button className="text-gray-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 hover:bg-gray-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Completed
              </button>
            </div>
            
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Ship className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">Documentation Administrator - Flag State</h1>
              </div>
              <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-700">
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
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task List - Flag State Documentation Administrator</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task, index) => (
                  <TaskCard key={index} {...task} />
                ))}
              </div>
            </div>
            
            {/* Flag State Documentation Overview */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Flag State Documentation Overview</h2>
                <button className="text-gray-600 hover:text-gray-900 flex items-center gap-2 text-sm">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search document..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-800 text-white">
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
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{doc.documentType}</td>
                          <td className="p-4 text-gray-900">{doc.applicant}</td>
                          <td className="p-4">
                            <StatusBadge 
                              status={doc.eligibility === "eligible" ? "Eligible" : "Under Review"} 
                              variant={doc.eligibility}
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={doc.paymentStatus === "paid" ? "Paid" : "Pending"} 
                              variant={doc.paymentStatus}
                            />
                          </td>
                          <td className="p-4">
                            <StatusBadge 
                              status={doc.applicationStatus === "under-review" ? "Under Review" : "Submitted"} 
                              variant={doc.applicationStatus}
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
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Eye className="h-4 w-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Edit className="h-4 w-4 text-gray-600" />
                              </button>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <Download className="h-4 w-4 text-gray-600" />
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
  );
};

export default AdminFlagState;
