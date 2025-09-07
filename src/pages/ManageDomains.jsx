import React, { useState, useEffect } from "react";
import { Domain } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import SimpleForm from "../components/forms/SimpleForm";

export default function ManageDomains() {
  const [domains, setDomains] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadDomains = async () => {
    const data = await Domain.list();
    setDomains(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadDomains();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadDomains();
  };

  const handleSave = async (data) => {
    if (selectedDomain) {
      await Domain.update(selectedDomain.id, data);
    } else {
      await Domain.create(data);
    }
    await loadDomains();
    setIsFormOpen(false);
    setSelectedDomain(null);
  };

  const handleEdit = (domain) => {
    setSelectedDomain(domain);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את תחום הרכש?")) {
      await Domain.delete(id);
      await loadDomains();
    }
  };

  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  const formFields = [
    { name: 'name', label: 'שם תחום הרכש', type: 'text', required: true },
    { name: 'description', label: 'תיאור', type: 'textarea' }
  ];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול תחומי רכש</h1>
          <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
          </Link>
        </div>
        <Button onClick={() => { setSelectedDomain(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף תחום רכש
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {domains.map((domain) => (
          <Card key={domain.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{domain.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{domain.description || "אין תיאור"}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(domain)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(domain.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {domains.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>אין תחומי רכש במערכת</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {isFormOpen && (
          <SimpleForm
            title={selectedDomain ? "עריכת תחום רכש" : "הוספת תחום רכש חדש"}
            fields={formFields}
            data={selectedDomain}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedDomain(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}