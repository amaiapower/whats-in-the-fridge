export default function CookingDoodle() {
  return (
    <svg
      viewBox="0 0 180 160"
      className="w-40 h-36 sm:w-48 sm:h-44"
      fill="none"
      aria-hidden
    >
      {/* steam */}
      <g stroke="var(--sage)" strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <path
          d="M78 52 Q72 42 80 34 Q88 26 82 16"
          style={{ animation: "steam-rise 2.6s ease-in-out infinite", transformOrigin: "80px 34px" }}
        />
        <path
          d="M100 52 Q94 40 102 32 Q110 24 104 14"
          style={{
            animation: "steam-rise 2.6s ease-in-out infinite",
            animationDelay: "0.6s",
            transformOrigin: "102px 32px",
          }}
        />
        <path
          d="M90 56 Q84 46 92 38 Q100 30 94 20"
          style={{
            animation: "steam-rise 2.6s ease-in-out infinite",
            animationDelay: "1.2s",
            transformOrigin: "92px 38px",
          }}
        />
      </g>

      {/* sizzling food */}
      <g fill="var(--terracotta)">
        <circle
          cx="70"
          cy="88"
          r="6"
          style={{ animation: "sizzle-hop 1.1s ease-in-out infinite", transformOrigin: "70px 88px" }}
        />
        <circle
          cx="90"
          cy="84"
          r="7"
          style={{
            animation: "sizzle-hop 1.1s ease-in-out infinite",
            animationDelay: "0.2s",
            transformOrigin: "90px 84px",
          }}
        />
        <circle
          cx="110"
          cy="89"
          r="5.5"
          style={{
            animation: "sizzle-hop 1.1s ease-in-out infinite",
            animationDelay: "0.4s",
            transformOrigin: "110px 89px",
          }}
        />
      </g>

      {/* pan */}
      <g style={{ animation: "pan-wobble 2.4s ease-in-out infinite", transformOrigin: "90px 100px" }}>
        <path
          d="M40 100 Q42 128 90 130 Q138 128 140 100 Q138 96 90 96 Q42 96 40 100Z"
          fill="var(--paper)"
          stroke="var(--ink)"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path
          d="M40 100 Q90 112 140 100"
          stroke="var(--ink)"
          strokeWidth="2"
          opacity="0.35"
          fill="none"
        />
        <path
          d="M140 100 Q160 96 170 88"
          stroke="var(--ink)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
