import { useEffect, useMemo, useState } from "react";

const INITIAL = [64, 34, 25, 12, 22];
const SPEEDS = { 1: 0.5, 2: 1, 3: 1.8 };

// Build every frame of a bubble sort once, then just play them in a loop.
function buildFrames() {
  const items = [...INITIAL];
  const n = items.length;
  const sorted = [];
  const frames = [];
  let step = 0;

  const push = (extra) =>
    frames.push({ items: [...items], active: [], swapping: [], sorted: [...sorted], step, ...extra });

  push({ status: `Initializing array: [${INITIAL.join(", ")}]`, delay: 1400 });

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      step++;
      push({
        active: [j, j + 1],
        status: `Comparing index ${j} (${items[j]}) and ${j + 1} (${items[j + 1]})...`,
        delay: 900,
      });
      if (items[j] > items[j + 1]) {
        push({ swapping: [j, j + 1], status: `Swapping elements: ${items[j]} > ${items[j + 1]}`, delay: 600 });
        [items[j], items[j + 1]] = [items[j + 1], items[j]];
        push({ swapping: [j, j + 1], status: "Swapped!", delay: 600 });
      }
    }
    sorted.push(n - i - 1);
  }

  push({ status: "Array sorting complete!", delay: 2500 });
  push({ status: "Resetting array for next cycle...", delay: 1000 });
  return frames;
}

function boxClass(state) {
  const base =
    "flex h-12 w-12 items-center justify-center rounded-xl font-mono text-base font-bold transition-all duration-300 sm:h-16 sm:w-16 sm:text-lg";
  if (state === "compare")
    return `${base} scale-105 border-2 border-signal-sky bg-signal-sky/10 text-signal-sky shadow-glow`;
  if (state === "swap")
    return `${base} scale-110 border-2 border-signal-purple bg-signal-purple/15 text-signal-purple shadow-glow`;
  if (state === "sorted")
    return `${base} border-2 border-signal-mint/70 bg-signal-mint/10 text-signal-mint`;
  return `${base} border border-ink-600 bg-ink-800 text-ink-100`;
}

export default function HeroVisualizer() {
  const frames = useMemo(buildFrames, []);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(2);
  const frame = frames[index];

  useEffect(() => {
    if (!playing) return undefined;
    const id = setTimeout(
      () => setIndex((i) => (i + 1) % frames.length),
      frame.delay / SPEEDS[speed]
    );
    return () => clearTimeout(id);
  }, [index, playing, speed, frame.delay, frames.length]);

  return (
    <div className="mx-auto mt-16 w-full max-w-xl overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/80 p-6 text-left shadow-2xl backdrop-blur sm:p-8">
      {/* top bar */}
      <div className="mb-8 flex items-center justify-between border-b border-ink-700 pb-3 font-mono text-xs text-ink-400">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal-coral/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-ink-500" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-signal-mint/80" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="hidden text-[11px] text-ink-500 sm:inline">Speed:</span>
            <input
              type="range"
              min="1"
              max="3"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="h-1 w-16 cursor-pointer accent-signal-purple"
              aria-label="Animation speed"
            />
          </label>
          <span className="text-ink-500">Step: {frame.step}</span>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="rounded bg-ink-800 p-1 transition hover:bg-ink-700 hover:text-ink-50"
            aria-label={playing ? "Pause animation" : "Play animation"}
          >
            {playing ? (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* array */}
      <div className="flex min-h-[120px] items-center justify-center gap-3 py-2 sm:gap-4">
        {frame.items.map((value, idx) => {
          const state = frame.swapping.includes(idx)
            ? "swap"
            : frame.active.includes(idx)
            ? "compare"
            : frame.sorted.includes(idx)
            ? "sorted"
            : "idle";
          return (
            <div key={idx} className="flex flex-col items-center">
              <div className={boxClass(state)}>{value}</div>
              <span className="mt-2 font-mono text-[11px] text-ink-500">{idx}</span>
            </div>
          );
        })}
      </div>

      {/* status */}
      <div className="mt-6 flex items-center justify-between border-t border-ink-700 pt-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-ink-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-mint opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-mint" />
          </span>
          <span className="max-w-[260px] truncate sm:max-w-none">{frame.status}</span>
        </div>
        <span className="hidden text-ink-500 sm:block">{playing ? "Looping automatically" : "Paused"}</span>
      </div>
    </div>
  );
}
