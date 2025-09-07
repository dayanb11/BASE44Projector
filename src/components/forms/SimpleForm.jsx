import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from "@/components/ui/dialog";

export default function SimpleForm({ title, fields, data, onSave, onCancel }) {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: data || {},
  });

  React.useEffect(() => {
    if (data) {
      Object.keys(data).forEach(key => {
        setValue(key, data[key]);
      });
    }
  }, [data, setValue]);

  return (
    <DialogContent className="sm:max-w-[500px]" dir="rtl">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          מלא את הפרטים הנדרשים.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSave)}>
        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right">
                {field.label}
                {field.required && <span className="text-red-500 mr-1">*</span>}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea 
                  id={field.name} 
                  {...register(field.name, { required: field.required })} 
                  className="col-span-3" 
                />
              ) : (
                <Input 
                  id={field.name} 
                  type={field.type || 'text'}
                  {...register(field.name, { required: field.required })} 
                  className="col-span-3" 
                />
              )}
              {errors[field.name] && (
                <span className="text-red-500 text-xs col-span-4">שדה חובה</span>
              )}
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
          <Button type="submit">שמירה</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}