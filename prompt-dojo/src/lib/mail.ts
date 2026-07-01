import nodemailer from "nodemailer";
import { SITE_NAME } from "./constants";

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

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${getBaseUrl()}/verify-email?token=${encodeURIComponent(token)}`;
  await sendMail({
    to: email,
    subject: `【${SITE_NAME}】メールアドレスの確認`,
    html: `
      <p>${SITE_NAME}へのご登録ありがとうございます。</p>
      <p>以下のリンクをクリックして、メールアドレスを確認してください。</p>
      <p><a href="${url}">${url}</a></p>
      <p>このリンクは24時間有効です。</p>
    `,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<void> {
  const url = `${getBaseUrl()}/reset-password?token=${encodeURIComponent(token)}`;
  await sendMail({
    to: email,
    subject: `【${SITE_NAME}】パスワードのリセット`,
    html: `
      <p>パスワードリセットのリクエストを受け付けました。</p>
      <p>以下のリンクから新しいパスワードを設定してください。</p>
      <p><a href="${url}">${url}</a></p>
      <p>このリンクは1時間有効です。心当たりがない場合は無視してください。</p>
    `,
  });
}
