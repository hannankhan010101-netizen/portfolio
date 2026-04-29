"use client";

import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { MOTION_DURATION, MOTION_EASE } from "@/constants/motion";

type RevealTag = "div" | "article" | "li";

interface RevealItemProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
  readonly as?: RevealTag;
  readonly hoverLift?: boolean;
}

/**
 * Scroll-in lift with optional hover lift for cards and list rows.
 */
export function RevealItem({
  children,
  className,
  delay = 0,
  as = "div",
  hoverLift = true,
}: RevealItemProps) {
  const ref = useRef<HTMLDivElement | HTMLLIElement | HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(ref, {
    once: true,
    amount: "some",
    margin: "0px 0px 14% 0px",
  });

  const shared = {
    ref,
    className,
    initial: prefersReducedMotion ? false : { opacity: 1, y: 22 },
    animate: prefersReducedMotion
      ? undefined
      : isInView
        ? { opacity: 1, y: 0 }
        : { opacity: 1, y: 22 },
    transition: {
      duration: MOTION_DURATION.slow,
      ease: MOTION_EASE,
      delay,
    },
    whileHover:
      prefersReducedMotion || !hoverLift
        ? undefined
        : {
            y: -4,
            transition: { duration: 0.22, ease: MOTION_EASE },
          },
  };

  if (as === "article") {
    return (
      <motion.article {...shared} ref={ref as React.RefObject<HTMLElement>}>
        {children}
      </motion.article>
    );
  }

  if (as === "li") {
    return (
      <motion.li {...shared} ref={ref as React.RefObject<HTMLLIElement>}>
        {children}
      </motion.li>
    );
  }

  return (
    <motion.div {...shared} ref={ref as React.RefObject<HTMLDivElement>}>
      {children}
    </motion.div>
  );
}
