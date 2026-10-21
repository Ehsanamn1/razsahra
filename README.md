# راز صحرا | RAZ SAHRA

وب‌سایت فارسی و راست‌چین **راهبران زنجیره ارزش صحرا** با برند تجاری **راز صحرا | RAZ SAHRA** و شعار **«از تأمین تا ارزش‌آفرینی»**. این مخزن علاوه بر وب‌سایت، زیرساخت پنل مدیریت محتوا، احراز هویت و دریافت فرم‌ها را برای استقرار روی Cloudflare Pages در بر می‌گیرد.

## فناوری و اجزای پروژه

- فرانت‌اند سبک HTML/CSS/JavaScript، با طراحی واکنش‌گرا، فارسی RTL و مسیرهای مبتنی بر `?page=` برای سازگاری با پیش‌نمایش GitHub Pages.
- Cloudflare Pages Functions در مسیر `functions/api/[[path]].js`؛ APIهای حساب کاربری، نقش مدیر، CMS، مقاله‌ها، صندوق پیام‌ها، تنظیمات عمومی، کاتالوگ اپلیکیشن و گزارش فعالیت.
- PostgreSQL میزبانی‌شده روی Neon از طریق `@neondatabase/serverless`؛ ساختار و داده‌های اولیه در `db/schema.sql`.
- هش رمز عبور با PBKDF2-SHA-256، کوکی نشست HttpOnly و SameSite=Lax، کوکی Secure روی HTTPS، نگهداری هش توکن نشست، ثبت رویدادهای مهم و محدودسازی تلاش‌های ورود و ارسال فرم.
- `_headers` برای تنظیم چند هدر امنیتی پایه؛ `wrangler.toml` و `scripts/build.mjs` برای ساخت نسخه مناسب Cloudflare Pages.
- `scripts/check.mjs` برای بررسی مسیرهای احراز هویت و مدیریت، وجود جداول دیتابیس، ثبت فرم‌ها، fallback و گردش‌کار استقرار.

## وضعیت میزبانی

پیش‌نمایش قدیمی GitHub Pages در نشانی زیر باقی می‌ماند:

https://ehsanamn1.github.io/razsahra/

این نشانی **نسخه ایستا** است؛ GitHub Pages فایل‌های رابط کاربری را منتشر می‌کند اما Cloudflare Pages Functions و اتصال Neon را اجرا نمی‌کند. بنابراین، ورود و ذخیره آنلاین فرم‌ها در آن فعال نیست و فرم‌ها در صورت نبود API به‌صورت شفاف فایل پشتیبان محلی تولید می‌کنند.

هدف استقرار کامل:

https://razsahra.pages.dev/

انتشار Cloudflare از گردش‌کار `.github/workflows/pages.yml` انجام می‌شود. تا وقتی پروژه Cloudflare ساخته و مقادیر دسترسی زیر پیکربندی نشده‌اند، workflow فقط build و check را اجرا می‌کند و در Summary علت ردشدن استقرار را می‌نویسد. پس از اتصال Cloudflare و ثبت مقادیر، هر push معتبر به `main` می‌تواند نسخه جدید را منتشر کند.

## راه‌اندازی Cloudflare Pages

1. در Cloudflare، از بخش **Workers & Pages** یک Pages project با نام دقیق `razsahra` بسازید و شاخه production را `main` قرار دهید.
2. در تنظیمات مخزن GitHub، یک Repository Variable با نام `CLOUDFLARE_ACCOUNT_ID` بسازید و Account ID خود را در آن قرار دهید.
3. یک Repository Secret با نام `CLOUDFLARE_API_TOKEN` بسازید. توکن فقط باید دسترسی لازم برای انتشار Cloudflare Pages روی همان حساب را داشته باشد؛ آن را در فایل‌های پروژه یا پیام‌های عمومی قرار ندهید.
4. در صورت داشتن دامنه اختصاصی، یک Repository Variable با نام `SITE_URL` برابر آدرس نهایی و کامل سایت (HTTPS) بسازید. در غیر این صورت workflow از `https://razsahra.pages.dev` استفاده می‌کند.
5. workflow با Node.js 22، دستورهای `npm install --no-audit --no-fund`، `npm run check`، `npm run build` و سپس `wrangler pages deploy dist --project-name=razsahra --branch=main` را اجرا می‌کند.

## راه‌اندازی پایگاه‌داده Neon

1. یک پایگاه‌داده PostgreSQL در Neon بسازید و **connection string مربوط به pooled connection** را بردارید.
2. محتوای `db/schema.sql` را یک بار در Neon SQL Editor اجرا کنید. دستورهای ایجاد جدول و داده‌های اولیه طوری نوشته شده‌اند که اجرای دوباره بخش‌های پایه، داده‌های موجود را جایگزین نکند.
3. در Cloudflare Pages project به **Settings → Variables and Secrets** بروید و `DATABASE_URL` را به‌عنوان Secret برای محیط Production تنظیم کنید. مقدار باید connection string واقعی Neon باشد؛ آن را در Git ذخیره نکنید.
4. بعد از deploy، نشانی `https://دامنه-نهایی/api/health` را باز کنید. پاسخ موفق باید `ok: true` و `database: "connected"` داشته باشد. اگر خطای 503 دیدید، ابتدا مقدار `DATABASE_URL` و سپس اجرای schema را بررسی کنید.

## ساخت اولین مدیر — راه‌اندازی یک‌باره

ثبت‌نام عمومی فقط نقش `user` می‌سازد؛ هیچ فیلد یا پارامتر عمومی برای انتخاب نقش مدیر وجود ندارد. ایجاد مدیر نخست با endpoint یک‌باره `POST /api/auth/bootstrap-admin` انجام می‌شود:

1. پس از اجرای schema، در تنظیمات Production مربوط به Cloudflare Pages یک Secret موقت با نام `ADMIN_BOOTSTRAP_SECRET` بسازید. مقدار باید دست‌کم ۳۲ نویسه تصادفی داشته باشد. همین مقدار را فقط برای درخواست راه‌اندازی اولیه نگه دارید.
2. از ترمینال امن خود، درخواست نمونه زیر را با جایگزین‌کردن دامنه و مقادیر نمونه اجرا کنید:

```bash
curl -i -X POST "https://razsahra.pages.dev/api/auth/bootstrap-admin" \
  -H "content-type: application/json" \
  -H "x-admin-bootstrap-secret: REPLACE_WITH_THE_SAME_TEMPORARY_SECRET" \
  --data '{"username":"siteadmin","email":"admin@example.com","display_name":"Site Admin","password":"REPLACE_WITH_A_UNIQUE_PASSWORD_OF_16_OR_MORE_CHARACTERS"}'
```

3. بعد از دریافت پاسخ موفق، با نام کاربری و رمز مدیر در صفحه `?page=login` وارد شوید. این endpoint با یک claim اتمیک در دیتابیس فقط یک بار قابل استفاده است؛ اگر مدیر از قبل وجود داشته یا bootstrap قبلاً انجام شده باشد، درخواست رد می‌شود.
4. **بلافاصله پس از ساخت مدیر، Secret به نام `ADMIN_BOOTSTRAP_SECRET` را از Cloudflare حذف کنید.** رمز مدیر را در این مخزن یا فایل‌های عمومی نگه ندارید.

اگر اشتباهاً bootstrap انجام شده اما مدیر قابل دسترسی نیست، برای بازیابی از SQL Editor و رویه کنترل‌شده مدیریت پایگاه‌داده استفاده کنید؛ سعی نکنید endpoint یک‌باره را برای ساخت نقش مدیر دوم باز کنید.

## توسعه محلی

```bash
npm install --no-audit --no-fund
cp .dev.vars.example .dev.vars
# مقدارهای DATABASE_URL و ADMIN_BOOTSTRAP_SECRET را فقط در .dev.vars محلی قرار دهید.
npm run check
npm run build
npm run dev
```

برای اجرای API محلی، `.dev.vars` باید به دیتابیس آزمایشی یا دیتابیس توسعه مورداعتماد اشاره کند. فایل `.dev.vars` در `.gitignore` قرار دارد؛ فایل واقعی را commit نکنید. برای پیکربندی Cloudflare از راهنمای `db/DEPLOYMENT.md` هم استفاده کنید.

## APIهای اصلی

- `GET /api/health` — بررسی اتصال دیتابیس و آماده‌بودن schema.
- `POST /api/auth/register`، `POST /api/auth/login`، `GET /api/auth/me` و `POST /api/auth/logout` — حساب‌های عادی و نشست‌ها.
- `POST /api/auth/bootstrap-admin` — راه‌اندازی یک‌باره مدیر با Secret موقت؛ برای استفاده روزمره نیست.
- `GET /api/public/pages?slug=home&lang=fa` و `GET /api/public/articles?lang=fa` — خواندن محتوای منتشرشده.
- `POST /api/inquiries` — ثبت پیام و پیشنهاد همکاری با محدودسازی تلاش‌ها.
- مسیرهای `/api/admin/*` — پیشخوان حفاظت‌شده، مدیریت محتوا و کاربران، صندوق پیام‌ها، اپلیکیشن‌ها، تنظیمات و audit log.

فرم‌های تماس و همکاری فقط زمانی پیام موفقیت و شناسه پیگیری نشان می‌دهند که API ذخیره‌سازی را تأیید کند. اگر API در دسترس نباشد، یک فایل متنی محلی به‌عنوان پشتیبان ایجاد می‌شود و پیام وضعیت روشن می‌گوید که درخواست آنلاین ثبت نشده است.

## محدودیت‌های فعلی امنیت حساب

تأیید ایمیل، بازیابی رمز عبور و ارسال اعلان ایمیلی هنوز متصل نشده‌اند. تا تکمیل این قابلیت‌ها، از ثبت اطلاعات حساس خودداری کنید و برای دسترسی‌های عملیاتی حساس، ثبت‌نام عمومی را به‌عنوان سامانه حساب با تأیید هویت کامل در نظر نگیرید. دسترسی پنل مدیریت از سمت API کنترل می‌شود و پنهان یا آشکارشدن دکمه‌های فرانت‌اند به‌تنهایی مبنای مجوز نیست.

## طراحی، محتوای تحریریه و دارایی‌های تصویری

- وب‌سایت فارسی و راست‌چین، رابط واکنش‌گرا، هدر و منوی موبایل متحرک، چهار اسلاید اصلی و چهار اسلاید دعوت به همکاری، مجله تخصصی و پیشخوان مدیر را ارائه می‌کند.
- مجله ایستای اولیه در `assets/raz-sahra-articles.html` و نسخه انگلیسی آن در `assets/raz-sahra-articles-en.html` قرار دارد.
- تصاویر معرفی صنعت نماینده عمومی هستند و نباید به‌عنوان تصاویر تأسیسات متعلق به راز صحرا معرفی شوند.
- تصاویر موضوعی از Pexels و Unsplash استفاده می‌کنند؛ شرایط آن‌ها در [مجوز Pexels](https://www.pexels.com/license/) و [مجوز Unsplash](https://unsplash.com/license) آمده است.
- تصویر مزرعه پرندگان در دشت لار اثر مهدی کلهر است و با انتساب و مجوز Creative Commons Attribution 3.0 استفاده می‌شود.
- بنر اصلی یک گرافیک تولیدشده برای همین وب‌سایت است. لوگوی هدر، فوتر و آیکون وب‌اپ از فایل‌های ارائه‌شده از سوی مالک برند استفاده می‌کنند؛ در صورت جایگزینی، وضعیت مجوز و انتساب باید دوباره بررسی شود.

## پیش از عرضه عمومی

تأیید دامنه و اطلاعات رسمی کسب‌وکار، بازبینی سیاست حریم خصوصی، تعیین مدت نگهداری و رویه حذف پیام‌ها، تکمیل تأیید ایمیل و بازیابی رمز، تست کامل نسخه Cloudflare در موبایل و دسکتاپ و بررسی دسترس‌پذیری هنوز لازم است.


## Backend and migration

- معماری، مسیرهای API، راهنمای استقرار Cloudflare Pages، تنظیمات محرمانه، schema و مهاجرت دامنه در [BACKEND.md](BACKEND.md) مستند شده است.
- schema قابل‌حمل PostgreSQL در `db/schema.sql` نگهداری می‌شود؛ مقاله‌های فارسی/انگلیسی نسخه فعلی به دیتابیس CMS seed شده‌اند.
- مدار در `/madar/` منتشر می‌شود و درخواست‌های API آن از طریق `/api/medar/*` به Worker عملیاتی منتقل می‌شوند. خروجی native اندروید/iOS هنوز به عنوان فایل قابل دانلود منتشر نشده است.
