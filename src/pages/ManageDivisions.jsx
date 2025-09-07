import React, { useState, useEffect } from "react";
import { Division } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import SimpleForm from "../components/forms/SimpleForm";

export default function ManageDivisions() {
  const [divisions, setDivisions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadDivisions = async () => {
    const data = await Division.list();
    setDivisions(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadDivisions();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadDivisions();
  };

  const handleSave = async (data) => {
    if (selectedDivision) {
      await Division.update(selectedDivision.id, data);
    } else {
      await Division.create(data);
    }
    await loadDivisions();
    setIsFormOpen(false);
    setSelectedDivision(null);
  };

  const handleEdit = (division) => {
    setSelectedDivision(division);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את האגף?")) {
      await Division.delete(id);
      await loadDivisions();
    }
  };

  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  const formFields = [
    { name: 'name', label: 'שם האגף', type: 'text', required: true },
    { name: 'description', label: 'תיאור', type: 'textarea' }
  ];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול אגפים</h1>
          <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
          </Link>
        </div>
        <Button onClick={() => { setSelectedDivision(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף אגף
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {divisions.map((division) => (
          <Card key={division.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{division.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{division.description || "אין תיאור"}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(division)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(division.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {divisions.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>אין אגפים במערכת</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {isFormOpen && (
          <SimpleForm
            title={selectedDivision ? "עריכת אגף" : "הוספת אגף חדש"}
            fields={formFields}
            data={selectedDivision}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedDivision(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}