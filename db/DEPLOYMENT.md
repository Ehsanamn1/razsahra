# راهنمای استقرار backend راز صحرا

این راهنما برای اجرای واقعی API روی Cloudflare Pages و Neon است. فقط build فرانت‌اند، احراز هویت یا CMS را به‌تنهایی فعال نمی‌کند؛ هر سه بخش به استقرار Functions، تنظیم Secrets و اجرای schema نیاز دارند.

## ترتیب پیشنهادی

1. در Neon یک پروژه PostgreSQL بسازید و connection string pooled را دریافت کنید.
2. فایل `db/schema.sql` را در SQL Editor همان پایگاه‌داده اجرا کنید.
3. یک Pages project با نام `razsahra` در Cloudflare بسازید و شاخه production را `main` تنظیم کنید.
4. در Cloudflare Pages → Settings → Variables and Secrets، مقدار `DATABASE_URL` را به‌عنوان Secret در Production ثبت کنید.
5. برای ساخت اولین مدیر، یک Secret موقت `ADMIN_BOOTSTRAP_SECRET` با حداقل ۳۲ نویسه تصادفی تنظیم کنید. این متغیر را به‌عنوان GitHub Secret یا در فایل پروژه قرار ندهید.
6. در GitHub → Settings → Secrets and variables → Actions:
   - متغیر `CLOUDFLARE_ACCOUNT_ID` را با Account ID حساب Cloudflare بسازید.
   - Secret `CLOUDFLARE_API_TOKEN` را با دسترسی لازم برای انتشار Cloudflare Pages روی همان حساب بسازید.
   - در صورت استفاده از دامنه سفارشی، متغیر `SITE_URL` را برابر URL نهایی HTTPS سایت قرار دهید.
7. فایل‌های پروژه را به `main` ارسال کنید یا گردش‌کار **Build and deploy RAZ SAHRA to Cloudflare Pages** را به‌صورت دستی اجرا کنید. workflow ابتدا `npm run check` و `npm run build` را اجرا و سپس خروجی `dist` را منتشر می‌کند.
8. پس از deploy، `/api/health` را باز کنید. تا زمان پاسخ `ok: true` و `database: "connected"` به سراغ bootstrap نروید.
9. اولین مدیر را با `POST /api/auth/bootstrap-admin` بسازید. نمونه درخواست و ترتیب آن در README اصلی آمده است.
10. بلافاصله بعد از ساخت مدیر، متغیر `ADMIN_BOOTSTRAP_SECRET` را از Cloudflare Pages حذف کنید و deploy/reload لازم را انجام دهید. endpoint یک‌باره به‌کمک claim ذخیره‌شده در دیتابیس دیگر مدیر جدید ایجاد نمی‌کند.
11. با صفحه ورود سایت وارد شوید و تب‌های پیشخوان را بررسی کنید: نمای کلی، صفحه‌ها، مقاله‌ها، کاربران، صندوق پیام‌ها، اپلیکیشن‌ها، تنظیمات و گزارش فعالیت.

## متغیرهای محیطی

| Variable | محل | لازم | توضیح |
|---|---|---|---|
| `DATABASE_URL` | Cloudflare Pages Secret | بله | اتصال pooled پایگاه‌داده Neon |
| `ADMIN_BOOTSTRAP_SECRET` | Cloudflare Pages Secret | فقط راه‌اندازی اولیه | کلید موقت یک‌باره؛ بعد از ساخت مدیر حذف شود |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions Secret | برای انتشار خودکار | توکن انتشار محدود به Cloudflare Pages |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions Variable | برای انتشار خودکار | شناسه حساب Cloudflare |
| `SITE_URL` | GitHub Actions Variable | اختیاری | دامنه عمومی نهایی؛ پیش‌فرض `https://razsahra.pages.dev` |

برای محیط محلی از `.dev.vars.example` یک نسخه با نام `.dev.vars` بسازید و مقادیر توسعه را وارد کنید. `.dev.vars` در `.gitignore` است و نباید commit شود.

## بررسی و عیب‌یابی

- `503 backend_not_configured` یا `database_not_configured`: متغیر `DATABASE_URL` برای محیطی که درخواست را اجرا می‌کند تنظیم نشده است.
- `503 database_unavailable`: اتصال دیتابیس یا schema اجراشده را بررسی کنید.
- `503 bootstrap_not_configured`: secret موقت `ADMIN_BOOTSTRAP_SECRET` غایب است یا حداقل طول لازم را ندارد.
- `403 bootstrap_secret_invalid`: مقدار هدر `x-admin-bootstrap-secret` دقیقاً با Secret ثبت‌شده در Cloudflare یکسان نیست.
- `409 bootstrap_already_used`: در حال حاضر مدیر وجود دارد یا claim یک‌باره قبلاً مصرف شده است. برای دورزدن محدودیت، یک secret دیگر اضافه نکنید؛ مسیر بازیابی دیتابیس را بررسی کنید.
- workflow سبز اما بدون deploy: در Summary ببینید آیا `CLOUDFLARE_API_TOKEN` و `CLOUDFLARE_ACCOUNT_ID` تعریف شده‌اند. بررسی کنید پروژه Pages با نام دقیق `razsahra` در همان حساب قرار دارد.
- پیش‌نمایش `ehsanamn1.github.io/razsahra/` نسخه ایستای قدیمی است و API/Functions را اجرا نمی‌کند. API را روی دامنه Cloudflare یا دامنه سفارشی متصل به Pages آزمایش کنید.

## مرزهای فعلی

تأیید ایمیل، بازیابی رمز عبور، ارسال اعلان ایمیلی، حذف حساب و سیاست نگهداری/حذف پیام‌ها هنوز پیاده‌سازی نشده‌اند. برای استفاده عملیاتی، این محدودیت‌ها را صریحاً در نظر بگیرید. هیچ secret یا رمز مدیر نباید در Git، HTML، پیام عمومی یا README قرار گیرد.
