import React, { useState, useEffect } from "react";
import { EngagementType } from "@/api/entities";
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
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, PlusCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import EngagementTypeForm from "../components/settings/EngagementTypeForm";

export default function ManageEngagementTypes() {
  const [types, setTypes] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadTypes = async () => {
    const data = await EngagementType.list();
    setTypes(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadTypes();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadTypes();
  };

  const handleSave = async (data) => {
    if (selectedType) {
      await EngagementType.update(selectedType.id, data);
    } else {
      await EngagementType.create(data);
    }
    await loadTypes();
    setIsFormOpen(false);
    setSelectedType(null);
  };

  const handleEdit = (type) => {
    setSelectedType(type);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את סוג ההתקשרות?")) {
      await EngagementType.delete(id);
      await loadTypes();
    }
  };

  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול סוגי התקשרות</h1>
          <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
          </Link>
        </div>
        <Button onClick={() => { setSelectedType(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף סוג התקשרות
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם הסוג</TableHead>
              <TableHead>תיאור</TableHead>
              <TableHead>משך (ימים)</TableHead>
              <TableHead>מספר פעילויות</TableHead>
              <TableHead>פעיל</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.type_name}</TableCell>
                <TableCell>{type.type_description}</TableCell>
                <TableCell>{type.estimated_duration}</TableCell>
                <TableCell>{type.default_activities?.length || 0}</TableCell>
                <TableCell>
                  <Badge variant={type.is_active ? "default" : "secondary"}>
                    {type.is_active ? 'כן' : 'לא'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(type)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)}>
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
          <EngagementTypeForm
            engagementType={selectedType}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedType(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}