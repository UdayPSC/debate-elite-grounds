
import React, { useState } from "react";
import { categories } from "@/data/mockData";
import DebateCard from "@/components/debates/DebateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

type Debate = Database['public']['Tables']['debates']['Row'];

const DebatesPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { data: debates, isLoading, error } = useQuery({
    queryKey: ['debates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Debate[];
    }
  });
  
  const filteredDebates = debates?.filter(debate => 
    activeCategory === "all" || debate.category === activeCategory
  ) || [];
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <section>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-eliteNavy">Explore Debates</h1>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-eliteGray overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveCategory("all")}
              className="data-[state=active]:bg-white data-[state=active]:text-elitePurple"
            >
              All
            </TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                onClick={() => setActiveCategory(category)}
                className="data-[state=active]:bg-white data-[state=active]:text-elitePurple"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-elitePurple" />
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-red-500">Failed to load debates</p>
              </div>
            ) : filteredDebates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDebates.map((debate) => (
                  <DebateCard 
                    key={debate.id} 
                    debate={{
                      id: debate.id,
                      title: debate.title,
                      description: debate.description,
                      category: debate.category,
                      createdBy: debate.created_by,
                      createdAt: new Date(debate.created_at || ''),
                      endsAt: new Date(debate.ends_at),
                      status: debate.status as 'active' | 'completed',
                      participantCount: debate.participant_count || 0,
                      argumentCount: debate.argument_count || 0,
                      featured: debate.featured || false
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-eliteMediumGray">No debates found. Be the first to create a debate!</p>
              </div>
            )}
          </TabsContent>
          
          {categories.map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-elitePurple" />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-red-500">Failed to load debates</p>
                </div>
              ) : filteredDebates.filter(d => d.category === category).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDebates
                    .filter(debate => debate.category === category)
                    .map((debate) => (
                      <DebateCard 
                        key={debate.id} 
                        debate={{
                          id: debate.id,
                          title: debate.title,
                          description: debate.description,
                          category: debate.category,
                          createdBy: debate.created_by,
                          createdAt: new Date(debate.created_at || ''),
                          endsAt: new Date(debate.ends_at),
                          status: debate.status as 'active' | 'completed',
                          participantCount: debate.participant_count || 0,
                          argumentCount: debate.argument_count || 0,
                          featured: debate.featured || false
                        }}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-eliteMediumGray">No debates found in this category.</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export default DebatesPage;
