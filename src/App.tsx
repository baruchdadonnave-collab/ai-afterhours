import {
  type FormEvent,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Calculator,
  Check,
  CheckCircle,
  FileText,
  Link,
  Mail,
  Phone,
  User
} from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LiveConversationDemo } from "@/components/LiveConversationDemo";
import { RoadmapJourney } from "@/components/RoadmapJourney";
import { cn } from "@/lib/utils";
import logoCallbot from "@/assets/logo-callbot-header.png";

type Page = "home" | "pricing" | "thank-you";

const FORMSPREE_LEAD_ENDPOINT = "https://formspree.io/f/mbdvzgkp";
const CONTACT_PHONE = "0587872155";
const CONTACT_PHONE_INTL = "972587872155";

const navItems = [
  { label: "לקוחות", href: "/#testimonials" },
  { label: "תמחור", href: "/pricing" },
  { label: "שאלות", href: "/#faq" }
];

const testimonials = [
  {
    quote:
      "עכשיו אני יודע מי התקשר בלילה ומה הוא רצה. בבוקר אני פשוט חוזר ללידים החמים.",
    name: "אבי לוי",
    role: "בעל מוסך",
    field: "רכב",
    highlight: "18 לידים נשמרו בחודש"
  },
  {
    quote:
      "מטופלים מקבלים מענה רגוע גם כשהמרפאה סגורה, והצוות מקבל תקציר מסודר.",
    name: "ד״ר נעמה שחר",
    role: "מנהלת מרפאה",
    field: "בריאות",
    highlight: "42% פחות עומס בבוקר"
  },
  {
    quote:
      "בנדל״ן מהירות תגובה היא הכול. השיחות מהערב כבר לא נופלות בין הכיסאות.",
    name: "רון מלמד",
    role: "מנהל משרד",
    field: "נדל״ן",
    highlight: "חזרה לליד תוך 7 דקות"
  },
  {
    quote:
      "הלקוחות מקבלים תשובה נעימה גם אחרי שעות הפעילות, ואנחנו פותחים את היום עם סדר עדיפויות ברור.",
    name: "יעל בן דוד",
    role: "מנהלת שירות",
    field: "קליניקה",
    highlight: "31 שיחות סוכמו אוטומטית"
  },
  {
    quote:
      "פעם היינו מגלים פניות רק בבוקר. עכשיו כל בקשה מגיעה מסודרת עם שם, טלפון וסיבת הפנייה.",
    name: "מיכאל צור",
    role: "בעל עסק",
    field: "שירותים",
    highlight: "0 שיחות בלי מעקב"
  },
  {
    quote:
      "לקוחות מרגישים שמדברים עם נציג אמיתי, ואנחנו מתחילים כל בוקר עם רשימת פניות מסודרת.",
    name: "שירה אברהם",
    role: "בעלת סלון",
    field: "יופי",
    highlight: "94% שביעות רצון מהשיחה"
  }
];

const faqItems = [
  {
    question: "האם הבוט באמת מדבר עברית?",
    answer:
      "כן. הזרימה נבנית בעברית ומותאמת לשיחות של עסקים ישראליים, כולל שאלות המשך קצרות וסיכום ברור לנציג."
  },
  {
    question: "מה קורה אם הלקוח רוצה לדבר עם בן אדם?",
    answer:
      "הבוט מתעד את הבקשה, מסמן דחיפות ומעביר את הליד לערוץ שהוגדר מראש כדי שהצוות יחזור אליו."
  },
  {
    question: "אפשר לחבר את זה ל־CRM קיים?",
    answer:
      "כן. בשלב הדמו בודקים את המערכת שלכם ומגדירים חיבור ל־Powerlink, HubSpot, Slack או webhook."
  },
  {
    question: "כמה זמן לוקח לעלות לאוויר?",
    answer:
      "ברוב העסקים אפשר להפעיל פיילוט ראשוני תוך ימים ספורים אחרי אישור תסריט השיחה והחיבורים."
  },
  {
    question: "האם יש התחייבות ארוכה?",
    answer:
      "המודל נבנה סביב שימוש בפועל. בדף התמחור אפשר לראות את ההיגיון, ובדמו נסביר את המספרים לפי העסק שלך."
  }
];

const pricingFaq = [
  {
    question: "יש מינימום חודשי?",
    answer:
      "לרוב יש מסגרת מינימום כדי להבטיח זמינות, ניטור ושיפור תסריטי השיחה. בדמו נתאים אותה לנפח השיחות שלך."
  },
  {
    question: "אפשר לבטל?",
    answer:
      "כן. המטרה היא להוכיח ערך דרך לידים שנשמרו, לא לנעול אותך במנוי שלא מתאים לעסק."
  },
  {
    question: "אינטגרציות כלולות?",
    answer:
      "חיבור בסיסי לערוץ אחד כלול בתהליך ההקמה. אינטגרציות מורכבות יותר מתומחרות לפי היקף."
  },
  {
    question: "מקבלים חשבונית בישראל?",
    answer:
      "כן. התמחור מוצג בשקלים והחשבונית מותאמת לעבודה מול עסקים ישראליים."
  }
];

function getPageFromPath(): Page {
  if (window.location.pathname === "/pricing") return "pricing";
  if (window.location.pathname === "/thank-you") return "thank-you";
  return "home";
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromPath);

  useEffect(() => {
    const syncPage = () => setPage(getPageFromPath());
    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);

  const navigate = (nextPage: Page) => {
    const path = nextPage === "home" ? "/" : `/${nextPage}`;
    window.history.pushState({}, "", path);
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen bg-page text-foreground" dir="rtl">
      <Header currentPage={page} navigate={navigate} />
      <main>
        {page === "home" && <LandingPage navigate={navigate} />}
        {page === "pricing" && <PricingPage navigate={navigate} />}
        {page === "thank-you" && <ThankYouPage navigate={navigate} />}
      </main>
      <Footer navigate={navigate} />
      <ContactButtons variant="floating" />
    </div>
  );
}

function Header({
  currentPage,
  navigate
}: {
  currentPage: Page;
  navigate: (page: Page) => void;
}) {
  return (
    <header className="site-header">
      <div className="site-header-inner container flex items-center justify-between">
        <button
          className="site-logo flex shrink-0 items-center text-right"
          onClick={() => navigate("home")}
          type="button"
        >
          <img
            alt="CALLBOT"
            className="site-logo-img"
            decoding="async"
            height={72}
            src={logoCallbot}
            width={84}
          />
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const isPricing = item.href === "/pricing";
            const active = isPricing && currentPage === "pricing";

            return (
              <a
                className={cn(
                  "nav-link text-sm text-muted-foreground transition hover:text-foreground",
                  active && "active text-foreground"
                )}
                href={item.href}
                key={item.label}
                onClick={(event) => {
                  if (isPricing) {
                    event.preventDefault();
                    navigate("pricing");
                  }
                }}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <Button
          className="h-7 px-3 text-xs md:h-8 md:px-4 md:text-sm"
          onClick={() => {
            navigate("home");
            window.setTimeout(scrollToDemo, 50);
          }}
          size="sm"
        >
          הזמן דמו
        </Button>
      </div>
    </header>
  );
}

function LandingPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <>
      <section
        className="hero-section pb-24 pt-[calc(var(--site-header-height)+2rem)] md:pb-32 md:pt-[calc(var(--site-header-height)+3.5rem)]"
        id="hero"
      >
        <div aria-hidden="true" className="hero-section-backdrop">
          <div className="hero-bg-light" />
          <svg
            className="hero-bg-wave"
            preserveAspectRatio="none"
            viewBox="0 0 1000 1050"
          >
            <defs>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="heroWaveDark"
                x1="580"
                x2="1000"
                y1="525"
                y2="525"
              >
                <stop offset="0%" stopColor="#3a2060" />
                <stop offset="55%" stopColor="#2a1545" />
                <stop offset="100%" stopColor="#1a1030" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="heroWaveDarkDepth"
                x1="1000"
                x2="620"
                y1="0"
                y2="1050"
              >
                <stop offset="0%" stopColor="#5c2b82" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#1a1030" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="heroCoveCore"
                x1="800"
                x2="550"
                y1="0"
                y2="1050"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#8ef8f2" stopOpacity="1" />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.92" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="heroCoveSpill"
                x1="820"
                x2="380"
                y1="0"
                y2="1050"
              >
                <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.55" />
                <stop offset="28%" stopColor="#4ecdc4" stopOpacity="0.22" />
                <stop offset="62%" stopColor="#4ecdc4" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="heroCoveCoreMobile"
                x1="1000"
                x2="0"
                y1="440"
                y2="1050"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#8ef8f2" stopOpacity="1" />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0.92" />
              </linearGradient>
              <linearGradient
                gradientUnits="userSpaceOnUse"
                id="heroCoveSpillMobile"
                x1="1000"
                x2="320"
                y1="440"
                y2="900"
              >
                <stop offset="0%" stopColor="#4ecdc4" stopOpacity="0.5" />
                <stop offset="38%" stopColor="#4ecdc4" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#4ecdc4" stopOpacity="0" />
              </linearGradient>
              <filter
                height="400%"
                id="hero-cove-spill"
                width="400%"
                x="-150%"
                y="-150%"
              >
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="22" />
                <feOffset dx="-18" dy="0" in="blur" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="blur" />
                </feMerge>
              </filter>
              <filter
                height="300%"
                id="hero-cove-spill-mobile"
                width="300%"
                x="-100%"
                y="-100%"
              >
                <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="16" />
                <feOffset dx="-10" dy="8" in="blur" result="offsetBlur" />
                <feMerge>
                  <feMergeNode in="offsetBlur" />
                  <feMergeNode in="blur" />
                </feMerge>
              </filter>
              <filter
                height="300%"
                id="hero-cove-bloom"
                width="300%"
                x="-100%"
                y="-100%"
              >
                <feGaussianBlur in="SourceGraphic" result="blurSoft" stdDeviation="9" />
                <feGaussianBlur in="SourceGraphic" result="blurMid" stdDeviation="3.5" />
                <feMerge>
                  <feMergeNode in="blurSoft" />
                  <feMergeNode in="blurMid" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <filter
                height="200%"
                id="hero-cove-core"
                width="200%"
                x="-50%"
                y="-50%"
              >
                <feGaussianBlur in="SourceGraphic" result="glow" stdDeviation="1.2" />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g className="hero-wave-paths hero-wave-paths--desktop">
              <path
                className="hero-wave-fill"
                d="M 1000 0 L 800 0 C 690 200, 610 400, 530 600 C 450 800, 490 920, 550 1050 L 1000 1050 Z"
                fill="url(#heroWaveDark)"
              />
              <path
                className="hero-wave-fill-depth"
                d="M 1000 0 L 800 0 C 690 200, 610 400, 530 600 C 450 800, 490 920, 550 1050 L 1000 1050 Z"
                fill="url(#heroWaveDarkDepth)"
              />
              <path
                className="hero-wave-glow-spill"
                d="M 800 0 C 690 200, 610 400, 530 600 C 450 800, 490 920, 550 1050"
                filter="url(#hero-cove-spill)"
                stroke="url(#heroCoveSpill)"
              />
              <path
                className="hero-wave-glow-bloom"
                d="M 800 0 C 690 200, 610 400, 530 600 C 450 800, 490 920, 550 1050"
                filter="url(#hero-cove-bloom)"
                stroke="#4ecdc4"
              />
              <path
                className="hero-wave-glow-core"
                d="M 800 0 C 690 200, 610 400, 530 600 C 450 800, 490 920, 550 1050"
                filter="url(#hero-cove-core)"
                stroke="url(#heroCoveCore)"
              />
            </g>
            <g className="hero-wave-paths hero-wave-paths--mobile">
              <path
                className="hero-wave-fill"
                d="M 1000 0 L 1000 440 C 965 495, 880 575, 740 645 C 560 735, 300 895, 0 1050 L 1000 1050 Z"
                fill="url(#heroWaveDark)"
              />
              <path
                className="hero-wave-fill-depth"
                d="M 1000 0 L 1000 440 C 965 495, 880 575, 740 645 C 560 735, 300 895, 0 1050 L 1000 1050 Z"
                fill="url(#heroWaveDarkDepth)"
              />
              <path
                className="hero-wave-glow-spill"
                d="M 1000 440 C 965 495, 880 575, 740 645 C 560 735, 300 895, 0 1050"
                filter="url(#hero-cove-spill-mobile)"
                stroke="url(#heroCoveSpillMobile)"
              />
              <path
                className="hero-wave-glow-bloom"
                d="M 1000 440 C 965 495, 880 575, 740 645 C 560 735, 300 895, 0 1050"
                filter="url(#hero-cove-bloom)"
                stroke="#4ecdc4"
              />
              <path
                className="hero-wave-glow-core"
                d="M 1000 440 C 965 495, 880 575, 740 645 C 560 735, 300 895, 0 1050"
                filter="url(#hero-cove-core)"
                stroke="url(#heroCoveCoreMobile)"
              />
            </g>
          </svg>
        </div>

        <div className="hero-frame">
          <div className="container relative z-[2]">
            <div className="hero-layout" dir="ltr">
              <div className="hero-content" dir="rtl">
                <h1 className="hero-title animate-fade-up">
                  <span className="hero-title-line">הבוט שלא נותן</span>
                  <span className="hero-title-accent">ללקוחות לחכות</span>
                </h1>
                <p className="mt-6 max-w-xl animate-fade-up text-xl leading-8 text-muted-foreground [animation-delay:160ms]">
                  כל שיחה שלא נענית היא ליד שהלך למתחרה. Voice AI AfterHours
                  עונה בשמך, מסכם את השיחה ומעביר לצוות ליד ברור לחזרה.
                </p>
                <div className="mt-9 flex animate-fade-up flex-col items-start gap-4 [animation-delay:240ms] sm:flex-row">
                  <Button onClick={() => scrollToDemo()}>
                    הזמן דמו של 15 דקות <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button onClick={() => navigate("pricing")} variant="secondary">
                    ראה תמחור
                  </Button>
                </div>
                <ContactButtons
                  className="animate-fade-up [animation-delay:320ms]"
                  variant="inline"
                />
              </div>

              <div className="hero-phones animate-fade-up [animation-delay:420ms]">
                <HeroPhoneMockups />
              </div>
            </div>
          </div>
        </div>

        <div className="container relative z-[2]">
          <LiveConversationDemo />
        </div>
      </section>

      <RoadmapJourney />

      <Testimonials />
      <DemoSection navigate={navigate} />
      <FaqSection />
    </>
  );
}

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const dragStartX = useRef<number | null>(null);
  const didDragRef = useRef(false);

  const goTo = (index: number) => {
    setActiveIndex((index + testimonials.length) % testimonials.length);
  };

  const goNext = () => goTo(activeIndex + 1);
  const goPrevious = () => goTo(activeIndex - 1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    dragStartX.current = event.clientX;
    didDragRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (dragStartX.current === null) return;

    const distance = event.clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(distance) > 42) {
      didDragRef.current = true;
      distance > 0 ? goPrevious() : goNext();
    }
  };

  const handleSideCardClick = (index: number, position: number) => {
    if (position === 0 || didDragRef.current) return;
    goTo(index);
  };

  const handleSideCardPointerDown = (
    event: PointerEvent<HTMLElement>,
    position: number
  ) => {
    if (position !== 0) {
      didDragRef.current = false;
      event.stopPropagation();
    }
  };

  return (
    <section className="bg-page py-20 md:py-[120px]" id="testimonials">
      <div className="container">
        <SectionTitle
          eyebrow="לקוחות"
          title="לא KPI קר. שיחות אמיתיות שלא הלכו לאיבוד"
          copy="ציטוטים בשפה של בעלי עסקים, לא בשפה של מצגת משקיעים."
        />

        <div
          aria-label="קרוסלת עדויות לקוח"
          className="testimonial-carousel"
          onPointerCancel={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }

            dragStartX.current = null;
            didDragRef.current = false;
          }}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          role="region"
        >
          <div className="testimonial-carousel-stage">
            {testimonials.map((item, index) => {
              const position = getCarouselPosition(index, activeIndex, testimonials.length);
              const isVisible = position >= -1 && position <= 1;

              return (
                <article
                  aria-hidden={!isVisible}
                  className={cn(
                    "testimonial-carousel-card",
                    position === 0 && "is-active",
                    position === -1 && "is-left",
                    position === 1 && "is-right",
                    !isVisible && "is-hidden"
                  )}
                  key={item.name}
                  onClick={() => handleSideCardClick(index, position)}
                  onPointerDown={(event) => handleSideCardPointerDown(event, position)}
                  onKeyDown={(event) => {
                    if (position === 0) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleSideCardClick(index, position);
                    }
                  }}
                  role={position !== 0 ? "button" : undefined}
                  tabIndex={position !== 0 ? 0 : undefined}
                >
                  <CardHeader className="relative z-10">
                    <div className="mb-4 flex justify-center gap-1 text-accent">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <span key={starIndex}>★</span>
                      ))}
                    </div>
                    <p className="testimonial-carousel-quote">״{item.quote}״</p>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="testimonial-carousel-person">
                      <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/20 text-accent">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.role} · {item.field}
                        </div>
                      </div>
                    </div>
                    <div className="testimonial-carousel-highlight">{item.highlight}</div>
                  </CardContent>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((item, index) => (
            <button
              aria-label={`עבור לעדות של ${item.name}`}
              aria-current={index === activeIndex}
              className={cn("testimonial-carousel-dot", index === activeIndex && "is-active")}
              key={item.name}
              onClick={() => goTo(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function getCarouselPosition(index: number, activeIndex: number, total: number) {
  const raw = index - activeIndex;
  const half = Math.floor(total / 2);

  if (raw > half) return raw - total;
  if (raw < -half) return raw + total;
  return raw;
}

function DemoSection({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="section-edge bg-page py-20 md:py-[120px]" id="demo">
      <div className="container grid items-start gap-12 md:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mb-4 text-[14px] tracking-[0.02em] text-accent">
            דמו קצר, בלי התחייבות
          </p>
          <h2 className="text-[34px] font-semibold leading-[1.2] tracking-[-0.01em] md:text-[50px]">
            תן לנו{" "}
            <span className="text-[#9d6fd4]">15</span>{" "}
            דקות ונראה לך כמה שיחות אפשר להציל
          </h2>
          <p className="mt-5 text-[18px] leading-[1.75] text-muted-foreground">
            שלב ראשון קצר: שם, טלפון ומייל. אחרי זה נוכל להשלים פרטים נוספים
            רק אם זה רלוונטי.
          </p>
        </div>
        <DemoForm onSuccess={() => navigate("thank-you")} />
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="bg-page py-20 md:py-[120px]" id="faq">
      <div className="container max-w-4xl">
        <SectionTitle
          eyebrow="FAQ"
          title="שאלות לפני שמתחילים"
          copy="התשובות קצרות בכוונה. הדמו נועד לבדוק התאמה אמיתית לעסק."
        />
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}

function PricingPage({ navigate }: { navigate: (page: Page) => void }) {
  const [lostCalls, setLostCalls] = useState(80);
  const potential = useMemo(() => Math.round(lostCalls * 0.42 * 280), [lostCalls]);

  return (
    <>
      <section className="bg-hero-glow pb-20 pt-[calc(var(--site-header-height)+5rem)] md:pb-28 md:pt-[calc(var(--site-header-height)+7rem)]">
        <div className="container max-w-3xl text-center">
          <p className="mb-4 text-[13px] tracking-[0.02em] text-accent">
            תמחור
          </p>
          <h1 className="text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]">
            משלמים לפי שיחות שנענו, לא לפי מושבים במערכת
          </h1>
          <p className="mt-6 text-xl leading-8 text-muted-foreground">
            המודל נועד להיות קרוב לערך האמיתי: כמה לידים לא הלכו לאיבוד אחרי
            שעות הפעילות.
          </p>
        </div>
      </section>

      <section className="section-edge bg-page py-20 md:py-[120px]">
        <div className="container grid items-start gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <IconBubble>
                <Calculator className="h-6 w-6" />
              </IconBubble>
              <div>
                <CardTitle>מחשבון שיחות אבודות</CardTitle>
                <CardDescription>
                  כמה שיחות אתה מעריך שאתה מפספס בחודש?
                </CardDescription>
              </div>
            </div>
            <input
              className="w-full accent-[#4ECDC4]"
              max="300"
              min="10"
              onChange={(event) => setLostCalls(Number(event.target.value))}
              type="range"
              value={lostCalls}
            />
            <div className="mt-6 rounded-xl border border-white/[0.07] bg-deeper p-5">
              <div className="text-[52px] font-bold leading-none tracking-[-0.02em]">
                {lostCalls}
                <span className="text-accent"> שיחות</span>
              </div>
              <p className="mt-3 text-muted-foreground">בחודש, לפי ההערכה שלך</p>
            </div>
            <div className="mt-4 rounded-xl border border-accent/20 bg-accent/10 p-5">
              <p className="text-sm text-accent">פוטנציאל הכנסה שנשמר</p>
              <div className="mt-2 text-[40px] font-bold">
                <span className="text-accent">₪</span>
                {potential.toLocaleString("he-IL")}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                אומדן בלבד לפי שיעור המרה שמרני ושווי ליד ממוצע. בדמו נחשב לפי
                העסק שלך.
              </p>
            </div>
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            <PricingCard
              cta="בדוק התאמה"
              features={[
                "עד 120 שיחות בחודש",
                "תסריט שיחה אחד",
                "סיכום ליד ל־CRM או Slack",
                "דוח ביצועים חודשי"
              ]}
              name="Starter"
              price="לפי שיחה"
              onCta={() => {
                navigate("home");
                window.setTimeout(scrollToDemo, 50);
              }}
            />
            <PricingCard
              highlighted
              cta="הזמן דמו"
              features={[
                "נפח שיחות גמיש",
                "כמה תסריטים לפי מחלקות",
                "אינטגרציות מתקדמות",
                "שיפור תסריטים שוטף"
              ]}
              name="Growth"
              price="מותאם לעסק"
              onCta={() => {
                navigate("home");
                window.setTimeout(scrollToDemo, 50);
              }}
            />
          </div>
        </div>
      </section>

      <section className="bg-page py-20 md:py-[120px]">
        <div className="container max-w-4xl">
          <SectionTitle
            eyebrow="FAQ תמחורי"
            title="המספרים צריכים להיות פשוטים"
            copy="אנחנו מסבירים את המודל לפני שמבקשים החלטה."
          />
          <Accordion items={pricingFaq} />
          <div className="mt-10 rounded-xl border border-white/[0.07] bg-surface p-8 text-center">
            <h2 className="text-3xl font-semibold">לא בטוח איזה מסלול מתאים?</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              בוא לדמו קצר ונראה יחד את נפח השיחות, שעות העומס והאינטגרציות
              הדרושות.
            </p>
            <Button
              className="mt-6"
              onClick={() => {
                navigate("home");
                window.setTimeout(scrollToDemo, 50);
              }}
            >
              הזמן דמו של 15 דקות <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function ThankYouPage({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="min-h-[calc(100vh-var(--site-header-height))] bg-hero-glow pb-20 pt-[calc(var(--site-header-height)+5rem)] md:pb-28 md:pt-[calc(var(--site-header-height)+7rem)]">
      <div className="container max-w-3xl text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h1 className="mt-8 text-[40px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[56px]">
          קיבלנו! נחזור אליך תוך 2 שעות
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-xl leading-8 text-muted-foreground">
          הפרטים נשלחו. עכשיו נבדוק התאמה ראשונית ונחזור עם זמן קצר לדמו.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "קיבלת מייל",
              copy: "אישור קצר עם הפרטים שמסרת.",
              icon: Mail
            },
            {
              title: "נציג יצור קשר",
              copy: "נשאל כמה שאלות על נפח השיחות.",
              icon: Phone
            },
            {
              title: "הדמו עצמו",
              copy: "נראה איך זה נשמע ועובד בעסק שלך.",
              icon: Bot
            }
          ].map((item) => (
            <Card className="p-5 text-center" key={item.title}>
              <IconBubble className="mx-auto">
                <item.icon className="h-6 w-6" />
              </IconBubble>
              <h3 className="mt-4 text-xl font-medium">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.copy}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-white/[0.07] bg-surface p-6">
          <p className="text-sm text-muted-foreground">בינתיים אפשר לקרוא עוד</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button variant="secondary">
              לינקדאין CEO <Link className="h-4 w-4" />
            </Button>
            <Button variant="secondary">
              מאמר על שיחות לילה <FileText className="h-4 w-4" />
            </Button>
            <Button variant="secondary">
              Case study למוסך <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button className="mt-8" onClick={() => navigate("home")} variant="outline">
          חזרה לדף הבית
        </Button>
      </div>
    </section>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function DemoForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttempted(true);
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!name || phone.length < 8 || !isValidEmail(email)) return;

    setSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_LEAD_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, email })
      });

      if (!response.ok) {
        throw new Error("submit_failed");
      }

      setSubmitted(true);
      window.setTimeout(() => {
        onSuccess();
      }, 600);
    } catch {
      setSubmitError("לא הצלחנו לשלוח את הטופס. נסה שוב בעוד רגע.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="animate-fade-up p-8 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-accent/10 text-accent">
          <CheckCircle className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold">הטופס התקבל</h3>
        <p className="mt-3 text-muted-foreground">
          מעבירים אותך לדף האישור עם הצעדים הבאים.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">שם מלא</Label>
          <Input
            id="name"
            invalid={attempted}
            name="name"
            placeholder="מיכל ברק"
          />
        </div>
        <div>
          <Label htmlFor="phone">טלפון לחזרה</Label>
          <Input
            id="phone"
            invalid={attempted}
            name="phone"
            placeholder="050-1234567"
            type="tel"
          />
        </div>
        <div>
          <Label htmlFor="email">מייל</Label>
          <Input
            autoComplete="email"
            id="email"
            invalid={attempted}
            name="email"
            placeholder="name@company.co.il"
            type="email"
          />
        </div>
        <Button className="w-full" disabled={submitting} type="submit">
          {submitting ? "שולח..." : "הזמן דמו של 15 דקות"}{" "}
          {!submitting && <ArrowLeft className="h-4 w-4" />}
        </Button>
        {submitError && (
          <p className="text-center text-sm leading-6 text-[#E24B4A]">
            {submitError}
          </p>
        )}
        <p className="text-center text-sm leading-6 text-muted-foreground">
          בלי ספאם. נחזור רק כדי לבדוק התאמה לדמו.
        </p>
      </form>
    </Card>
  );
}

function PricingCard({
  name,
  price,
  features,
  cta,
  highlighted,
  onCta
}: {
  name: string;
  price: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  onCta: () => void;
}) {
  return (
    <Card
      className={cn(
        "p-6",
        highlighted && "border-primary/60 shadow-[0_0_0_1px_rgba(92,43,130,0.5)]"
      )}
    >
      {highlighted && (
        <span className="mb-4 inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent">
          מומלץ לצמיחה
        </span>
      )}
      <h3 className="text-2xl font-semibold">{name}</h3>
      <div className="mt-4 text-[32px] font-bold">{price}</div>
      <ul className="mt-6 space-y-3">
        {features.map((feature) => (
          <li className="flex items-center gap-3 text-muted-foreground" key={feature}>
            <Check className="h-4 w-4 text-accent" />
            {feature}
          </li>
        ))}
      </ul>
      <Button className="mt-8 w-full" onClick={onCta}>
        {cta}
      </Button>
    </Card>
  );
}

function HeroPhoneScreen() {
  return (
    <div className="hero-phone-screen">
      <div className="hero-phone-screen-list">
        {["מוסך - תקלה דחופה", "מרפאה - תיאום תור", "נדל״ן - דירה למכירה"].map(
          (item, index) => (
            <div
              className={cn(
                "hero-phone-screen-item",
                index === 0 && "hero-phone-screen-item-active"
              )}
              key={item}
            >
              <div>{item}</div>
              <small>לפני {index + 4} דקות</small>
            </div>
          )
        )}
      </div>
      <div className="hero-phone-screen-card">
        <div className="hero-phone-screen-card-head">
          <div>
            <small>ליד חדש</small>
            <strong>יוסי כהן · תקלה ברכב</strong>
          </div>
          <span>דחוף</span>
        </div>
        <p>
          הלקוח התקשר ב־22:41. הרכב לא מניע, נמצא באזור רמת גן, מבקש חזרה בבוקר
          מוקדם. הסכים לקבל SMS עם זמני טיפול.
        </p>
      </div>
      <div aria-hidden="true" className="hero-phone-screen-visual" />
    </div>
  );
}

function HeroPhoneMockups() {
  return (
    <div className="hero-phones-stage">
      <div className="hero-phones-group">
        <div className="hero-phone hero-phone-left">
          <div className="hero-phone-frame">
            <div className="hero-phone-notch" />
            <HeroPhoneScreen />
          </div>
        </div>
        <div className="hero-phone hero-phone-center">
          <div className="hero-phone-frame">
            <div className="hero-phone-notch" />
            <HeroPhoneScreen />
          </div>
        </div>
        <div className="hero-phone hero-phone-right">
          <div className="hero-phone-frame">
            <div className="hero-phone-notch" />
            <HeroPhoneScreen />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  copy,
  align = "center"
}: {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "center" | "right";
}) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-right"
      )}
    >
      <p className="mb-3 text-[13px] tracking-[0.02em] text-accent">{eyebrow}</p>
      <h2 className="text-[28px] font-semibold leading-[1.2] tracking-[-0.01em] md:text-[40px]">
        {title}
      </h2>
      <p className="mt-4 text-[17px] leading-[1.75] text-muted-foreground">{copy}</p>
    </div>
  );
}

function IconBubble({
  children,
  className
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid h-12 w-12 place-items-center rounded-lg bg-primary/15 text-accent",
        className
      )}
    >
      {children}
    </div>
  );
}

function Footer({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <footer className="border-t border-white/[0.06] bg-page py-8">
      <div className="container flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <button
          className="flex items-center gap-3 text-right"
          onClick={() => navigate("home")}
          type="button"
        >
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-primary/50 bg-primary/20 text-accent">
            <Bot className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-latin font-semibold">AI AfterHours</span>
            <span className="text-sm text-muted-foreground">
              Voice AI לעסקים ישראליים
            </span>
          </span>
        </button>
        <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">נגישות</a>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a href="mailto:hello@aiafterhours.co">hello@aiafterhours.co</a>
          <a aria-label="LinkedIn" href="#">
            <Link className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function scrollToDemo() {
  const element = document.getElementById("demo");
  element?.scrollIntoView({ behavior: "smooth" });
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={cn("h-4 w-4 shrink-0", className)}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ContactButtons({
  variant = "floating",
  className
}: {
  variant?: "inline" | "floating";
  className?: string;
}) {
  const showLabels = variant === "inline";

  return (
    <div
      aria-label="יצירת קשר"
      className={cn(
        "contact-actions",
        variant === "floating" && "contact-actions--floating",
        variant === "inline" && "contact-actions--inline",
        className
      )}
    >
      <a
        aria-label={`שלח הודעה בוואטסאפ ל-${CONTACT_PHONE}`}
        className="contact-btn contact-btn--whatsapp"
        href={`https://wa.me/${CONTACT_PHONE_INTL}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <WhatsAppIcon className="contact-btn-icon" />
        {showLabels && <span>וואטסאפ</span>}
      </a>
      <a
        aria-label={`התקשר אלינו: ${CONTACT_PHONE}`}
        className="contact-btn contact-btn--call"
        href={`tel:+${CONTACT_PHONE_INTL}`}
      >
        <Phone className="contact-btn-icon" />
        {showLabels && <span>התקשר</span>}
      </a>
    </div>
  );
}
