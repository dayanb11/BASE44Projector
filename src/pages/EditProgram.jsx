
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Program } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Save, X } from "lucide-react";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import EmployeeCombobox from "../components/forms/EmployeeCombobox";
import DepartmentCombobox from "../components/forms/DepartmentCombobox";

export default function EditProgramPage() {
    const [program, setProgram] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null); // New state for employee
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmployee = sessionStorage.getItem("currentEmployee");
        if (storedEmployee) {
            setCurrentEmployee(JSON.parse(storedEmployee));
            const params = new URLSearchParams(location.search);
            const id = params.get('id');
            if (id) {
                loadProgram(id);
            } else {
                setIsLoading(false);
            }
        } else {
            setCurrentEmployee(null);
            setIsLoading(false);
        }

    const handleEmployeeLogin = (employee) => {
        setCurrentEmployee(employee);
        // After successful login, try to load program if ID is in URL
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id) {
            loadProgram(id);
        } else {
            setIsLoading(false); // No ID, but successfully logged in
        }
    };

    const loadProgram = async (id) => {
        setIsLoading(true);
        try {
            const allPrograms = await Program.list();
            const programData = allPrograms.find(p => p.id === id);
            if (programData) {
                setProgram(programData);
            } else {
                setProgram(null); // Program not found
            }
        } catch (error) {
            console.error("Error loading program:", error);
            setProgram(null); // Handle error by setting program to null
        }
        setIsLoading(false);
    };

    const handleSave = async () => {
        if (!program) return;
        
        setIsSaving(true);
        try {
            await Program.update(program.id, program);
            navigate(createPageUrl(`ProgramDetails?id=${program.id}`));
        } catch (error) {
            console.error("Error updating program:", error);
            // Optionally, show an error message to the user
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        // If program is null (e.g., created a new one and then cancelled), navigate to Programs list
        if (program && program.id) {
            navigate(createPageUrl(`ProgramDetails?id=${program.id}`));
        } else {
            navigate(createPageUrl("Programs"));
        }
    };

    const updateField = (field, value) => {
        setProgram(prev => ({ ...prev, [field]: value }));
    };

    // If no employee is logged in, show the authentication component
    if (!currentEmployee) {
        return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
    }

    if (isLoading) {
        return (
            <div className="p-6 text-center" dir="rtl">
                <p>טוען פרטי משימה...</p>
            </div>
        );
    }

    if (!program) {
        return (
            <div className="p-6 text-center" dir="rtl">
                <h2 className="text-xl font-bold mb-4">לא נמצאה משימה</h2>
                <Button onClick={() => navigate(createPageUrl("Programs"))}>
                    חזרה לרשימה
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">עריכת משימה</h1>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleCancel}>
                        <X className="w-4 h-4 ml-2" />
                        ביטול
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 ml-2" />
                        {isSaving ? "שומר..." : "שמירה"}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>פרטים בסיסיים</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">מספר משימה</label>
                            <Input
                                value={program.program_number || ""}
                                onChange={(e) => updateField("program_number", e.target.value)}
                                placeholder="P2024-XXX"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">עדיפות</label>
                            <Select value={program.priority} onValueChange={(value) => updateField("priority", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">נמוכה</SelectItem>
                                    <SelectItem value="medium">בינונית</SelectItem>
                                    <SelectItem value="high">גבוהה</SelectItem>
                                    <SelectItem value="urgent">דחופה</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">כותרת המשימה</label>
                        <Input
                            value={program.title || ""}
                            onChange={(e) => updateField("title", e.target.value)}
                            placeholder="כותרת המשימה"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">תיאור המשימה</label>
                        <Textarea
                            value={program.description || ""}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="תיאור מפורט של המשימה"
                            className="h-24"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">דורש</label>
                            <Input
                                value={program.requester_name || ""}
                                onChange={(e) => updateField("requester_name", e.target.value)}
                                placeholder="שם הדורש"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">יחידה דורשת</label>
                            <DepartmentCombobox
                                value={program.requester_unit || ""}
                                onValueChange={(newValue) => updateField("requester_unit", newValue)}
                                allowCustomInput={true}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">קניין מטפל</label>
                            <EmployeeCombobox
                                value={program.assigned_employee || ""}
                                onValueChange={(newValue) => updateField("assigned_employee", newValue)}
                                roleFilter={["procurement_officer", "junior_officer"]}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">ראש צוות</label>
                            <EmployeeCombobox
                                value={program.team_leader || ""}
                                onValueChange={(newValue) => updateField("team_leader", newValue)}
                                roleFilter={["team_leader", "procurement_manager"]}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">סטטוס</label>
                            <Select value={program.status} onValueChange={(value) => updateField("status", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="open">חדש</SelectItem>
                                    <SelectItem value="plan">בתכנון</SelectItem>
                                    <SelectItem value="in_progress">בביצוע</SelectItem>
                                    <SelectItem value="complete">מוכן</SelectItem>
                                    <SelectItem value="done">הושלם</SelectItem>
                                    <SelectItem value="freeze">מוקפא</SelectItem>
                                    <SelectItem value="cancel">בוטל</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">תחנה נוכחית</label>
                            <Input
                                type="number"
                                value={program.current_station || ""}
                                onChange={(e) => updateField("current_station", parseInt(e.target.value) || 0)}
                                min="1"
                                max={program.total_stations || 10}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">סה״כ תחנות</label>
                            <Input
                                type="number"
                                value={program.total_stations || ""}
                                onChange={(e) => updateField("total_stations", parseInt(e.target.value) || 0)}
                                min="1"
                                max="20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">תאריך התחלה</label>
                            <Input
                                type="date"
                                value={program.start_date || ""}
                                onChange={(e) => updateField("start_date", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">תאריך יעד</label>
                            <Input
                                type="date"
                                value={program.target_date || ""}
                                onChange={(e) => updateField("target_date", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">תאריך השלמה</label>
                            <Input
                                type="date"
                                value={program.completion_date || ""}
                                onChange={(e) => updateField("completion_date", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">תקציב משוער (₪)</label>
                            <Input
                                type="number"
                                value={program.estimated_budget || ""}
                                onChange={(e) => updateField("estimated_budget", parseInt(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">עלות בפועל (₪)</label>
                            <Input
                                type="number"
                                value={program.actual_cost || ""}
                                onChange={(e) => updateField("actual_cost", parseInt(e.target.value) || 0)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">הערות</label>
                        <Textarea
                            value={program.notes || ""}
                            onChange={(e) => updateField("notes", e.target.value)}
                            placeholder="הערות נוספות..."
                            className="h-20"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
