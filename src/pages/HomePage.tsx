
import React, { useState } from "react";
import { categories } from "@/data/mockData";
import DebateCard from "@/components/debates/DebateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";
import { Loader2 } from "lucide-react";

type Debate = Database['public']['Tables']['debates']['Row'];

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const { data: debates, isLoading, error } = useQuery({
    queryKey: ['homepageDebates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data as Debate[];
    }
  });
  
  const featuredDebate = debates?.find(debate => debate.featured);
  const activeDebates = debates?.filter(debate => 
    !debate.featured && (activeCategory === "all" || debate.category === activeCategory)
  ) || [];
  
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <section className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-eliteNavy mb-2">Welcome to Elite<span className="text-elitePurple">Minds</span></h1>
        <p className="text-eliteMediumGray max-w-2xl mx-auto">
          A platform for thoughtful debate and discourse on important topics. Join our community of critical thinkers!
        </p>
        <div className="flex justify-center mt-6 gap-4">
          <Button
            className="bg-elitePurple hover:bg-elitePurple/90 text-white"
            size="lg"
            asChild
          >
            <Link to="/register">Join the Community</Link>
          </Button>
          <Button
            variant="outline"
            className="border-elitePurple text-elitePurple hover:bg-eliteLightPurple"
            size="lg"
            asChild
          >
            <Link to="/debates">Browse Debates</Link>
          </Button>
        </div>
      </section>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-elitePurple" />
        </div>
      ) : featuredDebate && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-eliteNavy mb-4">Featured Debate</h2>
          <DebateCard 
            debate={{
              id: featuredDebate.id,
              title: featuredDebate.title,
              description: featuredDebate.description,
              category: featuredDebate.category,
              createdBy: featuredDebate.created_by,
              createdAt: new Date(featuredDebate.created_at || ''),
              endsAt: new Date(featuredDebate.ends_at),
              status: featuredDebate.status as 'active' | 'completed',
              participantCount: featuredDebate.participant_count || 0,
              argumentCount: featuredDebate.argument_count || 0,
              featured: featuredDebate.featured || false
            }} 
            featured={true} 
          />
        </section>
      )}
      
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-eliteNavy">Active Debates</h2>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-eliteGray">
            <TabsTrigger 
              value="all" 
              onClick={() => setActiveCategory("all")}
              className="data-[state=active]:bg-white data-[state=active]:text-elitePurple"
            >
              All
            </TabsTrigger>
            {categories.slice(0, 5).map((category) => (
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
            ) : activeDebates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeDebates.map((debate) => (
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
          
          {categories.slice(0, 5).map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-elitePurple" />
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white rounded-lg border">
                  <p className="text-red-500">Failed to load debates</p>
                </div>
              ) : activeDebates.filter(d => d.category === category).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDebates
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

export default HomePage;
