
import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";
import { Debate, getUser } from "@/data/mockData";

interface DebateCardProps {
  debate: Debate;
  featured?: boolean;
}

const DebateCard: React.FC<DebateCardProps> = ({ debate, featured = false }) => {
  const creator = getUser(debate.createdBy);
  
  const timeRemaining = () => {
    const now = new Date();
    const diff = debate.endsAt.getTime() - now.getTime();
    
    // If debate has ended
    if (diff <= 0) return "Debate ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} left`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''} left`;
    }
  };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all ${featured ? 'border-elitePurple' : ''}`}>
      <CardContent className={`p-0`}>
        <Link to={`/debates/${debate.id}`}>
          <div className={`${featured ? 'bg-eliteLightPurple text-eliteNavy p-2 text-xs font-medium' : 'hidden'}`}>
            FEATURED DEBATE
          </div>
          <div className="p-5">
            <div className="flex justify-between items-start">
              <Badge variant="outline" className={`mb-2 ${
                debate.category === 'Technology' ? 'bg-blue-50 text-blue-700 border-blue-300' : 
                debate.category === 'Politics' ? 'bg-red-50 text-red-700 border-red-300' :
                debate.category === 'Science' ? 'bg-green-50 text-green-700 border-green-300' :
                debate.category === 'Economics' ? 'bg-yellow-50 text-yellow-700 border-yellow-300' :
                debate.category === 'Social Issues' ? 'bg-purple-50 text-purple-700 border-purple-300' :
                'bg-gray-50 text-gray-700 border-gray-300'
              }`}>
                {debate.category}
              </Badge>
              <div className="flex items-center text-xs text-eliteMediumGray">
                <Clock className="h-3 w-3 mr-1" />
                {timeRemaining()}
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2 text-eliteNavy line-clamp-2">{debate.title}</h3>
            <p className="text-sm text-eliteMediumGray line-clamp-2 mb-4">{debate.description}</p>
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center">
                <div className="bg-elitePurple text-white rounded-full h-6 w-6 flex items-center justify-center mr-2">
                  {creator?.fullName.charAt(0)}
                </div>
                <span className="text-eliteDarkGray">by {creator?.username}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  <span>{debate.argumentCount} arguments</span>
                </div>
                <div className="flex items-center">
                  <span>• {debate.participantCount} participants</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default DebateCard;
