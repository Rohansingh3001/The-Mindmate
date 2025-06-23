"use client";

import React from "react";
import { Particles } from "@/components/ui/particles"; // adjust import if needed

const ParticleBackground = ({
  color = "#ffffff",
  quantity = 80, // Decent amount, not too dense
  staticity = 60,
  ease = 40,
  size = 0.5,
  vx = 0.03,
  vy = 0.03,
}) => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <Particles
        color={color}
        quantity={quantity}
        staticity={staticity}
        ease={ease}
        size={size}
        vx={vx}
        vy={vy}
        className="w-full h-full"
      />
    </div>
  );
};

export default ParticleBackground;
