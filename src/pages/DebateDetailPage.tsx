import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import ArgumentCard, { Argument } from "@/components/debates/ArgumentCard";
import { MessageSquare, Users, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Database } from "@/integrations/supabase/types";

type Debate = Database['public']['Tables']['debates']['Row'];
type Profile = Database['public']['Tables']['profiles']['Row'];

// Define the argument type correctly
interface ArgumentRow {
  id: string;
  debate_id: string;
  user_id: string;
  position: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: Profile;
}

const DebateDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [position, setPosition] = useState<"for" | "against">("for");
  const [argument, setArgument] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserVotes, setCurrentUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  // Fetch debate details
  const { data: debate, isLoading: isDebateLoading, error: debateError } = useQuery({
    queryKey: ['debate', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      return data as Debate;
    },
    enabled: !!id
  });
  
  // Fetch creator details
  const { data: creator, isLoading: isCreatorLoading } = useQuery({
    queryKey: ['debateCreator', debate?.created_by],
    queryFn: async () => {
      if (!debate?.created_by) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', debate.created_by)
        .single();
        
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!debate?.created_by
  });
  
  // Fetch arguments with proper join to profiles table
  const { data: argumentsData, isLoading: areArgumentsLoading } = useQuery({
    queryKey: ['debateArguments', id],
    queryFn: async () => {
      if (!id) return [];
      
      console.log("Fetching arguments for debate:", id);
      
      const { data, error } = await supabase
        .from('arguments')
        .select(`
          *,
          profiles:user_id(*)
        `)
        .eq('debate_id', id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Error fetching arguments:", error);
        throw error;
      }
      
      console.log("Fetched arguments:", data);
      return data as unknown as ArgumentRow[];
    },
    enabled: !!id
  });

  // Fetch votes for the arguments
  const { data: votes } = useQuery({
    queryKey: ['argumentVotes', id],
    queryFn: async () => {
      if (!id || !argumentsData?.length) return {};
      
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      
      const argIds = argumentsData.map(arg => arg.id);
      
      const { data, error } = await supabase
        .from('votes')
        .select('*')
        .in('argument_id', argIds);
        
      if (error) throw error;
      
      // Process votes
      const voteCounts: Record<string, { upvotes: number, downvotes: number }> = {};
      const userVotes: Record<string, 'up' | 'down' | null> = {};
      
      // Initialize all arguments with zero votes
      argIds.forEach(argId => {
        voteCounts[argId] = { upvotes: 0, downvotes: 0 };
      });
      
      // Count votes for each argument
      data?.forEach(vote => {
        if (vote.vote_type) {
          voteCounts[vote.argument_id].upvotes += 1;
        } else {
          voteCounts[vote.argument_id].downvotes += 1;
        }
        
        // Track user's own votes
        if (userId && vote.user_id === userId) {
          userVotes[vote.argument_id] = vote.vote_type ? 'up' : 'down';
        }
      });
      
      setCurrentUserVotes(userVotes);
      return voteCounts;
    },
    enabled: !!argumentsData?.length
  });
  
  // Set up real-time subscription for new arguments and votes
  useEffect(() => {
    if (!id) return;
    
    const channel = supabase
      .channel('argument-changes')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public',
          table: 'arguments',
          filter: `debate_id=eq.${id}`
        },
        () => {
          console.log("Arguments changed, refetching...");
          // Invalidate and refetch arguments when changes happen
          queryClient.invalidateQueries({ queryKey: ['debateArguments', id] });
          
          // Also update debate's argument count on insert
          queryClient.invalidateQueries({ queryKey: ['debate', id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes'
        },
        () => {
          console.log("Votes changed, refetching...");
          // Invalidate and refetch votes when changes happen
          queryClient.invalidateQueries({ queryKey: ['argumentVotes', id] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient, argumentsData]);
  
  // Transform raw data into the format expected by ArgumentCard component
  const processedArguments: Argument[] = (argumentsData || []).map(argRow => {
    const voteInfo = votes?.[argRow.id] || { upvotes: 0, downvotes: 0 };
    
    return {
      id: argRow.id,
      debateId: argRow.debate_id,
      userId: argRow.user_id,
      position: argRow.position as 'for' | 'against',
      content: argRow.content,
      createdAt: new Date(argRow.created_at || ''),
      updatedAt: new Date(argRow.updated_at || ''),
      votes: {
        upvotes: voteInfo.upvotes,
        downvotes: voteInfo.downvotes,
        userVote: currentUserVotes[argRow.id] || null
      },
      user: {
        username: argRow.profiles?.username || 'Unknown',
        avatarUrl: argRow.profiles?.avatar_url || undefined
      }
    };
  });
  
  const forArguments = processedArguments.filter(arg => arg.position === "for");
  const againstArguments = processedArguments.filter(arg => arg.position === "against");
  
  const timeRemaining = () => {
    if (!debate?.ends_at) return "";
    
    const now = new Date();
    const endsAt = new Date(debate.ends_at);
    const diff = endsAt.getTime() - now.getTime();
    
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
  
  const handleVote = async (argumentId: string, voteType: boolean) => {
    // Check if user is logged in
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      toast.error("You must be logged in to vote", {
        description: "Please log in and try again."
      });
      navigate("/login");
      return;
    }
    
    const userId = sessionData.session.user.id;
    
    // Check if user already voted
    const currentVote = currentUserVotes[argumentId];
    
    try {
      // If user already voted the same way, remove the vote
      if ((currentVote === 'up' && voteType) || (currentVote === 'down' && !voteType)) {
        // Delete the vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .eq('user_id', userId)
          .eq('argument_id', argumentId);
        
        if (error) throw error;
        
        // Update local state
        setCurrentUserVotes(prev => ({
          ...prev,
          [argumentId]: null
        }));
      } else {
        // If user already voted differently, update the vote
        if (currentVote) {
          const { error } = await supabase
            .from('votes')
            .update({ vote_type: voteType })
            .eq('user_id', userId)
            .eq('argument_id', argumentId);
          
          if (error) throw error;
        } else {
          // If user hasn't voted, insert new vote
          const { error } = await supabase
            .from('votes')
            .insert({
              user_id: userId,
              argument_id: argumentId,
              vote_type: voteType
            });
          
          if (error) throw error;
        }
        
        // Update local state
        setCurrentUserVotes(prev => ({
          ...prev,
          [argumentId]: voteType ? 'up' : 'down'
        }));
      }
      
      // Invalidate votes query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['argumentVotes', id] });
    } catch (error) {
      console.error('Error voting:', error);
      toast.error("Failed to submit vote");
    }
  };
  
  const handleReply = (argumentId: string) => {
    setReplyingTo(argumentId);
    // Scroll to argument form
    document.getElementById('argument-form')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmitArgument = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
      toast.error("You must be logged in to submit an argument", {
        description: "Please log in and try again."
      });
      navigate("/login");
      return;
    }
    
    if (!argument.trim()) {
      toast.error("Argument cannot be empty", {
        description: "Please provide your argument."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('arguments')
        .insert({
          debate_id: id,
          user_id: sessionData.session.user.id,
          position: position,
          content: argument
        });
        
      if (error) {
        console.error("Error submitting argument:", error);
        toast.error("Failed to submit argument", {
          description: error.message
        });
        return;
      }
      
      toast.success("Argument submitted successfully!");
      
      // Reset form
      setArgument("");
      setReplyingTo(null);
      
      // Update argument count in debate
      if (debate) {
        const newCount = (debate.argument_count || 0) + 1;
        await supabase
          .from('debates')
          .update({ argument_count: newCount })
          .eq('id', id);
      }
      
    } catch (error) {
      console.error("Error submitting argument:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDebateLoading || isCreatorLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-elitePurple" />
      </div>
    );
  }

  if (debateError || !debate) {
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
              {creator?.full_name?.charAt(0) || creator?.username?.charAt(0) || '?'}
            </div>
            <span className="text-eliteDarkGray">
              Started by <span className="font-medium">{creator?.username || 'Unknown'}</span>
            </span>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-1 text-eliteMediumGray" />
              <span>{debate.argument_count || 0} arguments</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-eliteMediumGray" />
              <span>{debate.participant_count || 0} participants</span>
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
              {areArgumentsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-elitePurple" />
                </div>
              ) : forArguments.length === 0 ? (
                <p className="text-sm text-eliteMediumGray">No arguments for this position yet.</p>
              ) : (
                forArguments.map(argument => (
                  <ArgumentCard 
                    key={argument.id} 
                    argument={argument}
                    onUpvote={() => handleVote(argument.id, true)}
                    onDownvote={() => handleVote(argument.id, false)}
                    onReply={() => handleReply(argument.id)}
                  />
                ))
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
              {areArgumentsLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-elitePurple" />
                </div>
              ) : againstArguments.length === 0 ? (
                <p className="text-sm text-eliteMediumGray">No arguments against this position yet.</p>
              ) : (
                againstArguments.map(argument => (
                  <ArgumentCard 
                    key={argument.id} 
                    argument={argument}
                    onUpvote={() => handleVote(argument.id, true)}
                    onDownvote={() => handleVote(argument.id, false)}
                    onReply={() => handleReply(argument.id)}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div id="argument-form" className="bg-white p-6 border rounded-lg shadow-sm animate-scale-in">
        <h3 className="font-semibold text-lg mb-4">
          {replyingTo ? 'Reply to Argument' : 'Add Your Argument'}
          {replyingTo && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-eliteMediumGray"
              onClick={() => setReplyingTo(null)}
            >
              (Cancel)
            </Button>
          )}
        </h3>
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
          
          <Button 
            type="submit" 
            className="bg-elitePurple hover:bg-elitePurple/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Argument"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default DebateDetailPage;
