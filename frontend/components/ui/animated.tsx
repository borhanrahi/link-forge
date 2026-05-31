"use client";

import { useRef, useState, useEffect } from "react";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── AnimatedSection — Fade/slide in on scroll ───

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  once?: boolean;
}

const directionVariants: Record<string, Variants> = {
  up: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  direction = "up",
  duration = 0.5,
  once = true,
}: AnimatedSectionProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={directionVariants[direction]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer — Staggered children animations ───

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  delay?: number;
  once?: boolean;
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  delay = 0,
  once = true,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Spotlight — Cinematic light beam ───

interface SpotlightProps {
  className?: string;
  fill?: string;
}

export function Spotlight({ className, fill = "white" }: SpotlightProps) {
  return (
    <svg
      className={cn(
        "pointer-events-none absolute z-0 h-[169%] w-[138%] animate-spotlight opacity-0 lg:w-[84%]",
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#spotlight-filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          fill={fill}
          fillOpacity="0.08"
        />
      </g>
      <defs>
        <filter
          id="spotlight-filter"
          x="0"
          y="0"
          width="3787"
          height="2842"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="120" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
}

// ─── ShimmerButton — Button with shimmer sweep ───

interface ShimmerButtonProps {
  children: React.ReactNode;
  className?: string;
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  size?: "sm" | "default" | "lg";
}

export function ShimmerButton({
  children,
  className,
  as = "button",
  href,
  onClick,
  type = "button",
  size = "default",
}: ShimmerButtonProps) {
  const sizeClasses = {
    sm: "h-9 px-4 text-xs gap-1.5",
    default: "h-11 px-6 text-sm gap-2",
    lg: "h-13 px-8 text-base gap-2.5",
  };

  const baseClasses = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-xl font-medium",
    "transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-500/25 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
    "select-none",
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      <span className="absolute inset-0 -z-0 bg-[linear-gradient(110deg,transparent_0%,transparent_35%,rgb(255_255_255/0.15)_50%,transparent_65%,transparent_100%)] bg-[length:200%_100%] animate-shimmer" />
    </>
  );

  if (as === "a" && href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={baseClasses}>
      {content}
    </button>
  );
}

// ─── TextReveal — Word-by-word text animation ───

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function TextReveal({ text, className, delay = 0, once = true }: TextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.p
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-50px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.04,
            delayChildren: delay,
          },
        },
      }}
      className={cn("inline", className)}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block">
          <motion.span
            variants={{
              hidden: { opacity: 0, filter: "blur(4px)", y: 8 },
              visible: { opacity: 1, filter: "blur(0px)", y: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {i < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </motion.p>
  );
}

// ─── HoverCard — Card with enhanced hover effects ───

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function HoverCard({ children, className, glowColor }: HoverCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("group relative overflow-hidden transition-all duration-300", className)}
    >
      {/* Spotlight glow following cursor */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300",
          isHovered && "opacity-100",
        )}
        style={{
          background: `radial-gradient(400px circle at ${position.x}% ${position.y}%, ${glowColor || "rgb(212 120 68 / 0.08)"}, transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

// ─── GradientBorder — Gradient animated border ───

interface GradientBorderProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}

export function GradientBorder({
  children,
  className,
  containerClassName,
  animate = true,
}: GradientBorderProps) {
  return (
    <div className={cn("group relative", containerClassName)}>
      <div
        className={cn(
          "absolute -inset-[1px] rounded-xl bg-gradient-to-r from-terracotta-400 via-terracotta-600 to-terracotta-400 opacity-40 transition-opacity duration-300 group-hover:opacity-70",
          animate && "animate-gradient-x bg-[length:200%_100%]",
        )}
      />
      <div className={cn("relative rounded-[11px] bg-neutral-900", className)}>
        {children}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NEW ACETERNITY-INSPIRED COMPONENTS
// ═══════════════════════════════════════════════════════════════

// ─── FlipWords — Animated word cycling ───

interface FlipWordsProps {
  words: string[];
  className?: string;
  duration?: number;
}

export function FlipWords({ words, className, duration = 2500 }: FlipWordsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isAnimating) return;
    const timer = setTimeout(() => {
      setIsAnimating(true);
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [currentIndex, duration, isAnimating, words.length]);

  return (
    <span className={cn("relative inline-block", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[currentIndex]}
          initial={{ opacity: 0, y: 10, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -10, rotateX: 40 }}
          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
          onAnimationComplete={() => setIsAnimating(false)}
          className="inline-block"
        >
          {words[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ─── AnimatedCounter — Count-up on scroll ───

interface AnimatedCounterProps {
  from?: number;
  to: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
  once?: boolean;
}

export function AnimatedCounter({
  from = 0,
  to,
  suffix = "",
  prefix = "",
  className,
  duration = 2,
  once = true,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setHasAnimated(true);
          const startTime = performance.now();
          const step = (now: number) => {
            const elapsed = (now - startTime) / 1000;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(from + (to - from) * eased));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [from, to, duration, once, hasAnimated]);

  const displayVal = count >= 1000
    ? count >= 1000000
      ? (count / 1000000).toFixed(1) + "M"
      : (count / 1000).toFixed(0) + "K"
    : String(count);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}{displayVal}{suffix}
    </span>
  );
}

// ─── Accordion — Animated FAQ / expandable items ───

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  return (
    <div className={cn("divide-y divide-neutral-200", className)}>
      {items.map((item, i) => {
        const isOpen = openItems.has(i);
        return (
          <div key={i} className="py-3 first:pt-0 last:pb-0">
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 py-3 text-left transition-colors hover:text-terracotta-600"
            >
              <span className="text-base font-medium text-neutral-800">
                {item.title}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="shrink-0 text-neutral-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-4 text-sm text-neutral-600 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── WobbleCard — Card with 3D tilt on hover ───

interface WobbleCardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  intensity?: number;
}

export function WobbleCard({
  children,
  className,
  containerClassName,
  intensity = 10,
}: WobbleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);
    setRotateX(-deltaY * intensity);
    setRotateY(deltaX * intensity);
    setScale(1.02);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
        transition: "transform 0.15s ease-out",
      }}
      className={cn("will-change-transform", containerClassName)}
    >
      <div className={cn("relative overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
}

// ─── Marquee — Infinite scrolling cards ───

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  speed?: number;
  pauseOnHover?: boolean;
}

export function Marquee({
  children,
  className,
  direction = "left",
  speed = 30,
  pauseOnHover = true,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative flex overflow-hidden",
        pauseOnHover && "[&:hover>div]:[animation-play-state:paused]",
        className,
      )}
    >
      <motion.div
        className="flex shrink-0 gap-4"
        animate={{
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {children}
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 gap-4">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Particles — Floating particle background ───

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ParticlesProps {
  className?: string;
  quantity?: number;
  color?: string;
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
}

export function Particles({
  className,
  quantity = 30,
  color = "212 120 68",
  size = { min: 2, max: 6 },
  speed = { min: 8, max: 20 },
}: ParticlesProps) {
  const [mounted, setMounted] = useState(false);
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: quantity }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: size.min + Math.random() * (size.max - size.min),
      opacity: 0.15 + Math.random() * 0.25,
      duration: speed.min + Math.random() * (speed.max - speed.min),
      delay: Math.random() * 5,
    })),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgb(${color} / ${p.opacity})`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            opacity: [p.opacity, p.opacity * 0.5, p.opacity, p.opacity * 0.6, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
