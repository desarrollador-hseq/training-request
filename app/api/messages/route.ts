import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { msisdn, message } = await req.json()

        if (!msisdn || !message) return new NextResponse("Not Found", { status: 400 })

        const response = await axios.get('http://api.labsmobile.com/get/send.php', {
            params: {
                username: process.env.LABSMOBILEUSERNAME,
                password: process.env.LABSMOBILETOKEN,
                msisdn: msisdn,
                message: message,
            },
        })

        return NextResponse.json(response.data)
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}