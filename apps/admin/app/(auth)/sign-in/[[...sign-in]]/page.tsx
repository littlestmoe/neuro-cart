"use client";

import { SignIn } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function AdminSignInPage() {
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
              id="adminGrad"
              x1="140"
              y1="80"
              x2="140"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#e74c3c" />
              <stop offset="100%" stopColor="#6c5ce7" />
            </linearGradient>
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
          <g transform="translate(140, 125)">
            <path
              d="M0,-35 L30,15 L-30,15 Z"
              fill="url(#adminGrad)"
              opacity="0.9"
            >
              <animate
                attributeName="d"
                values="M0,-35 L30,15 L-30,15 Z; M0,-40 L33,18 L-33,18 Z; M0,-35 L30,15 L-30,15 Z"
                dur="3s"
                repeatCount="indefinite"
              />
            </path>
            <text
              x="0"
              y="8"
              textAnchor="middle"
              fill="#fff"
              fontSize="18"
              fontWeight="700"
            >
              !
            </text>
            <circle
              r="45"
              fill="none"
              stroke="#e74c3c"
              strokeWidth="1"
              strokeDasharray="4 8"
              opacity="0.25"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0;360"
                dur="15s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
          <text
            x="140"
            y="225"
            textAnchor="middle"
            fill="#e74c3c"
            fontSize="20"
            fontWeight="800"
            fontFamily="DM Sans, sans-serif"
          >
            Admin Panel
          </text>
          <text
            x="140"
            y="245"
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="11"
            fontFamily="DM Sans, sans-serif"
          >
            Platform Management
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
