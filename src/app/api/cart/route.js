import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server';

export async function GET(request){
    try{
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get('userId');

        if(!userId){
            return NextResponse.json(
                {error: 'User Id is required'},
                {status:400}
            )
        }

        const {data,error} = await supabase
            .from('cart_items')
            .select(`
                id,
                quantity,
                product_id,
                products(
                    id,
                    name,
                    images,
                    price,
                    original_price,
                    slug    
                )
            `)
            .eq('user_id',userId)
            .order('created_at', { ascending: false })
        if (error) throw error
        return Response.json(data)
     }
    catch(error){
        return NextResponse.json(
            {error:error.message},
            {status:500}
        )
    }
}


export async function POST(request){
    try{
        const { userId,productId,quantity=1} = await request.json();

        if(!userId || !productId){
            return NextResponse.json(
                {message:'userId & productId is required'},
                {status:400}
            )
        }

        const { data, error } = await supabase
            .from('cart_items')
            .upsert(
                {user_id:userId,product_id:productId,quantity},
                {onConflict: 'user_id,product_id'}
            )
            .select()
        
        if (error) throw error
        return NextResponse.json(data)
    }
    catch(error){
        return NextResponse.json(
            {error:error.message},
            {status:500}
        )
    }
}
