
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

interface ArgumentUser {
  username: string;
  avatarUrl?: string;
}

export interface Argument {
  id: string;
  debateId: string;
  userId: string;
  position: 'for' | 'against';
  content: string;
  createdAt: Date;
  updatedAt: Date;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  user: ArgumentUser;
}

interface ArgumentCardProps {
  argument: Argument;
  onUpvote?: (argumentId: string) => void;
  onDownvote?: (argumentId: string) => void;
  onReply?: (argumentId: string) => void;
}

const ArgumentCard: React.FC<ArgumentCardProps> = ({ argument, onUpvote, onDownvote, onReply }) => {
  const formatDate = (date: Date) => {
    if (!date || isNaN(date.getTime())) {
      return 'Unknown date';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleUpvote = async () => {
    try {
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("You must be logged in to vote");
        return;
      }

      if (onUpvote) {
        onUpvote(argument.id);
      }
    } catch (error) {
      console.error("Error upvoting:", error);
      toast.error("Failed to upvote");
    }
  };

  const handleDownvote = async () => {
    try {
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("You must be logged in to vote");
        return;
      }

      if (onDownvote) {
        onDownvote(argument.id);
      }
    } catch (error) {
      console.error("Error downvoting:", error);
      toast.error("Failed to downvote");
    }
  };

  const handleReply = async () => {
    try {
      // Check if user is logged in
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("You must be logged in to reply");
        return;
      }

      if (onReply) {
        onReply(argument.id);
      }
    } catch (error) {
      console.error("Error setting up reply:", error);
      toast.error("Failed to set up reply");
    }
  };

  return (
    <Card className={cn(
      "mb-4 border-l-4 animate-fade-in",
      argument.position === "for" ? "border-l-green-500" : "border-l-red-500"
    )}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center">
            <div className="bg-eliteNavy text-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
              {argument.user.username?.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-medium text-sm">{argument.user.username}</p>
              <p className="text-xs text-eliteMediumGray">@{argument.user.username} • {formatDate(argument.createdAt)}</p>
            </div>
          </div>
          <div className="px-2 py-1 rounded text-xs font-medium">
            {argument.position === "for" ? (
              <span className="text-green-600">For</span>
            ) : (
              <span className="text-red-600">Against</span>
            )}
          </div>
        </div>
        
        <p className="text-sm text-eliteDarkGray mb-4">{argument.content}</p>
        
        <div className="flex space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-eliteMediumGray hover:text-green-600 hover:bg-green-50 flex items-center text-xs",
              argument.votes.userVote === 'up' && "text-green-600 bg-green-50"
            )}
            onClick={handleUpvote}
          >
            <ThumbsUp className="h-3 w-3 mr-1" /> {argument.votes.upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "text-eliteMediumGray hover:text-red-600 hover:bg-red-50 flex items-center text-xs",
              argument.votes.userVote === 'down' && "text-red-600 bg-red-50"
            )}
            onClick={handleDownvote}
          >
            <ThumbsDown className="h-3 w-3 mr-1" /> {argument.votes.downvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-eliteMediumGray hover:text-elitePurple hover:bg-eliteLightPurple flex items-center text-xs"
            onClick={handleReply}
          >
            <Reply className="h-3 w-3 mr-1" /> Reply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArgumentCard;
