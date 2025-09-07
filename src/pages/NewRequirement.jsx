
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Program } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X } from "lucide-react";

import EmployeeAuth from "../components/auth/EmployeeAuth";
import DepartmentCombobox from "../components/forms/DepartmentCombobox";

const engagementTypes = [
    { value: "standard_purchase", label: "רכש רגיל" },
    { value: "complex_tender", label: "מכרז מורכב" },
    { value: "framework_agreement", label: "הסכם מסגרת" },
    { value: "urgent_purchase", label: "רכש דחוף" },
    { value: "strategic_procurement", label: "רכש אסטרטגי" },
];

const priorityLevels = [
    { value: "low", label: "נמוכה" },
    { value: "medium", label: "בינונית" },
    { value: "high", label: "גבוהה" },
    { value: "urgent", label: "דחופה" },
];

export default function NewRequirementPage() {
    const [program, setProgram] = useState({
        title: "",
        description: "",
        requester_name: "",
        requester_unit: "",
        engagement_type: "standard_purchase",
        priority: "medium",
        status: "open",
        current_station: 1,
        total_stations: 5,
        start_date: new Date().toISOString().split('T')[0],
    });
    const [isSaving, setIsSaving] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmployee = sessionStorage.getItem("currentEmployee");
        if (storedEmployee) {
            const employee = JSON.parse(storedEmployee);
            setCurrentEmployee(employee);
            setProgram(prev => ({ ...prev, requester_name: employee.full_name }));
        } else {
            setCurrentEmployee(null);
        }
    }, []);

    const handleEmployeeLogin = (employee) => {
        setCurrentEmployee(employee);
        setProgram(prev => ({ ...prev, requester_name: employee.full_name }));
    };

    const handleSave = async () => {
        if (!program.title || !program.requester_name || !program.engagement_type) {
            alert("אנא מלא את כל שדות החובה: כותרת, דורש, סוג התקשרות.");
            return;
        }
        
        setIsSaving(true);
        try {
            const newProgram = await Program.create(program);
            navigate(createPageUrl(`ProgramDetails?id=${newProgram.id}`));
        } catch (error) {
            console.error("Error creating program:", error);
            alert("שגיאה ביצירת הדרישה. נסה שוב.");
        }
        setIsSaving(false);
    };

    const updateField = (field, value) => {
        setProgram(prev => ({ ...prev, [field]: value }));
    };

    if (!currentEmployee) {
        return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">יצירת דרישה חדשה</h1>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate(createPageUrl("Programs"))}>
                        <X className="w-4 h-4 ml-2" />
                        ביטול
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        <Save className="w-4 h-4 ml-2" />
                        {isSaving ? "שומר..." : "שמירת דרישה"}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>פרטי הדרישה</CardTitle>
                    <CardDescription>מלא את פרטי הדרישה כדי להגישה למערכת הרכש.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">כותרת הדרישה <span className="text-red-500">*</span></label>
                        <Input
                            value={program.title}
                            onChange={(e) => updateField("title", e.target.value)}
                            placeholder="דוגמה: רכש 10 מחשבים ניידים"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">תיאור הדרישה</label>
                        <Textarea
                            value={program.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="פרט לגבי הדרישה, כולל דרישות טכניות, כמויות, וכל מידע רלוונטי אחר."
                            className="h-24"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">דורש <span className="text-red-500">*</span></label>
                            <Input
                                value={program.requester_name}
                                onChange={(e) => updateField("requester_name", e.target.value)}
                                placeholder="שם הדורש"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">יחידה דורשת</label>
                            <DepartmentCombobox
                                value={program.requester_unit}
                                onValueChange={(value) => updateField("requester_unit", value)}
                                allowCustomInput={true}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">סוג התקשרות <span className="text-red-500">*</span></label>
                            <Select value={program.engagement_type} onValueChange={(value) => updateField("engagement_type", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {engagementTypes.map(type => (
                                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">עדיפות</label>
                            <Select value={program.priority} onValueChange={(value) => updateField("priority", value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {priorityLevels.map(p => (
                                        <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">תאריך יעד נדרש</label>
                            <Input
                                type="date"
                                value={program.target_date || ""}
                                onChange={(e) => updateField("target_date", e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">תקציב משוער (₪)</label>
                            <Input
                                type="number"
                                value={program.estimated_budget || ""}
                                onChange={(e) => updateField("estimated_budget", parseInt(e.target.value, 10) || 0)}
                                placeholder="0"
                            />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
