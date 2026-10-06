"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

// next-themes injects an inline <script> to avoid a theme flash. React 19 warns
// about rendering <script> on the client, so on the client we mark it as JSON
// (inert); the server-rendered copy still runs before hydration.
const scriptProps =
  typeof window === "undefined"
    ? undefined
    : ({ type: "application/json" } as const);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      scriptProps={scriptProps}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
