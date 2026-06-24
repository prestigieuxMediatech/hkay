import {SignJWT, jwtVerify} from 'jose'

const secret = new TextEncoder().encode(process.env.ADMIN_SESSION_SECRET);

export const ADMIN_SESSION_COOKIE = 'admin_session';

export async function signAdminSession(admin){
    return new SignJWT({
        role:'admin',
        email:admin.email
    })
        .setProtectedHeader({alg:'HS256'})
        .setSubject(admin.id)
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret)
}

export async function verifyAdminSession(token){
    const { payload } = await jwtVerify(token,secret);
    return payload
}