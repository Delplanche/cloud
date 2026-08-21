import { createFileRoute, redirect } from "@tanstack/react-router";
import { localePath, toLocale } from "@/i18n/config";

export const Route = createFileRoute("/$lang/cloud/")({
  beforeLoad: ({ params }) => {
    throw redirect({ to: localePath(toLocale(params.lang), "stack"), replace: true });
  },
});
