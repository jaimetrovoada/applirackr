"use client";
import { User } from "next-auth";
import Image from "next/image";
import Button from "./Button";
import { signIn, signOut } from "next-auth/react";
import { useRef } from "react";

interface Props {
  user: Omit<User, "id"> | undefined;
}

const Header = ({ user }: Props) => {
  return (
    <header className="border-b border-gray-700 bg-black">
      <nav className="container mx-auto flex flex-row items-center justify-between p-4 lg:px-0">
        <h1 className="text-3xl lg:text-6xl">AppliTrackr</h1>
        {user ? (
          <div className="flex flex-row items-center">
            <div className="relative aspect-square w-12 rounded-full border border-gray-600/50 bg-black lg:w-20">
              <Image
                src={user.image!}
                alt="user avatar"
                fill
                className="object-cover"
              />
            </div>
            <Button className="-ml-6 pl-8" onClick={() => signOut()}>
              sign out
            </Button>
          </div>
        ) : (
          <Button onClick={() => signIn()}>Sign in</Button>
        )}
      </nav>
    </header>
  );
};

export default Header;
