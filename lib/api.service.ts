import { Application, ApplicationRequest } from "@/@types";
import { z } from "zod";
import { ApplicationValidator } from "./validators/schemas";
import { LinkFlow } from "@/lib/utils";

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

const PartialValidator = ApplicationValidator.partial();
export async function updateApplication(
  id: string,
  payload: z.infer<typeof PartialValidator>
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
    return [res.ok, null] as [Boolean, null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}

export async function getStatistics(cookie: string) {
  try {
    const res = await fetch(`${url}/api/applications/analytics`, {
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

    return [body, null] as [LinkFlow[], null];
  } catch (error) {
    console.log({ error });
    return [null, error] as [null, Error];
  }
}
