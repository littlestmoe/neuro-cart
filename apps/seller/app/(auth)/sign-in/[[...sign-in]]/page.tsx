"use client";

import { SignIn } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function SellerSignInPage() {
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
              id="sellerGrad"
              x1="140"
              y1="80"
              x2="140"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#6c5ce7" />
              <stop offset="100%" stopColor="#fd79a8" />
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
            <rect
              x="-30"
              y="-35"
              width="60"
              height="45"
              rx="6"
              fill="url(#sellerGrad)"
              opacity="0.9"
            >
              <animate
                attributeName="y"
                values="-35;-40;-35"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x="-20"
              y="15"
              width="40"
              height="5"
              rx="2"
              fill="#fd79a8"
              opacity="0.5"
            />
            <rect
              x="-15"
              y="25"
              width="30"
              height="5"
              rx="2"
              fill="#6c5ce7"
              opacity="0.4"
            />
            <path
              d="M-10,-20 L10,-20 M-10,-10 L10,-10"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>
          <text
            x="140"
            y="225"
            textAnchor="middle"
            fill="#6c5ce7"
            fontSize="20"
            fontWeight="800"
            fontFamily="DM Sans, sans-serif"
          >
            Seller Portal
          </text>
          <text
            x="140"
            y="245"
            textAnchor="middle"
            fill="#a0a0b0"
            fontSize="11"
            fontFamily="DM Sans, sans-serif"
          >
            Manage Your Store
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
