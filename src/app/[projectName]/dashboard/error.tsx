"use client";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2 style={{ color: "white" }}>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
