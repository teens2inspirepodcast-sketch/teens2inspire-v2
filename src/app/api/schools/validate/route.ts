import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publicEnvironment, secretEnvironment } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = String(body?.code ?? "").trim();
    if (!code || code.length > 80) return NextResponse.json({ valid: false, error: "Enter a school code." }, { status: 400 });
    const { url } = publicEnvironment();
    const { supabaseSecret } = secretEnvironment();
    if (!supabaseSecret) return NextResponse.json({ valid: false, error: "School access is not configured yet." }, { status: 503 });
    const admin = createClient(url, supabaseSecret, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data, error } = await admin.from("school_codes").select("school_name, active, max_uses, uses, expires_at").eq("code", code).maybeSingle();
    if (error) throw error;
    const valid = Boolean(data?.active && (!data.expires_at || new Date(data.expires_at).getTime() > Date.now()) && (data.max_uses == null || data.uses < data.max_uses));
    if (!valid) return NextResponse.json({ valid: false, error: "That school code is not active. Check the code and try again." }, { status: 400 });
    return NextResponse.json({ valid: true, schoolName: data.school_name });
  } catch {
    return NextResponse.json({ valid: false, error: "We could not verify that school code." }, { status: 500 });
  }
}
