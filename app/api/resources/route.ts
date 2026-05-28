import { NextResponse } from "next/server";
import { getDbContext } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Server error";
}

// 1. GET: Lexon te gjitha resurset aktive te infrastruktures
export async function GET() {
  try {
    const { db } = await getDbContext();
    // Marrim resurset qe nuk jane shkaterruar ende dhe i rendisim nga me te rejat
    const resources = await db
      .collection("resources")
      .find({ status: "Active" })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, data: resources }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// 2. POST: Simulon "IaC Apply" (Krijon resursin ne Cloud/Database)
export async function POST(request: Request) {
  try {
    const { db } = await getDbContext();
    const body = (await request.json()) as { name?: string; type?: string };

    if (!body.name || !body.type) {
      return NextResponse.json(
        { success: false, error: "Emri dhe lloji duhen plotesuar!" },
        { status: 400 }
      );
    }

    const newResource = {
      name: body.name,
      type: body.type, // "Compute (EC2)", "Storage (S3)", ose "Database (RDS)"
      status: "Active",
      createdAt: new Date(),
    };

    const result = await db.collection("resources").insertOne(newResource);

    return NextResponse.json(
      {
        success: true,
        data: { ...newResource, _id: result.insertedId },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

// 3. DELETE: Simulon "IaC Destroy" (Fshin resursin specifik me ID)
export async function DELETE(request: Request) {
  try {
    const { db } = await getDbContext();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID e resursit mungon!" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "ID e resursit eshte e pavlefshme!" },
        { status: 400 }
      );
    }

    await db.collection("resources").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json(
      {
        success: true,
        message: "Resursi u shkaterrua me sukses (Destroyed)",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
