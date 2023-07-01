import ApplicationsTable from "@/components/ApplicationsTable";
import { getUserApplications } from "@/lib/api.service";
import { headers } from "next/headers";

export default async function Page() {
  const cookie = headers().get("cookie") ?? "";
  const [res, err] = await getUserApplications(cookie);
  console.log({ err });

  return (
    <main className="container mx-auto flex flex-col gap-4 p-4 lg:px-0">
      {res && <ApplicationsTable applications={res} />}{" "}
      {err && err.message === "Unauthorized" ? (
        <p>Unauthorized</p>
      ) : (
        <p>Failed to fetch data</p>
      )}
    </main>
  );
}
