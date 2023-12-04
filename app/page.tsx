import { Button } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Button as={Link} href="/applications">
        Applications
      </Button>
      <h2 className="text-center text-3xl font-bold">
        Lorem ipsum dolor sit amet.
      </h2>
      <p className="max-w-2xl text-slate-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, commodi
        odit. Obcaecati itaque voluptatem praesentium quos asperiores in quod
        veritatis a pariatur excepturi fugiat vel, nobis cumque, reprehenderit
        delectus odio quisquam labore? Quibusdam nihil consequatur est non
        explicabo atque magnam ex blanditiis fugit suscipit quas, eum
        consequuntur dolorem. Eum, molestiae?
      </p>
    </>
  );
}
