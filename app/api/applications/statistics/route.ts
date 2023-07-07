import { getUser } from "@/lib/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Application, Statistic } from "@/@types";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    const applications = await prisma.application.findMany({
      where: {
        user: {
          email: user?.email,
        },
      },
    });

    let statusFrequency = new Map<Application["stage"], number>();
    applications.forEach((application) => {
      if (statusFrequency.has(application.stage)) {
        statusFrequency.set(
          application.stage,
          statusFrequency.get(application.stage)! + 1
        );
      } else {
        statusFrequency.set(application.stage, 1);
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
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}