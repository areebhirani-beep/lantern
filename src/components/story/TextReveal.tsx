"use client";

import { type FC, type ReactNode, useRef } from "react";
import { motion, type MotionValue, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

// Adapted from the Magic UI / 21st.dev "Text Reveal" component: words illuminate
// from dim to bright as you scroll. Recolored to the Lantern palette and set in
// the display serif. The scroll target is the tall outer container.

interface TextRevealByWordProps {
  text: string;
  className?: string;
}

export const TextRevealByWord: FC<TextRevealByWordProps> = ({ text, className }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const words = text.split(" ");

  return (
    <div ref={targetRef} className={cn("relative z-0 h-[200vh]", className)}>
      <div className="sticky top-0 mx-auto flex h-[50%] max-w-4xl items-center bg-transparent px-5 py-[5rem]">
        <p className="flex flex-wrap p-5 font-display text-3xl font-medium leading-tight text-cream/15 md:p-8 md:text-4xl lg:p-10 lg:text-5xl xl:text-[3.4rem]">
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return (
              <Word key={i} progress={scrollYProgress} range={[start, end]}>
                {word}
              </Word>
            );
          })}
        </p>
      </div>
    </div>
  );
};

interface WordProps {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);
  return (
    <span className="relative mx-1 lg:mx-1.5">
      <span className="absolute opacity-20">{children}</span>
      <motion.span style={{ opacity }} className="text-cream">
        {children}
      </motion.span>
    </span>
  );
};
