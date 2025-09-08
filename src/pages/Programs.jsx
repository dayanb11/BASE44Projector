
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Program } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Search, ListFilter, User, Clock, ArrowRight } from "lucide-react";

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

const ProgramCard = ({ program }) => {
    const timeAgo = formatDistanceToNow(new Date(program.created_date), { addSuffix: true, locale: he });
    const progress = (program.current_station / program.total_stations) * 100;

    return (
        <Link to={createPageUrl(`ProgramDetails?id=${program.id}`)} className="block hover:no-underline">
            <Card className="p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col justify-between hover:border-blue-300">
                <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-800 leading-tight hover:text-blue-700 transition-colors">
                            {program.title}
                        </h3>
                        <Badge className={`${statusColors[program.status]} border`}>
                            {statusLabels[program.status]}
                        </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{program.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                        {program.assigned_employee && (
                            <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>{program.assigned_employee}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                            <span>#{program.program_number || program.id.slice(-4).toUpperCase()}</span>
                        </div>
                    </div>

                    {program.requester_name && (
                        <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">דורש:</span> {program.requester_name}
                            {program.requester_unit && ` • ${program.requester_unit}`}
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                        <span>התקדמות</span>
                        <span>תחנה {program.current_station} מתוך {program.total_stations}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-blue-600 h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default function ProgramsPage() {
    const [programs, setPrograms] = useState([]);
    const [filteredPrograms, setFilteredPrograms] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [isLoading, setIsLoading] = useState(true);
    const [currentEmployee, setCurrentEmployee] = useState(null); // New state for current employee
    const location = useLocation();

    // Function to load programs
    const loadPrograms = async () => {
        setIsLoading(true);
        try {
            const data = await Program.list("-created_date");
            console.log("Loaded programs:", data.length);
            setPrograms(data);
            setFilteredPrograms(data);
        } catch (error) {
            console.error("Error loading programs:", error);
            setPrograms([]); // Ensure programs are reset on error
            setFilteredPrograms([]);
        }
        setIsLoading(false);
    };

    // Handler for successful employee login
    const handleEmployeeLogin = (employee) => {
        setCurrentEmployee(employee);
        sessionStorage.setItem("currentEmployee", JSON.stringify(employee)); // Store employee in session storage
        loadPrograms(); // Load programs after successful login
    };

    // Effect to check for authenticated employee on component mount or location change
    useEffect(() => {
        const storedEmployee = sessionStorage.getItem("currentEmployee");
        if (storedEmployee) {
            setCurrentEmployee(JSON.parse(storedEmployee));
            loadPrograms(); // Load programs if an employee is already logged in
        } else {
            setCurrentEmployee(null);
            setIsLoading(false); // If no employee, stop loading state and show login
        }
    }, [location]);

    // Handle URL parameters (when coming from dashboard status click)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        console.log("URL status parameter:", status);
        if (status && statusLabels[status]) {
            setStatusFilter(status);
        }
    }, [location.search]);

    // Filter programs based on search and status
    useEffect(() => {
        let result = programs;
        console.log("Filtering - Total programs:", programs.length);
        console.log("Status filter:", statusFilter);
        console.log("Search term:", searchTerm);

        if (searchTerm) {
            result = result.filter(p => 
                p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.assigned_employee?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.requester_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== "all") {
            result = result.filter(p => p.status === statusFilter);
            console.log(`Programs with status '${statusFilter}':`, result.length);
        }

        setFilteredPrograms(result);
        console.log("Final filtered programs:", result.length);
    }, [searchTerm, statusFilter, programs]);

    const getStatusCounts = () => {
        const counts = {};
        Object.keys(statusLabels).forEach(status => {
            counts[status] = programs.filter(p => p.status === status).length;
        });
        return counts;
    };

    const statusCounts = getStatusCounts();

    // If no employee is logged in, show the authentication component
    if (!currentEmployee) {
        return <EmployeeAuth onSuccess={handleEmployeeLogin} />;
    }

    // Loading state for programs (after authentication check)
    if (isLoading) {
        return (
            <div className="p-6 space-y-6" dir="rtl">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array(8).fill(0).map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">שולחן עבודה</h1>
                        <Link to={createPageUrl("Dashboard")}>
                            <Button variant="outline" size="sm">
                                <ArrowRight className="w-4 h-4 ml-2" />
                                חזרה לדשבורד
                            </Button>
                        </Link>
                    </div>
                    <p className="text-gray-500 mt-1">
                        {statusFilter !== "all" 
                            ? `מציג ${filteredPrograms.length} משימות בסטטוס "${statusLabels[statusFilter]}"`
                            : `מציג ${filteredPrograms.length} משימות מתוך ${programs.length} סה"כ`
                        }
                    </p>
                </div>

                {/* Status Summary */}
                {statusFilter !== "all" && (
                    <div className="text-left">
                        <Badge className={`${statusColors[statusFilter]} text-lg px-4 py-2`}>
                            {statusLabels[statusFilter]} ({filteredPrograms.length})
                        </Badge>
                    </div>
                )}
            </div>

            {/* Status Counts Bar */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 p-4 bg-gray-50 rounded-lg">
                {Object.entries(statusLabels).map(([status, label]) => (
                    <div 
                        key={status}
                        className={`text-center p-2 rounded cursor-pointer transition-all ${
                            statusFilter === status ? 'bg-blue-100 border-2 border-blue-300' : 'hover:bg-gray-100'
                        }`}
                        onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                    >
                        <div className="text-lg font-bold">{statusCounts[status] || 0}</div>
                        <div className="text-xs text-gray-600">{label}</div>
                    </div>
                ))}
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input 
                        placeholder="חפש משימה, קניין, דורש או תיאור..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <ListFilter className="w-5 h-5 text-gray-500" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="סנן לפי סטטוס" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">כל הסטטוסים ({programs.length})</SelectItem>
                            {Object.entries(statusLabels).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label} ({statusCounts[key] || 0})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {statusFilter !== "all" && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setStatusFilter("all")}
                        >
                            נקה סינון
                        </Button>
                    )}
                </div>
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrograms.map(program => (
                    <ProgramCard key={program.id} program={program} />
                ))}
            </div>

            {/* Empty State */}
            {filteredPrograms.length === 0 && !isLoading && (
                <div className="text-center py-20 text-gray-500">
                    <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">
                        {statusFilter !== "all" 
                            ? `אין משימות בסטטוס "${statusLabels[statusFilter]}"`
                            : "לא נמצאו משימות"
                        }
                    </h3>
                    <p className="text-gray-400">
                        {searchTerm 
                            ? "נסה לשנות את מילות החיפוש או הסינון"
                            : "כל המשימות נמצאות בסטטוסים אחרים"
                        }
                    </p>
                    {(statusFilter !== "all" || searchTerm) && (
                        <Button 
                            variant="outline" 
                            className="mt-4"
                            onClick={() => {
                                setStatusFilter("all");
                                setSearchTerm("");
                            }}
                        >
                            הצג את כל המשימות
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
