const KEYWORDS = new Set([
  "public", "void", "int", "boolean", "for", "if", "else", "break", "return",
  "class", "new", "static", "private", "true", "false", "while",
]);

// Small hand-rolled tokenizer -- good enough for readable Java highlighting
// without pulling in a full syntax-highlighting dependency.
function highlightLine(line) {
  const tokens = line.split(/(\s+|[(){}\[\];,.]|"[^"]*")/g).filter((t) => t !== "");

  return tokens.map((token, i) => {
    let className = "text-ink-100";
    if (KEYWORDS.has(token)) className = "text-signal-purple";
    else if (/^\d+$/.test(token)) className = "text-signal-amber";
    else if (/^".*"$/.test(token)) className = "text-signal-mint";
    else if (/^[(){}\[\];,.]$/.test(token)) className = "text-ink-500";
    else if (/^(arr|n|i|j|temp|swapped)$/.test(token)) className = "text-signal-sky";

    return (
      <span key={i} className={className}>
        {token}
      </span>
    );
  });
}

export default function CodePanel({ code, activeLine, fileName = "Solution.java" }) {
  const lines = code.split("\n");

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <div className="flex items-center gap-2 border-b border-ink-700 bg-ink-850 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-signal-coral/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal-amber/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-signal-mint/70" />
        <span className="ml-2 font-mono text-xs text-ink-500">{fileName}</span>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = lineNumber === activeLine;
          return (
            <div
              key={idx}
              className={`flex rounded px-2 -mx-2 transition-colors duration-150 ${
                isActive ? "bg-signal-purple/15 border-l-2 border-signal-purple" : "border-l-2 border-transparent"
              }`}
            >
              <span className="mr-4 w-5 shrink-0 select-none text-right text-ink-600">{lineNumber}</span>
              <code className="whitespace-pre">{highlightLine(line)}</code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
