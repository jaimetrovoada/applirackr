"use client"; // Error components must be Client Components

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error({ error });
  }, [error]);

  if (error.message === "Unauthorized") {
    return (
      <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:px-0">
        <h2 className="text-3xl font-semibold">
          Unauthorized!!! Please Sign in.{" "}
        </h2>
      </main>
    );
  }

  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:px-0">
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </button>
    </main>
  );
}
