import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export function DateCard() {
  const [time, setTime] = useState(getCurrentTime());
  const [date, setDate] = useState(getFormattedDate());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getCurrentTime());
      setDate(getFormattedDate());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="
      relative w-[230px] h-20 rounded-xl p-5 overflow-hidden shadow-lg border
        bg-white dark:bg-neutral-900 
      flex items-center
        border-neutral-200 dark:border-neutral-800
      "
    >
      {/* GREEN Animated Background */}
      <motion.div className="absolute inset-0 opacity-30" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div
            className="
              w-12 h-12 p-1 rounded-xl flex items-center justify-center
              bg-white/40 dark:bg-white/10
              border border-white/40 dark:border-white/20
              backdrop-blur-xl shadow-xl
            "
          >
            <Calendar className="w-6 h-6 text-neutral-800 dark:text-neutral-200" />
          </div>

          <div className="flex flex-col">
            <p className="text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
              {date}
            </p>
            <p className="text-xs uppercase tracking-wide text-neutral-700 dark:text-neutral-300">
              {time.hours} : {time.minutes}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Helpers ---------------- */

function getFormattedDate() {
  const today = new Date();
  return today.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });
}

function getCurrentTime() {
  const now = new Date();
  return {
    hours: String(now.getHours()).padStart(2, "0"),
    minutes: String(now.getMinutes()).padStart(2, "0"),
    seconds: String(now.getSeconds()).padStart(2, "0"),
  };
}

/* ---------------- Flip Unit ---------------- */

function FlipUnit({ value }) {
  return (
    <div className="relative w-12 h-14 perspective-500">
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ rotateX: 90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: -90, opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="

              bg-white/40 dark:bg-white/10
              border border-white/40 dark:border-white/20
              backdrop-blur-xl shadow
            absolute inset-0 flex items-center justify-center
            rounded-xl 
            text-neutral-900 dark:text-white
            text-xl font-semibold
          "
        >
          {value}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
