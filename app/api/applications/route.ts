import { getUser } from "@/lib/auth.service";
import { prisma } from "@/lib/db";
import { ApplicationValidator } from "@/lib/validators/schemas";
import { NextRequest, NextResponse } from "next/server";
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
    return NextResponse.json(applications);
  } catch (error) {
    console.log({ error });
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    const reqBod = await req.json();
    const body = ApplicationValidator.parse(reqBod);

    const result = await prisma.application.create({
      data: {
        user: { connect: { email: user?.email! } },
        company: body.company,
        position: body.position,
        stage: body.stage,
        postingUrl: body.postingUrl,
        dateApplied: body.dateApplied,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.log({ error });
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json({ error }, { status: 500 });
  }
}
