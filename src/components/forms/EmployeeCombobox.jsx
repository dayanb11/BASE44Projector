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
import { Employee } from "@/api/entities";

export default function EmployeeCombobox({ value, onValueChange, roleFilter }) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        let employeeList = await Employee.list();
        
        // Filter by active status
        employeeList = employeeList.filter(e => e.is_active);

        // Filter by role if a roleFilter is provided
        if (roleFilter) {
          employeeList = employeeList.filter(e => roleFilter.includes(e.role));
        }
        
        setEmployees(employeeList);
      } catch (error) {
        console.error("Failed to fetch employees:", error);
        setEmployees([]);
      }
      setIsLoading(false);
    };

    fetchEmployees();
  }, [roleFilter]);

  const selectedEmployee = employees.find(
    (employee) => employee.full_name?.toLowerCase() === value?.toLowerCase()
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
          {value
            ? selectedEmployee?.full_name
            : "בחר עובד..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" dir="rtl">
        <Command filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
        }}>
          <CommandInput placeholder="חפש עובד..." />
          <CommandList>
            {isLoading && <div className="p-2 text-sm text-center">טוען...</div>}
            <CommandEmpty>לא נמצא עובד.</CommandEmpty>
            <CommandGroup>
              {employees.map((employee) => (
                <CommandItem
                  key={employee.id}
                  value={employee.full_name || ''}
                  onSelect={(currentValue) => {
                    const selected = employees.find(e => e.full_name.toLowerCase() === currentValue.toLowerCase())?.full_name || "";
                    onValueChange(selected === value ? "" : selected);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value?.toLowerCase() === employee.full_name?.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <div>{employee.full_name}</div>
                    <div className="text-xs text-gray-500">{employee.role}</div>
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