
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { DateRange } from "react-day-picker";
import { authOptions } from "@/lib/authOptions";
import { mailOptions, transporter } from "@/lib/nodemailer";
import { templateMail } from "@/lib/template-mail";
import { formatDateOf } from "@/lib/utils";

const generateEmailContent = (collaborator: CollaboratorData, rescheduled: boolean) => {
  const { name, levelName, companyName, courseDate, courseName } = collaborator;

  const baseUrl = process.env.NEXTAUTH_URL
  const title = rescheduled ? `Actualización: Cambio de Fechas del Curso ${courseName}` : `Confirmación de Inscripción a curso de ${courseName}`

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

                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                    <tbody>
                      <tr>
                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">

                          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                            <p style="line-height: 140%;">Estimado(a) ${name},</p>
                            <p style="line-height: 140%;">&nbsp;</p>
                            <p style="line-height: 140%;">${rescheduled ? "Te informamos sobre un cambio en las fechas del curso que estás programado para tomar. A continuación, encontrarás los detalles actualizados:"
      : `Nos complace informarte que has sido inscrito por parte de: ${companyName}, en el siguiente curso:`}</p>
                            <ul style="list-style-type: disc;">
                              <li style="line-height: 19.6px;"><strong>Nombre del Curso:</strong> ${courseName}</li>
                              ${levelName !== courseName ? `<li style="line-height: 19.6px;"><strong>Nivel</strong>: ${levelName}</li>` : ""}
                              <li style="line-height: 19.6px;"><strong>Fecha de inicio:</strong> ${courseDate.from ? formatDateOf(courseDate.from!) : ""}</li>
                              <li style="line-height: 19.6px;"><strong>Hora:</strong> 7 : 30 AM</li>
                              <li style="line-height: 19.6px;"><strong>Lugar:</strong> Calle 30 # 10 - 230 Local 1</li>
                            </ul>
                            <p style="line-height: 140%;">&nbsp;</p>
                            <p style="line-height: 140%;">
                            ${rescheduled ?
    "Lamentamos cualquier inconveniente que este cambio pueda causarte y agradecemos tu comprensión y flexibilidad. Nuestro objetivo es brindarte la mejor experiencia de aprendizaje posible, y esperamos verte en el curso en la nueva fecha programada."
    : ""}
                            </p>
                            <p style="line-height: 140%;">&nbsp;</p>
                            <p style="line-height: 140%;">Asegúrate de cumplir con los siguientes requisitos para asistir al curso:</p>
                            <p style="line-height: 140%;">&nbsp;</p>
                            <p style="line-height: 140%;"><a target="_blank" href="${baseUrl}/requisitos-para-asistir" rel="noopener">Ver requisitos para asistir</a></p>
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
    text: "",
    html: `${templateMail({ content: content, title })} `
  };
};

interface CollaboratorData {
  name: string,
  companyName: string,
  courseName: string,
  levelName?: string,
  courseDate: DateRange,
}

export async function POST(req: Request) {
  let emailFormNotification: string | null = null;
  const session = await getServerSession(authOptions)


  try {
    if (!session || session.user.role !== "ADMIN") return new NextResponse("Unauthorized", { status: 401 })
    const values = (await req.json()) as any;

    if (!values) {
      return new NextResponse("Bad request", { status: 400 });
    }
    // const config = await db.configurationSettings.findFirst({});
    const { collaborator, rescheduled } = values;

    // if (!config || !config.emailForNotifications) {
    //   emailFormNotification = process.env.EMAILSENDER!;
    // }
    if (!collaborator || !collaborator.email) {
      return new NextResponse("Bad request", { status: 400 });
    }

    // console.log({trainingRequest: trainingRequest?.collaborators.map(m => m.collaborator)});
    // generateEmailContent(collaborator);
    await transporter.sendMail({
      ...mailOptions,
       to: collaborator.email!,
      // to: "kingj3su@gmail.com",
      ...generateEmailContent(collaborator, rescheduled ? rescheduled : false),
      subject: `Confirmación de Inscripción a Curso de: [${collaborator.courseName}]`,
    });
    return NextResponse.json({ message: "ok", status: 200 });
  } catch (error) {
    console.log("[SEND-COLLABORATOR-PROGRAMMED", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
