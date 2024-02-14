

import { Company } from "@prisma/client";
import { NextResponse } from "next/server";
import { transporter, mailOptions } from "@/lib/nodemailer";
import { templateMail } from "@/lib/template-mail"

const generateEmailContent = (company: Company) => {
  const { businessName, nameContact } = company;

  const title = "Empresa verificada"

  const content = `   <div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--<![endif]-->

            <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                <tr>
                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                    <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                      <div>
                        <div>Estimado (a) ${nameContact},</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>Nos complace informarle que su empresa, ${businessName}, ha sido verificada con éxito en nuestra plataforma.</div>
                        <div>&nbsp;</div>
                        <div>Gracias por confiar en nuestros servicios. A partir de ahora, usted y su equipo pueden comenzar a crear y gestionar solicitudes de entrenamiento, como también consultar certificados &nbsp;de manera ágil en cualquier momento
                          y lugar.</div>
                        <div>&nbsp;</div>
                        <div>Si necesita asistencia o tiene alguna pregunta, no dude en ponerse en contacto con nuestro equipo de asesores. Estamos aquí para ayudarle en cada paso del camino.</div>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                        <div>
                          <div>
                            <div>&nbsp;¡Gracias de nuevo por elegirnos!</div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </td>
                </tr>
              </tbody>
            </table>

            <!--[if (!mso)&(!IE)]><!-->
          </div>
          <!--<![endif]-->
        </div>
      </div>
      <!--[if (mso)|(IE)]></td><![endif]-->
      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
    </div>
  </div>
</div>`


  return {
    text: "¡Su empresa ha sido verificada!",
    html: `${templateMail({ content: content, title })}`
  };
};


export async function POST(req: Request) {
   
    try {
      const values = (await req.json()) as any;
  
      if (!values) {
        return new NextResponse("Bad request", { status: 400 });
      }
      // const config = await db.configurationSettings.findFirst({});
      const { company } = values;
  
      // if (!config || !config.emailForNotifications) {
      //   emailFormNotification = process.env.EMAILSENDER!;
      // }
      if (!company) {
        return new NextResponse("Bad request", { status: 400 });
      }
  
      // console.log({trainingRequest: trainingRequest?.collaborators.map(m => m.collaborator)});
    //   generateEmailContent(company);
      await transporter.sendMail({
        ...mailOptions,
        to: `${company.email}`,
        ...generateEmailContent(company),
        subject: `¡Su empresa ha sido verificada!`,
      });
      return NextResponse.json({ message: "ok", status: 200 });
    } catch (error) {
      console.log("[SEND-COMPANY-VALIDATE", error);
      return new NextResponse("Internal Errorr " + error, { status: 500 });
    }
  }