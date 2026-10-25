import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { getAlgorithmBySlug } from "../algorithms/registry.js";
import ArrayVisualizer from "../components/visualizer/ArrayVisualizer.jsx";
import PlaybackControls from "../components/visualizer/PlaybackControls.jsx";
import CodePanel from "../components/visualizer/CodePanel.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

const SPEED_TO_MS = (speed) => 900 / speed;

function randomArray(size = 7) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
}

export default function AlgorithmPage() {
  const { slug } = useParams();
  const algo = getAlgorithmBySlug(slug);
  const { user } = useAuth();

  const [rawInput, setRawInput] = useState(() => (algo?.defaultArray || []).join(", "));
  const [inputArray, setInputArray] = useState(algo?.defaultArray || []);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [inputError, setInputError] = useState("");
  const hasLoggedRun = useRef(false);
  const hasLoggedComplete = useRef(false);

  const steps = useMemo(() => (algo ? algo.generateSteps(inputArray) : []), [algo, inputArray]);
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    hasLoggedRun.current = false;
    hasLoggedComplete.current = false;
  }, [inputArray, algo]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => {
      setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, SPEED_TO_MS(speed));
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const logRun = useCallback(() => {
    if (!user || hasLoggedRun.current || !algo) return;
    hasLoggedRun.current = true;
    api.post("/progress/run", { algorithmSlug: algo.slug, category: algo.category }).catch(() => {});
  }, [user, algo]);

  useEffect(() => {
    if (currentStep?.type === "done" && user && algo && !hasLoggedComplete.current) {
      hasLoggedComplete.current = true;
      api
        .post("/progress/complete", { algorithmSlug: algo.slug, category: algo.category })
        .catch(() => {});
    }
  }, [currentStep, user, algo]);

  if (!algo) return <Navigate to="/topics" replace />;

  if (!algo.implemented) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink-50">{algo.name} is coming soon</h1>
        <p className="mt-3 text-ink-400">This visualizer hasn't been built yet. Check back soon!</p>
        <Link to="/topics" className="mt-8 inline-block text-signal-purple hover:underline">
          &larr; Back to topics
        </Link>
      </div>
    );
  }

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    logRun();
    setIsPlaying((p) => !p);
  };

  const applyInput = () => {
    const parsed = rawInput
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v !== "")
      .map(Number);

    if (parsed.length < 2 || parsed.length > 12 || parsed.some((n) => Number.isNaN(n))) {
      setInputError("Enter 2 to 12 comma-separated numbers, e.g. 64, 34, 25, 12");
      return;
    }
    setInputError("");
    setInputArray(parsed);
  };

  const handleRandomize = () => {
    const arr = randomArray(7);
    setRawInput(arr.join(", "));
    setInputArray(arr);
    setInputError("");
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <Link to="/topics" className="text-sm text-ink-500 transition hover:text-signal-purple">
        &larr; Back to topics
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-3xl font-semibold text-ink-50 sm:text-4xl">{algo.name}</h1>
        <span className="rounded-full bg-signal-mint/15 px-3 py-1 text-xs font-medium text-signal-mint">
          {algo.difficulty}
        </span>
      </div>

      {/* Explanation */}
      <section className="mt-6 space-y-3">
        {algo.explanation.map((p, i) => (
          <p key={i} className="max-w-3xl text-ink-300 leading-relaxed">
            {p}
          </p>
        ))}
      </section>

      {/* Visualizer */}
      <section className="mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-display text-lg font-semibold text-ink-100">Visualizer</h2>
          <div className="flex flex-wrap items-center gap-2">
            <input
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="64, 34, 25, 12"
              className="w-56 rounded-lg border border-ink-600 bg-ink-800 px-3 py-1.5 font-mono text-xs text-ink-100 outline-none focus:border-signal-purple"
            />
            <button
              onClick={applyInput}
              className="rounded-lg bg-signal-purple px-3 py-1.5 text-xs font-medium text-ink-950 transition hover:brightness-110"
            >
              Apply
            </button>
            <button
              onClick={handleRandomize}
              className="rounded-lg border border-ink-600 px-3 py-1.5 text-xs text-ink-200 transition hover:border-signal-purple hover:text-signal-purple"
            >
              Randomize
            </button>
          </div>
        </div>
        {inputError && <p className="mb-3 text-xs text-signal-coral">{inputError}</p>}

        <ArrayVisualizer
          array={currentStep?.array || inputArray}
          compareIndices={currentStep?.compareIndices || []}
          sortedIndices={currentStep?.sortedIndices || []}
          stepType={currentStep?.type}
        />

        <div className="mt-4 flex items-center gap-3 rounded-xl border-l-2 border-signal-purple bg-ink-850 px-4 py-3">
          <span className="text-xs font-mono uppercase tracking-wide text-ink-500">Step</span>
          <span className="text-sm text-ink-200">{currentStep?.description}</span>
        </div>

        <div className="mt-4">
          <PlaybackControls
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            onPrev={() => setCurrentStepIndex((i) => Math.max(i - 1, 0))}
            onNext={() => {
              logRun();
              setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
            }}
            onScrub={(v) => setCurrentStepIndex(v)}
            currentStep={currentStepIndex}
            totalSteps={steps.length}
            speed={speed}
            onSpeedChange={setSpeed}
            onReset={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
          />
        </div>

        {currentStep?.type === "done" && !user && (
          <div className="mt-4 rounded-xl border border-signal-purple/40 bg-signal-purple/10 px-4 py-3 text-sm text-ink-200">
            Nicely sorted! <Link to="/signup" className="font-medium text-signal-purple hover:underline">Create a free account</Link> to save this to your progress.
          </div>
        )}
      </section>

      {/* Code + Complexity */}
      <section className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-100">Java implementation</h2>
          <CodePanel
            code={algo.javaCode}
            activeLine={currentStep?.line}
            fileName={`${algo.name.replace(/\s+/g, "")}.java`}
          />
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-100">Time &amp; space complexity</h2>
          <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-850">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-ink-700">
                  <td className="px-4 py-3 text-ink-400">Best case</td>
                  <td className="px-4 py-3 text-right font-mono text-signal-mint">{algo.complexity.time.best}</td>
                </tr>
                <tr className="border-b border-ink-700">
                  <td className="px-4 py-3 text-ink-400">Average case</td>
                  <td className="px-4 py-3 text-right font-mono text-signal-amber">{algo.complexity.time.average}</td>
                </tr>
                <tr className="border-b border-ink-700">
                  <td className="px-4 py-3 text-ink-400">Worst case</td>
                  <td className="px-4 py-3 text-right font-mono text-signal-coral">{algo.complexity.time.worst}</td>
                </tr>
                <tr className="border-b border-ink-700">
                  <td className="px-4 py-3 text-ink-400">Space</td>
                  <td className="px-4 py-3 text-right font-mono text-signal-sky">{algo.complexity.space}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-ink-400">Stable / In-place</td>
                  <td className="px-4 py-3 text-right font-mono text-ink-200">
                    {algo.complexity.stable ? "Stable" : "Unstable"} &middot; {algo.complexity.inPlace ? "In-place" : "Extra space"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-400">{algo.complexityNotes}</p>
        </div>
      </section>
    </div>
  );
}
