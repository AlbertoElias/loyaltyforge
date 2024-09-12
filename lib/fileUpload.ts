import fs from "node:fs";
import path from "node:path";

export async function uploadFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Ensure the upload directory exists
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate a unique filename
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadDir, filename);

  // Write the file
  fs.writeFileSync(filepath, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}