
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, MessageSquare, Award, Edit, LogOut } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Define interface for Profile data
interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  website: string | null;
  created_at: string;
}

// Define interface for Debate data
interface Debate {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  created_by: string;
  status: 'active' | 'completed';
  featured: boolean;
}

// Define interface for raw argument data from Supabase
interface ArgumentRow {
  id: string;
  content: string;
  position: string;
  debate_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  debate_title?: string;
}

// Define processed Argument data used in the component
interface Argument {
  id: string;
  debateId: string;
  content: string;
  position: string;
  createdAt: Date;
  updatedAt: Date;
  debateTitle?: string;
}

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  
  // Query to fetch the profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', username],
    queryFn: async () => {
      // Get profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();
        
      if (profileError) throw profileError;
      if (!profileData) throw new Error('Profile not found');
      
      // Check if the current user is viewing their own profile
      const { data: { session } } = await supabase.auth.getSession();
      setIsCurrentUser(session?.user?.id === profileData.id);
      
      return profileData as Profile;
    }
  });
  
  // Query to fetch debates created by the user
  const { data: debates, isLoading: debatesLoading } = useQuery({
    queryKey: ['userDebates', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      const { data, error } = await supabase
        .from('debates')
        .select('*')
        .eq('created_by', profile.id);
        
      if (error) throw error;
      return data as Debate[];
    },
    enabled: !!profile?.id
  });
  
  // Query to fetch arguments posted by the user - Fixed the syntax error here
  const { data: userArguments, isLoading: argumentsLoading } = useQuery({
    queryKey: ['userArguments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      // First get arguments by user
      const { data: argumentsData, error: argumentsError } = await supabase
        .from('arguments')
        .select('*, debates(title)')
        .eq('user_id', profile.id);
        
      if (argumentsError) throw argumentsError;
      
      // Process arguments data
      const processedArguments: Argument[] = (argumentsData || []).map((arg: any) => {
        return {
          id: arg.id,
          debateId: arg.debate_id,
          content: arg.content,
          position: arg.position,
          createdAt: new Date(arg.created_at),
          updatedAt: new Date(arg.updated_at),
          debateTitle: arg.debates?.title
        };
      });
      
      return processedArguments;
    },
    enabled: !!profile?.id
  });
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error("Error signing out", {
          description: error.message
        });
        return;
      }
      
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("An unexpected error occurred");
    }
  };
  
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elitePurple"></div>
      </div>
    );
  }
  
  if (!profile) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p className="mb-6">The user you're looking for doesn't exist or has deleted their account.</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl py-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="w-full lg:w-1/3">
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-primary/30">
                    {profile.avatar_url ? (
                      <AvatarImage src={profile.avatar_url} alt={profile.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary-foreground text-2xl">
                        {profile.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {isCurrentUser && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-1 glass-button"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <h1 className="text-2xl font-bold">{profile.full_name || profile.username}</h1>
                <p className="text-muted-foreground mb-2">@{profile.username}</p>
                
                {profile.bio && (
                  <p className="text-center text-sm my-4">{profile.bio}</p>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
                
                {profile.website && (
                  <a 
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm text-primary hover:underline mb-6"
                  >
                    {profile.website}
                  </a>
                )}
                
                {isCurrentUser ? (
                  <div className="flex flex-col w-full gap-2 mt-2">
                    <Button className="bg-gradient-to-r from-elitePurple to-eliteBlue hover:opacity-90" asChild>
                      <Link to="/settings">Edit Profile</Link>
                    </Button>
                    <Button variant="outline" className="glass-button" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button className="w-full bg-gradient-to-r from-elitePurple to-eliteBlue hover:opacity-90">
                    Follow
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-center mt-6 py-4 border-t border-border/40">
                <div>
                  <p className="font-bold text-xl">{debates?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Debates</p>
                </div>
                <div>
                  <p className="font-bold text-xl">{userArguments?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Arguments</p>
                </div>
                <div>
                  <p className="font-bold text-xl">0</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Profile Content */}
        <div className="w-full lg:w-2/3">
          <Tabs defaultValue="debates" className="w-full">
            <TabsList className="w-full mb-6 bg-card/30 backdrop-blur-sm">
              <TabsTrigger value="debates" className="flex-1">Debates</TabsTrigger>
              <TabsTrigger value="arguments" className="flex-1">Arguments</TabsTrigger>
              <TabsTrigger value="awards" className="flex-1">Awards</TabsTrigger>
            </TabsList>
            
            {/* Debates Tab */}
            <TabsContent value="debates" className="space-y-4">
              {debatesLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elitePurple"></div>
                </div>
              ) : debates && debates.length > 0 ? (
                <div className="space-y-4">
                  {debates.map(debate => (
                    <Card key={debate.id} className="glass-card overflow-hidden hover-lift hover-glow">
                      <Link to={`/debates/${debate.id}`} className="block">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-bold text-lg">{debate.title}</h3>
                              <Badge variant={debate.status === 'active' ? 'default' : 'secondary'}>
                                {debate.status === 'active' ? 'Active' : 'Completed'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{debate.description}</p>
                            <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                              <span>{new Date(debate.created_at).toLocaleDateString()}</span>
                              <Badge variant="outline" className="capitalize">{debate.category}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card/30 backdrop-blur-sm rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No debates yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">This user hasn't created any debates yet.</p>
                  {isCurrentUser && (
                    <Button asChild>
                      <Link to="/debates/create">Start a Debate</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Arguments Tab */}
            <TabsContent value="arguments" className="space-y-4">
              {argumentsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-elitePurple"></div>
                </div>
              ) : userArguments && userArguments.length > 0 ? (
                <div className="space-y-4">
                  {userArguments.map(argument => (
                    <Card key={argument.id} className="glass-card overflow-hidden hover-lift">
                      <Link to={`/debates/${argument.debateId}`} className="block">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium">{argument.debateTitle || "Debate"}</h3>
                              <Badge variant={argument.position === 'for' ? 'default' : 'destructive'} className="capitalize">
                                {argument.position}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{argument.content}</p>
                            <div className="text-xs text-muted-foreground mt-2">
                              {argument.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card/30 backdrop-blur-sm rounded-lg">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium">No arguments yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">This user hasn't posted any arguments yet.</p>
                  {isCurrentUser && (
                    <Button asChild>
                      <Link to="/debates">Join a Debate</Link>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* Awards Tab */}
            <TabsContent value="awards">
              <div className="text-center py-12 bg-card/30 backdrop-blur-sm rounded-lg">
                <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">No awards yet</h3>
                <p className="text-sm text-muted-foreground">Participate in debates to earn awards!</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
