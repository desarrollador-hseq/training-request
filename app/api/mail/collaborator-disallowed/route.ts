

import { NextResponse } from "next/server";
import { transporter, mailOptions } from "@/lib/nodemailer";
import { templateMail } from "@/lib/template-mail"

interface generateEmailContentProps {
  textContent: string;
  link: string;
  name: string;
  document: string;
  course: string;
}

const generateEmailContent = ({ textContent, link, name, document, course, }: generateEmailContentProps) => {


  const title = "Colaborador inhabilitado"

  const table = `
    <div class="u-row-container" style="padding: 2px;background-color: transparent">
    <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
      <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 2px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: transparent;"><![endif]-->

        <!--[if (mso)|(IE)]><td align="center" width="166" style="background-color: #ffffff;width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 3px solid #287fb8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
          <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!-->
            <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 3px solid #287fb8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--<![endif]-->

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                      <!--[if mso]><table width="100%"><tr><td><![endif]-->
                      <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Cabin',sans-serif; font-size: 18px; font-weight: 400;"><span><span><span><span><span><span><span><strong>Nombre</strong></span></span>
                        </span>
                        </span>
                        </span>
                        </span>
                        </span>
                      </h1>
                      <!--[if mso]></td></tr></table><![endif]-->

                    </td>
                  </tr>
                </tbody>
              </table>

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                      <div style="font-family: 'Cabin',sans-serif; font-size: 14px; font-weight: 400; line-height: 140%; text-align: center; word-wrap: break-word;">
                        <p style="line-height: 140%;">${name}</p>
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
        <!--[if (mso)|(IE)]><td align="center" width="173" style="background-color: #ffffff;width: 173px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 3px solid #287fb8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-34p67" style="max-width: 320px;min-width: 173.33px;display: table-cell;vertical-align: top;">
          <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!-->
            <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 3px solid #287fb8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--<![endif]-->

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                      <!--[if mso]><table width="100%"><tr><td><![endif]-->
                      <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Cabin',sans-serif; font-size: 18px; font-weight: 400;"><span><span><span><span><span><span><span><strong>Documento</strong></span></span>
                        </span>
                        </span>
                        </span>
                        </span>
                        </span>
                      </h1>
                      <!--[if mso]></td></tr></table><![endif]-->

                    </td>
                  </tr>
                </tbody>
              </table>

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                      <div style="font-family: 'Cabin',sans-serif; font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                        <p style="line-height: 140%;">${document}</p>
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
        <!--[if (mso)|(IE)]><td align="center" width="160" style="background-color: #ffffff;width: 160px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 3px solid #287fb8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-32" style="max-width: 320px;min-width: 160px;display: table-cell;vertical-align: top;">
          <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!-->
            <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 3px solid #287fb8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
              <!--<![endif]-->

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                      <!--[if mso]><table width="100%"><tr><td><![endif]-->
                      <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-family: 'Cabin',sans-serif; font-size: 18px; font-weight: 400;"><span><span><span><span><span><span><strong>Curso</strong></span></span>
                        </span>
                        </span>
                        </span>
                        </span>
                      </h1>
                      <!--[if mso]></td></tr></table><![endif]-->

                    </td>
                  </tr>
                </tbody>
              </table>

              <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                <tbody>
                  <tr>
                    <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                      <div style="font-family: 'Cabin',sans-serif; font-size: 14px; line-height: 140%; text-align: center; word-wrap: break-word;">
                        <p style="line-height: 140%;">${course}</p>
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

            <!--[if (mso)|(IE)]><td align="center" width="600" style="background-color: #ffffff;width: 600px;padding: 12px 5px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
            <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
              <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                <!--[if (!mso)&(!IE)]><!-->
                <div style="box-sizing: border-box; height: 100%; padding: 12px 5px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                  <!--<![endif]-->

                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                          <div style="font-family: 'Cabin',sans-serif; font-size: 15px; line-height: 140%; text-align: left; word-wrap: break-word;">
                            <p style="line-height: 140%;">${textContent}</p>
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

                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                          <div align="center">
                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="" style="height:46px; v-text-anchor:middle; width:129px;" arcsize="8.5%"  stroke="f" fillcolor="#287fb8"><w:anchorlock/><center style="color:#FFFFFF;font-family: 'Cabin',sans-serif; "><![endif]-->
                            <a href="${link}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #287fb8; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-family: 'Cabin',sans-serif; font-size: 15px;">
                              <span style="display:block;padding:14px 24px;line-height:120%;"><strong><span style="line-height: 18px;">GESTIONAR</span></strong>
                              </span>
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

  `


  return {
    text: "Colaborador inhabilitado en una solicitud",
    html: `${templateMail({ content: table, title })}`
  };
};


export async function POST(req: Request) {
  const baseUrl = process.env.NEXTAUTH_URL

  try {
    const values = (await req.json()) as any;

    if (!values) {
      return new NextResponse("Bad request", { status: 400 });
    }

    const { textContent, toEmail, name, document, course, link } = values;

    if (!textContent || !toEmail || !name || !document || !course || !link) {
      return new NextResponse("Bad request", { status: 400 });
    }
    await transporter.sendMail({
      ...mailOptions,
      // to: `${toEmail}`,
      to: `kingj3su@gmail.com`,
      ...generateEmailContent({ textContent, link: `${baseUrl}${link}`, name, document, course }),
      subject: `Colaborador inhabilitado en una solicitud`,
    });
    return NextResponse.json({ message: "ok", status: 200 });
  } catch (error) {
    console.log("[SEND-COMPANY-VALIDATE", error);
    return new NextResponse("Internal Errorr " + error, { status: 500 });
  }
}