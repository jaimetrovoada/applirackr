import { getUser } from "@/lib/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { objectToCsv } from "@/lib/utils";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
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

    const csvData = objectToCsv(applications);
    console.log({ csvData });

    return NextResponse.json(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition":
          'attachment; filename="' + "applications-" + Date.now() + '.csv"',
      },
    });
  } catch (error) {
    console.log({ error });
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json(error);
  }
}
