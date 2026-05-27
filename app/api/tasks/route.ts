import { getDb } from "@/lib/mongodb";

type CreateTaskBody = {
  title?: string;
};

export async function GET() {
  try {
    const db = await getDb();
    const taskDocuments = await db
      .collection("tasks")
      .find({}, { projection: { title: 1, createdAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const tasks = taskDocuments.map((task) => ({
      _id: task._id.toString(),
      title: String(task.title ?? ""),
      createdAt:
        task.createdAt instanceof Date
          ? task.createdAt.toISOString()
          : new Date().toISOString(),
    }));

    return Response.json({ tasks }, { status: 200 });
  } catch {
    return Response.json(
      { error: "Nuk u arrit leximi i task-eve." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateTaskBody;
    const title = body.title?.trim();

    if (!title || title.length < 3) {
      return Response.json(
        { error: "Titulli duhet të ketë të paktën 3 karaktere." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const now = new Date();
    const result = await db.collection("tasks").insertOne({
      title,
      createdAt: now,
    });

    return Response.json(
      {
        task: {
          _id: result.insertedId.toString(),
          title,
          createdAt: now.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return Response.json(
      { error: "Nuk u arrit krijimi i task-ut." },
      { status: 500 }
    );
  }
}
