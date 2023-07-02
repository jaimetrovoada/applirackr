"use client";
import { Button } from "@/components";
import { signIn } from "next-auth/react";
import React from "react";
import { AiFillGithub, AiFillGoogleCircle } from "react-icons/ai";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  return (
    <main className="container mx-auto flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:px-0">
      <div className="mx-auto flex h-1/3 w-full max-w-screen-sm flex-col items-center gap-6 rounded-lg border border-gray-600/50 bg-zinc-950 p-4 shadow-md">
        <h2 className="text-4xl font-semibold">Sign to AppliTrackr</h2>
        <div className="my-auto flex flex-col gap-4">
          <Button
            onClick={() =>
              signIn("github", {
                redirect: true,
                callbackUrl: searchParams.get("callbackUrl") ?? "/",
              })
            }
            className="inline-flex items-center gap-4 text-xl"
          >
            <AiFillGithub size={36} />
            Sign with GitHub
          </Button>
          <Button
            onClick={() =>
              signIn("google", {
                redirect: true,
                callbackUrl: searchParams.get("callbackUrl") ?? "/",
              })
            }
            className="inline-flex items-center gap-4 text-xl"
          >
            <AiFillGoogleCircle size={36} />
            Sign with Google
          </Button>
        </div>
      </div>
    </main>
  );
}
