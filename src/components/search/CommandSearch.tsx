
import React, { useState, useEffect } from "react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { useCommandSearch } from "@/hooks/useCommandSearch";
import { File, User } from "lucide-react";

export function CommandSearch() {
  const { refetch, searchResults, handleSelectResult } = useCommandSearch();
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const timer = setTimeout(() => {
        refetch();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [searchTerm, refetch]);
  
  return (
    <div className="w-full max-w-lg mx-auto">
      <Command className="rounded-lg border shadow-md bg-popover text-foreground">
        <CommandInput 
          placeholder="Search for debates, users..." 
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="h-12"
        />
        {searchTerm.length >= 2 && (
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            {searchResults && searchResults.length > 0 && (
              <>
                <CommandGroup heading="Debates">
                  {searchResults
                    .filter(result => result.type === "debate")
                    .map(debate => (
                      <CommandItem
                        key={debate.id}
                        value={debate.title}
                        onSelect={() => handleSelectResult(debate)}
                        className="flex items-center p-2"
                      >
                        <File className="mr-2 h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">{debate.title}</span>
                          {debate.description && (
                            <span className="text-xs text-muted-foreground line-clamp-1">
                              {debate.description}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    ))}
                </CommandGroup>
                
                <CommandGroup heading="Users">
                  {searchResults
                    .filter(result => result.type === "profile")
                    .map(profile => (
                      <CommandItem
                        key={profile.id}
                        value={profile.title}
                        onSelect={() => handleSelectResult(profile)}
                        className="flex items-center p-2"
                      >
                        <User className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{profile.title}</span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
