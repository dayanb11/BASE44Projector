
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";

export default function EngagementTypeForm({ engagementType, onSave, onCancel }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: engagementType ? {
        ...engagementType,
        approval_levels: engagementType.approval_levels?.join(", ") || "",
        default_activities: JSON.stringify(engagementType.default_activities || [], null, 2),
    } : {
        is_active: true,
        default_activities: "[]"
    },
  });

  const handleFormSubmit = (data) => {
      let parsedActivities;
      try {
          parsedActivities = JSON.parse(data.default_activities);
          if(!Array.isArray(parsedActivities)) throw new Error();
      } catch (e) {
          alert("פורמט JSON של 'פעילויות ברירת מחדל' אינו תקין. אנא תקן והגש שוב.");
          return;
      }

      const approvalLevels = data.approval_levels ? data.approval_levels.split(",").map(s => s.trim()) : [];
      
      onSave({ ...data, default_activities: parsedActivities, approval_levels: approvalLevels });
  };

  return (
    <DialogContent className="sm:max-w-[700px]" dir="rtl">
      <DialogHeader>
        <DialogTitle>{engagementType ? 'עריכת סוג התקשרות' : 'הוספת סוג התקשרות חדש'}</DialogTitle>
        <DialogDescription>מלא את פרטי סוג ההתקשרות.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          
          <div className="space-y-2">
            <Label htmlFor="type_name">שם סוג ההתקשרות</Label>
            <Input id="type_name" {...register("type_name", { required: true })} />
            {errors.type_name && <span className="text-red-500 text-xs">שדה חובה</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_description">תיאור</Label>
            <Textarea id="type_description" {...register("type_description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">משך זמן משוער (בימים)</Label>
              <Input id="estimated_duration" type="number" {...register("estimated_duration", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="is_active">פעיל</Label>
                <Controller
                    name="is_active"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center pt-2">
                           <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                           <span className="mr-2 text-sm">{field.value ? 'כן' : 'לא'}</span>
                        </div>
                    )}
                />
            </div>
          </div>
          
           <div className="space-y-2">
                <Label htmlFor="typical_budget_range">טווח תקציב אופייני</Label>
                <Input id="typical_budget_range" {...register("typical_budget_range")} placeholder="לדוגמה: 10,000 - 50,000 שח"/>
            </div>
            
             <div className="space-y-2">
                <Label htmlFor="approval_levels">רמות אישור נדרשות (מופרדות בפסיק)</Label>
                <Input id="approval_levels" {...register("approval_levels")} placeholder="לדוגמה: מנהל מחלקה, מנהל אגף"/>
            </div>

           <div className="space-y-2">
                <Label htmlFor="default_activities">פעילויות ברירת מחדל (בפורמט JSON)</Label>
                 <Textarea 
                    id="default_activities" 
                    {...register("default_activities", { required: true })} 
                    className="h-48 text-left font-mono text-sm"
                    dir="ltr"
                 />
                 <p className="text-xs text-gray-500">
                    {'דוגמה לפורמט: [{"station": 1, "activity_name": "אישור התחלה", "estimated_days": 2}]'}
                 </p>
                {errors.default_activities && <span className="text-red-500 text-xs">שדה חובה</span>}
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
