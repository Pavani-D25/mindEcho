"use client";

import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = React.memo(function BackgroundBeams({
  className,
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip)">
          <g filter="url(#filter)">
            <path
              d="M200 200L50 100L350 100L200 200Z"
              fill="url(#beam1)"
              fillOpacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="20s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M200 200L100 50L100 350L200 200Z"
              fill="url(#beam2)"
              fillOpacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="25s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M200 200L350 300L50 300L200 200Z"
              fill="url(#beam3)"
              fillOpacity="0.6"
            >
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 200 200"
                to="360 200 200"
                dur="30s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
        <defs>
          <filter
            id="filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            filterUnits="objectBoundingBox"
            primitiveUnits="userSpaceOnUse"
            colorInterpolationFilters="linearRGB"
          >
            <feGaussianBlur
              stdDeviation="5"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              in="SourceGraphic"
              edgeMode="none"
              result="blur"
            />
          </filter>
          <linearGradient
            id="beam1"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="#18CCFC" stopOpacity="0" />
            <stop offset="50%" stopColor="#18CCFC" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6344F5" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="beam2"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="#FBCF33" stopOpacity="0" />
            <stop offset="50%" stopColor="#FBCF33" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FF8856" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="beam3"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="#FF8856" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF8856" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#18CCFC" stopOpacity="0" />
          </linearGradient>
          <clipPath id="clip">
            <rect width="400" height="400" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
});