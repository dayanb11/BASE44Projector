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
import { ProcurementTeam } from "@/api/entities";

export default function ProcurementTeamCombobox({ value, onValueChange }) {
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const teamList = await ProcurementTeam.list();
        setTeams(teamList);
      } catch (error) {
        console.error("Failed to fetch procurement teams:", error);
        setTeams([]);
      }
      setIsLoading(false);
    };

    fetchTeams();
  }, []);

  const selectedTeam = teams.find(
    (team) => team.name?.toLowerCase() === value?.toLowerCase()
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
          {value || "בחר צוות..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" dir="rtl">
        <Command filter={(value, search) => {
            if (value.toLowerCase().includes(search.toLowerCase())) return 1;
            return 0;
        }}>
          <CommandInput placeholder="חפש צוות..." />
          <CommandList>
            {isLoading && <div className="p-2 text-sm text-center">טוען...</div>}
            <CommandEmpty>לא נמצא צוות.</CommandEmpty>
            <CommandGroup>
              {teams.map((team) => (
                <CommandItem
                  key={team.id}
                  value={team.name || ''}
                  onSelect={(currentValue) => {
                    const selected = teams.find(t => t.name?.toLowerCase() === currentValue.toLowerCase())?.name || "";
                    onValueChange(selected === value ? "" : selected);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "ml-2 h-4 w-4",
                      value?.toLowerCase() === team.name?.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div>
                    <div>{team.name}</div>
                    {team.description && (
                      <div className="text-xs text-gray-500">{team.description}</div>
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