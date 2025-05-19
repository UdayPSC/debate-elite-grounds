import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import DebateCard from "@/components/debates/DebateCard";
import ArgumentCard, { Argument } from "@/components/debates/ArgumentCard";
import { Calendar, MessageSquare, Map, Trophy, Pencil, User, Settings, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/sonner";
import { Database } from "@/integrations/supabase/types";

type Profile = Database['public']['Tables']['profiles']['Row'];
type Debate = Database['public']['Tables']['debates']['Row'];

interface ArgumentRow {
  id: string;
  debate_id: string;
  user_id: string;
  position: string;
  content: string;
  created_at: string;
  updated_at: string;
  debate?: {
    title?: string;
  };
}

const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userDebates, setUserDebates] = useState<Debate[]>([]);
  const [editForm, setEditForm] = useState({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    expertise_areas: [] as string[],
    newExpertiseArea: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUserVotes, setCurrentUserVotes] = useState<Record<string, 'up' | 'down' | null>>({});
  
  // Fetch current user
  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionData.session.user.id)
        .single();
        
      if (error) return null;
      return data as Profile;
    }
  });
  
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
  
  // Initialize edit form when profile is loaded
  useEffect(() => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name || '',
        username: profile.username || '',
        bio: profile.bio || '',
        location: profile.location || '',
        expertise_areas: profile.expertise_areas || [],
        newExpertiseArea: ''
      });
    }
  }, [profile]);
  
  // Check if this is the current user's profile
  useEffect(() => {
    const checkCurrentUser = async () => {
      if (profile && currentUser) {
        setIsCurrentUser(profile.id === currentUser.id);
      }
    };
    
    checkCurrentUser();
  }, [profile, currentUser]);
  
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
  
  // Fetch user's arguments
  const { data: userArguments, isLoading: isArgumentsLoading } = useQuery({
    queryKey: ['userArguments', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      
      // First get arguments
      const { data: argumentsData, error: argumentsError } = await supabase
        .from('arguments')
        .select('*, debate:debate_id(title)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (argumentsError) {
        console.error("Error fetching user arguments:", argumentsError);
        throw argumentsError;
      }

      // Process arguments
      const processedArguments: Argument[] = (argumentsData || []).map((arg: ArgumentRow) => {
        return {
          id: arg.id,
          debateId: arg.debate_id,
          userId: arg.user_id,
          position: arg.position as 'for' | 'against',
          content: arg.content,
          createdAt: new Date(arg.created_at || ''),
          updatedAt: new Date(arg.updated_at || ''),
          votes: {
            upvotes: 0,
            downvotes: 0,
            userVote: null
          },
          user: {
            username: profile.username || 'Unknown',
            avatarUrl: profile.avatar_url || undefined
          },
          debateTitle: arg.debate?.title || 'Unknown Debate'
        };
      });
      
      return processedArguments;
    },
    enabled: !!profile?.id
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addExpertiseArea = () => {
    if (editForm.newExpertiseArea.trim() && !editForm.expertise_areas.includes(editForm.newExpertiseArea.trim())) {
      setEditForm(prev => ({
        ...prev,
        expertise_areas: [...prev.expertise_areas, prev.newExpertiseArea.trim()],
        newExpertiseArea: ''
      }));
    }
  };
  
  const removeExpertiseArea = (area: string) => {
    setEditForm(prev => ({
      ...prev,
      expertise_areas: prev.expertise_areas.filter(a => a !== area)
    }));
  };
  
  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Check username uniqueness if changed
      if (editForm.username !== profile?.username) {
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', editForm.username)
          .neq('id', currentUser.id)
          .maybeSingle();
          
        if (existingUser) {
          toast.error("Username is already taken");
          setIsSubmitting(false);
          return;
        }
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          username: editForm.username,
          bio: editForm.bio,
          location: editForm.location,
          expertise_areas: editForm.expertise_areas
        })
        .eq('id', currentUser.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setIsEditDialogOpen(false);
      
      // If username changed, navigate to new profile URL
      if (editForm.username !== username) {
        navigate(`/profile/${editForm.username}`);
      }
      
      // Invalidate cache to refresh data
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['profile', editForm.username] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isProfileLoading) {
    return <div className="flex justify-center items-center py-12">Loading profile...</div>;
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
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 animate-fade-in">
        <div className="h-40 bg-gradient-to-r from-eliteNavy via-elitePurple to-indigo-500 relative">
          {isCurrentUser && (
            <Button 
              onClick={() => setIsEditDialogOpen(true)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border border-white/30"
              size="sm"
            >
              <Pencil className="h-4 w-4 mr-2" /> Edit Profile
            </Button>
          )}
        </div>
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16 mb-6">
            <div className="h-32 w-32 rounded-full bg-white p-2 shadow-lg">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || profile.username} 
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-elitePurple to-eliteNavy rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {(profile.full_name || profile.username).charAt(0)}
                </div>
              )}
            </div>
            <div className="md:flex-1">
              <h1 className="text-2xl font-bold text-eliteNavy">{profile.full_name || ''}</h1>
              <p className="text-eliteMediumGray">@{profile.username}</p>
            </div>
            {!isCurrentUser && (
              <Button className="bg-elitePurple hover:bg-elitePurple/90 text-white transition-all">
                Follow
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {profile.bio && (
              <p className="text-eliteDarkGray">{profile.bio}</p>
            )}
            
            <div className="flex flex-wrap gap-2">
              {profile.expertise_areas?.map((area) => (
                <Badge key={area} variant="secondary" className="bg-eliteLightPurple text-elitePurple border border-elitePurple/20">
                  {area}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-eliteMediumGray mt-4 pt-4 border-t">
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
      
      {/* Profile Content */}
      <Tabs defaultValue="debates" className="mb-6 animate-fade-in">
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
              <User className="mx-auto h-12 w-12 text-eliteMediumGray/30 mb-2" />
              <p className="text-eliteMediumGray">This user hasn't started any debates yet.</p>
              {isCurrentUser && (
                <Button 
                  onClick={() => navigate('/debates/create')} 
                  className="mt-4 bg-elitePurple hover:bg-elitePurple/90 text-white"
                >
                  Start a Debate
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="arguments" className="mt-6">
          {isArgumentsLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-elitePurple" />
            </div>
          ) : userArguments && userArguments.length > 0 ? (
            <div className="space-y-4">
              {userArguments.map(argument => (
                <div key={argument.id} className="bg-white rounded-lg border p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm text-eliteMediumGray">
                      On debate: <span className="text-eliteNavy cursor-pointer hover:underline" onClick={() => navigate(`/debates/${argument.debateId}`)}>{argument.debateTitle}</span>
                    </h4>
                    <Badge variant="outline" className={argument.position === 'for' ? 'text-green-600 border-green-300 bg-green-50' : 'text-red-600 border-red-300 bg-red-50'}>
                      {argument.position === 'for' ? 'For' : 'Against'}
                    </Badge>
                  </div>
                  <p className="text-sm text-eliteDarkGray mb-2">{argument.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-eliteMediumGray">
                      {new Date(argument.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-elitePurple hover:bg-eliteLightPurple"
                      onClick={() => navigate(`/debates/${argument.debateId}`)}
                    >
                      Go to Debate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border">
              <MessageSquare className="mx-auto h-12 w-12 text-eliteMediumGray/30 mb-2" />
              <p className="text-eliteMediumGray">No arguments by this user yet.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="achievements" className="mt-6">
          <div className="text-center py-12 bg-white rounded-lg border">
            <Trophy className="mx-auto h-12 w-12 text-eliteMediumGray/30 mb-2" />
            <p className="text-eliteMediumGray">User's achievements will be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information visible to other users.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                value={editForm.full_name}
                onChange={handleInputChange}
                placeholder="Your full name"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                placeholder="username"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={editForm.bio}
                onChange={handleInputChange}
                placeholder="Tell others about yourself..."
                className="resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editForm.location}
                onChange={handleInputChange}
                placeholder="Your location"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Expertise Areas</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editForm.expertise_areas.map(area => (
                  <Badge key={area} variant="secondary" className="group">
                    {area}
                    <button 
                      type="button"
                      onClick={() => removeExpertiseArea(area)}
                      className="ml-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="newExpertiseArea"
                  name="newExpertiseArea"
                  value={editForm.newExpertiseArea}
                  onChange={handleInputChange}
                  placeholder="Add expertise (e.g., Technology, Politics)"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={addExpertiseArea}
                  disabled={!editForm.newExpertiseArea.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveProfile} 
              className="bg-elitePurple hover:bg-elitePurple/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfilePage;
