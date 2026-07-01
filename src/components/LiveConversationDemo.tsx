import { type CSSProperties, type RefObject, useEffect, useRef, useState } from "react";
import sleepingMan from "@/assets/roadmap-sleeping-man.png";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const MESSAGES = [
  {
    id: 1,
    role: "customer" as const,
    text: "היי, ראיתי את השירות באתר. אפשר לדבר מחר על אוטומציה לעסק?"
  },
  {
    id: 2,
    role: "agent" as const,
    text: "בטח. אני הבוט של AfterHours. מה שם העסק ומה המספר הכי נוח לחזרה?"
  },
  {
    id: 3,
    role: "customer" as const,
    text: "מוסך דרך השלום, 052-444-1890. עדיף לפני 10:00."
  },
  {
    id: 4,
    role: "agent" as const,
    text: "מעולה. קבעתי שיחה ל-08:45, שמרתי ליד חדש ושלחתי אישור ב-SMS.",
    success: true
  }
];

const START_DELAY_MS = 600;
const TYPING_INDICATOR_MS = 1800;
const MESSAGE_GAP_MS = 700;
const LOOP_PAUSE_MS = 4500;
const RESET_DELAY_MS = 400;

const STORY_STEPS = [
  {
    eyebrow: "01 · אחרי שעות הפעילות",
    title: "לקוחות ממשיכים לכתוב גם כשאתה לא זמין.",
    text: "שאלות קצרות, בקשות להצעת מחיר ופניות דחופות מגיעות בערב, בלילה ובסופי שבוע."
  },
  {
    eyebrow: "02 · תגובה אוטומטית",
    title: "ה-AI עונה, מסנן ומקדם את השיחה.",
    text: "המערכת מזהה כוונה, אוספת פרטים, קובעת המשך טיפול ושומרת ליד ברור לצוות."
  },
  {
    eyebrow: "03 · העסק ממשיך לעבוד",
    title: "שיחה שמרגישה מקומית, לא תאגידית.",
    text: "בעל העסק יכול לנוח. הצ׳אט ההולוגרפי ממשיך לענות, לסגור פגישות ולהעביר לידים בזמן אמת."
  }
];

function ChatBubble({
  text,
  role,
  success
}: {
  text: string;
  role: "customer" | "agent";
  success?: boolean;
}) {
  return (
    <div
      className={cn(
        "live-bubble-in live-chat-bubble max-w-[88%] rounded-2xl px-4 py-3 text-[15px] leading-7 text-foreground/95",
        role === "customer"
          ? "live-chat-bubble-customer self-end rounded-br-md"
          : success
            ? "live-chat-bubble-agent live-chat-bubble-success self-start rounded-bl-md"
            : "live-chat-bubble-agent self-start rounded-bl-md"
      )}
    >
      {text}
    </div>
  );
}

function TypingIndicator({ role }: { role: "customer" | "agent" }) {
  return (
    <div
      aria-label="מקליד..."
      className={cn(
        "live-bubble-in live-chat-bubble flex items-center gap-1.5 rounded-2xl px-4 py-3.5",
        role === "customer"
          ? "live-chat-bubble-customer self-end rounded-br-md"
          : "live-chat-bubble-agent self-start rounded-bl-md"
      )}
      role="status"
    >
      <span className="live-typing-dot" />
      <span className="live-typing-dot" />
      <span className="live-typing-dot" />
    </div>
  );
}

function useLiveChatLoop(active: boolean) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typingRole, setTypingRole] = useState<"customer" | "agent" | null>(null);
  const [cycle, setCycle] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active) {
      setVisibleCount(0);
      setTypingRole(null);
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setVisibleCount(MESSAGES.length);
      setTypingRole(null);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const schedule = (fn: () => void, ms: number) => {
      timers.push(
        setTimeout(() => {
          if (!cancelled) fn();
        }, ms)
      );
    };

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        const node = scrollRef.current;
        if (!node) return;
        node.scrollTo({ top: node.scrollHeight, behavior: "smooth" });
      });
    };

    const playSequence = () => {
      setVisibleCount(0);
      setTypingRole(null);
      let elapsed = START_DELAY_MS;

      MESSAGES.forEach((message, index) => {
        schedule(() => {
          setTypingRole(message.role);
          scrollToBottom();
        }, elapsed);
        elapsed += TYPING_INDICATOR_MS;

        schedule(() => {
          setTypingRole(null);
          setVisibleCount(index + 1);
          scrollToBottom();
        }, elapsed);
        elapsed += MESSAGE_GAP_MS;
      });

      schedule(() => {
        setTypingRole(null);
        setVisibleCount(0);
        schedule(() => {
          setCycle((value) => value + 1);
          playSequence();
        }, RESET_DELAY_MS);
      }, elapsed + LOOP_PAUSE_MS);
    };

    playSequence();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active]);

  return { visibleCount, typingRole, cycle, scrollRef };
}

function useStoryProgress(targetRef: RefObject<HTMLDivElement | null>) {
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const activeStepRef = useRef(0);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    const getMobileStep = (nextProgress: number, currentStep: number) => {
      const advanceAt = [0.32, 0.65] as const;
      const retreatAt = [0.24, 0.57] as const;
      let step = currentStep;

      if (step < STORY_STEPS.length - 1 && nextProgress >= advanceAt[step]) {
        step += 1;
      } else if (step > 0 && nextProgress < retreatAt[step - 1]) {
        step -= 1;
      }

      return step;
    };

    const update = () => {
      const node = targetRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const nextProgress = Math.min(1, Math.max(0, -rect.top / scrollable));
      setProgress(nextProgress);

      const nextStep = mobileQuery.matches
        ? getMobileStep(nextProgress, activeStepRef.current)
        : Math.min(
            STORY_STEPS.length - 1,
            Math.floor(nextProgress * STORY_STEPS.length)
          );

      if (nextStep !== activeStepRef.current) {
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    mobileQuery.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mobileQuery.removeEventListener("change", update);
    };
  }, [targetRef]);

  return { activeStep, progress };
}

function LiveChatMockup({ active }: { active: boolean }) {
  const { visibleCount, typingRole, cycle, scrollRef } = useLiveChatLoop(active);
  const visibleMessages = MESSAGES.slice(0, visibleCount);

  return (
    <div className="live-chat-glow live-chat-panel overflow-hidden rounded-2xl">
      <div className="live-chat-panel-grid" aria-hidden>
        <span />
        <span />
        <span />
      </div>

      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.09] px-5 py-4">
        <div className="text-right">
          <div className="text-[15px] font-semibold text-foreground">AI AfterHours</div>
          <div className="mt-0.5 text-xs text-muted-foreground">ליד חדש · תגובה אוטומטית</div>
        </div>
        <div className="live-ai-badge inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          AI Live
        </div>
      </div>

      <div
        className="live-chat-messages relative z-10 flex min-h-[220px] max-h-[min(320px,52vh)] flex-col gap-3 overflow-y-auto scroll-smooth px-4 py-5 md:min-h-[240px] md:px-5 md:py-6"
        ref={scrollRef}
      >
        {visibleMessages.map((message) => (
          <ChatBubble
            key={`${cycle}-${message.id}`}
            role={message.role}
            success={"success" in message ? message.success : undefined}
            text={message.text}
          />
        ))}
        {typingRole && (
          <TypingIndicator key={`${cycle}-typing-${typingRole}-${visibleCount}`} role={typingRole} />
        )}
      </div>
    </div>
  );
}

export function LiveConversationDemo() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const storyRef = useRef<HTMLDivElement>(null);
  const { activeStep, progress } = useStoryProgress(storyRef);
  const storyStyle = { "--story-progress": progress } as CSSProperties;

  return (
    <div
      className="live-story-shell relative z-10 mx-auto w-full max-w-7xl overflow-visible px-2 pb-10 pt-6 sm:px-0 md:pb-16 md:pt-28 lg:pb-20 lg:pt-32"
      id="live-demo"
      ref={ref}
    >
      <div className="live-story-scroll" ref={storyRef} style={storyStyle}>
        <div className="live-story-pin">
          <div className="live-demo-layout grid items-start gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-14 lg:gap-16">
            <div className="live-story-copy-stack overflow-visible text-center md:text-right">
              {STORY_STEPS.map((step, index) => (
                <div
                  className={cn(
                    "live-story-copy",
                    activeStep === index && "is-active",
                    index === 0 && "live-story-copy-step-1",
                    index === 1 && "live-story-copy-step-2",
                    index === 2 && "live-story-copy-step-3"
                  )}
                  key={step.eyebrow}
                >
                  <p className="live-story-eyebrow">{step.eyebrow}</p>
                  <h2 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.01em] text-foreground md:text-[44px]">
                    {step.title}
                  </h2>
                  <p className="mx-auto mt-5 max-w-xl text-[17px] leading-[1.75] text-muted-foreground md:mx-0">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="live-story-visuals" data-active-step={activeStep}>
              <div className={cn("live-story-scene live-story-scene-messages", activeStep === 0 && "is-active")}>
                <div className="live-floating-notices-cluster">
                  <div className="live-floating-notice notice-one">לקוח חדש · 23:18</div>
                  <div className="live-floating-notice notice-two">אפשר לקבל מחיר?</div>
                  <div className="live-floating-notice notice-three">הודעת WhatsApp נכנסה</div>
                  <div className="live-floating-notice notice-four">יש מישהו זמין?</div>
                  <div className="live-floating-notice notice-five">שיחה שלא נענתה · 00:41</div>
                </div>
                <div className="live-signal-orb" />
              </div>

              <div className={cn("live-story-scene live-story-scene-automation", activeStep === 1 && "is-active")}>
                <div className="live-automation-cluster">
                  <div className="live-automation-card automation-one">
                    <span>AI מזהה כוונה</span>
                    <strong>בקשת שירות חדשה</strong>
                  </div>
                  <div className="live-automation-card automation-two">
                    <span>תגובה נשלחה</span>
                    <strong>״אשמח לעזור, מה המספר שלך?״</strong>
                  </div>
                  <div className="live-automation-card automation-three">
                    <span>AI אוסף פרטים</span>
                    <strong>התור הפנוי הקרוב ב-22.06 בשעה 16:00 מתאים לך?</strong>
                  </div>
                  <div className="live-automation-card automation-four is-success">
                    <span>פגישה נקבעה</span>
                    <strong>מחר · 08:45 · ליד נשמר</strong>
                  </div>
                  <div className="live-automation-card automation-five is-success">
                    <span>פגישה נקבעה</span>
                    <strong>
                      מעולה קבענו פגישה בשעה 12:45 ביום שלשי שיהיה המשך יום טוב
                    </strong>
                  </div>
                </div>
              </div>

              <div className={cn("live-story-scene live-story-scene-cinematic", activeStep === 2 && "is-active")}>
                <div className="live-demo-stage">
                  <div aria-hidden className="live-demo-sleeping-figure">
                    <div className="live-demo-sleeping-figure-surface">
                      <img
                        alt=""
                        className="live-demo-sleeping-figure-img"
                        decoding="async"
                        draggable={false}
                        loading="lazy"
                        src={sleepingMan}
                      />
                    </div>
                  </div>

                  <div className="live-demo-particles" aria-hidden>
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="live-demo-chat relative z-20 overflow-visible">
                    <LiveChatMockup active={isInView && activeStep === 2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
