import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser, getOwnProfile } from "@/lib/auth";
import { createR2UploadUrl } from "@/lib/r2";

const requestSchema = z.object({
  purpose: z.enum(["avatar", "artwork", "podcast", "video", "download"]),
  fileName: z.string().trim().min(1).max(180),
  contentType: z.string().trim().min(1).max(120),
  size: z.number().int().positive(),
});

function allowedUpload(purpose: z.infer<typeof requestSchema>["purpose"], type: string, size: number) {
  if (purpose === "artwork") return size <= 20 * 1024 * 1024 && ["image/jpeg", "image/png", "image/webp"].includes(type);
  if (purpose === "avatar") return size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png", "image/webp"].includes(type);
  if (purpose === "podcast") return size <= 1024 * 1024 * 1024 && ["audio/mpeg", "audio/mp4", "audio/aac", "audio/ogg", "audio/webm", "audio/wav", "audio/x-wav", "audio/flac"].includes(type);
  if (purpose === "video") return size <= 2 * 1024 * 1024 * 1024 && ["video/mp4", "video/webm", "video/quicktime"].includes(type);
  return size <= 100 * 1024 * 1024 && ["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(type);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Sign in to upload a file." }, { status: 401 });
  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a supported file and try again." }, { status: 400 });
  const { purpose, fileName, contentType, size } = parsed.data;
  if (purpose !== "avatar") {
    const profile = await getOwnProfile(user.id);
    if (profile?.role !== "administrator") return NextResponse.json({ error: "Only an administrator can upload library media." }, { status: 403 });
  }
  if (!allowedUpload(purpose, contentType, size)) return NextResponse.json({ error: "This file type or size is not supported." }, { status: 400 });

  const name = fileName.toLowerCase().replace(/[^a-z0-9._-]/g, "-").slice(-100) || "asset";
  const folder = purpose === "artwork" ? "artwork" : purpose === "podcast" ? "podcasts" : purpose === "video" ? "videos" : purpose === "download" ? "downloads" : `avatars/${user.id}`;
  const key = `${folder}/${crypto.randomUUID()}-${name}`;
  try {
    const uploadUrl = await createR2UploadUrl({ key, contentType, contentLength: size, isPublic: purpose === "artwork" });
    return NextResponse.json({ uploadUrl, key, contentType }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Cloud media storage is not configured yet. Please try again later." }, { status: 503 });
  }
}
