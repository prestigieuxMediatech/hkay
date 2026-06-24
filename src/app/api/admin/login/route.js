import { NextResponse } from 'next/server'
import bcrypt from "bcryptjs"

import { supabase } from '@/lib/supabase'
import {ADMIN_SESSION_COOKIE,signAdminSession} from '@/lib/admin-session'

export async function POST(request){
    try{
        const {email,password} = await request.json();

        if(!email || !password){
            return NextResponse.json(
                {error:'Email & Password are required'},
                {status:400}
            )
        }

        const normalizedEmail = email.toLowerCase().trim();

        const { data:admin, error } = await supabase
            .from("admin")
            .select('id, email, password_hash, is_active')
            .eq("email",normalizedEmail)
            .maybeSingle()

        if(error || !admin || !admin.is_active){
            return NextResponse.json(
                {success:false, message:'Invalid Credentals'},
                {status:400}
            )
        }

        const isMatch = await bcrypt.compare(password,admin.password_hash);
        console.log({
            enteredPassword: password,
            hashFromDB: admin.password_hash,
            isMatch
        });
        if(!isMatch){
            return NextResponse.json(
                {success:false, message:'Incorrect Password'},
                {status:401}
            )
        }

        const token = await signAdminSession(admin);
        
        const response = NextResponse.json({ok:true});

        response.cookies.set(ADMIN_SESSION_COOKIE,token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite:'lax',
            path:'/',
            maxAge: 60 * 60 * 24 * 7,
        })
        
        return response;
    }
    catch(error){
        return NextResponse.json(
            {success: false, message:error.message},
            {status:500}
        )
    }
}