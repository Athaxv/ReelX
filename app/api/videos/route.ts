import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import Video, { IVideo } from "@/model/video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(){
    try {
        await connectDB();
        const videos = await Video.find({}).sort({createdAt: -1}).lean()

        if (!videos || videos.length === 0){
            return NextResponse.json([], { status: 300 })
        }

        return NextResponse.json(videos, { status: 200 })
    } catch (error) {
        return NextResponse.json(error, {status: 401})
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions);
        if (!session){
            return NextResponse.json("User Unauthorized", { status: 401 })
        }
        await connectDB();
        const body:IVideo = await request.json();

        if ( !body.title || !body.description || !body.videoUrl || !body.thumbnailUrl){
            return NextResponse.json({ error: "Missing required fields"}, { status: 401 })
        }

        const videoData = {
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: 1920,
                width: 1080,
                quality: body.transformation?.quality ?? 100
            }
        }

        const newVideo = await Video.create(videoData);
        return NextResponse.json(newVideo, { status: 201 })

    } catch (error) {
        return NextResponse.json(error, { status: 402 })
    }
}