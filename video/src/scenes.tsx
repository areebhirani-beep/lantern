import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C } from "./theme";
import {
  Backdrop,
  Center,
  display,
  FadeUp,
  Flame,
  gradientText,
  Logo,
  sans,
} from "./components";

/** Fades the whole scene out over its final frames for a soft cut. */
function useOutro(frames = 16) {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const durationInFrames = useVideoConfig().durationInFrames / 2;
  return interpolate(
    frame,
    [durationInFrames - frames, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
}

function Chip({ mi, en }: { mi: string; en: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 14,
        padding: "12px 22px",
        borderRadius: 999,
        border: `1px solid ${C.line}`,
        background: "rgba(255,255,255,0.03)",
      }}
    >
      <span style={{ ...display(30) }}>{mi}</span>
      <span style={{ ...sans(22, C.muted) }}>{en}</span>
    </div>
  );
}

// 1 ─ The person ─────────────────────────────────────────────────────────────
export const ColdOpen: React.FC = () => {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const { fps } = useVideoConfig();
  const grow = spring({ frame, fps: fps / 2, config: { damping: 200 }, durationInFrames: 40 });
  const opacity = useOutro();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop intensity={0.22} />
      <Center>
        <div style={{ transform: `scale(${0.4 + grow * 0.6})` }}>
          <Flame size={104} />
        </div>
        <FadeUp delay={34} style={{ marginTop: 56, maxWidth: 1500 }}>
          <div style={display(62)}>
            My grandmother dreams in a
            <br />language I was never taught.
          </div>
        </FadeUp>
      </Center>
    </AbsoluteFill>
  );
};

// 2 ─ The loss ───────────────────────────────────────────────────────────────
export const Stakes: React.FC = () => {
  const opacity = useOutro();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop />
      <Center>
        <FadeUp style={{ maxWidth: 1300 }}>
          <div style={display(64)}>
            Every two weeks, somewhere on Earth,
            <br />a language takes its last breath.
          </div>
        </FadeUp>
        <FadeUp delay={45} style={{ marginTop: 56 }}>
          <div style={{ ...display(52), color: C.ember }}>Hers is on that list.</div>
        </FadeUp>
      </Center>
    </AbsoluteFill>
  );
};

// 3 ─ The turn (we wrote it down) ────────────────────────────────────────────
export const MeetLantern: React.FC = () => {
  const opacity = useOutro();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop intensity={0.18} />
      <Center>
        <FadeUp style={{ maxWidth: 1200 }}>
          <div style={display(58)}>So we wrote down what she remembers.</div>
        </FadeUp>
        <FadeUp delay={26} style={{ marginTop: 44, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, maxWidth: 1200 }}>
          <Chip mi="Kia ora" en="hello" />
          <Chip mi="whānau" en="family" />
          <Chip mi="tama" en="son" />
          <Chip mi="wai" en="water" />
          <Chip mi="I haere au" en="I went" />
        </FadeUp>
        <FadeUp delay={56} style={{ marginTop: 44 }}>
          <div style={sans(30, C.muted)}>
            Forty-one phrases. That was all. Then we gave them to{" "}
            <span style={{ fontFamily: "var(--font-fraunces)", color: C.flame }}>Lantern</span>.
          </div>
        </FadeUp>
      </Center>
    </AbsoluteFill>
  );
};

// 4 ─ The mechanism ──────────────────────────────────────────────────────────
const STEPS = [
  { n: "01", title: "Her words", body: "The only thing the AI is allowed to learn from." },
  { n: "02", title: "The grammar, found", body: "It saw the tense system hiding in her sentences." },
  { n: "03", title: "A course, built", body: "Flashcards, pronunciation, spaced repetition, in minutes." },
  { n: "04", title: "And growing", body: "Every new phrase makes her language larger again." },
];

export const Mechanism: React.FC = () => {
  const opacity = useOutro();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop />
      <Center>
        <FadeUp>
          <div style={display(54)}>
            A course took shape, in <span style={gradientText}>minutes</span>, not years.
          </div>
        </FadeUp>
        <div style={{ display: "flex", gap: 28, marginTop: 70 }}>
          {STEPS.map((s, i) => (
            <FadeUp key={s.title} delay={30 + i * 24}>
              <div
                style={{
                  width: 360,
                  height: 290,
                  borderRadius: 24,
                  border: `1px solid ${C.line}`,
                  background: "rgba(255,255,255,0.03)",
                  padding: 34,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Flame size={36} />
                  <span style={{ ...display(26, C.faint) }}>{s.n}</span>
                </div>
                <div style={{ ...display(40), textAlign: "left", marginTop: 30 }}>{s.title}</div>
                <div style={{ ...sans(23, C.muted), textAlign: "left", marginTop: 14 }}>{s.body}</div>
              </div>
            </FadeUp>
          ))}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 5 ─ The honest engine ──────────────────────────────────────────────────────
export const HonestEngine: React.FC = () => {
  const opacity = useOutro();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop glow={C.pounamu} intensity={0.12} />
      <Center>
        <FadeUp>
          <div style={{ ...sans(24, C.pounamu), letterSpacing: "0.15em", textTransform: "uppercase" }}>
            The promise that makes it trustworthy
          </div>
        </FadeUp>
        <FadeUp delay={18} style={{ marginTop: 30 }}>
          <div style={display(92)}>
            &ldquo;We never invent <span style={gradientText}>a word</span>.&rdquo;
          </div>
        </FadeUp>
        <FadeUp delay={48} style={{ marginTop: 44, maxWidth: 1150 }}>
          <div style={sans(33, C.muted)}>
            An AI can&rsquo;t truly know a language with fifty speakers left. So Lantern
            only ever uses <span style={{ color: C.cream }}>her</span> words, and
            throws out any sentence with a word she never said.
          </div>
        </FadeUp>
      </Center>
    </AbsoluteFill>
  );
};

// 6 ─ Demo (the real screen recording) ───────────────────────────────────────
export const DemoSlot: React.FC = () => {
  const opacity = useOutro();
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 70 }}>
        <div
          style={{
            width: 1480,
            borderRadius: 20,
            overflow: "hidden",
            border: `1px solid ${C.line}`,
            boxShadow: "0 40px 90px rgba(0,0,0,0.6)",
          }}
        >
          <OffthreadVideo
            src={staticFile("demo-workspace.mp4")}
            style={{ width: "100%", display: "block" }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 7 ─ The vision ─────────────────────────────────────────────────────────────
export const Vision: React.FC = () => {
  const frame = useCurrentFrame() / 2; // logical 30fps frame (composition runs at 60)
  const opacity = useOutro();
  const dots = Array.from({ length: 60 });
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, opacity }}>
      <Backdrop />
      <AbsoluteFill style={{ opacity: 0.5 }}>
        {dots.map((_, i) => {
          const x = (i * 137.5) % 100;
          const y = (i * 53.7) % 100;
          const tw = 0.3 + 0.7 * Math.abs(Math.sin((frame + i * 12) / 18));
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i % 5 === 0 ? C.pounamu : C.ember,
                opacity: tw,
                boxShadow: `0 0 10px ${i % 5 === 0 ? C.pounamu : C.ember}`,
              }}
            />
          );
        })}
      </AbsoluteFill>
      <Center>
        <FadeUp>
          <div style={display(58)}>She isn&rsquo;t alone.</div>
        </FadeUp>
        <FadeUp delay={28} style={{ marginTop: 30 }}>
          <div style={display(78)}>
            Room for <span style={gradientText}>three thousand</span> more.
          </div>
        </FadeUp>
      </Center>
    </AbsoluteFill>
  );
};

// 8 ─ Close ──────────────────────────────────────────────────────────────────
export const Close: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <Backdrop intensity={0.22} />
      <Center>
        <FadeUp>
          <div style={display(58)}>
            A language only dies when the
            <br />
            last person stops speaking it.
          </div>
        </FadeUp>
        <FadeUp delay={36} style={{ marginTop: 40 }}>
          <div style={{ ...display(44), color: C.ember }}>So we keep speaking.</div>
        </FadeUp>
        <FadeUp delay={60} style={{ marginTop: 56 }}>
          <Logo size={64} />
        </FadeUp>
      </Center>
    </AbsoluteFill>
  );
};
