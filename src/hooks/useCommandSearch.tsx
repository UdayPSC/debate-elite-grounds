
import { useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type CommandSearchResult = {
  type: "debate" | "profile";
  id: string;
  title: string;
  description?: string;
  category?: string;
  username?: string;
};

export function useCommandSearch() {
  const navigate = useNavigate();
  const commandDialogRef = useRef<HTMLDialogElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  
  // Query for search results
  const { data: searchResults, refetch } = useQuery({
    queryKey: ["search-results"],
    queryFn: async () => {
      const searchTerm = searchInputRef.current?.value || "";
      if (!searchTerm || searchTerm.length < 3) return [];
      
      // Get debates that match
      const { data: debates } = await supabase
        .from("debates")
        .select("id, title, description, category")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(5);
        
      // Get profiles that match
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(5);
        
      const results: CommandSearchResult[] = [
        ...(debates?.map(debate => ({
          type: "debate" as const,
          id: debate.id,
          title: debate.title,
          description: debate.description,
          category: debate.category
        })) || []),
        ...(profiles?.map(profile => ({
          type: "profile" as const,
          id: profile.id,
          title: profile.full_name || profile.username,
          username: profile.username
        })) || [])
      ];
      
      return results;
    },
    enabled: false,
  });
  
  const toggleSearch = useCallback(() => {
    if (!commandDialogRef.current) {
      const dialog = document.getElementById('command-dialog') as HTMLDialogElement;
      commandDialogRef.current = dialog;
    }
    
    if (commandDialogRef.current) {
      if (commandDialogRef.current.open) {
        commandDialogRef.current.close();
      } else {
        commandDialogRef.current.showModal();
        // Focus on input inside dialog
        setTimeout(() => {
          const input = document.querySelector('#command-dialog input') as HTMLInputElement;
          if (input) {
            input.focus();
          }
        }, 100);
      }
    }
  }, []);
  
  const handleSelectResult = useCallback((result: CommandSearchResult) => {
    if (result.type === "debate") {
      navigate(`/debates/${result.id}`);
    } else if (result.type === "profile") {
      navigate(`/profile/${result.username}`);
    }
    
    if (commandDialogRef.current?.open) {
      commandDialogRef.current.close();
    }
  }, [navigate]);
  
  useEffect(() => {
    // Handle Cmd+K / Ctrl+K shortcut
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      
      // Close on escape
      if (e.key === 'Escape' && commandDialogRef.current?.open) {
        commandDialogRef.current.close();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSearch]);
  
  return {
    searchResults,
    refetch,
    toggleSearch,
    searchInputRef,
    handleSelectResult
  };
}
