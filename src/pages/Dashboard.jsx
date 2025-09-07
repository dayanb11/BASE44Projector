
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Program } from "@/api/entities";
import { Employee } from "@/api/entities";
import { format } from "date-fns";
import { he } from "date-fns/locale";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import StatusIndicator from "../components/dashboard/StatusIndicator";
import RecentPrograms from "../components/dashboard/RecentPrograms";
import TeamWorkload from "../components/dashboard/TeamWorkload";
// ProgressChart import is removed as per instructions

export default function Dashboard() {
  const [programs, setPrograms] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // בדיקה אם יש עובד מחובר
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadData();
    } else {
      setCurrentEmployee(null); // Ensure currentEmployee is null if no stored employee
      setIsLoading(false);
    }
  }, [location]);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadData();
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentEmployee");
    setCurrentEmployee(null);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [programsData, employeesData] = await Promise.all([
        Program.list("-created_date"),
        Employee.list()
      ]);
      setPrograms(programsData);
      setEmployees(employeesData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  // אם אין עובד מחובר, הצג מסך התחברות
  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  const getStatusCounts = () => {
    const counts = {
      open: 0,
      plan: 0, 
      in_progress: 0,
      complete: 0,
      done: 0,
      freeze: 0,
      cancel: 0
    };
    programs.forEach(program => {
      if (counts.hasOwnProperty(program.status)) {
        counts[program.status]++;
      }
    });
    return counts;
  };

  const statusDefinitions = [
    { statusKey: 'open', label: 'חדש', color: 'bg-red-500' },
    { statusKey: 'plan', label: 'בתכנון', color: 'bg-orange-500' },
    { statusKey: 'in_progress', label: 'בביצוע', color: 'bg-yellow-500' },
    { statusKey: 'complete', label: 'מוכן', color: 'bg-blue-500' },
    { statusKey: 'done', label: 'הושלם', color: 'bg-green-500' },
    { statusKey: 'freeze', label: 'מוקפא', color: 'bg-gray-500' },
    { statusKey: 'cancel', label: 'בוטל', color: 'bg-stone-500' },
  ];

  const statusCounts = getStatusCounts();
  const totalPrograms = programs.length;

  return (
    <div className="p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">לוח בקרה</h1>
          <p className="text-gray-500 mt-1">
            {format(new Date(), "EEEE, dd MMMM yyyy", { locale: he })}
          </p>
          <p className="text-sm text-blue-600 mt-1">
            שלום {currentEmployee.full_name} • {currentEmployee.role === 'procurement_manager' ? 'מנהל רכש' : currentEmployee.role}
          </p>
        </div>
        <div className="text-left">
          <p className="text-2xl font-bold text-blue-600">{totalPrograms}</p>
          <p className="text-sm text-gray-500">סה״כ משימות</p>
          <button 
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-500 mt-1"
          >
            התנתקות
          </button>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
        {statusDefinitions.map(status => (
           <StatusIndicator 
              key={status.statusKey}
              count={statusCounts[status.statusKey]}
              total={totalPrograms}
              color={status.color}
              label={status.label}
              statusKey={status.statusKey}
           />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentPrograms programs={programs.slice(0, 8)} isLoading={isLoading} />
        </div>
        
        <div className="space-y-6">
          <TeamWorkload employees={employees} programs={programs} />
          {/* ProgressChart component removed from here */}
        </div>
      </div>
    </div>
  );
}
