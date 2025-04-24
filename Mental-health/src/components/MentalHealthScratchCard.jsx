import React, { useEffect, useRef } from "react";

import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import * as ScratchCard from "scratchcard-js"; // ✅ fixed import

useEffect(() => {
  const sc = new ScratchCard.default("#scratch-container", {
    scratchType: 'brush',
    containerWidth: 320,
    containerHeight: 200,
    clearZoneRadius: 30,
    percentToFinish: 40,

    htmlBackground: `
      <div style="
        background: linear-gradient(135deg, #fef6ff, #dcd3ff);
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        font-family: 'Segoe UI', sans-serif;
      ">
        <h2 style="color:#6a4eeb; font-size: 24px; margin: 0;">Your Mental Health</h2>
        <p style="color:#444; font-size: 20px;">Matters 💜</p>
      </div>
    `,
    htmlForeground: `
      <div style="
        background: repeating-linear-gradient(
          45deg,
          #ccc,
          #ccc 10px,
          #bbb 10px,
          #bbb 20px
        );
        width: 100%;
        height: 100%;
      "></div>
    `,
    callback: () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      console.log("Scratch complete!");
    },
  });

  sc.init();
}, []);
