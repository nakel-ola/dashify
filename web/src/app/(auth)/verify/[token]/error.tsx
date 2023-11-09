"use client";
import { ExpiredCard, FailedCard } from "./features";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error }: Props) {
  if (error?.message === "NOT_FOUND") return <FailedCard />;
  if (error?.message === "TOKEN_EXPIRED") return <ExpiredCard />;
  return <FailedCard />;
}
