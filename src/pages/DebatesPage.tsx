
import React, { useState } from "react";
import { mockDebates, categories } from "@/data/mockData";
import DebateCard from "@/components/debates/DebateCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DebatesPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  
  const debates = mockDebates
    .filter(debate => activeCategory === "all" || debate.category === activeCategory)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {debates.map((debate) => (
                <DebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          </TabsContent>
          
          {categories.map((category) => (
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

export default DebatesPage;
