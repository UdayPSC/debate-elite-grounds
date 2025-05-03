
// Mock data for development

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  location?: string;
  bio?: string;
  expertiseAreas?: string[];
  createdAt: Date;
  avatarUrl?: string;
  socialLinks?: Record<string, string>;
}

export interface Debate {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string;
  createdAt: Date;
  endsAt: Date;
  status: 'active' | 'completed';
  participantCount: number;
  argumentCount: number;
  featured?: boolean;
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
  };
}

export interface Vote {
  id: string;
  argumentId: string;
  userId: string;
  voteType: boolean;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  earnedAt: Date;
}

export const mockUsers: User[] = [
  {
    id: "1",
    username: "sophialogic",
    email: "sophia@example.com",
    fullName: "Sophia Chen",
    location: "San Francisco, CA",
    bio: "Tech ethicist and AI researcher with a passion for thoughtful debate on emerging technologies.",
    expertiseAreas: ["AI Ethics", "Technology", "Philosophy"],
    createdAt: new Date("2023-01-15"),
    avatarUrl: "https://i.pravatar.cc/150?img=1",
    socialLinks: {
      twitter: "https://twitter.com/sophialogic",
      linkedin: "https://linkedin.com/in/sophialogic"
    }
  },
  {
    id: "2",
    username: "marcus_aurelius",
    email: "marcus@example.com",
    fullName: "Marcus Johnson",
    location: "Chicago, IL",
    bio: "Political scientist specializing in comparative politics. I believe in evidence-based discourse.",
    expertiseAreas: ["Politics", "History", "International Relations"],
    createdAt: new Date("2023-02-10"),
    avatarUrl: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "3",
    username: "quantum_clara",
    email: "clara@example.com",
    fullName: "Clara Oswald",
    location: "Boston, MA",
    bio: "Physicist exploring the frontiers of quantum mechanics and its philosophical implications.",
    expertiseAreas: ["Physics", "Science", "Quantum Theory"],
    createdAt: new Date("2023-01-05"),
    avatarUrl: "https://i.pravatar.cc/150?img=3",
    socialLinks: {
      twitter: "https://twitter.com/quantum_clara"
    }
  },
  {
    id: "4",
    username: "ethical_techie",
    email: "james@example.com",
    fullName: "James Wilson",
    location: "Austin, TX",
    bio: "Software engineer concerned with the societal impacts of technology. Advocate for digital rights.",
    expertiseAreas: ["Technology", "Ethics", "Privacy"],
    createdAt: new Date("2023-03-20"),
    avatarUrl: "https://i.pravatar.cc/150?img=4"
  }
];

export const mockDebates: Debate[] = [
  {
    id: "1",
    title: "Should AI development be regulated by international law?",
    description: "As artificial intelligence capabilities advance rapidly, should we implement international legal frameworks to govern its development and deployment? What are the implications for innovation, safety, and global cooperation?",
    category: "Technology",
    createdBy: "1",
    createdAt: new Date("2024-04-25"),
    endsAt: new Date("2024-05-10"),
    status: "active",
    participantCount: 24,
    argumentCount: 18,
    featured: true
  },
  {
    id: "2",
    title: "Is universal basic income a viable solution to automation-induced unemployment?",
    description: "As automation replaces jobs across various sectors, would universal basic income effectively address the resulting economic disruption? What are the economic and social implications?",
    category: "Economics",
    createdBy: "3",
    createdAt: new Date("2024-04-28"),
    endsAt: new Date("2024-05-12"),
    status: "active",
    participantCount: 16,
    argumentCount: 12
  },
  {
    id: "3",
    title: "Should social media platforms be responsible for moderating misinformation?",
    description: "With the rise of fake news and misinformation, should social media companies be legally obligated to moderate content on their platforms? Where is the line between free speech and harmful content?",
    category: "Social Issues",
    createdBy: "4",
    createdAt: new Date("2024-04-30"),
    endsAt: new Date("2024-05-15"),
    status: "active",
    participantCount: 32,
    argumentCount: 28
  },
  {
    id: "4",
    title: "Is nuclear energy the solution to climate change?",
    description: "Given the urgent need to reduce carbon emissions, should we invest more heavily in nuclear power as a clean energy alternative? What are the risks and benefits compared to other renewable sources?",
    category: "Science",
    createdBy: "2",
    createdAt: new Date("2024-05-01"),
    endsAt: new Date("2024-05-16"),
    status: "active",
    participantCount: 20,
    argumentCount: 16
  },
  {
    id: "5",
    title: "Should voting be mandatory in democratic countries?",
    description: "Would compulsory voting strengthen democratic participation or undermine freedom of choice? What can we learn from countries that have implemented mandatory voting?",
    category: "Politics",
    createdBy: "2",
    createdAt: new Date("2024-05-02"),
    endsAt: new Date("2024-05-17"),
    status: "active",
    participantCount: 18,
    argumentCount: 14
  }
];

export const mockArguments: Argument[] = [
  {
    id: "1",
    debateId: "1",
    userId: "4",
    position: "for",
    content: "International AI regulation is essential to prevent a dangerous race to the bottom in safety standards. Without global coordination, countries might prioritize development speed over safety protocols, potentially leading to catastrophic outcomes with advanced AI systems.",
    createdAt: new Date("2024-04-26"),
    updatedAt: new Date("2024-04-26"),
    votes: {
      upvotes: 15,
      downvotes: 3
    }
  },
  {
    id: "2",
    debateId: "1",
    userId: "3",
    position: "against",
    content: "Premature regulation would stifle innovation and give advantages to countries that don't comply. AI is still rapidly evolving, and rigid international frameworks would likely be based on insufficient understanding of future capabilities, potentially hampering beneficial developments.",
    createdAt: new Date("2024-04-27"),
    updatedAt: new Date("2024-04-27"),
    votes: {
      upvotes: 12,
      downvotes: 5
    }
  },
  {
    id: "3",
    debateId: "1",
    userId: "2",
    position: "for",
    content: "Effective regulation doesn't mean stopping innovation; it means directing it responsibly. International standards could help ensure AI development benefits humanity broadly rather than exacerbating existing inequalities or introducing new risks.",
    createdAt: new Date("2024-04-28"),
    updatedAt: new Date("2024-04-28"),
    votes: {
      upvotes: 18,
      downvotes: 2
    }
  },
  {
    id: "4",
    debateId: "1",
    userId: "1",
    position: "against",
    content: "The technical complexity of AI makes effective international regulation nearly impossible. Most policymakers lack the technical understanding to craft meaningful regulations, and by the time consensus is reached, the technology will have already advanced beyond the framework.",
    createdAt: new Date("2024-04-28"),
    updatedAt: new Date("2024-04-29"),
    votes: {
      upvotes: 10,
      downvotes: 7
    }
  }
];

export const categories = [
  "Technology",
  "Politics",
  "Science",
  "Economics",
  "Social Issues",
  "Philosophy",
  "Environment",
  "Education",
  "Healthcare",
  "International Relations"
];

export const getUser = (userId: string): User | undefined => {
  return mockUsers.find(user => user.id === userId);
};

export const getUserByUsername = (username: string): User | undefined => {
  return mockUsers.find(user => user.username === username);
};

export const getDebate = (debateId: string): Debate | undefined => {
  return mockDebates.find(debate => debate.id === debateId);
};

export const getDebateArguments = (debateId: string): Argument[] => {
  return mockArguments.filter(argument => argument.debateId === debateId);
};

export const getUserDebates = (userId: string): Debate[] => {
  return mockDebates.filter(debate => debate.createdBy === userId);
};
