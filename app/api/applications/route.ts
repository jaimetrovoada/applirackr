import { getUser } from "@/lib/auth.service";
import { prisma } from "@/lib/db";
import { ApplicationValidator } from "@/lib/validators/schemas";
import { ApplicationRequest } from "@/@types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, res: NextResponse) {
  try {
    const user = await getUser();
    const applications = await prisma.job.findMany({
      where: {
        user: {
          email: user?.email,
        },
      },
    });
    return NextResponse.json(applications);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reqBod: ApplicationRequest = await req.json();
    console.log({ reqBod });
    const body = ApplicationValidator.parse(reqBod);

    const result = await prisma.job.create({
      data: {
        user: { connect: { email: user?.email! } },
        company: body.company,
        title: body.title,
        status: body.status,
        postingUrl: body.postingUrl,
        dateApplied: body.dateApplied,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
