"use client";

import { SignUp } from "@clerk/nextjs";
import styles from "./page.module.css";

export default function SellerSignUpPage() {
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
              id="sellerUpGrad"
              x1="140"
              y1="80"
              x2="140"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#fd79a8" />
              <stop offset="100%" stopColor="#6c5ce7" />
            </linearGradient>
          </defs>
          <pattern
            id="dots"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.04)" />
          </pattern>
          <rect width="280" height="280" fill="url(#dots)" />
          <g transform="translate(140, 125)">
            <circle r="35" fill="url(#sellerUpGrad)" opacity="0.9">
              <animate
                attributeName="r"
                values="33;37;33"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>
            <path
              d="M0,-15 L0,15 M-15,0 L15,0"
              stroke="#fff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>
          <text
            x="140"
            y="225"
            textAnchor="middle"
            fill="#fd79a8"
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
            Create Seller Account
          </text>
        </svg>
      </section>
      <section className={styles.rightPane}>
        <div className={styles.formWrapper}>
          <SignUp />
        </div>
      </section>
    </main>
  );
}
