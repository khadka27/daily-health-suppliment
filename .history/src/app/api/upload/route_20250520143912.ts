import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { mkdir } from "fs/promises"
import { existsSync } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Set up the uploads directory path
const uploadsDir = path.join(process.cwd(), "public", "uploads")

export async function POST(request: NextRequest) {
  console.log("Upload API called")

  try {
    // Ensure the uploads directory exists
    if (!existsSync(uploadsDir)) {
      console.log("Creating uploads directory:", uploadsDir)
      await mkdir(uploadsDir, { recursive: true })
    }

    // Parse the form data
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.log("No file found in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", file.name, "Size:", file.size, "Type:", file.type)

    // Create a safe filename
    const fileExt = file.name.split(".").pop() || "jpg"
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = path.join(uploadsDir, fileName)

    // Convert the file to a buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Write the file to disk
    console.log("Writing file to:", filePath)
    await writeFile(filePath, buffer)
    console.log("File written successfully")

    // Return the URL to the uploaded file
    const fileUrl = `/uploads/${fileName}`
    console.log("File URL:", fileUrl)

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error("Error in upload API:", error)
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
