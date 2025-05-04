
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DebateCard from "@/components/debates/DebateCard";
import { Calendar, MessageSquare, Map, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Debate = Database['public']['Tables']['debates']['Row'];

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [userDebates, setUserDebates] = useState<Debate[]>([]);
  
  // Fetch user profile from Supabase
  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      if (!username) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .maybeSingle();
        
      if (error) throw error;
      return data as Profile | null;
    }
  });
  
  // Fetch user's debates once we have the profile
  useEffect(() => {
    const fetchUserDebates = async () => {
      if (profile?.id) {
        const { data, error } = await supabase
          .from('debates')
          .select('*')
          .eq('created_by', profile.id)
          .order('created_at', { ascending: false });
          
        if (!error && data) {
          setUserDebates(data as Debate[]);
        }
      }
    };
    
    fetchUserDebates();
  }, [profile?.id]);
  
  if (isProfileLoading) {
    return <div className="text-center py-12">Loading profile...</div>;
  }
  
  if (profileError || !profile) {
    return <div className="text-center py-12">User not found</div>;
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
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
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || profile.username} 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full bg-elitePurple rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(profile.full_name || profile.username).charAt(0)}
                </div>
              )}
            </div>
            <div className="md:flex-1">
              <h1 className="text-2xl font-bold text-eliteNavy">{profile.full_name || ''}</h1>
              <p className="text-eliteMediumGray">@{profile.username}</p>
            </div>
            <Button variant="outline" className="border-elitePurple text-elitePurple hover:bg-eliteLightPurple">
              Follow
            </Button>
          </div>
          
          <div className="space-y-4">
            {profile.bio && (
              <p className="text-eliteDarkGray">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {profile.expertise_areas?.map((area) => (
                <Badge key={area} variant="secondary" className="bg-eliteLightPurple text-eliteNavy">
                  {area}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-eliteMediumGray">
              {profile.location && (
                <div className="flex items-center">
                  <Map className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Joined {formatDate(profile.created_at)}</span>
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
