
import React from "react";
import { motion } from "framer-motion";

export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut"
    }
  }
});

export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren
    }
  }
});

export const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay,
      duration: 0.5,
      ease: "easeOut"
    }
  }
});

interface MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: "fadeIn" | "scaleIn" | "none";
}

export const MotionSection = ({
  children,
  className = "",
  delay = 0,
  animation = "fadeIn"
}: MotionProps) => {
  const variants = animation === "fadeIn" 
    ? fadeIn(delay) 
    : animation === "scaleIn" 
      ? scaleIn(delay) 
      : {};

  return (
    <motion.section
      initial={animation !== "none" ? "hidden" : undefined}
      animate={animation !== "none" ? "visible" : undefined}
      variants={variants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export const MotionDiv = ({
  children,
  className = "",
  delay = 0,
  animation = "fadeIn"
}: MotionProps) => {
  const variants = animation === "fadeIn" 
    ? fadeIn(delay) 
    : animation === "scaleIn" 
      ? scaleIn(delay) 
      : {};

  return (
    <motion.div
      initial={animation !== "none" ? "hidden" : undefined}
      animate={animation !== "none" ? "visible" : undefined}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ 
  children,
  className = "",
  staggerDelay = 0.1,
  containerDelay = 0
}: {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  containerDelay?: number;
}) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer(staggerDelay, containerDelay)}
    className={className}
  >
    {children}
  </motion.div>
);
