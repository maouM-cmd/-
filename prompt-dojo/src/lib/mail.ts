import nodemailer from "nodemailer";

const SITE_NAMES = { ja: "プロンプ道場", en: "Prompt Dojo" } as const;

function getBaseUrl(): string {
  return (
    process.env.APP_BASE_URL ??
    process.env.NEXT_PUBLIC_APP_BASE_URL ??
    "http://localhost:3000"
  );
}

function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_FROM);
}

function getTransporter() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

export async function sendMail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!isSmtpConfigured()) {
    console.log(`[mail] SMTP not configured. Would send to ${to}:`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Body: ${html.replace(/<[^>]+>/g, " ").trim()}`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  });
}

function normalizeLocale(locale?: string): "ja" | "en" {
  return locale === "en" ? "en" : "ja";
}

export async function sendVerificationEmail(
  email: string,
  token: string,
  locale = "ja",
): Promise<void> {
  const loc = normalizeLocale(locale);
  const siteName = SITE_NAMES[loc];
  const url = `${getBaseUrl()}/${loc}/verify-email?token=${encodeURIComponent(token)}`;

  const content =
    loc === "en"
      ? {
          subject: `[${siteName}] Verify your email`,
          html: `
      <p>Thank you for signing up for ${siteName}.</p>
      <p>Click the link below to verify your email address.</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link is valid for 24 hours.</p>
    `,
        }
      : {
          subject: `【${siteName}】メールアドレスの確認`,
          html: `
      <p>${siteName}へのご登録ありがとうございます。</p>
      <p>以下のリンクをクリックして、メールアドレスを確認してください。</p>
      <p><a href="${url}">${url}</a></p>
      <p>このリンクは24時間有効です。</p>
    `,
        };

  await sendMail({ to: email, ...content });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  locale = "ja",
): Promise<void> {
  const loc = normalizeLocale(locale);
  const siteName = SITE_NAMES[loc];
  const url = `${getBaseUrl()}/${loc}/reset-password?token=${encodeURIComponent(token)}`;

  const content =
    loc === "en"
      ? {
          subject: `[${siteName}] Reset your password`,
          html: `
      <p>We received a password reset request.</p>
      <p>Click the link below to set a new password.</p>
      <p><a href="${url}">${url}</a></p>
      <p>This link is valid for 1 hour. Ignore this email if you did not request a reset.</p>
    `,
        }
      : {
          subject: `【${siteName}】パスワードのリセット`,
          html: `
      <p>パスワードリセットのリクエストを受け付けました。</p>
      <p>以下のリンクから新しいパスワードを設定してください。</p>
      <p><a href="${url}">${url}</a></p>
      <p>このリンクは1時間有効です。心当たりがない場合は無視してください。</p>
    `,
        };

  await sendMail({ to: email, ...content });
}
