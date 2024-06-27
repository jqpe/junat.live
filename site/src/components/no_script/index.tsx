import type { PropsWithChildren } from "react";
import type React from "react";

import { useTranslations } from "~/i18n";

export function NoScript(
  props: PropsWithChildren<{
    as?: React.ElementType;
  }>,
) {
  const As = props.as ?? "noscript";
  const t = useTranslations();

  return (
    <As className="bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900 p-[10px] flex flex-col justify-center items-center fixed top-0 right-0 left-0">
      <p>{props.children ?? t("errors.nojs")}</p>
    </As>
  );
}

export default NoScript;
