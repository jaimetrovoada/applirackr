import { Application, ApplicationRequest, Statistic } from "@/@types";

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

export async function getUserApplications(cookie: string) {
  try {
    const res = await fetch(`${url}/api/applications`, {
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    });
    const body = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }

      throw new Error("FailedToFetch");
    }

    return [body, null] as [Application[], null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}

export async function updateApplication(
  id: string,
  payload: ApplicationRequest
) {
  try {
    const res = await fetch(`${url}/api/applications/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const body = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("RequestFailed");
    }
    return [body, null] as [Application, null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}

export async function deleteApplication(id: string) {
  try {
    const res = await fetch(`${url}/api/applications/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("RequestFailed");
    }
    return [res, null] as [Response, null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}

export async function getStatistics(cookie: string) {
  try {
    const res = await fetch(`${url}/api/applications/statistics`, {
      headers: {
        "Content-Type": "application/json",
        cookie,
      },
    });
    const body = await res.json();

    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }

      throw new Error("FailedToFetch");
    }

    return [body, null] as [Statistic[], null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}
