import { supabase } from '@/lib/supabase'

export async function GET(){
    try{
        const { data,error } = await supabase
            .from('admin')
            .select('id')
            .limit(1)

        if(error){
            return Response.json(
                {success:false, message:error.message},
                {status:500}
            )
        }
        return Response.json(
            {success:true,message:'Supabase Connected Succesfully',data},
            {status:200}
        )
    }
    catch(error){
        return Response.json(
            {success:false, message:error.message},
            {status:500}
        )
    }
}