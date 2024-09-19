import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // The 'body' is what we RECEIVE from the client as part
  // of the incoming request payload (from a form).
  const body = "";
  const validation = schema.safeParse(body);

  const newUser = await prisma.user.create({
    // data:bpdy!!! this is NOT SAFE!
    data: {
      name: body.name,
      email: body.email,
    },
  });

  // We are then sending this same data back to the client as the response.
  return NextResponse.json(newUser, { status: 201 });
}
