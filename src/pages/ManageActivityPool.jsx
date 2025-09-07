import React, { useState, useEffect } from "react";
import { ActivityPool } from "@/api/entities";
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
import ActivityPoolForm from "../components/settings/ActivityPoolForm";

const categoryLabels = {
    planning: "תכנון",
    market_research: "חקר שוק",
    tender_preparation: "הכנת מכרז",
    evaluation: "בחינה",
    negotiation: "משא ומתן",
    contracting: "התקשרות",
    approval: "אישור",
    execution: "ביצוע"
};

const complexityLabels = {
    simple: "פשוט",
    medium: "בינוני",
    complex: "מורכב"
};

export default function ManageActivityPool() {
  const [activities, setActivities] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const loadActivities = async () => {
    const data = await ActivityPool.list();
    setActivities(data);
  };

  useEffect(() => {
    const storedEmployee = sessionStorage.getItem("currentEmployee");
    if (storedEmployee) {
      setCurrentEmployee(JSON.parse(storedEmployee));
      loadActivities();
    } else {
      setCurrentEmployee(null);
    }
  }, []);

  const handleEmployeeLogin = (employee) => {
    setCurrentEmployee(employee);
    loadActivities();
  };

  const handleSave = async (data) => {
    if (selectedActivity) {
      await ActivityPool.update(selectedActivity.id, data);
    } else {
      await ActivityPool.create(data);
    }
    await loadActivities();
    setIsFormOpen(false);
    setSelectedActivity(null);
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הפעילות?")) {
      await ActivityPool.delete(id);
      await loadActivities();
    }
  };

  if (!currentEmployee) {
    return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
  }

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ניהול מאגר פעילויות</h1>
          <Link to={createPageUrl("Settings")} className="text-sm text-blue-500 hover:underline flex items-center gap-1">
            <ArrowRight className="w-4 h-4"/> חזרה להגדרות מערכת
          </Link>
        </div>
        <Button onClick={() => { setSelectedActivity(null); setIsFormOpen(true); }}>
          <PlusCircle className="ml-2 w-4 h-4" />
          הוסף פעילות
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>שם הפעילות</TableHead>
              <TableHead>קטגוריה</TableHead>
              <TableHead>רמת מורכבות</TableHead>
              <TableHead>משך (ימים)</TableHead>
              <TableHead>חובה</TableHead>
              <TableHead>פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.activity_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{categoryLabels[activity.category] || activity.category}</Badge>
                </TableCell>
                <TableCell>{complexityLabels[activity.complexity_level] || activity.complexity_level}</TableCell>
                <TableCell>{activity.estimated_duration}</TableCell>
                <TableCell>{activity.is_mandatory ? 'כן' : 'לא'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(activity)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(activity.id)}>
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
          <ActivityPoolForm
            activity={selectedActivity}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setSelectedActivity(null); }}
          />
        )}
      </Dialog>
    </div>
  );
}