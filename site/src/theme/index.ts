import type { MantineThemeOverride, MantineTheme } from '@mantine/core'

const theme: MantineThemeOverride = {
  primaryColor: 'primary',
  // Mantine expects 10 colors but the style guide only contains 9.
  // These color values include the first 9 colors and a dark shade at the end.
  colors: {
    primary: [
      'hsl(276, 100%, 99%)',
      'hsl(274, 100%, 95.9%)',
      'hsl(275, 100%, 90.2%)',
      'hsl(275, 100%, 78.6%)',
      'hsl(275, 100%, 73.7%)',
      'hsl(275, 100%, 48.8%)',
      'hsl(275, 100%, 38%)',
      'hsl(275, 100%, 22.2%)',
      'hsl(276, 100%, 2.9%)',
      'hsl(275, 100.00%, 1.35%)'
    ],
    secondary: [
      'hsl(157, 23.60%, 98.44%)',
      'hsl(157, 23.60%, 92.79%)',
      'hsl(157, 23.60%, 82.55%)',
      'hsl(157, 23.60%, 62.55%)',
      'hsl(157, 23.60%, 54.85%)',
      'hsl(157, 23.60%, 34.57%)',
      'hsl(157, 23.60%, 26.32%)',
      'hsl(157, 23.60%, 14.57%)',
      'hsl(157, 23.60%, 0.97%)',
      'hsl(157, 23.60%, 0.62%)'
    ],
    slateGray: [
      'hsl(222, 17.90%, 98.57%)',
      'hsl(222, 17.90%, 94.12%)',
      'hsl(222, 17.90%, 85.72%)',
      'hsl(222, 17.90%, 70.00%)',
      'hsl(222, 17.90%, 63.76%)',
      'hsl(222, 17.90%, 42.28%)',
      'hsl(222, 17.90%, 32.53%)',
      'hsl(222, 17.90%, 17.72%)',
      'hsl(222, 17.90%, 1.30%)',
      'hsl(222, 17.90%, 0.42%)'
    ]
  }
}

export type Theme = typeof theme & MantineTheme

export default theme
