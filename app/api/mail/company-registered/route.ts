import { db } from "@/lib/db";
import { mailOptions, transporter } from "@/lib/nodemailer";
import { Company } from "@prisma/client";
import { NextResponse } from "next/server";

const COMPANY_REGISTRATION_FIELDS: any = {
  businessName: "Nombre de la empresa",
  email: "Correo electrónico",
  nit: "Nit",
  sector: "Sector",
  phoneContact: "Teléfono de contacto",
  nameContact: "Nombre del contacto",
};

const generateEmailContent = (data: any) => {
  const filteredData = Object.entries(data)
    .filter(([key]) => COMPANY_REGISTRATION_FIELDS[key])
    .reduce((obj, [key, val]) => {
      return { ...obj, [key]: val };
    }, {});
  const stringData = Object.entries(filteredData).reduce(
    (str, [key, val]) =>
      (str += `${COMPANY_REGISTRATION_FIELDS[key]}: \n${val} \n \n`),
    ""
  );
  const htmlData = Object.entries(filteredData).reduce((str, [key, val]) => {
    return (str += `<h3 class="form-heading" align="left">${COMPANY_REGISTRATION_FIELDS[key]}</h3><p class="form-answer" align="left">${val}</p>`);
  }, "");

  return {
    text: stringData,
    html: `<!DOCTYPE html><html><head><title></title><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><style type="text/css">body,table,td,a {-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;}table {border-collapse: collapse !important;}body {height: 100% !important;margin: 0 !important;padding: 0 !important;width: 100% !important;}@media screen and (max-width: 525px) {.wrapper {width: 100% !important;max-width: 100% !important;}.responsive-table {width: 100% !important;}.padding {padding: 10px 5% 15px 5% !important;}.section-padding {padding: 0 15px 50px 15px !important;}}.form-container {margin-bottom: 24px;padding: 20px;border: 1px dashed #ccc;}.form-heading {color: #2a2a2a;font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;font-weight: 400;text-align: left;line-height: 20px;font-size: 18px;margin: 0 0 8px;padding: 0;}.form-answer {color: #2a2a2a;font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;font-weight: 300;text-align: left;line-height: 20px;font-size: 16px;margin: 0 0 24px;padding: 0;}div[style*="margin: 16px 0;"] {margin: 0 !important;}</style></head><body style="margin: 0 !important; padding: 0 !important; background: #fff"><divstyle="display: none;font-size: 1px;color: #fefefe;line-height: 1px;max-height: 0px;max-width: 0px;opacity: 0;overflow: hidden;"></div><table border="0" cellpadding="0" cellspacing="0" width="100%"><tr><tdbgcolor="#ffffff"align="center"style="padding: 10px 15px 30px 15px"class="section-padding"><tableborder="0"cellpadding="0"cellspacing="0"width="100%"style="max-width: 500px"class="responsive-table"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><tablewidth="100%"border="0"cellspacing="0"cellpadding="0"><tr><tdstyle="padding: 0 0 0 0;font-size: 16px;line-height: 25px;color: #232323;"class="padding message-content"><h2 style="font-size: 20px;">* Nueva empresa registrada *</h2><div class="form-container">${htmlData}</div><h2></h2></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>`,
  };
};

export async function POST(req: Request) {
  let emailFormNotification: string | null = null;
  try {
    const values = (await req.json()) as Company;

    if (!values) {
      return new NextResponse("Bad request", { status: 400 });
    }
    
    const config = await db.configurationSettings.findFirst({})

    if (!config || !config.emailForNotifications) {
      emailFormNotification = process.env.EMAILSENDER!
     }
   
    await transporter.sendMail({
      ...mailOptions,
      to: emailFormNotification!,
      ...generateEmailContent(values),
      subject: "** Nueva empresa registrada",
    });

    return NextResponse.json({ message: "ok", status: 200 });
  } catch (error) {
    console.log("[SEND-REGISTERED-COMPANY-", error);
    return new NextResponse("Internal Errorr", { status: 500 });
  }
}
