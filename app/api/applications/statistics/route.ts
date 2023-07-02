import { getUser } from "@/lib/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Application, Statistic } from "@/@types";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const applications = await prisma.job.findMany({
      where: {
        user: {
          email: user?.email,
        },
      },
    });

    let statusFrequency = new Map<Application["status"], number>();
    applications.forEach((application) => {
      if (statusFrequency.has(application.status)) {
        statusFrequency.set(
          application.status,
          statusFrequency.get(application.status)! + 1
        );
      } else {
        statusFrequency.set(application.status, 1);
      }
    });

    const statusFrequencyArray: Statistic[] = [];
    statusFrequency.forEach((value, key) => {
      statusFrequencyArray.push({
        status: key,
        count: value,
        pct: value / applications.length,
      });
    });

    console.log({ statusFrequencyArray });
    return NextResponse.json(statusFrequencyArray);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error }, { status: 500 });
  }
}
