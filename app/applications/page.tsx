import ApplicationsTable from "@/components/ApplicationsTable";
import { getUserApplications, getStatistics } from "@/lib/api.service";
import { headers } from "next/headers";

export default async function Page() {
  const cookie = headers().get("cookie") ?? "";
  const [res, err] = await getUserApplications(cookie);
  const [statistics, err2] = await getStatistics(cookie);

  if (err) {
    throw err;
  }

  return (
    <main className="container mx-auto flex flex-1 flex-col gap-4 p-4 lg:px-0">
      <ApplicationsTable applications={res} />
    </main>
  );
}
