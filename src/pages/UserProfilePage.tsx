
import React from "react";
import { useParams } from "react-router-dom";
import { getUserByUsername, getUserDebates } from "@/data/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DebateCard from "@/components/debates/DebateCard";
import { Calendar, MessageSquare, Map, Trophy } from "lucide-react";

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  
  // In a real app, we would fetch the user profile from API
  const user = username ? getUserByUsername(username) : undefined;
  const userDebates = user ? getUserDebates(user.id) : [];
  
  if (!user) {
    return <div className="text-center py-12">User not found</div>;
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-eliteNavy to-elitePurple"></div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-md">
              {user.avatarUrl ? (
                <img 
                  src={user.avatarUrl} 
                  alt={user.fullName} 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full bg-elitePurple rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="md:flex-1">
              <h1 className="text-2xl font-bold text-eliteNavy">{user.fullName}</h1>
              <p className="text-eliteMediumGray">@{user.username}</p>
            </div>
            <Button variant="outline" className="border-elitePurple text-elitePurple hover:bg-eliteLightPurple">
              Follow
            </Button>
          </div>
          
          <div className="space-y-4">
            {user.bio && (
              <p className="text-eliteDarkGray">{user.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {user.expertiseAreas?.map((area) => (
                <Badge key={area} variant="secondary" className="bg-eliteLightPurple text-eliteNavy">
                  {area}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-eliteMediumGray">
              {user.location && (
                <div className="flex items-center">
                  <Map className="h-4 w-4 mr-1" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{userDebates.length} debates started</span>
              </div>
              <div className="flex items-center">
                <Trophy className="h-4 w-4 mr-1" />
                <span>Top 5% debater</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="debates" className="mb-6">
        <TabsList className="bg-eliteGray">
          <TabsTrigger value="debates" className="data-[state=active]:bg-white data-[state=active]:text-elitePurple">
            Debates
          </TabsTrigger>
          <TabsTrigger value="arguments" className="data-[state=active]:bg-white data-[state=active]:text-elitePurple">
            Arguments
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-white data-[state=active]:text-elitePurple">
            Achievements
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="debates" className="mt-6">
          {userDebates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userDebates.map(debate => (
                <DebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <p className="text-eliteMediumGray">This user hasn't started any debates yet.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="arguments" className="mt-6">
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-eliteMediumGray">User's arguments will be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-6">
          <div className="text-center py-12 bg-white rounded-lg border">
            <p className="text-eliteMediumGray">User's achievements will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfilePage;
