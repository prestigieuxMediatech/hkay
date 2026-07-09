import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request) {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
    
    if(error) throw error;

    return Response.json(data);
}