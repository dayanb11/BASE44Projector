
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  ArrowLeft, 
  Calendar,
  User,
  Building2,
  Clock,
  ClipboardList
} from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function RecentPrograms({ programs, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">משימות אחרונות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">משימות אחרונות</CardTitle>
        <Link to={createPageUrl("Programs")}>
          <Button variant="outline" size="sm">
            כל המשימות
            <ArrowLeft className="w-4 h-4 mr-2" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {programs.map((program) => (
          <Link 
            to={createPageUrl(`ProgramDetails?id=${program.id}`)} 
            key={program.id}
            className="block hover:no-underline"
          >
            <div 
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900 flex-1 hover:text-blue-700 transition-colors">
                    {program.title}
                  </h3>
                  <Badge className={`${statusColors[program.status]} border text-xs`}>
                    {statusLabels[program.status]}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                      #{program.program_number || program.id.slice(-4).toUpperCase()}
                    </span>
                  </div>
                  
                  {program.assigned_employee && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{program.assigned_employee}</span>
                    </div>
                  )}
                  
                  {program.department && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      <span>{program.department}</span>
                    </div>
                  )}
                  
                  {program.target_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(program.target_date), "dd/MM", { locale: he })}</span>
                    </div>
                  )}
                </div>

                {program.requester_name && (
                  <div className="mt-1 text-sm text-gray-600">
                    דורש: {program.requester_name}
                    {program.requester_unit && ` • ${program.requester_unit}`}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}

        {programs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>אין משימות להצגה</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
