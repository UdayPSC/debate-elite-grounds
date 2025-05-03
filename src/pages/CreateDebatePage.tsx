
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { categories } from "@/data/mockData";

const CreateDebatePage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    duration: "7" // default 7 days
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would submit the form to API
    console.log("Submitting debate:", formData);
  };

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <h1 className="text-2xl md:text-3xl font-bold text-eliteNavy mb-6 text-center">Create a New Debate</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Debate Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Debate Title</Label>
                <Input 
                  id="title" 
                  name="title"
                  placeholder="Enter a clear, engaging title for your debate" 
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-eliteMediumGray">
                  A concise question or statement that clearly presents the topic to be debated.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Debate Description</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  placeholder="Provide context and background for your debate topic..." 
                  className="min-h-32 resize-none"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-eliteMediumGray">
                  Explain the context of your debate, why it matters, and what specific aspects you want participants to address.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="duration">Debate Duration</Label>
                  <Select 
                    defaultValue="7"
                    onValueChange={(value) => handleSelectChange("duration", value)}
                  >
                    <SelectTrigger id="duration">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <div className="flex justify-end gap-4">
                  <Button variant="outline" type="button">Preview</Button>
                  <Button type="submit" className="bg-elitePurple hover:bg-elitePurple/90 text-white">
                    Create Debate
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDebatePage;
