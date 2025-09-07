import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";

const categoryOptions = [
    { value: "planning", label: "תכנון" },
    { value: "market_research", label: "חקר שוק" },
    { value: "tender_preparation", label: "הכנת מכרז" },
    { value: "evaluation", label: "בחינה" },
    { value: "negotiation", label: "משא ומתן" },
    { value: "contracting", label: "התקשרות" },
    { value: "approval", label: "אישור" },
    { value: "execution", label: "ביצוע" }
];

const complexityOptions = [
    { value: "simple", label: "פשוט" },
    { value: "medium", label: "בינוני" },
    { value: "complex", label: "מורכב" }
];

export default function ActivityPoolForm({ activity, onSave, onCancel }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: activity ? {
        ...activity,
        required_skills: activity.required_skills?.join(", ") || "",
    } : {
        is_mandatory: true,
    },
  });

  const handleFormSubmit = (data) => {
      const skills = data.required_skills ? data.required_skills.split(",").map(s => s.trim()) : [];
      onSave({ ...data, required_skills: skills });
  };

  return (
    <DialogContent className="sm:max-w-[600px]" dir="rtl">
      <DialogHeader>
        <DialogTitle>{activity ? 'עריכת פעילות' : 'הוספת פעילות חדשה'}</DialogTitle>
        <DialogDescription>מלא את פרטי הפעילות למאגר.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          
          <div className="space-y-2">
            <Label htmlFor="activity_name">שם הפעילות</Label>
            <Input id="activity_name" {...register("activity_name", { required: true })} />
            {errors.activity_name && <span className="text-red-500 text-xs">שדה חובה</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity_description">תיאור הפעילות</Label>
            <Textarea id="activity_description" {...register("activity_description")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>קטגוריה</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="בחר קטגוריה..." /></SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <span className="text-red-500 text-xs">שדה חובה</span>}
            </div>
            
            <div className="space-y-2">
              <Label>רמת מורכבות</Label>
              <Controller
                name="complexity_level"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger><SelectValue placeholder="בחר רמת מורכבות..." /></SelectTrigger>
                    <SelectContent>
                      {complexityOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_duration">משך זמן משוער (בימים)</Label>
              <Input id="estimated_duration" type="number" {...register("estimated_duration", { valueAsNumber: true })} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="is_mandatory">פעילות חובה</Label>
                <Controller
                    name="is_mandatory"
                    control={control}
                    render={({ field }) => (
                        <div className="flex items-center pt-2">
                           <Switch id="is_mandatory" checked={field.value} onCheckedChange={field.onChange} />
                           <span className="mr-2 text-sm">{field.value ? 'כן' : 'לא'}</span>
                        </div>
                    )}
                />
            </div>
          </div>

           <div className="space-y-2">
                <Label htmlFor="required_skills">כישורים נדרשים (מופרדים בפסיק)</Label>
                <Input id="required_skills" {...register("required_skills")} />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="default_assignee_role">תפקיד ברירת מחדל</Label>
                <Input id="default_assignee_role" {...register("default_assignee_role")} placeholder="לדוגמה: קניין"/>
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