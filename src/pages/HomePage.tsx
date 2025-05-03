
import React, { useState } from "react";
import { mockDebates, categories } from "@/data/mockData";
import DebateCard from "@/components/debates/DebateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const featuredDebate = mockDebates.find(debate => debate.featured);
  const activeDebates = mockDebates
    .filter(debate => !debate.featured && (activeCategory === "all" || debate.category === activeCategory))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
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
            <a href="/register">Join the Community</a>
          </Button>
          <Button
            variant="outline"
            className="border-elitePurple text-elitePurple hover:bg-eliteLightPurple"
            size="lg"
            asChild
          >
            <a href="/debates">Browse Debates</a>
          </Button>
        </div>
      </section>
      
      {featuredDebate && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-eliteNavy mb-4">Featured Debate</h2>
          <DebateCard debate={featuredDebate} featured={true} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDebates.map((debate) => (
                <DebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          </TabsContent>
          
          {categories.slice(0, 5).map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockDebates
                  .filter(debate => debate.category === category)
                  .map((debate) => (
                    <DebateCard key={debate.id} debate={debate} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  );
};

export default HomePage;
