import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function TeamWorkload({ employees, programs }) {
  const getEmployeeWorkload = () => {
    const workloadMap = {};
    
    // Initialize all employees
    employees.forEach(emp => {
      workloadMap[emp.full_name] = {
        ...emp,
        activeTasks: 0,
        workloadPercentage: 0
      };
    });

    // Count active programs per employee
    programs.forEach(program => {
      if (['open', 'plan', 'in_progress'].includes(program.status) && program.assigned_employee) {
        if (workloadMap[program.assigned_employee]) {
          workloadMap[program.assigned_employee].activeTasks++;
        }
      }
    });

    // Calculate workload percentage (assuming max 5 concurrent tasks = 100%)
    Object.values(workloadMap).forEach(emp => {
      emp.workloadPercentage = Math.min(100, (emp.activeTasks / 5) * 100);
    });

    return Object.values(workloadMap)
      .filter(emp => emp.is_active)
      .sort((a, b) => b.activeTasks - a.activeTasks)
      .slice(0, 8);
  };

  const topEmployees = getEmployeeWorkload();

  const getWorkloadColor = (percentage) => {
    if (percentage >= 80) return "text-red-600";
    if (percentage >= 60) return "text-orange-600"; 
    if (percentage >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      procurement_manager: "מנהל רכש",
      team_leader: "ראש צוות", 
      procurement_officer: "קניין",
      junior_officer: "קניין זוטר"
    };
    return roleLabels[role] || role;
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-bold">
          <Users className="w-5 h-5" />
          עומס עבודה צוות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {topEmployees.map((employee) => (
          <div key={employee.employee_id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-sm">{employee.full_name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {getRoleLabel(employee.role)}
                  </Badge>
                  {employee.team && (
                    <span className="text-xs text-gray-500">{employee.team}</span>
                  )}
                </div>
              </div>
              <div className="text-left">
                <span className={`text-sm font-semibold ${getWorkloadColor(employee.workloadPercentage)}`}>
                  {Math.round(employee.workloadPercentage)}%
                </span>
                <p className="text-xs text-gray-500">{employee.activeTasks} משימות</p>
              </div>
            </div>
            <Progress 
              value={employee.workloadPercentage} 
              className="h-2"
            />
          </div>
        ))}

        {topEmployees.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <p className="text-sm">אין נתונים על עומס עבודה</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}