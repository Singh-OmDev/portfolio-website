"use client";

import { useState, useEffect } from "react";
import Mascot from "@/components/Mascot";
import MatrixRain from "@/components/MatrixRain";
import CommandPalette from "@/components/CommandPalette";
import IntroScreen from "@/components/IntroScreen";
import RobotMenu from "@/components/RobotMenu";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const [isMatrixMode, setIsMatrixMode] = useState(false);

  useEffect(() => {
    const handleMatrixActivation = () => {
      setIsMatrixMode(true);
      document.body.classList.add("matrix-active");
      document.documentElement.classList.add("matrix-mode");

      // Turn off after 8 seconds
      setTimeout(() => {
        setIsMatrixMode(false);
        document.body.classList.remove("matrix-active");
        document.documentElement.classList.remove("matrix-mode");
      }, 8000);
    };

    window.addEventListener("matrix-mode-activated", handleMatrixActivation);
    return () => window.removeEventListener("matrix-mode-activated", handleMatrixActivation);
  }, []);

  return (
    <>
      <IntroScreen />
      <RobotMenu />
      <MatrixRain active={isMatrixMode} />
      <Mascot />
      <CommandPalette />
      {children}
    </>
  );
}
