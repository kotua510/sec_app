import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import os from "os";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: "画像がありません" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = process.env.UPLOAD_DIR
      ? path.resolve(process.env.UPLOAD_DIR)
      : process.env.NODE_ENV === "production"
        ? path.join(os.tmpdir(), "sec_app", "images")
        : path.join(process.cwd(), "public", "images");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      fileName,
      imageUrl: `/images/${fileName}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "画像の保存に失敗しました" }, { status: 500 });
  }
}
