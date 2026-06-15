import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Stage = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
};

const stages: Stage[] = [
  {
    id: "01",
    eyebrow: "Stage 01 · אסטרטגיה",
    title: "מנתחים את העסק שלך",
    description:
      "בודקים מתי נופלות שיחות, מה הלקוחות שואלים בשעות עומס ומה ליד טוב נראה אצלך."
  },
  {
    id: "02",
    eyebrow: "Stage 02 · תסריט שיחה",
    title: "בונים שיחה שנשמעת אנושית",
    description:
      "תסריט בעברית טבעית, עם שאלות המשך והובלה רכה לסגירה — בלי לרגיש בוטית."
  },
  {
    id: "03",
    eyebrow: "Stage 03 · אינטגרציה",
    title: "מחברים לכלים שלך",
    description:
      "CRM, Slack, SMS או webhook — סיכום ליד מסודר נכנס למקום שהצוות באמת רואה."
  },
  {
    id: "04",
    eyebrow: "Stage 04 · Live",
    title: "עולים לאוויר",
    description:
      "הבוט עונה במקומך 24/7, ולידים חמים מחכים לחזרה כבר בבוקר שאחרי."
  }
];

const STAGE_THRESHOLDS = [0.0, 0.34, 0.67, 0.985];

const DESKTOP_PATH =
  "M 80 320 C 280 320 280 80 480 80 C 680 80 680 320 880 320 C 1040 320 1080 200 1160 80";
const DESKTOP_VIEWBOX = "0 0 1240 400";

const MOBILE_PATH =
  "M 200 60 C 60 200 340 320 200 460 C 60 600 340 720 200 860";
const MOBILE_VIEWBOX = "0 0 400 920";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 768px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (event: MediaQueryListEvent) => setIsDesktop(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isDesktop;
}

export function RoadmapJourney() {
  const isDesktop = useIsDesktop();
  const sectionRef = useRef<HTMLElement | null>(null);
  const pathFillRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const [nodes, setNodes] = useState<{ x: number; y: number }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const pathD = isDesktop ? DESKTOP_PATH : MOBILE_PATH;
  const viewBox = isDesktop ? DESKTOP_VIEWBOX : MOBILE_VIEWBOX;

  useLayoutEffect(() => {
    const path = pathFillRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    setPathLength(len);
    setNodes(
      STAGE_THRESHOLDS.map((t) => {
        const pt = path.getPointAtLength(t * len);
        return { x: pt.x, y: pt.y };
      })
    );

    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
  }, [pathD]);

  useEffect(() => {
    if (pathLength === 0) return;

    let raf = 0;
    let displayed = 0;
    let target = 0;
    let lastActive = -1;

    const compute = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const range = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      target = Math.max(0, Math.min(1, scrolled / Math.max(1, range)));
    };

    const tick = () => {
      displayed += (target - displayed) * 0.16;
      if (Math.abs(target - displayed) < 0.0004) displayed = target;

      const path = pathFillRef.current;
      if (path) {
        path.style.strokeDashoffset = `${pathLength * (1 - displayed)}`;
      }

      let nextActive = 0;
      for (let i = 0; i < STAGE_THRESHOLDS.length; i++) {
        if (displayed >= STAGE_THRESHOLDS[i] - 0.015) nextActive = i;
      }
      if (nextActive !== lastActive) {
        lastActive = nextActive;
        setActiveIndex(nextActive);
      }

      raf = requestAnimationFrame(tick);
    };

    compute();
    const onScroll = () => compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathLength]);

  const current = stages[activeIndex];

  return (
    <section
      aria-label="המסע איתנו"
      className="roadmap-section"
      ref={sectionRef}
      style={{ height: isDesktop ? "440vh" : "480vh" }}
    >
      <div aria-hidden className="roadmap-section-lead" />
      <div className="roadmap-sticky">
        <div aria-hidden className="roadmap-ambient" />
        <div aria-hidden className="roadmap-grid" />
        <div aria-hidden className="roadmap-vignette" />

        <div className="roadmap-stage container relative z-10 flex h-full w-full flex-col">
          <div className="mx-auto w-full max-w-3xl text-center">
            <div className="roadmap-text-block" key={activeIndex}>
              <p className="roadmap-eyebrow">{current.eyebrow}</p>
              <h2 className="roadmap-title">{current.title}</h2>
              <p className="roadmap-desc">{current.description}</p>
              <div className="roadmap-progress-bar" aria-hidden>
                {stages.map((_, i) => (
                  <span
                    className={cn(
                      "roadmap-progress-tick",
                      i <= activeIndex && "is-active"
                    )}
                    key={i}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="roadmap-svg-wrap" dir="ltr">
            <svg
              className="block h-auto w-full"
              preserveAspectRatio="xMidYMid meet"
              viewBox={viewBox}
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  gradientUnits="userSpaceOnUse"
                  id="roadmap-accent-gradient"
                  x1="0"
                  x2="1240"
                  y1="0"
                  y2="0"
                >
                  <stop offset="0%" stopColor="#2eb8b0" />
                  <stop offset="55%" stopColor="#4ecdc4" />
                  <stop offset="100%" stopColor="#6fe0d9" />
                </linearGradient>
                <filter
                  height="300%"
                  id="roadmap-line-glow"
                  width="300%"
                  x="-100%"
                  y="-100%"
                >
                  <feGaussianBlur result="b1" stdDeviation="3.5" />
                  <feGaussianBlur in="SourceGraphic" result="b2" stdDeviation="10" />
                  <feMerge>
                    <feMergeNode in="b2" />
                    <feMergeNode in="b1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter
                  height="300%"
                  id="roadmap-node-halo"
                  width="300%"
                  x="-100%"
                  y="-100%"
                >
                  <feGaussianBlur stdDeviation="14" />
                </filter>
              </defs>

              <path
                d={pathD}
                fill="none"
                stroke="#161616"
                strokeLinecap="round"
                strokeWidth="22"
              />
              <path
                d={pathD}
                fill="none"
                stroke="rgba(255,255,255,0.04)"
                strokeLinecap="round"
                strokeWidth="22"
                strokeDasharray="0.5 18"
              />

              <path
                d={pathD}
                fill="none"
                ref={pathFillRef}
                stroke="url(#roadmap-accent-gradient)"
                strokeLinecap="round"
                strokeWidth="20"
                filter="url(#roadmap-line-glow)"
              />

              {nodes.map((pos, idx) => {
                const isActive = idx <= activeIndex;
                return (
                  <g
                    className={cn("roadmap-node", isActive && "is-active")}
                    key={idx}
                    transform={`translate(${pos.x}, ${pos.y})`}
                  >
                    {isActive && (
                      <circle
                        className="roadmap-node-halo"
                        cx="0"
                        cy="0"
                        fill="#4ecdc4"
                        filter="url(#roadmap-node-halo)"
                        opacity="0.55"
                        r="40"
                      />
                    )}
                    <g className="roadmap-node-inner">
                      <rect
                        className="roadmap-node-card"
                        height="56"
                        rx="16"
                        ry="16"
                        width="56"
                        x="-28"
                        y="-28"
                      />
                      <rect
                        className="roadmap-node-card-inner"
                        height="50"
                        rx="13"
                        ry="13"
                        width="50"
                        x="-25"
                        y="-25"
                      />
                      <text
                        className="roadmap-node-text"
                        textAnchor="middle"
                        x="0"
                        y="6"
                      >
                        {stages[idx].id}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div aria-hidden className="roadmap-scroll-hint">
          <span className="roadmap-scroll-hint-text">scroll</span>
          <span className="roadmap-scroll-hint-line" />
        </div>
      </div>
    </section>
  );
}
