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
                variant_id,
                selected_options,
                options_price_adjustment,
                products(
                    id,
                    name,
                    images,
                    price,
                    original_price,
                    slug
                ),
                product_variants(
                    id,
                    variant_label,
                    variant_type,
                    price
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
        const {
            userId,
            productId,
            variantId = null,
            quantity = 1,
            selectedOptions = {},
            optionsPriceAdjustment = 0
        } = await request.json();

        if(!userId || !productId){
            return NextResponse.json(
                {message:'userId & productId is required'},
                {status:400}
            )
        }

        const normalizedOptions = selectedOptions || {}

        // Manual upsert instead of .upsert()/onConflict — Postgres treats NULL
        // as distinct from NULL in unique constraints, so onConflict would never
        // match existing rows for products without a variant (variant_id = null).
        // selected_options (jsonb) has the same issue plus we need an exact-match
        // comparison (not just "any options"), so we fetch candidates by
        // user+product+variant and compare options in JS.
        let existingQuery = supabase
            .from('cart_items')
            .select('id, quantity, selected_options')
            .eq('user_id', userId)
            .eq('product_id', productId)

        existingQuery = variantId
            ? existingQuery.eq('variant_id', variantId)
            : existingQuery.is('variant_id', null)

        const { data: candidates, error: findError } = await existingQuery

        if (findError) throw findError

        const existing = (candidates || []).find(
            (row) => JSON.stringify(row.selected_options || {}) === JSON.stringify(normalizedOptions)
        )

        let data, error

        if (existing) {
            ({ data, error } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id)
                .select())
        } else {
            ({ data, error } = await supabase
                .from('cart_items')
                .insert({
                    user_id: userId,
                    product_id: productId,
                    variant_id: variantId,
                    quantity,
                    selected_options: normalizedOptions,
                    options_price_adjustment: optionsPriceAdjustment
                })
                .select())
        }

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