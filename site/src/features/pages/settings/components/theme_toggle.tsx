import React from "react";

import { RadioGroup } from "~/components/radio_group";
import { useTranslations } from "~/i18n";

export const ThemeToggle = () => {
  const [value, setValue] = React.useState<"light" | "dark" | undefined>();
  const defaultValue = localStorage.getItem("theme") ?? "system";

  const t = useTranslations();

  const onValueChange = (value: string) => {
    setValue(value as "light" | "dark");

    if (value === "light") {
      window.__setPreferredTheme("light");
      return;
    }

    if (value === "dark") {
      window.__setPreferredTheme("dark");
      return;
    }

    window.__setPreferredTheme();
    localStorage.removeItem("theme");

    const query = "(prefers-color-scheme: dark)";
    const prefersDark = window.matchMedia(query).matches;

    window.document.documentElement.classList[prefersDark ? "add" : "remove"](
      "dark",
    );
  };

  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === "class") {
          const theme = localStorage.getItem("theme");

          if (theme !== "light" && theme !== "dark") {
            return;
          }

          setValue(theme ?? undefined);
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
    });

    return function cleanup() {
      observer.disconnect();
    };
  }, []);

  return (
    <RadioGroup
      value={value}
      defaultValue={defaultValue}
      values={{
        light: t("themeVariants.light"),
        dark: t("themeVariants.dark"),
        system: t("themeVariants.system"),
      }}
      onValueChange={onValueChange}
    />
  );
};
