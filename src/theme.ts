import { createTheme, type CSSVariablesResolver } from "@mantine/core";

// Warm, editorial brown theme shared by Mantine components and custom surfaces.
export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 6, dark: 5 },
  colors: {
    brand: [
      "#F8F3ED", "#EFE4D8", "#E3D1BF", "#C9AD94", "#A98468",
      "#8D6E63", "#6F4E37", "#5B3B2D", "#3E2723", "#2D1B16",
    ],
  },
  fontFamily: '"Manrope", "Segoe UI", sans-serif',
  headings: { fontFamily: '"Manrope", "Segoe UI", sans-serif', fontWeight: "750" },
  radius: { xs: "7px", sm: "10px", md: "14px", lg: "18px", xl: "24px" },
  defaultRadius: "md",
  shadows: {
    xs: "0 2px 8px rgba(62, 39, 35, .05)",
    sm: "0 5px 16px rgba(62, 39, 35, .07)",
    md: "0 12px 30px rgba(62, 39, 35, .09)",
    lg: "0 18px 42px rgba(62, 39, 35, .12)",
    xl: "0 24px 56px rgba(62, 39, 35, .14)",
  },
  cursorType: "pointer",
  components: {
    Card: { defaultProps: { radius: "lg", shadow: "sm" }, classNames: { root: "glass-card" } },
    Paper: { defaultProps: { radius: "lg", shadow: "sm" }, classNames: { root: "glass-card" } },
    Avatar: { defaultProps: { radius: "xl" } },
    Button: { defaultProps: { radius: "md" } },
    TextInput: { styles: { input: { background: "var(--glass-field)", border: "1px solid var(--glass-border)", borderRadius: "var(--mantine-radius-md)", color: "var(--mantine-color-text)", minHeight: 42 } } },
    Textarea: { styles: { input: { background: "var(--glass-field)", border: "1px solid var(--glass-border)", borderRadius: "var(--mantine-radius-md)", color: "var(--mantine-color-text)" } } },
    PasswordInput: { styles: { input: { background: "var(--glass-field)", border: "1px solid var(--glass-border)", borderRadius: "var(--mantine-radius-md)", color: "var(--mantine-color-text)", minHeight: 42 } } },
    FileInput: { styles: { input: { background: "var(--glass-field)", border: "1px solid var(--glass-border)", borderRadius: "var(--mantine-radius-md)", color: "var(--mantine-color-text)", minHeight: 42 } } },
  },
});

export const glassVariables: CSSVariablesResolver = () => ({
  variables: {
    "--accent-grad": "linear-gradient(135deg, #6F4E37 0%, #8D6E63 100%)",
    "--mantine-primary-color-filled": "#6F4E37",
  },
  light: {
    "--glass": "#FFFFFF",
    "--glass-strong": "#FFFFFF",
    "--glass-soft": "#F8F4EF",
    "--glass-border": "#E8DED3",
    "--glass-edge": "rgba(255,255,255,.9)",
    "--glass-field": "#FFFEFC",
    "--glass-chip": "#F4EEE7",
    "--glass-bar": "rgba(250, 247, 242, .94)",
    "--glass-pop": "#FFFFFF",
    "--glass-hover": "#EEE4DA",
    "--glass-divider": "#EAE1D8",
    "--glass-shadow": "0 12px 30px rgba(62,39,35,.08)",
    "--bg-0": "#F5F0E8",
    "--bg-1": "#F5F0E8",
    "--tag-color": "#8D6E63",
    "--vignette": "none",
  },
  dark: {
    "--glass": "#2D211C",
    "--glass-strong": "#382820",
    "--glass-soft": "#3B2B23",
    "--glass-border": "#584235",
    "--glass-edge": "rgba(255,255,255,.06)",
    "--glass-field": "#33251F",
    "--glass-chip": "#443229",
    "--glass-bar": "rgba(39, 28, 23, .96)",
    "--glass-pop": "#382820",
    "--glass-hover": "#4A362B",
    "--glass-divider": "#503B30",
    "--glass-shadow": "0 14px 34px rgba(0,0,0,.22)",
    "--bg-0": "#211813",
    "--bg-1": "#2B1E18",
    "--tag-color": "#D7B58D",
    "--vignette": "none",
  },
});
