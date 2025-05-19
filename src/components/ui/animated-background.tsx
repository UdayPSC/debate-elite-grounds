
import React from "react";

export const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-background/70 dark:from-background dark:to-background/50" />
      
      {/* Animated circles */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 animate-float blur-3xl" />
      <div className="absolute top-1/3 right-1/3 w-96 h-96 rounded-full bg-primary/10 animate-float-delay blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-primary/5 animate-float-slow blur-3xl" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(155,135,245,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(155,135,245,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
    </div>
  );
};

export const GlassCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <div className={`glass-card ${className}`}>
      {children}
    </div>
  );
};
