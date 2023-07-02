import { ApplicationRequest } from "@/@types";
import { prisma } from "@/lib/db";
import { ApplicationValidator } from "@/lib/validators/schemas";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function PUT(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  try {
    const body = ApplicationValidator.parse(await req.json());

    const result = await prisma.job.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
