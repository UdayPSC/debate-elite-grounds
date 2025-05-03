
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getDebate, getDebateArguments, getUser } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ArgumentCard from "@/components/debates/ArgumentCard";
import { MessageSquare, Users, Clock } from "lucide-react";

const DebateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [position, setPosition] = useState<"for" | "against">("for");
  const [argument, setArgument] = useState("");
  
  // In a real app, we would fetch the debate and arguments from API
  const debate = id ? getDebate(id) : undefined;
  const arguments = id ? getDebateArguments(id) : [];
  const creator = debate ? getUser(debate.createdBy) : undefined;
  
  const forArguments = arguments.filter(arg => arg.position === "for")
    .sort((a, b) => (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes));
    
  const againstArguments = arguments.filter(arg => arg.position === "against")
    .sort((a, b) => (b.votes.upvotes - b.votes.downvotes) - (a.votes.upvotes - a.votes.downvotes));
  
  const timeRemaining = () => {
    if (!debate) return "";
    
    const now = new Date();
    const diff = debate.endsAt.getTime() - now.getTime();
    
    // If debate has ended
    if (diff <= 0) return "Debate ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} remaining`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    }
  };
  
  const handleSubmitArgument = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit the argument to API
    console.log("Submitting argument:", { position, argument });
    setArgument("");
  };

  if (!debate) {
    return <div className="text-center py-12">Debate not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Badge variant="outline" className={`${
            debate.category === 'Technology' ? 'bg-blue-50 text-blue-700 border-blue-300' : 
            debate.category === 'Politics' ? 'bg-red-50 text-red-700 border-red-300' :
            debate.category === 'Science' ? 'bg-green-50 text-green-700 border-green-300' :
            debate.category === 'Economics' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
            debate.category === 'Social Issues' ? 'bg-purple-50 text-purple-700 border-purple-300' :
            'bg-gray-50 text-gray-700 border-gray-300'
          }`}>
            {debate.category}
          </Badge>
          <div className="text-sm flex items-center text-eliteMediumGray">
            <Clock className="h-4 w-4 mr-1" />
            {timeRemaining()}
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-eliteNavy mb-3">{debate.title}</h1>
        <p className="text-eliteDarkGray mb-4">{debate.description}</p>
        
        <div className="flex items-center justify-between border-t border-b py-3 text-sm">
          <div className="flex items-center">
            <div className="bg-elitePurple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
              {creator?.fullName.charAt(0)}
            </div>
            <span className="text-eliteDarkGray">Started by <span className="font-medium">{creator?.username}</span></span>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-eliteMediumGray" />
              <span>{debate.argumentCount} arguments</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-eliteMediumGray" />
              <span>{debate.participantCount} participants</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-600 mb-4 flex items-center">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
              Arguments For ({forArguments.length})
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {forArguments.map(argument => (
                <ArgumentCard key={argument.id} argument={argument} />
              ))}
              {forArguments.length === 0 && (
                <p className="text-sm text-eliteMediumGray">No arguments for this position yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-red-600 mb-4 flex items-center">
              <span className="h-2 w-2 bg-red-500 rounded-full mr-2"></span>
              Arguments Against ({againstArguments.length})
            </h3>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {againstArguments.map(argument => (
                <ArgumentCard key={argument.id} argument={argument} />
              ))}
              {againstArguments.length === 0 && (
                <p className="text-sm text-eliteMediumGray">No arguments against this position yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white p-6 border rounded-lg shadow-sm animate-scale-in">
        <h3 className="font-semibold text-lg mb-4">Add Your Argument</h3>
        <form onSubmit={handleSubmitArgument}>
          <div className="mb-4">
            <label className="text-sm font-medium mb-2 block">Your Position</label>
            <Tabs defaultValue="for" className="w-full" onValueChange={(value) => setPosition(value as "for" | "against")}>
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="for" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">For</TabsTrigger>
                <TabsTrigger value="against" className="data-[state=active]:bg-red-500 data-[state=active]:text-white">Against</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="mb-4">
            <label htmlFor="argument" className="text-sm font-medium mb-2 block">Your Argument</label>
            <Textarea 
              id="argument" 
              placeholder="Present your argument here..." 
              className="resize-none min-h-32"
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="bg-elitePurple hover:bg-elitePurple/90 text-white">
            Submit Argument
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DebateDetailPage;
