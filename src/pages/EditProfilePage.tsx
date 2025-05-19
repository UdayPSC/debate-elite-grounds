
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Upload, User } from "lucide-react";

interface ProfileData {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null; 
  website: string | null;
  expertise_areas: string[] | null;
}

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    id: "",
    username: "",
    full_name: "",
    avatar_url: null,
    bio: "",
    location: "",
    website: "",
    expertise_areas: []
  });
  
  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      
      try {
        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          toast.error("You must be logged in to edit your profile");
          return;
        }
        
        setUserId(session.user.id);
        
        // Get profile data
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProfile({
            id: data.id,
            username: data.username || "",
            full_name: data.full_name || "",
            avatar_url: data.avatar_url,
            bio: data.bio || "",
            location: data.location || "",
            website: data.website || "",
            expertise_areas: data.expertise_areas || []
          });
          
          if (data.avatar_url) {
            setAvatarPreview(data.avatar_url);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    
    getProfile();
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setAvatarPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // First upload avatar if changed
      let avatarUrl = profile.avatar_url;
      
      if (avatarFile && userId) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `avatars/${userId}/${Date.now()}.${fileExt}`;
        
        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatarFile, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: urlData } = await supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
          
        avatarUrl = urlData.publicUrl;
      }
      
      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          bio: profile.bio,
          avatar_url: avatarUrl,
          location: profile.location,
          website: profile.website,
          expertise_areas: profile.expertise_areas,
          updated_at: new Date().toISOString()
        })
        .eq("id", profile.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      navigate(`/profile/${profile.username}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-elitePurple"></div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          className="flex items-center text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <Card className="glass-card shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
          <CardDescription>
            Update your personal information and profile settings
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Avatar upload */}
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt={profile.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary-foreground text-2xl">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label 
                    htmlFor="avatar" 
                    className="absolute -bottom-2 -right-2 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Upload avatar</span>
                  </label>
                  <input 
                    id="avatar" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Click icon to upload a profile picture
                </p>
              </div>
              
              {/* Username - Read only */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username" 
                  name="username" 
                  value={profile.username} 
                  readOnly 
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Username cannot be changed</p>
              </div>
              
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input 
                  id="full_name" 
                  name="full_name" 
                  value={profile.full_name || ""}
                  onChange={handleChange}
                  placeholder="Your full name"
                />
              </div>
              
              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  name="bio" 
                  value={profile.bio || ""}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </div>
              
              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={profile.location || ""}
                  onChange={handleChange}
                  placeholder="City, Country"
                />
              </div>
              
              {/* Website */}
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website" 
                  value={profile.website || ""}
                  onChange={handleChange}
                  placeholder="https://your-website.com"
                />
              </div>
            </div>
            
            <CardFooter className="flex justify-end space-x-4 px-0 pt-6 pb-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/profile/${profile.username}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={saving} 
                className="bg-elitePurple hover:bg-elitePurple/90"
              >
                {saving ? (
                  <>
                    <div className="mr-2 size-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProfilePage;
