import { motion, AnimatePresence } from "framer-motion";

// Renders the array as a row of animated boxes, matching the reference
// animation style: value on top, index below, glowing pointer tags for the
// indices currently being compared, colour states for compare / swap / sorted.
//
// `array` is a list of { id, value } elements. Keying by `id` instead of
// array position is what makes Framer Motion's `layout` animation physically
// slide a box to its new slot when two elements swap.
//
// `pointers` is a list of { index, label } driven entirely by the current
// algorithm's step data -- e.g. bubble sort sends "j"/"j+1", selection sort
// sends "min"/"i"/"j". This component doesn't know about any algorithm in
// advance, which is what lets new algorithms plug in without editing this file.
export default function ArrayVisualizer({ array, compareIndices = [], sortedIndices = [], stepType, pointers = [] }) {
  const labelsForIndex = (idx) => pointers.filter((p) => p.index === idx).map((p) => p.label);

  const stateForIndex = (idx) => {
    if (sortedIndices.includes(idx)) return "sorted";
    if (compareIndices.includes(idx)) return stepType === "swap" ? "swap" : "compare";
    return "idle";
  };

  const stylesFor = (state) => {
    switch (state) {
      case "sorted":
        return "border-signal-mint/70 bg-signal-mint/10 shadow-glowMint text-signal-mint";
      case "swap":
        return "border-signal-coral bg-signal-coral/15 shadow-glowCoral text-signal-coral";
      case "compare":
        return "border-signal-sky bg-signal-sky/10 shadow-glow text-signal-sky";
      default:
        return "border-ink-600 bg-ink-800 text-ink-100";
    }
  };

  return (
    <div className="relative flex min-h-[220px] w-full items-center justify-center overflow-x-auto rounded-2xl border border-ink-700 bg-ink-900 bg-dot-grid px-6 py-10">
      <div className="flex items-end gap-3 sm:gap-4">
        <AnimatePresence initial={false}>
          {array.map((el, idx) => {
            const state = stateForIndex(idx);
            const labels = labelsForIndex(idx);

            return (
              <motion.div
                key={el.id}
                layout
                transition={{ type: "spring", stiffness: 350, damping: 28 }}
                className="flex flex-col items-center gap-2"
              >
                {/* pointer tag(s) -- driven entirely by the step's `pointers` list, so any
                    algorithm can label any index without this component knowing about it in advance */}
                <div className="h-6 text-[11px] font-mono font-medium">
                  {labels.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-full bg-signal-sky/20 px-2 py-0.5 text-signal-sky"
                    >
                      {labels.join(" / ")}
                    </motion.span>
                  )}
                </div>

                <motion.div
                  layout
                  animate={{ scale: state === "swap" ? 1.08 : 1 }}
                  transition={{ type: "spring", stiffness: 380, damping: 20 }}
                  className={`flex h-16 w-16 items-center justify-center rounded-xl border-2 font-display text-xl font-semibold transition-colors duration-200 sm:h-[72px] sm:w-[72px] ${stylesFor(
                    state
                  )}`}
                >
                  {el.value}
                </motion.div>

                <span className="font-mono text-[11px] text-ink-500">{idx}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}