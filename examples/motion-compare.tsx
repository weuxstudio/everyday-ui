// The three motion levels side by side, driven by one set of controls, optionally in slow motion.
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Badge, Button, SegmentedControl } from "@everyday-ui/react";
import { AnimatedList, MotionProvider, Reveal } from "@everyday-ui/react/motion";
import { MOTION_LEVELS } from "./motion-levels.gen";

const LEVELS = [
  { id: "minimal", title: "minimal", text: "Fades only. Nothing moves. Calm, fast, serious." },
  { id: "smooth", title: "smooth", text: "Short glide, no overshoot. The default." },
  { id: "playful", title: "playful", text: "Springs overshoot, items pop in, buttons squish." },
] as const;

const NAMES = ["Nordlicht GmbH", "Studio Krone", "Hafen & Söhne", "Lumen Labs", "Atelier Morgen", "Berliner Bäckerei"];

/** Scale every duration for slow motion; everything else stays as the theme defines it. */
function varsFor(level: keyof typeof MOTION_LEVELS, factor: number): CSSProperties {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(MOTION_LEVELS[level])) {
    out[`--eu-${k}`] = k.startsWith("duration-") ? `${parseFloat(v) * factor}ms` : v;
  }
  return out as CSSProperties;
}

export default function MotionCompare() {
  const [items, setItems] = useState(NAMES.slice(0, 3));
  const [message, setMessage] = useState(false);
  const [speed, setSpeed] = useState("1");
  const [playing, setPlaying] = useState(false);
  const next = useRef(3);
  const factor = Number(speed);

  const add = () => setItems((xs) => [NAMES[next.current++ % NAMES.length]! + (next.current > NAMES.length ? ` ${next.current}` : ""), ...xs]);
  const remove = () => setItems((xs) => xs.filter((_, i) => i !== 1));
  const shuffle = () => setItems((xs) => [...xs].reverse());

  // Scripted run, also used for the recording.
  useEffect(() => {
    if (!playing) return;
    const step = 1100 * Math.max(1, factor * 0.75);
    const script = [add, () => setMessage(true), shuffle, remove, () => setMessage(false), add];
    const timers = script.map((fn, i) => window.setTimeout(fn, 300 + i * step));
    timers.push(window.setTimeout(() => setPlaying(false), 300 + script.length * step));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-heading">Motion levels compared</h1>
          <p className="mt-2 text-lg text-ink-muted">Same components, same actions, three settings of the theme's <code>motion</code> knob.</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <Button variant="primary" onClick={() => setPlaying(true)} loading={playing}>
            Play demo
          </Button>
          <Button onClick={add}>Add item</Button>
          <Button onClick={remove}>Remove item</Button>
          <Button onClick={shuffle}>Reorder</Button>
          <Button onClick={() => setMessage((m) => !m)}>{message ? "Hide message" : "Show message"}</Button>
          <SegmentedControl
            label="Speed"
            hideLabel
            value={speed}
            onValueChange={setSpeed}
            options={[
              { value: "1", label: "Real speed" },
              { value: "4", label: "Slow motion ×4" },
            ]}
          />
        </div>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {LEVELS.map((l) => (
          <MotionProvider key={`${l.id}-${speed}`} style={varsFor(l.id, factor)}>
            <section aria-labelledby={`lvl-${l.id}`} className="flex flex-col gap-4 rounded-card border border-border bg-surface p-card">
              <div>
                <h2 id={`lvl-${l.id}`} className="text-xl font-heading">
                  {l.title}
                </h2>
                <p className="mt-1 min-h-[3em] text-sm text-ink-muted">{l.text}</p>
              </div>
              <Button variant="primary" fullWidth>
                Press and hold me
              </Button>
              <div className="min-h-[4.5rem]">
                <Reveal show={message}>
                  <p className="flex items-center gap-2 rounded-control border border-success bg-success-subtle px-3 py-3 text-sm font-semibold text-success" role="status">
                    ✓ Invoice sent to Nordlicht GmbH
                  </p>
                </Reveal>
              </div>
              <AnimatedList
                items={items}
                getKey={(x) => x}
                className="flex min-h-[16rem] flex-col gap-2"
                itemClassName="flex min-h-touch items-center justify-between gap-3 rounded-control border border-border bg-paper px-3"
                renderItem={(x) => (
                  <>
                    <span className="truncate">{x}</span>
                    <Badge>Open</Badge>
                  </>
                )}
              />
            </section>
          </MotionProvider>
        ))}
      </div>
    </main>
  );
}
