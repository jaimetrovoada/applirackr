import { getUser } from "@/lib/auth.service";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { UnauthorizedError } from "@/lib/errors";
import { genStageSankeyData } from "@/lib/utils";

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

    const data = genStageSankeyData(applications);
    return NextResponse.json(data);
  } catch (error) {
    console.log({ error });
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
