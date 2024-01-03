import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const values = await req.json();

    if (!values) return new NextResponse("Unauthorized", { status: 401 });

    const { password, repeatPassword, acceptTerms, ...otherValues } = values;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const companyIsRegistered = await db.company.findFirst({
      where: { nit: values.nit },
    });

    if (companyIsRegistered) {
      return new NextResponse("Nit de empresa ya se encuentra registrado", {
        status: 400,
      });
    }

    const company = await db.company.create({
      data: { ...otherValues, password: hashedPassword },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log("[COMPANY_CREATE]", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
