/**
 * Email Templates for SmartAdX AI ERP
 */

const baseStyle = `
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  color: #333;
`;

const containerStyle = `
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9fafb;
`;

const cardStyle = `
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const buttonStyle = `
  display: inline-block;
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  margin: 20px 0;
`;

const footerStyle = `
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  color: #6b7280;
  font-size: 14px;
`;

export function welcomeEmail(name: string): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>مرحباً بك في SmartAdX AI ERP</title>
    </head>
    <body style="${baseStyle}">
      <div style="${containerStyle}">
        <div style="${cardStyle}">
          <h1 style="color: #667eea; margin-bottom: 20px;">مرحباً بك ${name}! 🎉</h1>
          <p>نحن سعداء بانضمامك إلى SmartAdX AI ERP - نظام إدارة الدعاية والإعلان الثوري بالذكاء الاصطناعي.</p>
          
          <h2 style="color: #4b5563; margin-top: 30px;">ماذا يمكنك أن تفعل الآن؟</h2>
          <ul style="line-height: 2;">
            <li>🚀 إنشاء حملتك الإعلانية الأولى</li>
            <li>🤖 استخدام الذكاء الاصطناعي لتوليد المحتوى</li>
            <li>📊 تحليل أداء حملاتك بشكل فوري</li>
            <li>📱 جدولة المنشورات على وسائل التواصل الاجتماعي</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="${buttonStyle}">
              ابدأ الآن
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280;">
            إذا كنت بحاجة إلى مساعدة، فريق الدعم لدينا جاهز دائماً لمساعدتك.
          </p>
        </div>
        
        <div style="${footerStyle}">
          <p>© 2025 SmartAdX AI ERP. جميع الحقوق محفوظة.</p>
          <p>صُنع بـ ❤️ في فلسطين 🇵🇸</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function passwordResetEmail(name: string, resetToken: string): string {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>إعادة تعيين كلمة المرور</title>
    </head>
    <body style="${baseStyle}">
      <div style="${containerStyle}">
        <div style="${cardStyle}">
          <h1 style="color: #667eea; margin-bottom: 20px;">إعادة تعيين كلمة المرور 🔐</h1>
          <p>مرحباً ${name},</p>
          <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" style="${buttonStyle}">
              إعادة تعيين كلمة المرور
            </a>
          </div>
          
          <p style="margin-top: 30px; padding: 15px; background-color: #fef3c7; border-radius: 8px; border-right: 4px solid #f59e0b;">
            ⚠️ هذا الرابط صالح لمدة ساعة واحدة فقط.
          </p>
          
          <p style="margin-top: 20px; color: #6b7280;">
            إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني بأمان.
          </p>
        </div>
        
        <div style="${footerStyle}">
          <p>© 2025 SmartAdX AI ERP. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function verificationEmail(name: string, verificationToken: string): string {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verificationToken}`;
  
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>تأكيد البريد الإلكتروني</title>
    </head>
    <body style="${baseStyle}">
      <div style="${containerStyle}">
        <div style="${cardStyle}">
          <h1 style="color: #667eea; margin-bottom: 20px;">تأكيد البريد الإلكتروني ✉️</h1>
          <p>مرحباً ${name},</p>
          <p>شكراً لتسجيلك في SmartAdX AI ERP! نحتاج فقط إلى التحقق من بريدك الإلكتروني.</p>
          
          <div style="text-align: center;">
            <a href="${verifyUrl}" style="${buttonStyle}">
              تأكيد البريد الإلكتروني
            </a>
          </div>
          
          <p style="margin-top: 30px; color: #6b7280;">
            أو انسخ هذا الرابط والصقه في متصفحك:
          </p>
          <p style="word-break: break-all; color: #667eea; font-size: 14px;">
            ${verifyUrl}
          </p>
        </div>
        
        <div style="${footerStyle}">
          <p>© 2025 SmartAdX AI ERP. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function invoiceEmail(
  clientName: string,
  invoiceNumber: string,
  amount: number,
  dueDate: string
): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>فاتورة جديدة</title>
    </head>
    <body style="${baseStyle}">
      <div style="${containerStyle}">
        <div style="${cardStyle}">
          <h1 style="color: #667eea; margin-bottom: 20px;">فاتورة جديدة 💰</h1>
          <p>عزيزي ${clientName},</p>
          <p>تم إصدار فاتورة جديدة لحسابك.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="padding: 10px;"><strong>رقم الفاتورة:</strong></td>
                <td style="padding: 10px;">${invoiceNumber}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>المبلغ:</strong></td>
                <td style="padding: 10px; color: #667eea; font-size: 20px; font-weight: bold;">$${amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 10px;"><strong>تاريخ الاستحقاق:</strong></td>
                <td style="padding: 10px;">${dueDate}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" style="${buttonStyle}">
              عرض الفاتورة
            </a>
          </div>
        </div>
        
        <div style="${footerStyle}">
          <p>© 2025 SmartAdX AI ERP. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function notificationEmail(
  userName: string,
  title: string,
  message: string,
  actionUrl?: string
): string {
  return `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="${baseStyle}">
      <div style="${containerStyle}">
        <div style="${cardStyle}">
          <h1 style="color: #667eea; margin-bottom: 20px;">${title} 🔔</h1>
          <p>مرحباً ${userName},</p>
          <p>${message}</p>
          
          ${actionUrl ? `
            <div style="text-align: center;">
              <a href="${actionUrl}" style="${buttonStyle}">
                عرض التفاصيل
              </a>
            </div>
          ` : ''}
        </div>
        
        <div style="${footerStyle}">
          <p>© 2025 SmartAdX AI ERP. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
