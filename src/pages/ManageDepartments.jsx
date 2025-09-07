import React, { useState, useEffect } from "react";
import { Department } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import SimpleForm from "../components/forms/SimpleForm";

export default function ManageDepartments() {
  const [departments, setDepartments] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadDepartments = async () => {
    const data = await Department.list();
    setDepartments(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadDepartments();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadDepartments();
  };

  const handleSave = async (data) => {
    if (selectedDepartment) {
      await Department.update(selectedDepartment.id, data);
    } else {
      await Department.create(data);
    }
    await loadDepartments();
    setIsFormOpen(false);
    setSelectedDepartment(null);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את המחלקה?")) {
      await Department.delete(id);
      await loadDepartments();
    }
  };

  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  const formFields = [
    { name: 'name', label: 'שם המחלקה', type: 'text', required: true },
    { name: 'description', label: 'תיאור', type: 'textarea' }
  ];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול מחלקות</h1>
          <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
          </Link>
        </div>
        <Button onClick={() => { setSelectedDepartment(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף מחלקה
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((department) => (
          <Card key={department.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{department.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{department.description || "אין תיאור"}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(department)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(department.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>אין מחלקות במערכת</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {isFormOpen && (
          <SimpleForm
            title={selectedDepartment ? "עריכת מחלקה" : "הוספת מחלקה חדשה"}
            fields={formFields}
            data={selectedDepartment}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedDepartment(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}