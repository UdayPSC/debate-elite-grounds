
import { useRef, useCallback, useState, useEffect } from "react";
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
  
  // Query for search results with debouncing
  const { data: searchResults, refetch, isLoading } = useQuery({
    queryKey: ["search-results", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];
      
      // Get debates that match with improved search including title and description
      const { data: debates, error: debatesError } = await supabase
        .from("debates")
        .select("id, title, description, category")
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(10);
        
      if (debatesError) {
        console.error("Error fetching debates:", debatesError);
        return [];
      }
        
      // Get profiles that match with improved search
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(5);
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        return [];
      }
      
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
  
  // Add a debounce effect for the search to improve performance
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        refetch();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm, refetch]);
  
  const handleSelectResult = useCallback((result: CommandSearchResult) => {
    if (result.type === "debate") {
      navigate(`/debates/${result.id}`);
    } else if (result.type === "profile") {
      navigate(`/profile/${result.username}`);
    }
    setSearchTerm("");
  }, [navigate]);
  
  return {
    searchResults: searchResults || [],
    refetch,
    searchInputRef,
    handleSelectResult,
    searchTerm,
    setSearchTerm,
    isLoading
  };
}
