import { prisma } from "@/lib/db";
import { ApplicationValidator } from "@/lib/validators/schemas";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth.service";

interface Params {
  id: string;
}

export async function PUT(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;

  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = ApplicationValidator.parse(await req.json());

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
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: Params }) {
  const { id } = context.params;
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.application.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log({ error });
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
