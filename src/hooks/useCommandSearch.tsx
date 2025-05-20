
import { useRef, useCallback, useState } from "react";
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
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  
  // Query for search results
  const { data: searchResults, refetch, isLoading } = useQuery({
    queryKey: ["search-results", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
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
    enabled: searchTerm.length >= 2,
  });
  
  const handleSelectResult = useCallback((result: CommandSearchResult) => {
    if (result.type === "debate") {
      navigate(`/debates/${result.id}`);
    } else if (result.type === "profile") {
      navigate(`/profile/${result.username}`);
    }
    setSearchTerm("");
  }, [navigate]);
  
  return {
    searchResults,
    refetch,
    searchInputRef,
    handleSelectResult,
    searchTerm,
    setSearchTerm,
    isLoading
  };
}
