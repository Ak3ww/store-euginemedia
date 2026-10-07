"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

interface CheckoutStepsProps {
  activeStep: number; // 0: BAG, 1: DELIVERY, 2: PAYMENT, 3: ORDER COMPLETE
}

export default function CheckoutSteps({ activeStep }: CheckoutStepsProps) {
  const steps = [
    { label: "BAG", href: "/cart" },
    { label: "DELIVERY", href: "/checkout" },
    { label: "PAYMENT", href: "/checkout" },
    { label: "ORDER COMPLETE", href: "#" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      <div className="flex items-center justify-between relative">
        {/* Connector Line behind steps */}
        <div className="absolute top-5 left-8 right-8 h-[3px] bg-neutral-200 -z-0">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{
              width: `${(Math.min(activeStep, 3) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {steps.map((step, idx) => {
          const isCompleted = idx < activeStep;
          const isActive = idx === activeStep;
          const isPending = idx > activeStep;

          return (
            <div key={step.label} className="flex flex-col items-center relative z-10">
              {/* Circle Icon */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-['Archivo'] text-sm font-bold transition-all duration-200 border-2 ${
                  isActive
                    ? "bg-[#ed1c24] text-white border-white shadow-md scale-110"
                    : isCompleted
                    ? "bg-black text-white border-white"
                    : "bg-neutral-300 text-neutral-600 border-white"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 text-white" /> : idx + 1}
              </div>

              {/* Step Label */}
              <span
                className={`mt-2 font-['Archivo'] text-[11px] sm:text-xs font-bold tracking-wider uppercase ${
                  isActive
                    ? "text-[#ed1c24]"
                    : isCompleted
                    ? "text-black"
                    : "text-neutral-400"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
