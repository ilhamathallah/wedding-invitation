"use client";
import { MotionConfig } from "framer-motion";

// Respects the visitor's "reduce motion" setting across every animation.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
