
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Argument, getUser } from "@/data/mockData";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArgumentCardProps {
  argument: Argument;
}

const ArgumentCard: React.FC<ArgumentCardProps> = ({ argument }) => {
  const user = getUser(argument.userId);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
              {user?.fullName.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.fullName}</p>
              <p className="text-xs text-eliteMediumGray">@{user?.username} • {formatDate(argument.createdAt)}</p>
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
            className="text-eliteMediumGray hover:text-green-600 hover:bg-green-50 flex items-center text-xs"
          >
            <ThumbsUp className="h-3 w-3 mr-1" /> {argument.votes.upvotes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-eliteMediumGray hover:text-red-600 hover:bg-red-50 flex items-center text-xs"
          >
            <ThumbsDown className="h-3 w-3 mr-1" /> {argument.votes.downvotes}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArgumentCard;
