
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { randomUUID } from "crypto";
import { transporter, mailOptions } from "@/lib/nodemailer";



export async function POST(req: Request) {

    try {
        const baseUrl = process.env.NEXTAUTH_URL
        const values = await req.json()


        const existingCompany = await db.company.findUnique({
            where: { email: values.email, active: true }
        });

        if (!existingCompany) {
            return new NextResponse("Correo electrónico no se encuentra registrado", { status: 400 });
        }

        const companyToken = await db.passwordResetToken.create({
            data: {
                companyId: existingCompany.id,
                token: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            }
        })

        const generateEmailContent = () => {
            const htmlData = `Link para restablecer contraseña: ${baseUrl}/recuperar-contrasena/${companyToken.token}`

            return {
                text: "Restablecer contraseña ",
                html: `<!DOCTYPE html><html><head><title></title><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style type="text/css">body,table,td,a {-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}table {border-collapse: collapse !important;}body {height: 100% !important;margin: 0 !important;padding: 0 !important;width: 100% !important;}@media screen and (max-width: 525px) {.wrapper {width: 100% !important;max-width: 100% !important;}.responsive-table {width: 100% !important;}.padding {padding: 10px 5% 15px 5% !important;}.section-padding {padding: 0 15px 50px 15px !important;}}.form-container {margin-bottom: 24px;padding: 20px;border: 1px dashed #ccc;}.form-heading {color: #2a2a2a;font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;font-weight: 400;text-align: left;line-height: 20px;font-size: 18px;margin: 0 0 8px;padding: 0;}.form-answer {color: #2a2a2a;font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;font-weight: 300;text-align: left;line-height: 20px;font-size: 16px;margin: 0 0 24px;padding: 0;}div[style*="margin: 16px 0;"] {margin: 0 !important;}</style></head><body style="margin: 0 !important; padding: 0 !important; background: #fff"><divstyle="display: none;font-size: 1px;color: #fefefe;line-height: 1px;max-height: 0px;max-width: 0px;opacity: 0;overflow: hidden;"></div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><tdbgcolor="#ffffff"align="center"style="padding: 10px 15px 30px 15px"class="section-padding"><tableborder="0"cellpadding="0"cellspacing="0"width="100%"style="max-width: 500px"class="responsive-table"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><tablewidth="100%"border="0"cellspacing="0"cellpadding="0"><tr><tdstyle="padding: 0 0 0 0;font-size: 16px;line-height: 25px;color: #232323;"class="padding message-content"><h2 style="font-size: 20px;">* Nueva empresa registrada *</h2><div class="form-container">${htmlData}</div><h2></h2></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>`,
            };
        };

        try {
            await transporter.sendMail({
                ...mailOptions,
                to: existingCompany.email!,
                ...generateEmailContent(),
                subject: "** Restablecer contraseña | hseq entrenamiento",
            });

        } catch (error) {
            return new NextResponse("Error al enviar el correo con el link, por favor intentelo nuevamente", { status: 400 });
        }

        return NextResponse.json(companyToken)

    } catch (error) {
        console.log("[COLLABORATOR-CREATE]", error)
        return new NextResponse("Internal Errorr", { status: 500 })
    }
}
