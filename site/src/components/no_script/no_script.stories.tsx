import type { Meta, StoryFn } from "@storybook/react";
import type { ComponentPropsWithoutRef } from "react";

import type { Locale } from "~/types/common";
import { LOCALES } from "~/constants";
import { getLocale } from "~/utils/get_locale";
import { translate } from "~/utils/translate";
import { NoScript } from "./";

type Props = Partial<ComponentPropsWithoutRef<typeof NoScript>> & {
  locale: Locale;
};

export const Default: StoryFn<Props> = (args) => {
  return (
    <NoScript as="div">
      <p>{translate(getLocale(args.locale))("errors.nojs")}</p>
    </NoScript>
  );
};

export default {
  component: NoScript,
  args: {
    locale: "en",
  },
  argTypes: {
    ...Object.fromEntries(
      ["children", "ref", "as", "css"].map((element) => [
        element,
        { table: { disable: true } },
      ]),
    ),
    locale: { defaultValue: "en", type: { name: "enum", value: [...LOCALES] } },
  },
} satisfies Meta<Props>;
