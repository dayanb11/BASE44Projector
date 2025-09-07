
import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Program } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, User, Check, MoreVertical, Edit, Trash2, Building2 } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EmployeeAuth from "../components/auth/EmployeeAuth"; // Added import

const statusColors = {
  open: "bg-orange-100 text-orange-800 border-orange-300",
  plan: "bg-blue-100 text-blue-800 border-blue-300", 
  in_progress: "bg-yellow-100 text-yellow-800 border-yellow-300",
  complete: "bg-green-100 text-green-800 border-green-300",
  done: "bg-green-200 text-green-900 border-green-400",
  freeze: "bg-gray-100 text-gray-800 border-gray-300",
  cancel: "bg-red-100 text-red-800 border-red-300"
};

const statusLabels = {
  open: "חדש",
  plan: "בתכנון",
  in_progress: "בביצוע", 
  complete: "מוכן",
  done: "הושלם",
  freeze: "מוקפא",
  cancel: "בוטל"
};

const getActivityName = (stationNumber) => {
    const activities = [
        "דיון התחלה",
        "הכנת מפרט טכני", 
        "אישור יציאה למכרז",
        "הכנת מכרז",
        "פרסום מכרז",
        "בחינת הצעות",
        "אישור ועדת רכש",
        "אישור סופי"
    ];
    return activities[stationNumber - 1] || `פעילות תחנה ${stationNumber}`;
};

export default function ProgramDetailsPage() {
    const [program, setProgram] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentEmployee, setCurrentEmployee] = useState(null); // Added state
    const location = useLocation();

    const loadData = useCallback(async (id) => {
        setIsLoading(true);
        try {
            // Load all programs and find the specific one
            const allPrograms = await Program.list();
            console.log("All programs:", allPrograms.length);
            console.log("Looking for ID:", id);
            
            const programData = allPrograms.find(p => p.id === id);
            console.log("Found program:", programData);
            
            if (programData) {
                const mockTasks = Array.from({ length: programData.total_stations || 5 }, (_, i) => ({
                    id: `task-${i}`,
                    station_number: i + 1,
                    activity_name: getActivityName(i + 1),
                    status: i + 1 < programData.current_station ? 'completed' : (i + 1 === programData.current_station ? 'in_progress' : 'pending'),
                    due_date: programData.target_date ? 
                        new Date(new Date(programData.target_date).getTime() - (programData.total_stations - i - 1) * 7 * 24 * 60 * 60 * 1000).toISOString() :
                        new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString()
                }));
                setProgram(programData);
                setTasks(mockTasks.sort((a,b) => a.station_number - b.station_number));
            } else {
                console.log("Program not found");
                setProgram(null);
            }
        } catch (error) {
            console.error("Error loading program details:", error);
            setProgram(null);
        }
        setIsLoading(false);
    }, []); // loadData dependencies are empty, meaning its reference is stable.

    useEffect(() => {
        const storedEmployee = sessionStorage.getItem("currentEmployee");
        if (storedEmployee) {
            setCurrentEmployee(JSON.parse(storedEmployee));
            const params = new URLSearchParams(location.search);
            const id = params.get('id');
            if (id) {
                loadData(id);
            } else {
                setIsLoading(false);
            }
        } else {
            setCurrentEmployee(null);
            setIsLoading(false);
        }
    }, [location, loadData]); // loadData is a dependency because it's called inside this effect

    const handleEmployeeLogin = (employee) => {
        setCurrentEmployee(employee);
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id) {
            loadData(id);
        } else {
            setIsLoading(false); // If no ID after login, ensure loading state is false
        }
    };

    // If no employee is logged in, display the authentication screen
    if (!currentEmployee) {
        return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
    }

    if (isLoading) {
        return (
            <div className="p-6 space-y-6" dir="rtl">
                <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                </div>
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!program) {
        return (
            <div className="p-6 text-center" dir="rtl">
                <h2 className="text-xl font-bold mb-4">לא נמצאה משימה</h2>
                <p className="text-gray-600 mb-4">המשימה המבוקשת לא נמצאה במערכת</p>
                <Link to={createPageUrl("Programs")}>
                    <Button>חזרה לרשימת המשימות</Button>
                </Link>
            </div>
        );
    }

    const progress = (program.current_station / program.total_stations) * 100;

    return (
        <div className="p-6 space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <Link to={createPageUrl("Programs")}>
                    <Button variant="outline">
                        <ArrowRight className="w-4 h-4 ml-2" />
                        חזרה לרשימה
                    </Button>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to={createPageUrl(`EditProgram?id=${program.id}`)}>
                        <Button variant="outline">
                            <Edit className="w-4 h-4 ml-2" />
                            עריכה
                        </Button>
                    </Link>
                    <Badge className={`${statusColors[program.status]} border text-lg px-4 py-2`}>
                        {statusLabels[program.status]}
                    </Badge>
                </div>
            </div>
            
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl mb-2">{program.title}</CardTitle>
                            <span className="font-mono bg-gray-100 px-3 py-1 rounded text-sm">
                                #{program.program_number || program.id.slice(-8).toUpperCase()}
                            </span>
                        </div>
                        <div className="text-left">
                            <div className="text-sm text-gray-500 mb-1">התקדמות כללית</div>
                            <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
                        </div>
                    </div>
                    <p className="text-gray-600 mt-4">{program.description}</p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <User className="w-4 h-4" />
                                <span>דורש</span>
                            </div>
                            <div className="font-semibold">{program.requester_name}</div>
                            {program.requester_unit && <div className="text-gray-500 text-xs">{program.requester_unit}</div>}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <User className="w-4 h-4" />
                                <span>קניין מטפל</span>
                            </div>
                            <div className="font-semibold">{program.assigned_employee}</div>
                            {program.team_leader && <div className="text-gray-500 text-xs">ראש צוות: {program.team_leader}</div>}
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>תאריך יעד</span>
                            </div>
                            <div className="font-semibold">
                                {format(new Date(program.target_date), "dd/MM/yyyy", { locale: he })}
                            </div>
                            <div className="text-gray-500 text-xs">
                                {program.start_date && `התחלה: ${format(new Date(program.start_date), "dd/MM/yyyy", { locale: he })}`}
                            </div>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Building2 className="w-4 h-4" />
                                <span>מחלקה</span>
                            </div>
                            <div className="font-semibold">{program.department || "לא צוין"}</div>
                            {program.estimated_budget && (
                                <div className="text-gray-500 text-xs">תקציב: ₪{program.estimated_budget.toLocaleString()}</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>מסלול הטיפול במשימה</span>
                        <div className="text-sm text-gray-500">
                            תחנה {program.current_station} מתוך {program.total_stations}
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 relative">
                        <div className="absolute top-0 bottom-0 right-5 w-0.5 bg-gray-200"></div>
                        {tasks.map((task, index) => (
                            <div key={task.id} className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                                    task.status === 'completed' ? 'bg-green-500' : 
                                    task.status === 'in_progress' ? 'bg-blue-500 animate-pulse' : 
                                    'bg-gray-300'
                                }`}>
                                    {task.status === 'completed' ? (
                                        <Check className="w-6 h-6 text-white" />
                                    ) : (
                                        <span className="text-white font-bold">{task.station_number}</span>
                                    )}
                                </div>
                                <Card className="flex-1">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold text-lg">{task.activity_name}</p>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                    <span>תאריך יעד: {format(new Date(task.due_date), "dd/MM/yyyy", { locale: he })}</span>
                                                    <Badge variant="outline" className={
                                                        task.status === 'completed' ? 'bg-green-50 text-green-700' :
                                                        task.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                                                        'bg-gray-50 text-gray-700'
                                                    }>
                                                        {task.status === 'completed' ? 'הושלם' :
                                                         task.status === 'in_progress' ? 'בביצוע' : 'ממתין'}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="w-4 h-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="start">
                                                    <DropdownMenuItem>
                                                        <Edit className="w-4 h-4 ml-2" /> ערוך פעילות
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-500">
                                                        <Trash2 className="w-4 h-4 ml-2" /> מחק פעילות
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
