import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import './Dashboard.css';

// Placeholder icons
const Users = () => <span>U</span>;
const DollarSign = () => <span>$</span>;
const Briefcase = () => <span>B</span>;
const BookOpen = () => <span>BO</span>;
const Filter = () => <span>[Filter]</span>;
const Download = () => <span>[Download]</span>;
const Eye = () => <span>[Eye]</span>;
const Edit = () => <span>[Edit]</span>;
const Trash2 = () => <span>[Trash2]</span>;

const Dashboard = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    {
      title: "Total Revenue",
      value: "₹4,52,31,890",
      change: "+20.1% from last month",
      changeType: "positive",
      icon: DollarSign,
    },
    {
      title: "Total Bookings",
      value: "+2350",
      change: "+180.1% from last month",
      changeType: "positive",
      icon: Users,
    },
    {
      title: "Completed Courses",
      value: "+12,234",
      change: "+19% from last month",
      changeType: "positive",
      icon: BookOpen,
    },
    {
      title: "Total Courses",
      value: "67",
      change: "+5% this month",
      changeType: "positive",
      icon: Briefcase,
    }
  ];

  const bookings = [
    { id: 1, course: "Advanced Marine Engineering", student: "Ravi Kumar", amount: "₹25,000", status: "Paid", email: "ravi.k@example.com" },
    { id: 2, course: "Basic Safety Training", student: "Sunita Sharma", amount: "₹15,000", status: "Paid", email: "sunita.s@example.com" },
    { id: 3, course: "Nautical Science Program", student: "Amit Patel", amount: "₹55,000", status: "Pending", email: "amit.p@example.com" },
    { id: 4, course: "GMDSS General Operator", student: "Priya Singh", amount: "₹30,000", status: "Paid", email: "priya.s@example.com" },
    { id: 5, course: "Ship Security Officer", student: "Vijay Verma", amount: "₹22,000", status: "Paid", email: "vijay.v@example.com" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      <div className="main-content">
        <Header onToggleSidebar={toggleSidebar} />
        <main className="main-content-inner">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          <div className="bookings-table-container">
            <div className="table-header">
              <h2 className="table-title">Course Bookings</h2>
              <div className="table-actions">
                <button className="action-button">
                  <Filter />
                  <span>Filter</span>
                </button>
                <button className="action-button">
                  <Download />
                  <span>Download</span>
                </button>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.course}</td>
                      <td>{booking.student}</td>
                      <td>{booking.email}</td>
                      <td>{booking.amount}</td>
                      <td>
                        <StatusBadge status={booking.status} variant={booking.status.toLowerCase()} />
                      </td>
                      <td className="action-cell">
                        <button className="icon-button"><Eye /></button>
                        <button className="icon-button"><Edit /></button>
                        <button className="icon-button"><Trash2 /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
