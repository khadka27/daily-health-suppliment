// import { NextResponse } from "next/server"
// import { testDatabaseConnection } from "@/lib/prisma"

// export async function GET() {
//   try {
//     const status = await testDatabaseConnection()

//     if (status.connected) {
//       return NextResponse.json({ status: "ok", message: status.message })
//     } else {
//       return NextResponse.json({ status: "error", message: status.message, error: status.error }, { status: 500 })
//     }
//   } catch (error) {
//     console.error("Error checking database status:", error)
//     return NextResponse.json(
//       { status: "error", message: "Failed to check database status", error: String(error) },
//       { status: 500 },
//     )
//   }
// }
