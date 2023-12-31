import ApplicationsTable from "@/components/ApplicationsTable";
import Graphs from "@/components/Graphs";
import { getUserApplications, getStatistics } from "@/lib/api.service";
import { headers } from "next/headers";

export default async function Page() {
  const cookie = headers().get("cookie") ?? "";
  const [res, err] = await getUserApplications(cookie);
  const [statistics, err2] = await getStatistics(cookie);
  console.log({ statistics });

  if (err) {
    throw err;
  }

  return (
    <>
      {
        // <Graphs data={statistics} />
      }
      <ApplicationsTable applications={res} />
    </>
  );
}
