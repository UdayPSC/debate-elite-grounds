
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="py-12 md:py-20 relative">
        <div className="relative z-10 text-center space-y-6 max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-elitePurple to-eliteBlue bg-clip-text text-transparent">
            Elite minds debate with evidence and reason
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            Join a community where ideas are challenged, refined, and elevated through structured, 
            respectful debate based on evidence and sound reasoning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="bg-elitePurple hover:bg-elitePurple/90" asChild>
              <Link to="/debates">Explore Debates</Link>
            </Button>
            <Button size="lg" variant="outline" className="glass-button" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Elite Minds?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 hover-lift hover-glow">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-elitePurple to-eliteBlue flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M3 12h18"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Structured Debates</h3>
              <p className="text-foreground/70 text-center">
                Clear format with propositions, rebuttals, and conclusions that encourage well-constructed arguments.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card p-6 hover-lift hover-glow">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-elitePurple to-eliteBlue flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v4l2 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Real-time Engagement</h3>
              <p className="text-foreground/70 text-center">
                Participate in live debates with typing indicators, reactions, and instant updates.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card p-6 hover-lift hover-glow">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-elitePurple to-eliteBlue flex items-center justify-center mb-4 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                  <circle cx="17" cy="7" r="5"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">Evidence-Based</h3>
              <p className="text-foreground/70 text-center">
                Support arguments with citations, links, and references for a more credible debate experience.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-elitePurple/20 to-eliteBlue/20 rounded-3xl mx-4 md:mx-12 -z-10"></div>
        <div className="relative glass-card mx-4 md:mx-12 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold">Ready to join the conversation?</h2>
            <p className="text-lg text-foreground/70">
              Create an account today and start engaging with top minds on topics that matter.
            </p>
          </div>
          <Button size="lg" className="bg-elitePurple hover:bg-elitePurple/90 min-w-40" asChild>
            <Link to="/register">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
