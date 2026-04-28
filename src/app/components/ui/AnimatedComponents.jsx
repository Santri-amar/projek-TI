import { motion } from "motion/react";
import { useState, useEffect, useRef } from "react";

/**
 * SplitText — Animated text that reveals letter by letter
 * Inspired by React Bits LetterPullup
 */
export function SplitText({ text = "", className = "", delay = 0 }) {
  const letters = text.split("");

  return (
    <span className={className} aria-label={text}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: delay + i * 0.03,
            duration: 0.4,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
          style={{ display: "inline-block", whiteSpace: letter === " " ? "pre" : "normal" }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

/**
 * AnimatedCounter — Counts from 0 to target number with smooth animation
 * Inspired by React Bits NumberTicker
 */
export function AnimatedCounter({ value, duration = 1.5, className = "", prefix = "", suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.]/g, "")) : value;

  useEffect(() => {
    if (isNaN(numericValue)) return;

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * numericValue));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(numericValue);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [numericValue, duration]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {prefix}{isNaN(numericValue) ? value : count}{suffix}
    </motion.span>
  );
}

/**
 * GradientText — Text with animated gradient
 * Inspired by React Bits GradientText
 */
export function GradientText({ children, className = "", from = "#6366f1", via = "#a855f7", to = "#6366f1" }) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: `linear-gradient(135deg, ${from}, ${via}, ${to})`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        backgroundSize: "200% 200%",
        animation: "gradientShift 3s ease infinite",
      }}
    >
      {children}
    </motion.span>
  );
}

/**
 * FadeInUp — Wrapper that fades content in from below
 */
export function FadeInUp({ children, delay = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.6,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * ShinyCard — Card with subtle shine effect on hover
 */
export function ShinyCard({ children, className = "" }) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ position: "relative" }}
    >
      {children}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: "-100%",
          width: "50%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          pointerEvents: "none",
        }}
        whileHover={{
          left: "150%",
          transition: { duration: 0.8, ease: "easeInOut" },
        }}
      />
    </motion.div>
  );
}

/**
 * StaggerContainer — Animates children with staggered delays
 */
export function StaggerContainer({ children, className = "", staggerDelay = 0.1 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: staggerDelay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = "" }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
