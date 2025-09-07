
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";
import ProcurementTeamCombobox from "../forms/ProcurementTeamCombobox";

const roleOptions = [
  { value: "procurement_manager", label: "מנהל רכש" },
  { value: "team_leader", label: "ראש צוות" },
  { value: "procurement_officer", label: "קניין" },
  { value: "junior_officer", label: "קניין זוטר" },
];

export default function EmployeeForm({ employee, onSave, onCancel }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: employee || { 
      is_active: true,
      password: "123456"
    },
  });
  const roleValue = watch("role");
  const teamValue = watch("team");

  React.useEffect(() => {
    if (employee) {
      Object.keys(employee).forEach(key => {
        setValue(key, employee[key]);
      });
    }
  }, [employee, setValue]);

  return (
    <DialogContent className="sm:max-w-[500px]" dir="rtl">
      <DialogHeader>
        <DialogTitle>{employee ? "עריכת עובד" : "הוספת עובד חדש"}</DialogTitle>
        <DialogDescription>
          {employee ? "עדכן את פרטי העובד." : "מלא את הפרטים ליצירת עובד חדש."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="full_name" className="text-right">שם מלא</Label>
            <Input id="full_name" {...register("full_name", { required: true })} className="col-span-3" />
            {errors.full_name && <span className="text-red-500 text-xs col-span-4">שדה חובה</span>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="employee_id" className="text-right">מספר עובד</Label>
            <Input id="employee_id" {...register("employee_id", { required: true })} className="col-span-3" />
            {errors.employee_id && <span className="text-red-500 text-xs col-span-4">שדה חובה</span>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">סיסמה</Label>
            <Input 
              id="password" 
              type="password"
              maxLength={14}
              {...register("password", { required: true, maxLength: 14 })} 
              className="col-span-3" 
            />
            {errors.password && <span className="text-red-500 text-xs col-span-4">שדה חובה (עד 14 תווים)</span>}
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">אימייל</Label>
            <Input id="email" type="email" {...register("email")} className="col-span-3" />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">תפקיד</Label>
            <div className="col-span-3">
              <Select onValueChange={(value) => setValue("role", value)} value={roleValue}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר תפקיד" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {errors.role && <span className="text-red-500 text-xs col-span-4">שדה חובה</span>}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="team" className="text-right">צוות</Label>
            <div className="col-span-3">
              <ProcurementTeamCombobox
                value={teamValue || ""}
                onValueChange={(value) => setValue("team", value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">מחלקה</Label>
            <Input id="department" {...register("department")} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">טלפון</Label>
            <Input id="phone" {...register("phone")} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
          <Button type="submit">שמירה</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
