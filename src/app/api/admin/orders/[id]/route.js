import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdmin } from "@/lib/require-admin";

export async function GET(request,{params}) {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const { id } = await params;

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id',id)
        .single()

    if(error) throw error;
    return Response.json(data)
}

export async function PUT(request,{params}) {
    const auth = await requireAdmin(request);
    if (auth.response) return auth.response;

    const { id } = await params;

    const {data,error} = await supabase
        .from('orders')
        .update(body)
        .eq('id',id)
        .select()
        .single()

    if(error) throw error;
    return Response.json(data)
}
