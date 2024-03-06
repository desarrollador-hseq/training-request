
import { mailOptions, transporter } from "@/lib/nodemailer";
import { templateMail } from "@/lib/template-mail";
import { formatDateOf } from "@/lib/utils";
import { Certificate } from "@prisma/client";
import { NextResponse } from "next/server";

interface CertificateWithCompanyEmail extends Certificate {
  collaborator: {
    company:
      | {
          email: string | null | undefined;
          nameContact: string | null | undefined;
        }
      | null
      | undefined;
  };
}

const generateEmailContent = (certificate: CertificateWithCompanyEmail) => {
  const { collaboratorFullname, dueDate, collaborator } = certificate;

  const baseUrl = process.env.NEXTAUTH_URL;
  const title = `Notificación de vencimiento de certificado para: ${collaboratorFullname}`;

  const content = `
  <div class="u-row-container" style="padding: 0px;background-color: transparent">
            <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

                <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                  <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--[if (!mso)&(!IE)]><!-->
                    <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                      <!--<![endif]-->

                      <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                        <tbody>
                          <tr>
                            <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                              <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                <div>
                                  <div>&nbsp;Estimado(a) ${
                                    collaborator.company?.nameContact
                                  }</div>
                                  <div>&nbsp;</div>
                                  <div>Le notificamos que uno de los certificados de sus colaboradores está próximo a vencer. Según nuestros registros, el certificado de ${collaboratorFullname} en el curso: [${
    certificate.courseName
  } ${certificate.levelName !== certificate.courseName ? `- ${certificate.levelName}` : ""}] está programado para vencer el ${
    dueDate ? formatDateOf(dueDate) : ""
  }</div>
                                  <div>&nbsp;</div>
                                  <div>Para evitar cualquier interrupción en las actividades laborales o cualquier inconveniente relacionado con la validez de este certificado, les recomendamos tomar las medidas necesarias para renovarlo a tiempo.</div>
                                  <div>&nbsp;</div>
                                  <div>
                                    <p style="line-height: 140%;">Si necesitan asistencia adicional o tienen alguna pregunta sobre este asunto, no duden en ponerse en contacto con nuestros asesores.</p>
                                    <p style="line-height: 140%;">&nbsp;</p>
                                    <p style="line-height: 140%;">&nbsp;</p>
                                    <p style="line-height: 140%;">Gracias por su atención y colaboración.</p>
                                  </div>
                                  <div>&nbsp;</div>
                                  <div>&nbsp;</div>
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
          </div>

          <div class="u-row-container" style="padding: 0px;background-color: transparent">
          <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

              <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
              <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                  <!--[if (!mso)&(!IE)]><!-->
                  <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                    <!--<![endif]-->

                    <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                      <tbody>
                        <tr>
                          <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                            <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                            <div align="center">
                              <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:49px; v-text-anchor:middle; width:131px;" arcsize="8%"  stroke="f" fillcolor="#3AAEE0"><w:anchorlock/><center style="color:#FFFFFF;font-family: 'Cabin',sans-serif; "><![endif]-->
                              <a href="${baseUrl}/dashboard/entrenamiento/certificados/${certificate.id}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #3AAEE0; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-family: 'Cabin',sans-serif; font-size: 14px;">
                                <span style="display:block;padding:16px 24px 16px 23px;line-height:120%;"><span style="line-height: 16.8px;">Ver certificado<br></span></span>
                              </a>
                              <!--[if mso]></center></v:roundrect><![endif]-->
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
        </div>
    `;

  return {
    text: "",
    html: `${templateMail({ content: content, title })} `,
  };
};

export async function POST(req: Request) {
  let emailFormNotification: string | null = null;
 

  try {
   
    const values = (await req.json()) as any;

    if (!values) {
      return new NextResponse("Bad request", { status: 400 });
    }
    // const config = await db.configurationSettings.findFirst({});
    const { certificate, email } = values;

    // if (!config || !config.emailForNotifications) {
    //   emailFormNotification = process.env.EMAILSENDER!;
    // }
    if (!certificate || !email) {
      return new NextResponse("Bad request", { status: 400 });
    }

    // console.log({trainingRequest: trainingRequest?.collaborators.map(m => m.collaborator)});
    // generateEmailContent(collaborator);
    await transporter.sendMail({
      ...mailOptions,
      to: email,
      // to: "kingj3su@gmail.com",
      ...generateEmailContent(certificate),
      subject: `Notificación de vencimiento de certificado`,
    });
    return NextResponse.json({ message: "ok", status: 200 });
  } catch (error) {
    console.log("[SEND-CERTIFICATE-TOEXPIRE-SOON", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
