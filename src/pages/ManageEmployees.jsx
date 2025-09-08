
import React, { useState, useEffect } from "react";
import { Employee } from "@/api/entities";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog } from "@/components/ui/dialog";
import { Pencil, Trash2, PlusCircle, ArrowRight } from "lucide-react";
import EmployeeForm from "@/components/settings/EmployeeForm";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmployeeAuth from "../components/auth/EmployeeAuth"; // Added import

const roleLabels = {
  procurement_manager: "מנהל רכש",
  team_leader: "ראש צוות",
  procurement_officer: "קניין",
  junior_officer: "קניין זוטר"
};

export default function ManageEmployees() {
  const [employees, setEmployees] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null); // Added state

  const loadEmployees = async () => {
    const data = await Employee.list();
    setEmployees(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadEmployees();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadEmployees();
  };

  const handleSave = async (data) => {
    if (selectedEmployee) {
      await Employee.update(selectedEmployee.id, data);
    } else {
      await Employee.create(data);
    }
    await loadEmployees();
    setIsFormOpen(false);
    setSelectedEmployee(null);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את העובד?")) {
      await Employee.delete(id);
      await loadEmployees();
    }
  };

  // Conditional rendering based on authentication
  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">ניהול עובדים</h1>
            <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
                 <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
            </Link>
        </div>
        <Button onClick={() => { setSelectedEmployee(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף עובד
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם מלא</TableHead>
              <TableHead>מספר עובד</TableHead>
              <TableHead>תפקיד</TableHead>
              <TableHead>צוות</TableHead>
              <TableHead>מחלקה</TableHead>
              <TableHead>סיסמה</TableHead>
              <TableHead>אימייל</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.full_name}</TableCell>
                <TableCell>{employee.employee_id}</TableCell>
                <TableCell>{roleLabels[employee.role] || employee.role}</TableCell>
                <TableCell>{employee.team || "לא שויך"}</TableCell>
                <TableCell>{employee.department || "לא מוגדר"}</TableCell>
                <TableCell className="font-mono text-sm">
                  {"*".repeat(employee.password?.length || 0)}
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(employee)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(employee.id)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {isFormOpen && (
          <EmployeeForm
            employee={selectedEmployee}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedEmployee(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}
