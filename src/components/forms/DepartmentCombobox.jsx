import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Department } from "@/api/entities";

export default function DepartmentCombobox({ value, onValueChange, allowCustomInput = true }) {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      setIsLoading(true);
      try {
        const departmentList = await Department.list();
        setDepartments(departmentList);
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      }
      setIsLoading(false);
    };

    fetchDepartments();
  }, []);

  const selectedDepartment = departments.find(
    (dept) => dept.name?.toLowerCase() === value?.toLowerCase()
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "בחר מחלקה..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" dir="rtl">
        <Command filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
        }}>
          <CommandInput 
            placeholder="חפש מחלקה או הקלד שם חדש..." 
            onValueChange={(searchValue) => {
              if (allowCustomInput && searchValue && !departments.find(d => d.name?.toLowerCase() === searchValue.toLowerCase())) {
                // Allow typing custom department name
              }
            }}
          />
          <CommandList>
            {isLoading && <div className="p-2 text-sm text-center">טוען...</div>}
            <CommandEmpty>
              {allowCustomInput ? (
                <div className="p-2 text-sm">
                  <button 
                    className="w-full text-right hover:bg-gray-100 p-2 rounded"
                    onClick={() => {
                      const customValue = document.querySelector('[cmdk-input]')?.value || '';
                      if (customValue.trim()) {
                        onValueChange(customValue.trim());
                        setOpen(false);
                      }
                    }}
                  >
                    השתמש ב: "<span className="font-medium">{document.querySelector('[cmdk-input]')?.value}</span>"
                  </button>
                </div>
              ) : (
                "לא נמצאה מחלקה."
              )}
            </CommandEmpty>
            <CommandGroup>
              {departments.map((department) => (
                <CommandItem
                  key={department.id}
                  value={department.name || ''}
                  onSelect={(currentValue) => {
                    const selected = departments.find(d => d.name?.toLowerCase() === currentValue.toLowerCase())?.name || "";
                    onValueChange(selected === value ? "" : selected);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value?.toLowerCase() === department.name?.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <div>{department.name}</div>
                    {department.description && (
                      <div className="text-xs text-gray-500">{department.description}</div>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}