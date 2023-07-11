import { prisma } from "@/lib/db";
import { ApplicationValidator } from "@/lib/validators/schemas";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth.service";
import { UnauthorizedError } from "@/lib/errors";

interface Params {
  id: string;
}

export async function PUT(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  try {
    const user = await getUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    const body = ApplicationValidator.partial().parse(await req.json());

    const result = await prisma.application.update({
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
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  try {
    const user = await getUser();

    if (!user) {
      throw new UnauthorizedError();
    }

    await prisma.application.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log({ error });
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error }, { status: error.statusCode });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
