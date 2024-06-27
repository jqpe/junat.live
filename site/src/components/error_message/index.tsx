import type { MouseEventHandler, ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { DigitrafficError } from "@junat/digitraffic";

import type { Locale } from "~/types/common";
import { PrimaryButton } from "~/components/primary_button";
import { getLocale } from "~/utils/get_locale";
import { translate } from "~/utils/translate";

const Message = (props: { msg: ReactNode; showTrackStatusLink?: boolean }) => {
  const router = useRouter();
  const locale = getLocale(router.locale);

  return (
    <aside className="bg-error-300 text-error-950 px-2 py-1 rounded-sm dark:bg-transparent dark:[border:1px_solid_theme(colors.error.700)] dark:text-error-50">
      {props.msg}
      {props.showTrackStatusLink ? (
        <>
          {translate(locale)("trackStatus")}
          <Link href="https://status.digitraffic.fi" target="_blank">
            status.digitraffic.fi
          </Link>{" "}
        </>
      ) : null}
    </aside>
  );
};

export const ErrorMessage = ({ error }: { error: unknown }) => {
  const router = useRouter();
  const locale = getLocale(router.locale);

  const digitraffic = error instanceof DigitrafficError;
  const networkError = digitraffic && error.isNetworkError;
  const tooManyRequests = digitraffic && error.status === 429;
  const digitrafficHttpError = digitraffic && error.status >= 400;

  const t = translate(locale);

  if (tooManyRequests) {
    return <Message msg={t("errors.digitraffic.tooManyRequests")} />;
  }

  if (networkError) {
    return <Message msg={t("errors.digitraffic.networkError")} />;
  }

  if (digitrafficHttpError) {
    return (
      <Message showTrackStatusLink msg={t("errors.digitraffic.unexpected")} />
    );
  }

  return Message({
    msg: (
      <>
        {t("errors.unknown")}
        <Link href="mailto:support@junat.live" target="_blank">
          support@junat.live
        </Link>
        {"."}
      </>
    ),
  });
};

export const ErrorMessageWithRetry = <
  T extends MouseEventHandler<HTMLButtonElement>,
>(props: {
  error: unknown;
  locale: Locale;
  onRetryButtonClicked: T;
}) => {
  return (
    <div className="flex flex-col gap-4 items-start">
      <ErrorMessage error={props.error} />
      <PrimaryButton
        onClick={props.onRetryButtonClicked}
        style={{ position: "relative" }}
      >
        {translate(props.locale)("tryAgain")}
      </PrimaryButton>
    </div>
  );
};
