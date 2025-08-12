import React, { useState } from 'react';
import Header from '../common/Header';
import { 
  ArrowLeftIcon, 
  DollarSignIcon, 
  CalendarIcon, 
  ExclamationTriangleIcon, 
  UsersIcon,
  CheckCircleIcon,
  DocumentIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FunnelIcon,
  DownloadIcon,
  EnvelopeIcon,
  ClockIcon
} from '../ui/Icons';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Dashboard Overview', icon: <DocumentIcon className="w-4 h-4" /> },
    { id: 'payments', label: 'Fee & Payments', icon: <DocumentIcon className="w-4 h-4" /> },
    { id: 'invoice', label: 'Invoice Generator', icon: <DocumentIcon className="w-4 h-4" /> },
    { id: 'payouts', label: 'Staff Payouts', icon: <UsersIcon className="w-4 h-4" /> },
    { id: 'refunds', label: 'Refunds & Disputes', icon: <ExclamationTriangleIcon className="w-4 h-4" /> }
  ];

  const metricCards = [
    {
      title: 'Total Revenue',
      value: '₹125,000',
      trend: '+12.5% from last month',
      icon: <DollarSignIcon className="w-8 h-8 text-green-500" />,
      color: 'bg-green-100'
    },
    {
      title: 'Monthly Income',
      value: '₹18,500',
      trend: 'Current month',
      icon: <CalendarIcon className="w-8 h-8 text-blue-500" />,
      color: 'bg-blue-100'
    },
    {
      title: 'Outstanding',
      value: '₹12,300',
      trend: 'Pending payments',
      icon: <ExclamationTriangleIcon className="w-8 h-8 text-orange-500" />,
      color: 'bg-orange-100'
    },
    {
      title: 'Active Students',
      value: '53',
      trend: '45 paid • 8 unpaid',
      icon: <UsersIcon className="w-8 h-8 text-purple-500" />,
      color: 'bg-purple-100'
    }
  ];

  const recentActivities = [
    {
      action: 'Payment received from John Smith',
      details: 'BST Course - ₹2,500',
      time: '2 hours ago',
      icon: <CheckCircleIcon className="w-5 h-5 text-green-500" />
    },
    {
      action: 'Invoice generated for Maritime Academy',
      details: 'INV-001 - ₹25,000',
      time: '5 hours ago',
      icon: <DocumentIcon className="w-5 h-5 text-blue-500" />
    }
  ];

  const paymentData = [
    { student: 'John Smith', course: 'Basic Safety Training', amount: '₹2,500', status: 'Paid', date: '2024-01-15' },
    { student: 'Sarah Johnson', course: 'Advanced Fire Fighting', amount: '₹3,200', status: 'Partially Paid', date: '2024-01-14' },
    { student: 'Mike Wilson', course: 'Medical First Aid', amount: '₹1,800', status: 'Pending', date: '2024-01-13' },
    { student: 'Emma Davis', course: 'Personal Survival', amount: '₹2,100', status: 'Paid', date: '2024-01-12' }
  ];

  const invoiceData = [
    { id: 'INV-001', client: 'Maritime Academy Ltd', service: 'BST Course - Batch 15', amount: '₹25,000', status: 'Sent', date: '2024-01-15' },
    { id: 'INV-002', client: 'Ocean Shipping Co', service: 'CDC Renewal Service', amount: '₹1,500', status: 'Paid', date: '2024-01-14' },
    { id: 'INV-003', client: 'Blue Wave Maritime', service: 'Placement Consultancy', amount: '₹5,000', status: 'Draft', date: '2024-01-13' }
  ];

  const payoutData = [
    { staff: 'Captain Robert Lee', role: 'Senior Trainer', amount: '₹8,500', status: 'Paid', date: '2024-01-01' },
    { staff: 'Engineer Maria Garcia', role: 'Technical Instructor', amount: '₹6,200', status: 'Pending', date: '2024-01-01' },
    { staff: 'Dr. James Wilson', role: 'Medical Trainer', amount: '₹4,800', status: 'Paid', date: '2024-01-01' }
  ];

  const refundData = [
    { student: 'Alex Thompson', course: 'Advanced Fire Fighting', amount: '₹3,200', reason: 'Course Cancelled', status: 'Approved', date: '2024-01-10' },
    { student: 'Lisa Chen', course: 'Personal Survival', amount: '₹2,100', reason: 'Medical Emergency', status: 'Pending', date: '2024-01-08' },
    { student: 'David Brown', course: 'Basic Safety Training', amount: '₹2,500', reason: 'Duplicate Payment', status: 'Processed', date: '2024-01-05' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Partially Paid': return 'bg-orange-100 text-orange-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Sent': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Processed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, index) => (
          <div key={index} className={`${card.color} rounded-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className="text-sm text-gray-500 mt-1">{card.trend}</p>
              </div>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-center gap-3">
              {activity.icon}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-500">{activity.details}</p>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-lg font-semibold text-gray-900">Fee & Payments Management</h3>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
            <PlusIcon className="w-4 h-4" />
            Add Payment
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
            <FunnelIcon className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <div className="p-4 border-b">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paymentData.map((payment, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.student}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.course}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="w-4 h-4" /></button>
                    <button className="text-green-600 hover:text-green-900"><PencilIcon className="w-4 h-4" /></button>
                    <button className="text-red-600 hover:text-red-900"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderInvoice = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Invoice Generator</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <PlusIcon className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoiceData.map((invoice, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.client}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.service}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{invoice.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{invoice.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900"><DownloadIcon className="w-4 h-4" /></button>
                    <button className="text-green-600 hover:text-green-900"><EnvelopeIcon className="w-4 h-4" /></button>
                    <button className="text-orange-600 hover:text-orange-900"><PencilIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Staff/Trainer Payouts</h3>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <PlusIcon className="w-4 h-4" />
          Add Payout
        </button>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payoutData.map((payout, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.staff}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.role}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payout.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                    {payout.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="w-4 h-4" /></button>
                    <button className="text-green-600 hover:text-green-900"><CheckCircleIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRefunds = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Refund & Dispute Handling</h3>

      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {refundData.map((refund, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{refund.student}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.course}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{refund.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.reason}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(refund.status)}`}>
                    {refund.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{refund.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900"><EyeIcon className="w-4 h-4" /></button>
                    <button className="text-green-600 hover:text-green-900"><CheckCircleIcon className="w-4 h-4" /></button>
                    <button className="text-red-600 hover:text-red-900"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'payments':
        return renderPayments();
      case 'invoice':
        return renderInvoice();
      case 'payouts':
        return renderPayouts();
      case 'refunds':
        return renderRefunds();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <button className="text-gray-600 hover:text-gray-900">
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="text-gray-600">
              Welcome back, Admin
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
