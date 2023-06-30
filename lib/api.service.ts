import { Application, ApplicationRequest } from "@/@types";

const url = process.env.NEXT_PUBLIC_APP_URL;
export async function createApplication(payload: ApplicationRequest) {
  try {
    const res = await fetch(`${url}/api/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = {
      ok: res.ok,
      status: res.status,
      body: await res.json(),
    };
    return [result, null] as [typeof result, null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}

export async function getUserApplications() {
  try {
    const res = await fetch(`${url}/api/applications`, { cache: "no-store" });
    const body: Application[] = await res.json();
    const result = {
      ok: res.ok,
      status: res.status,
      body,
    };
    return [result, null] as [typeof result, null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}
