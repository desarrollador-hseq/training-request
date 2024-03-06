
import { mailOptions, transporter } from "@/lib/nodemailer";
import { templateMail } from "@/lib/template-mail";
import { NextResponse } from "next/server";



const generateEmailContent = (certificate: any) => {
  const { collaboratorFullname, companyContact, course, level, certificateId } = certificate;

  const baseUrl = process.env.NEXTAUTH_URL;
  const title = `Certificado Emitido para: ${collaboratorFullname}`;

  const content = `
  <div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--<![endif]-->

            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                <tr>
                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                    <div style="font-family: 'Cabin',sans-serif; font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                      <div>
                        <div>
                          <p style="line-height: 140%;">¡Hola ${companyContact}!</p>
                          <p style="line-height: 140%;">&nbsp;</p>
                          <p style="line-height: 140%;">Queremos informarte que se ha emitido un certificado para uno de los colaboradores de tu empresa, en el curso: ${course}  ${level ? `- ${level}` : ""}.</p>
                          <p style="line-height: 140%;">&nbsp;</p>
                          <p style="line-height: 140%;">Puedes acceder al certificado haciendo clic en el siguiente botón:</p>
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
</div>




<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--<![endif]-->

            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                <tr>
                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                    <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                    <div align="center">
                      <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:49px; v-text-anchor:middle; width:131px;" arcsize="8%"  stroke="f" fillcolor="#287fb8"><w:anchorlock/><center style="color:#FFFFFF;font-family: 'Cabin',sans-serif; "><![endif]-->
                      <a href="${baseUrl}/dashboard/entrenamiento/certificados/${certificateId}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #287fb8; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-family: 'Cabin',sans-serif; font-size: 14px;">
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





<div class="u-row-container" style="padding: 0px;background-color: transparent">
  <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

      <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!-->
          <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--<![endif]-->

            <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
              <tbody>
                <tr>
                  <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">

                    <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                      <p style="line-height: 140%;">Si tienes alguna pregunta o necesitas asistencia adicional, no dudes en contactarnos.</p>
                      <p style="line-height: 140%;">&nbsp;</p>
                      <p style="line-height: 140%;">&nbsp;</p>
                      <p style="line-height: 140%;">¡Gracias y que tengas un excelente día!</p>
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
      subject: `Certificado Emitido para ${certificate.collaboratorFullname}`,
    });
    return NextResponse.json({ message: "ok", status: 200 });
  } catch (error) {
    console.log("[SEND-CERTIFICATE-TOEXPIRE-SOON", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
