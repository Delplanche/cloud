import { createFileRoute, redirect } from "@tanstack/react-router";
import { cloudPath, defaultLocale } from "@/i18n/config";
import { isCloudTarget } from "@/i18n/cloud";

/** Legacy /cloud/<target> zonder taal → canonieke taalversie. */
export const Route = createFileRoute("/cloud/$target")({
  beforeLoad: ({ params }) => {
    const to = isCloudTarget(params.target)
      ? cloudPath(defaultLocale, params.target)
      : `/${defaultLocale}`;
    throw redirect({ to, replace: true, statusCode: 301 });
  },
});
