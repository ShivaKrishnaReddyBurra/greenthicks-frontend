"use client";

import { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";

export default function SuccessAnimation() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animation after a small delay
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Outer circle animation */}
      <div
        className={`absolute w-24 h-24 rounded-full border-4 border-green-500
        ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        transition-all duration-700 ease-out`}
      />

      {/* Middle circle animation */}
      <div
        className={`absolute w-20 h-20 rounded-full bg-green-100
        ${animate ? "scale-100 opacity-100" : "scale-50 opacity-0"}
        transition-all duration-500 delay-200 ease-out`}
      />

      {/* Check mark animation */}
      <CheckCircle
        className={`relative z-10 w-16 h-16 text-green-600
        ${animate ? "scale-100 opacity-100" : "scale-0 opacity-0"}
        transition-all duration-500 delay-500`}
      />

      {/* Particles animation */}
      {animate && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full animate-particle"
              style={{
                animationDelay: `${i * 100}ms`,
                transform: `rotate(${i * 45}deg) translateY(-16px)`,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
