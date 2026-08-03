const SPEED_OPTIONS = [0.5, 1, 1.5, 2];

export default function PlaybackControls({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  onScrub,
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  onReset,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-ink-700 bg-ink-850 px-4 py-3">
      <button
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-signal-purple text-ink-950 transition hover:brightness-110"
      >
        {isPlaying ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <rect x="2" y="1" width="4" height="12" rx="1" />
            <rect x="8" y="1" width="4" height="12" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M2 1.5v11l10-5.5-10-5.5z" />
          </svg>
        )}
      </button>

      <button
        onClick={onPrev}
        disabled={currentStep === 0}
        aria-label="Previous step"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition hover:border-signal-purple hover:text-signal-purple disabled:opacity-30"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M10 1v10L2 6z" />
        </svg>
      </button>

      <button
        onClick={onNext}
        disabled={currentStep === totalSteps - 1}
        aria-label="Next step"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-600 text-ink-200 transition hover:border-signal-purple hover:text-signal-purple disabled:opacity-30"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <path d="M2 1v10l8-5z" />
        </svg>
      </button>

      <input
        type="range"
        min={0}
        max={Math.max(totalSteps - 1, 0)}
        value={currentStep}
        onChange={(e) => onScrub(Number(e.target.value))}
        className="h-1.5 flex-1 min-w-[120px] cursor-pointer appearance-none rounded-full bg-ink-700 accent-signal-purple"
      />

      <span className="whitespace-nowrap font-mono text-xs text-ink-500">
        {currentStep} / {Math.max(totalSteps - 1, 0)}
      </span>

      <select
        value={speed}
        onChange={(e) => onSpeedChange(Number(e.target.value))}
        className="rounded-lg border border-ink-600 bg-ink-800 px-2 py-1 text-xs text-ink-200 outline-none"
      >
        {SPEED_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}x
          </option>
        ))}
      </select>

      <button
        onClick={onReset}
        className="rounded-lg border border-ink-600 px-3 py-1 text-xs text-ink-300 transition hover:border-signal-coral hover:text-signal-coral"
      >
        Reset
      </button>
    </div>
  );
}
