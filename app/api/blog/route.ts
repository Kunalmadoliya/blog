import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"


export async function POST(request: NextRequest) {
    const { image_url, title, content, tags } = await request.json()

    if (!image_url || !title || !content || !tags) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const session = await auth()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }


}