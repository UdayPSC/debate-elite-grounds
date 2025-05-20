
import React, { useEffect } from "react";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "@/components/ui/command";
import { useCommandSearch } from "@/hooks/useCommandSearch";
import { File, User } from "lucide-react";

export function CommandSearch() {
  const { 
    searchResults, 
    handleSelectResult, 
    searchTerm, 
    setSearchTerm,
    searchInputRef,
    isLoading 
  } = useCommandSearch();
  
  // Focus search input when component mounts (for direct search experience)
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchInputRef]);
  
  return (
    <div className="w-full relative">
      <Command className="rounded-lg border shadow-md bg-popover">
        <CommandInput 
          placeholder="Search debates, users..."
          value={searchTerm}
          onValueChange={setSearchTerm}
          className="h-12"
          ref={searchInputRef}
          autoFocus
        />
        
        {searchTerm.length >= 2 && (
          <CommandList className="max-h-[300px] overflow-y-auto absolute w-full z-50 bg-popover rounded-b-lg border-t">
            <CommandEmpty>No results found.</CommandEmpty>
            
            {searchResults && searchResults.length > 0 && (
              <>
                {searchResults.filter(result => result.type === "debate").length > 0 && (
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
                          <File className="mr-2 h-4 w-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">{debate.title}</span>
                            {debate.description && (
                              <span className="text-xs text-foreground/90 line-clamp-1">
                                {debate.description}
                              </span>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
                
                {searchResults.filter(result => result.type === "profile").length > 0 && (
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
                          <User className="mr-2 h-4 w-4 text-primary" />
                          <span className="font-medium text-foreground">{profile.title}</span>
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
