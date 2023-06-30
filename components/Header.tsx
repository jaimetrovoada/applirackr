"use client";
import { User } from "next-auth";
import Image from "next/image";
import Button from "./Button";
import { signIn } from "next-auth/react";

interface Props {
  user: Omit<User, "id"> | undefined;
}

const Header = ({ user }: Props) => {
  return (
    <header className="border-b border-gray-700 bg-black">
      <nav className="container mx-auto flex flex-row items-center justify-between p-4 lg:px-0">
        <h1 className="text-3xl lg:text-6xl">AppliTrackr</h1>
        {user ? (
          <div className="relative w-12 aspect-square rounded-full overflow-hidden">
            <Image
              src={user.image!}
              alt="user avatar"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Button onClick={() => signIn()}>Sign in</Button>
        )}
      </nav>
    </header>
  );
};

export default Header;
