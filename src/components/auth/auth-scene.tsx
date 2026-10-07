function Pine({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill="#101820">
      <polygon points="0,-78 -22,-28 22,-28" />
      <polygon points="0,-46 -30,-2 30,-2" />
      <polygon points="0,-16 -36,28 36,28" />
      <rect x="-5" y="28" width="10" height="16" />
    </g>
  );
}

export function AuthScene() {
  return (
    <div className="auth-scene" aria-hidden="true">
      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="auth-sky" x1="0" y1="0" x2="1" y2="0.15">
            <stop offset="0%" stopColor="#f3a45c" />
            <stop offset="18%" stopColor="#e8833a" />
            <stop offset="40%" stopColor="#8d624c" />
            <stop offset="62%" stopColor="#3c4d5c" />
            <stop offset="100%" stopColor="#1a2933" />
          </linearGradient>
          <radialGradient id="auth-sun" cx="8%" cy="62%" r="42%">
            <stop offset="0%" stopColor="#ffe1b5" stopOpacity="0.95" />
            <stop offset="36%" stopColor="#f6a15a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#f6a15a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="auth-snow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8ea6b6" />
            <stop offset="55%" stopColor="#6d8796" />
            <stop offset="100%" stopColor="#4d6574" />
          </linearGradient>
        </defs>

        <rect width="1600" height="900" fill="url(#auth-sky)" />
        <rect width="1600" height="900" fill="url(#auth-sun)" />

        <path
          fill="#efb27a"
          fillOpacity="0.45"
          d="M0 640 L140 560 L260 610 L390 500 L520 590 L640 530 L760 610 L760 900 H0 Z"
        />
        <path
          fill="#d86d42"
          fillOpacity="0.28"
          d="M0 730 L110 660 L240 710 L380 640 L520 730 L680 660 L760 740 V900 H0 Z"
        />

        <path
          fill="url(#auth-snow)"
          d="M860 900 L1080 560 C1220 430 1380 330 1600 230 V900 Z"
        />
        <path
          fill="#e7eef2"
          fillOpacity="0.42"
          d="M1240 760 C1360 680 1480 640 1600 600 V760 C1500 800 1380 820 1240 760 Z"
        />

        <path
          fill="#121c24"
          d="M980 0 H1600 V150 C1520 210 1460 120 1380 170 C1280 230 1220 90 1140 150 C1060 200 1020 80 980 120 Z"
        />

        <g fill="#101820">
          <Pine x={1468} y={78} scale={0.55} />
          <Pine x={1520} y={96} scale={0.72} />
          <Pine x={1575} y={70} scale={0.48} />
        </g>

        <g>
          <Pine x={150} y={860} scale={0.7} />
          <Pine x={230} y={845} scale={0.95} />
          <Pine x={320} y={870} scale={0.62} />
          <Pine x={640} y={820} scale={0.8} />
          <Pine x={730} y={790} scale={1.05} />
          <Pine x={830} y={830} scale={0.85} />
          <Pine x={930} y={800} scale={1.2} />
          <Pine x={1040} y={845} scale={0.7} />
        </g>
      </svg>
    </div>
  );
}
