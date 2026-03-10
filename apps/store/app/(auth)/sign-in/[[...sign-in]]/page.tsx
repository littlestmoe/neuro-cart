"use client";

import { SignIn } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <main className={styles.container}>
      <section className={styles.leftPane} aria-hidden="true">
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="cartGrad"
              x1="140"
              y1="80"
              x2="140"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#6c5ce7" />
              <stop offset="100%" stopColor="#00cec9" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <pattern
            id="grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="1"
            />
          </pattern>
          <rect width="280" height="280" fill="url(#grid)" />
          <g transform="translate(140, 130)" filter="url(#glow)">
            <rect
              x="-40"
              y="-25"
              width="80"
              height="50"
              rx="8"
              fill="url(#cartGrad)"
              opacity="0.9"
            >
              <animate
                attributeName="y"
                values="-25;-30;-25"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <circle cx="-20" cy="35" r="6" fill="#6c5ce7">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="20" cy="35" r="6" fill="#00cec9">
              <animate
                attributeName="r"
                values="5;7;5"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M-15,-10 L15,-10 M-10,0 L10,0 M-5,10 L5,10"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
          <g opacity="0.5">
            <circle cx="60" cy="60" r="3" fill="#6c5ce7">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="220" cy="80" r="2" fill="#00cec9">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="80" cy="220" r="2.5" fill="#fd79a8">
              <animate
                attributeName="opacity"
                values="0.3;1;0.3"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          <text
            x="140"
            y="230"
            textAnchor="middle"
            fill="#6c5ce7"
            fontSize="20"
            fontWeight="800"
            fontFamily="DM Sans, sans-serif"
            letterSpacing="1"
          >
            Neuro Cart
          </text>
          <text
            x="140"
            y="250"
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="11"
            fontFamily="DM Sans, sans-serif"
          >
            AI-Driven Commerce
          </text>
        </svg>
      </section>
      <section className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <SignIn />
        </div>
      </section>
    </main>
  );
}
