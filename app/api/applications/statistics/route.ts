import { getUser } from "@/lib/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UnauthorizedError } from "@/lib/errors";
import { generateStageFrequencyTable } from "@/lib/utils";

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

    const statusFrequencyArray = generateStageFrequencyTable(applications);
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
