
import React, { useState } from "react";
import { Employee, User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, User, Lock, AlertCircle } from "lucide-react";

export default function EmployeeAuth({ onSuccess }) {
    const [employeeId, setEmployeeId] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // חיפוש העובד לפי מספר עובד
            const employees = await Employee.list();
            const employee = employees.find(emp => 
                emp.employee_id === employeeId && 
                emp.password === password &&
                emp.is_active
            );

            if (employee) {
                // Establish authenticated session with Base44 SDK
                await User.login({
                    username: employeeId,
                    password: password
                });
                
                // שמירת פרטי העובד המחובר בsessionStorage
                sessionStorage.setItem("currentEmployee", JSON.stringify(employee));
                window.dispatchEvent(new Event('authChange')); // Notify layout of login
                onSuccess(employee);
            } else {
                setError("מספר עובד או סיסמה שגויים");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("שגיאה בהתחברות, נסה שוב");
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" dir="rtl">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold">פרוג'קטור</CardTitle>
                    <p className="text-gray-600">מערכת ניהול משימות רכש</p>
                    <p className="text-sm text-gray-500 mt-2">התחבר כעובד למערכת</p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">מספר עובד</label>
                            <div className="relative">
                                <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="הזן מספר עובד"
                                    value={employeeId}
                                    onChange={(e) => setEmployeeId(e.target.value)}
                                    className="pr-10"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">סיסמה</label>
                            <div className="relative">
                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    type="password"
                                    placeholder="הזן סיסמה"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pr-10"
                                    maxLength={14}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "מתחבר..." : "התחבר למערכת"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
