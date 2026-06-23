import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: DISPLAY } = loadFraunces("normal", {
  weights: ["500"],
  subsets: ["latin"],
});
export const { fontFamily: SANS } = loadInter("normal", {
  weights: ["400", "500"],
  subsets: ["latin"],
});

// Lantern palette, matches the web app.
export const C = {
  ink: "#09090c",
  surface: "#16141d",
  surface2: "#1f1c29",
  line: "#2c2838",
  cream: "#f4eee3",
  muted: "#a59d90",
  faint: "#6f6859",
  ember: "#ffb454",
  flame: "#ffd488",
  emberDeep: "#d98324",
  pounamu: "#34d8a6",
} as const;
