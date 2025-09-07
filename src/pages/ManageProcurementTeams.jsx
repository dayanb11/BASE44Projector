import React, { useState, useEffect } from "react";
import { ProcurementTeam } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import SimpleForm from "../components/forms/SimpleForm";

export default function ManageProcurementTeams() {
  const [teams, setTeams] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadTeams = async () => {
    const data = await ProcurementTeam.list();
    setTeams(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadTeams();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadTeams();
  };

  const handleSave = async (data) => {
    if (selectedTeam) {
      await ProcurementTeam.update(selectedTeam.id, data);
    } else {
      await ProcurementTeam.create(data);
    }
    await loadTeams();
    setIsFormOpen(false);
    setSelectedTeam(null);
  };

  const handleEdit = (team) => {
    setSelectedTeam(team);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הצוות?")) {
      await ProcurementTeam.delete(id);
      await loadTeams();
    }
  };

  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  const formFields = [
    { name: 'name', label: 'שם הצוות', type: 'text', required: true },
    { name: 'description', label: 'תיאור', type: 'textarea' }
  ];

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול צוותי רכש</h1>
          <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
          </Link>
        </div>
        <Button onClick={() => { setSelectedTeam(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף צוות
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card key={team.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{team.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm mb-4">{team.description || "אין תיאור"}</p>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleEdit(team)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(team.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>אין צוותים במערכת</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {isFormOpen && (
          <SimpleForm
            title={selectedTeam ? "עריכת צוות" : "הוספת צוות חדש"}
            fields={formFields}
            data={selectedTeam}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedTeam(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}