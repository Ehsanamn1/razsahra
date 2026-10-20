/* RAZ SAHRA — bilingual UI, Persian/English direction and preference */
(function(){
  'use strict';
  var dictionary={
    "صفحه اصلی":"Home","درباره ما":"About","حوزه‌های فعالیت":"Our fields","زنجیره تأمین":"Supply chain","همکاری با ما":"Partnerships","مجله تخصصی":"Magazine","ارتباط با ما":"Contact","حریم خصوصی":"Privacy",
    "شروع همکاری":"Start a partnership","پیشنهاد همکاری":"Partnership request","پیشنهاد همکاری تولیدکننده":"Producer partnership","ارتباط با راز صحرا":"Contact Raz Sahra",
    "راهبران زنجیره ارزش صحرا":"Sahra Value Chain Leaders","راز صحرا":"Raz Sahra","از تأمین تا ارزش‌آفرینی":"From supply to value creation","از تأمین":"From supply","ارزش‌آفرینی":"value creation",
    "شناخت حوزه‌های فعالیت":"Explore our fields","آغاز گفت‌وگوی همکاری":"Start a conversation","آشنایی با حوزه‌های فعالیت":"Explore our fields","درخواست همکاری":"Partnership inquiry",
    "نگاه جامع به صنعت طیور":"A connected poultry industry","مدل پیشنهادی همکاری":"Proposed collaboration model","ارتباط روشن":"Clear communication","ظرفیت قابل بررسی":"Verifiable capacity","پیگیری مسئولانه":"Accountable follow-up",
    "نگاه زنجیره‌ای":"A value-chain perspective","روابط تجاری مسئولانه":"Responsible trade","توسعه مرحله‌ای":"Phased development",
    "یک صنعت؛":"One industry;","حلقه‌های به‌هم‌پیوسته":"connected value chains","مرور مدل زنجیره":"Explore the chain model","حوزه‌های فعالیت":"Our fields",
    "همکاری مبتنی بر اطلاعات":"Information-led collaboration","ظرفیت واقعی،":"Real capacity,","توافق روشن":"clear commitments","ثبت پیشنهاد همکاری":"Submit a partnership proposal","ارتباط با ما":"Contact us",
    "از گفت‌وگو تا فرصت مشترک":"From dialogue to shared opportunity","رشد پایدار،":"Sustainable growth,","با همکاری حرفه‌ای":"through professional collaboration","شروع گفت‌وگو":"Start a conversation","درباره راز صحرا":"About Raz Sahra",
    "یک صنعت؛ حلقه‌های به‌هم‌پیوسته":"One industry, connected links","مدل زنجیره تأمین":"Supply-chain model","FROM SUPPLY TO VALUE CREATION":"FROM SUPPLY TO VALUE CREATION",
    "بینش دقیق‌تر برای تصمیم‌های تجاری بهتر.":"Better insight for better business decisions.",
    "مجله تخصصی و تحلیل‌های صنعت":"Industry magazine & analysis","هشت مقاله تخصصی برای تصمیم‌های دقیق‌تر در صنعت طیور":"Eight specialist guides for better poultry-industry decisions",
    "هشت مقاله تخصصی درباره تأمین، کیفیت، لجستیک، قرارداد و مدیریت ریسک؛ برای استفاده در تصمیم‌های واقعی کسب‌وکار.":"Eight in-depth guides on sourcing, quality, logistics, contracts and risk—designed for real business decisions.",
    "مشاهده همه مقاله‌ها":"Browse all articles","مقاله‌های قبلی":"Previous articles","مقاله‌های بعدی":"Next articles","مطالعه مقاله":"Read article",
    "مقاله‌های کامل، دسته‌بندی‌شده و قابل ذخیره":"Detailed, categorised articles you can save","ورود به مجله تخصصی":"Explore the magazine",
    "دسترسی سریع":"Quick links","درباره ما":"About","حریم خصوصی":"Privacy policy","سیاست حریم خصوصی":"Privacy policy","حوزه‌های فعالیت":"Our fields","مجله تخصصی":"Magazine",
    "تأمین و بازرگانی":"Sourcing & trade","شبکه توزیع و زنجیره تأمین":"Distribution & supply chain","همکاری با فعالان صنعت طیور":"Poultry-industry partnerships",
    "زیرساخت‌های کشاورزی و دامپروری":"Agriculture & livestock infrastructure","توسعه تولید و بسته‌بندی":"Production & packaging development","سامانه‌های دیجیتال مدیریت عملیات":"Digital operations systems",
    "تمرکز اولیه":"Initial focus","در مسیر طراحی":"In design","حوزه همکاری":"Partnership opportunity","مسیر توسعه":"Development path","نیازمند ارزیابی":"Under evaluation","چشم‌انداز آینده":"Future direction",
    "شناخت نیاز، بررسی منابع تأمین و شکل‌دهی روابط تجاری بر پایه کیفیت، شفافیت و توافق روشن.":"Understand demand, assess supply options and build commercial relationships around quality, transparency and clear terms.",
    "ایجاد هماهنگی بهتر میان تأمین، تحویل و طرف‌های تجاری در چارچوب توافق‌های مشخص.":"Coordinate sourcing, delivery and trading partners through clear agreements.",
    "بررسی ظرفیت‌ها و نیازهای مرغداری‌ها، تولیدکنندگان و تأمین‌کنندگان مرتبط با صنعت طیور.":"Assess the capabilities and needs of poultry farms, producers and suppliers.",
    "بررسی فرصت‌های زیرساختی و همکاری‌های تخصصی متناسب با نیاز واقعی زنجیره ارزش.":"Explore infrastructure and specialist collaboration that supports real value-chain needs.",
    "بررسی مرحله‌ای امکان توسعه فعالیت‌های تولیدی و بسته‌بندی با توجه به الزامات فنی و قانونی.":"Evaluate production and packaging development against technical and regulatory requirements.",
    "بررسی ابزارهای دیجیتال برای سازمان‌دهی اطلاعات، گردش کار و تصمیم‌گیری بهتر در آینده.":"Explore digital tools for information management, workflow and better decisions.",
    "معرفی شرکت":"Company overview","فلسفه کسب‌وکار":"Business philosophy","ماموریت":"Mission","چشم‌انداز":"Vision","ارزش‌ها":"Values",
    "از نقطه شروع تجاری تا فرصت‌های توسعه":"From commercial foundations to growth opportunities",
    "تمرکز اولیه بر تأمین و هماهنگی تجاری است؛ حوزه‌های تولیدی و زیرساختی به‌عنوان مسیرهای توسعه بررسی می‌شوند.":"The current focus is sourcing and commercial coordination; production and infrastructure are considered as potential development paths.",
    "تجارت، وقتی منسجم‌تر پیش می‌رود که زنجیره دیده شود.":"Trade works better when the entire chain is visible.",
    "«از یک معامله تا یک رابطه تجاری پایدار؛ ارزش در هماهنگی و اعتماد ساخته می‌شود.»":"“From a single transaction to a lasting commercial relationship—value grows through coordination and trust.”",
    "رویکرد ما":"Our approach",
    "راهبران زنجیره ارزش صحرا با برند تجاری «راز صحرا» در حال توسعه رویکردی سازمان‌یافته برای تأمین، هماهنگی تجاری و توزیع است. نقطه شروع، شناخت درست نیاز بازار، ایجاد ارتباط شفاف با تأمین‌کنندگان و طراحی همکاری‌هایی است که برای طرفین معنا و ارزش داشته باشد.":"Sahra Value Chain Leaders, operating under the Raz Sahra brand, is developing a structured approach to sourcing, commercial coordination and distribution. It starts with understanding market needs, communicating clearly with suppliers and shaping cooperation that creates value for the parties involved.",
    "برخی حوزه‌ها در مرحله بررسی و توسعه قرار دارند. این وب‌سایت مسیر و اصول موردنظر شرکت را معرفی می‌کند و به‌جای ادعای امکانات یا فعالیت‌های تأییدنشده، وضعیت هر حوزه را شفاف نشان می‌دهد.":"Some areas remain under assessment or development. This website explains the company’s direction and principles without presenting unverified capabilities as operational facts.",
    "هر حلقه، بخشی از یک مسیر روشن‌تر است.":"Every link helps make the whole chain clearer.",
    "مدل موردنظر راز صحرا بر هماهنگی میان تأمین‌کننده، فرایندهای تجاری، توزیع و بازار تأکید دارد. ارتباط هر حلقه باید با مسئولیت، زمان‌بندی و توافق مشخص تعریف شود.":"Raz Sahra’s intended model emphasises coordination among suppliers, commercial processes, distribution and the market. Every hand-off needs clear ownership, timing and agreed terms.",
    "نمای کلی مدل همکاری":"Collaboration model overview","چارچوب پیشنهادی · نه سامانه عملیاتی زنده":"Proposed framework · not a live operating system",
    "تأمین‌کننده":"Supplier","منبع و ظرفیت":"Source & capacity","تأمین و هماهنگی":"Sourcing & coordination","توافق و پیگیری":"Agreement & follow-up","توزیع و تجارت":"Distribution & trade","تحویل هماهنگ":"Coordinated delivery","مشتری و بازار":"Customer & market","نیاز و بازخورد":"Demand & feedback",
    "اصول همکاری":"Collaboration principles","استانداردهایی برای تصمیم‌های بهتر":"Principles for better decisions",
    "نگاه زنجیره‌ای به کسب‌وکار":"A value-chain view","روابط تجاری پایدار":"Durable commercial relationships","نظم در تأمین و توزیع":"Discipline in sourcing and distribution","توسعه مرحله‌ای":"Phased development",
    "زنجیره‌های قوی با گفت‌وگوهای جدی آغاز می‌شوند.":"Strong supply chains start with serious conversations.",
    "اگر تأمین‌کننده، فعال صنعت طیور، توزیع‌کننده یا شریک تجاری بالقوه هستید، پیشنهاد خود را ثبت کنید تا نوع همکاری و شرایط اولیه آن قابل بررسی باشد.":"If you work in poultry production, sourcing, distribution or trade, tell us about your proposal so the potential fit and initial terms can be reviewed.",
    "پیشنهاد همکاری خود را ثبت کنید":"Submit a partnership proposal","ارتباط با راز صحرا":"Contact Raz Sahra","با رویکردی روشن وارد گفت‌وگو شویم.":"Start with a clear conversation.",
    "پیشنهاد همکاری خود را مطرح کنید":"Tell us about a partnership","اگر در تولید، تأمین، فرآوری، بسته‌بندی، حمل‌ونقل یا توزیع محصولات طیور فعالیت دارید، این فرم کمک می‌کند پیشنهاد شما با جزئیات اولیه و قابل بررسی ثبت شود.":"If you work in poultry production, sourcing, processing, packaging, transport or distribution, use this short form to outline your proposal for review.",
    "گفت‌وگوی حرفه‌ای":"A professional conversation","برای شروع، کافی است زمینه همکاری را روشن کنیم.":"Start by clarifying the proposed collaboration.",
    "نام، نوع همکاری، شماره تماس و شرح کوتاه پیشنهاد کافی است.":"Your name, collaboration type, phone number and a short proposal are enough.",
    "نام و نام خانوادگی / نام مجموعه *":"Name or organisation *","نوع همکاری *":"Partnership type *","شماره تماس *":"Phone number *","شرح پیشنهاد و شرایط مورد انتظار *":"Proposal and expected terms *",
    "انتخاب کنید":"Select an option","تأمین‌کننده":"Supplier","مرغداری یا فعال صنعت طیور":"Poultry farm or industry operator","توزیع‌کننده یا پخش":"Distributor","مشتری تجاری":"Business customer","شریک کشاورزی یا بازرگانی":"Agriculture or trade partner","سایر پیشنهادها":"Other",
    "نام شما یا کسب‌وکار":"Your name or business","شماره تماس در دسترس":"A reachable phone number","نوع محصول، ظرفیت یا خدمت":"Product, capacity or service","نوع همکاری، محصول یا خدمت، شرایط و زمان‌بندی را توضیح دهید.":"Describe the product or service, terms and timing.",
    "ذخیره پیش‌نویس":"Save draft","آماده‌سازی فایل درخواست":"Prepare request file","ساخت فایل پیام":"Prepare message file",
    "پیش‌نویس فقط روی همین مرورگر ذخیره می‌شود؛ ارسال آنلاین فعال نیست.":"Your draft is saved in this browser only; online sending is not enabled.",
    "ارتباط تجاری":"Business contact","برای ارتباط تجاری، طرح پیشنهاد یا پیگیری یک موضوع مرتبط با صنعت طیور، از این بخش استفاده کنید. مسیرهای رسمی تماس پس از تأیید اطلاعات شرکت درج خواهند شد.":"Use this section for business enquiries, proposals or follow-ups related to the poultry industry. Official direct contact details will be published after they are confirmed.",
    "برای گفت‌وگویی روشن و هدفمند":"For a clear, focused conversation","موضوع پیام را مشخص کنید و راه تماس قابل پیگیری ارائه دهید.":"Choose a topic and leave a reliable way to reach you.",
    "نام و نام خانوادگی *":"Full name *","موضوع پیام *":"Message topic *","نام شما":"Your name","شماره قابل تماس":"Phone number","متن پیام *":"Message *","موضوع و درخواست خود را شرح دهید.":"Describe your question or request.",
    "درخواست همکاری تجاری":"Business partnership","تأمین یا خرید":"Sourcing or purchasing","توزیع و حمل‌ونقل":"Distribution and transport","پرسش عمومی":"General enquiry","سایر موارد":"Other",
    "مجله تخصصی راز صحرا":"Raz Sahra magazine","راهنمای کاربردی برای فعالان صنعت طیور؛ از ارزیابی تأمین‌کننده و کنترل کیفیت تا حمل‌ونقل، قرارداد و مدیریت ریسک.":"In-depth guides for poultry professionals—from supplier assessment and quality control to logistics, contracts and risk management.",
    "هویت و رویکرد":"Identity & approach","درباره راهبران زنجیره ارزش صحرا":"About Sahra Value Chain Leaders",
    "زنجیره تأمین؛ با هماهنگی و مسئولیت روشن":"Supply chain: clear coordination and ownership",
    "چارچوب هماهنگی میان تولید، تأمین، توافق تجاری، حمل‌ونقل و بازار.":"A framework connecting production, sourcing, commercial terms, transport and the market.",
    "از منبع تا بازار":"From source to market","مراحل همکاری":"Collaboration stages","فرایند باید قابل فهم و قابل پیگیری باشد.":"The process should be clear and traceable.",
    "شناخت نیاز و مشخصات":"Define needs and requirements","بررسی منبع و شرایط":"Assess the source and terms","توافق بر مسئولیت‌ها":"Agree on responsibilities","پیگیری و بازخورد":"Follow-up and feedback",
    "دانش کاربردی برای تصمیم‌های دقیق‌تر":"Practical insight for better decisions",
    "در حال آماده‌سازی مجله...":"Preparing the magazine…","مجله تخصصی و دیدگاه‌ها":"Specialist magazine & analysis",
    "نام رسمی: راهبران زنجیره ارزش صحرا":"Legal name: Sahra Value Chain Leaders","برند تجاری: راز صحرا | RAZ SAHRA":"Brand: Raz Sahra","شعار: از تأمین تا ارزش‌آفرینی":"Tagline: From supply to value creation",
    "©":"©","حقوق محتوای این وب‌سایت محفوظ است.":"All website content rights reserved.","از تأمین تا ارزش‌آفرینی":"From supply to value creation",
    "اطلاعات تماس مستقیم پس از تأیید رسمی منتشر می‌شود.":"Direct contact details will be published after official confirmation.",
    "مجله تخصصی":"Magazine","خانه":"Home","بیشتر درباره ما":"More about us","مشاهده همه حوزه‌ها":"Explore all fields","جزئیات حوزه":"Field details","مشاهده رویکرد":"Explore our approach",
    "دسترسی سریع":"Quick links","همکاری":"Partnerships","راه‌های ارتباط":"Contact options","فرم تماس و پیام":"Contact form","ثبت پیشنهاد همکاری":"Submit a proposal","راهنماهای صنعت طیور":"Poultry industry guides",
    "صفحه اصلی":"Home","جست‌وجو در راهنماها...":"Search the magazine…","جست‌وجوی مقاله‌ها":"Search articles","۵ راهنمای کاربردی · قابل ذخیره برای مطالعه بعدی":"8 specialist guides · Save for later","مطالعه راهنما":"Read the guide","♡ ذخیره":"♡ Save","♥ ذخیره‌شده":"♥ Saved","بستن راهنما":"Close guide","No guide matched that search. Try a shorter phrase.":"No guide matched that search. Try a shorter phrase.",
    "راه‌های ارتباط":"Contact options","پیشنهاد همکاری تجاری":"Business partnership proposal","آماده‌سازی فایل درخواست":"Prepare request file",
    "توجه: این فایل از طریق وب‌سایت ارسال نشده است؛ برای ارسال باید آن را شخصاً به مقصد رسمی مورداعتماد منتقل کنید.":"Note: this file has not been sent through the website. You must send it yourself to a verified destination.",
    "فیلدهای ستاره‌دار ضروری هستند. لطفاً اطلاعات واقعی و قابل پیگیری وارد کنید.":"Fields marked * are required. Please enter accurate, traceable information.",
    "اطلاعات رسمی تماس پس از تأیید از سوی شرکت در این بخش قرار می‌گیرد. برای جلوگیری از انتشار اطلاعات نادرست، شماره تلفن، نشانی و حساب شبکه اجتماعی فرضی نمایش داده نشده است.":"Official contact details will appear here once confirmed. No unverified phone, address or social account is shown.",
    "پس از اعتبارسنجی، یک فایل متنی برای ذخیره یا ارسال دستی ساخته می‌شود.":"After validation, a text file is prepared for you to save and send manually.",
    "فایل درخواست برای ذخیره آماده شد. این اطلاعات به شرکت ارسال نشده است؛ پیش از ارسال دستی، محتوا و مقصد را بررسی کنید.":"Your request file is ready to save. It has not been sent to the company; review the file and verify the recipient before sending it.",
    "لطفاً فیلدهای ضروری را کامل و قالب ایمیل را بررسی کنید.":"Complete the required fields and check the email format.",
    "نام و نام خانوادگی / نام مجموعه *":"Name or organisation *","ایمیل (اختیاری)":"Email (optional)","ایمیل":"Email",
    "اطلاعات هنوز برای انتشار ارائه نشده است.":"Details have not yet been provided for publication.",
    "شرایط و الزامات این حوزه باید پیش از هر تعهد بررسی شود.":"Requirements should be assessed before any commitment.",
    "محتوا، زمانی ارزش دارد که واقعی و کاربردی باشد.":"Content should be evidence-based and useful.",
    "هویت شرکتی و برند تجاری":"Corporate identity and brand",
    "پنج راهنمای کاربردی برای تصمیم‌های دقیق‌تر در صنعت طیور":"Eight specialist guides for better decisions in the poultry industry",
    "چک‌لیست‌ها و چارچوب‌های تصمیم‌گیری برای فعالان صنعت طیور؛ همراه با امکان جست‌وجو و ذخیره مقاله برای مطالعه بعدی.":"Research-led guides for the poultry value chain: sourcing, farm management, product quality, logistics, contracts and food safety. Search, save and return when you need a practical reference.",
    "دانش کاربردی، نه شعارهای کلی":"Evidence, detail and practical value",
    "در این شماره":"In this edition","ورود به مجله":"Explore the magazine",
    "تأمین تا ارزش‌آفرینی":"From supply to value creation","زنجیره‌های قوی با گفت‌وگوهای جدی آغاز می‌شوند.":"Strong chains start with serious conversations.",
    "مقالات":"Articles","مطالعه مقاله‌ها":"Read the articles","محصولات طیور":"Poultry products","از تولید تا بازار":"From production to market",
    "نشان":"Brand mark","از نقطه شروع تجاری تا فرصت‌های توسعه":"From commercial foundations to growth opportunities",
    "تمرکز بر تأمین و هماهنگی تجاری است؛ حوزه‌های تولیدی و زیرساختی به‌عنوان مسیرهای توسعه بررسی می‌شوند.":"Our current focus is sourcing and commercial coordination. Production and infrastructure remain development paths under assessment."
  };
  Object.assign(dictionary,{
    "In the poultry industry, dependable outcomes require more than a single transaction. Raz Sahra focuses on connecting production capacity, market demand and distribution so commercial commitments are clearer and collaboration is easier to assess.":"در راز صحرا، نگاه به صنعت طیور از یک معامله فراتر می‌رود؛ مسئله، پیوند دقیق‌تر ظرفیت تولید، نیاز بازار و مسیر توزیع است تا تصمیم‌های تجاری روشن‌تر و همکاری‌ها قابل اتکاتر شوند.",
    "A connected industry, not a single product":"صنعتی به‌هم‌پیوسته، فراتر از یک محصول",
    "Every link helps make the whole chain clearer.":"هر حلقه، بخشی از یک مسیر روشن‌تر است.",
    "راز صحرا با نگاهی فراتر از یک محصول یا حلقه منفرد، بر پیوند میان تولیدکنندگان، تأمین‌کنندگان، خریداران و شبکه توزیع در صنعت طیور تمرکز دارد؛ از شناخت نیاز و ظرفیت تا هماهنگی تجاری و تحویل مسئولانه.":"Raz Sahra looks beyond a single product or transaction. We focus on connecting producers, suppliers, buyers and distribution across the poultry value chain—from understanding demand and capacity to coordinating commercial terms and responsible delivery.",
    "در راز صحرا، نگاه به صنعت طیور از یک معامله فراتر می‌رود؛ مسئله، پیوند دقیق‌تر ظرفیت تولید، نیاز بازار و مسیر توزیع است تا تصمیم‌های تجاری روشن‌تر و همکاری‌ها قابل اتکاتر شوند.":"At Raz Sahra, the poultry industry is more than a series of isolated transactions. The aim is to connect production capacity, market needs and distribution with greater precision—so commercial decisions are clearer and cooperation can be evaluated with confidence.",
    "در راز صحرا، نگاه به صنعت طیور از یک معامله فراتر می‌رود":"At Raz Sahra, the poultry industry is more than a single transaction",
    "راهبران زنجیره ارزش صحرا با برند تجاری «راز صحرا» در حال توسعه رویکردی سازمان‌یافته برای تأمین، هماهنگی تجاری و توزیع است. نقطه شروع، شناخت درست نیاز بازار، ایجاد ارتباط شفاف با تأمین‌کنندگان و طراحی همکاری‌هایی است که برای طرفین معنا و ارزش داشته باشد.":"Sahra Value Chain Leaders, under the Raz Sahra brand, is developing a structured approach to sourcing, commercial coordination and distribution. It begins with understanding market requirements, communicating clearly with suppliers and shaping collaboration that creates meaningful value for both sides.",
    "برخی حوزه‌ها در مرحله بررسی و توسعه قرار دارند. این وب‌سایت مسیر و اصول موردنظر شرکت را معرفی می‌کند و به‌جای ادعای امکانات یا فعالیت‌های تأییدنشده، وضعیت هر حوزه را شفاف نشان می‌دهد.":"Some activities remain under assessment or development. This website explains the company’s intended direction and principles while distinguishing future plans from verified operational capabilities.",
    "تمرکز اولیه بر تأمین و هماهنگی تجاری است؛ حوزه‌های تولیدی و زیرساختی به‌عنوان مسیرهای توسعه بررسی می‌شوند.":"The current focus is sourcing and commercial coordination. Production and infrastructure are being considered as potential development paths rather than presented as established operations.",
    "تمرکز اولیه بر تأمین و هماهنگی تجاری است":"Current focus: sourcing and commercial coordination",
    "شناخت نیاز، بررسی منابع تأمین و شکل‌دهی روابط تجاری بر پایه کیفیت، شفافیت و توافق روشن.":"Understand demand, assess potential supply sources and build commercial relationships around quality, transparency and clear terms.",
    "ایجاد هماهنگی بهتر میان تأمین، تحویل و طرف‌های تجاری در چارچوب توافق‌های مشخص.":"Coordinate sourcing, delivery and trading partners through defined agreements and shared expectations.",
    "بررسی ظرفیت‌ها و نیازهای مرغداری‌ها، تولیدکنندگان و تأمین‌کنندگان مرتبط با صنعت طیور.":"Assess capabilities and requirements across poultry farms, producers, suppliers and related businesses.",
    "بررسی فرصت‌های زیرساختی و همکاری‌های تخصصی متناسب با نیاز واقعی زنجیره ارزش.":"Explore infrastructure and specialist partnerships that address real value-chain needs.",
    "بررسی مرحله‌ای امکان توسعه فعالیت‌های تولیدی و بسته‌بندی با توجه به الزامات فنی و قانونی.":"Evaluate production and packaging opportunities against technical, operational and regulatory requirements.",
    "بررسی ابزارهای دیجیتال برای سازمان‌دهی اطلاعات، گردش کار و تصمیم‌گیری بهتر در آینده.":"Assess digital tools for organising information, improving workflows and supporting future decision-making.",
    "تجارت، وقتی منسجم‌تر پیش می‌رود که زنجیره دیده شود.":"Trade becomes more dependable when the whole chain is visible.",
    "«از یک معامله تا یک رابطه تجاری پایدار؛ ارزش در هماهنگی و اعتماد ساخته می‌شود.»":"“From a transaction to a lasting commercial relationship—value is built through coordination and trust.”",
    "راهبران زنجیره ارزش صحرا با برند تجاری «راز صحرا» در حال توسعه رویکردی سازمان‌یافته برای تأمین، هماهنگی تجاری و توزیع است. نقطه شروع، شناخت درست نیاز بازار، ایجاد ارتباط شفاف با تأمین‌کنندگان و طراحی همکاری‌هایی است که برای طرفین معنا و ارزش داشته باشد.":"Sahra Value Chain Leaders, under the Raz Sahra brand, is developing a structured approach to sourcing, commercial coordination and distribution. The starting point is a precise understanding of market demand, transparent supplier communication and collaborations that create practical value for both sides.",
    "برخی حوزه‌ها در مرحله بررسی و توسعه قرار دارند. این وب‌سایت مسیر و اصول موردنظر شرکت را معرفی می‌کند و به‌جای ادعای امکانات یا فعالیت‌های تأییدنشده، وضعیت هر حوزه را شفاف نشان می‌دهد.":"Some activities are still being assessed or developed. This website presents the company’s direction and principles without claiming that unverified capabilities, infrastructure or services are already operational.",
    "تجارت، وقتی منسجم‌تر پیش می‌رود که زنجیره دیده شود.":"Trade works better when the chain is understood as a whole.",
    "از یک معامله تا یک رابطه تجاری پایدار؛ ارزش در هماهنگی و اعتماد ساخته می‌شود.":"A durable commercial relationship grows from coordination, clarity and trust.",
    "از نقطه شروع تجاری تا فرصت‌های توسعه":"From commercial foundations to considered growth",
    "تمرکز اولیه بر تأمین و هماهنگی تجاری است؛ حوزه‌های تولیدی و زیرساختی به‌عنوان مسیرهای توسعه بررسی می‌شوند.":"Sourcing and commercial coordination are the initial focus; production and infrastructure are potential paths for staged development.",
    "شناخت نیاز، بررسی منابع تأمین و شکل‌دهی روابط تجاری بر پایه کیفیت، شفافیت و توافق روشن.":"Understand demand, evaluate supply options and build trading relationships around quality, transparency and clear agreements.",
    "ایجاد هماهنگی بهتر میان تأمین، تحویل و طرف‌های تجاری در چارچوب توافق‌های مشخص.":"Improve coordination among sourcing, delivery and business partners within clear, documented terms.",
    "بررسی ظرفیت‌ها و نیازهای مرغداری‌ها، تولیدکنندگان و تأمین‌کنندگان مرتبط با صنعت طیور.":"Understand the capacity and needs of farms, producers and suppliers throughout the poultry industry.",
    "بررسی فرصت‌های زیرساختی و همکاری‌های تخصصی متناسب با نیاز واقعی زنجیره ارزش.":"Assess infrastructure and specialist collaboration according to actual value-chain requirements.",
    "بررسی مرحله‌ای امکان توسعه فعالیت‌های تولیدی و بسته‌بندی با توجه به الزامات فنی و قانونی.":"Assess production and packaging development against technical, operational and legal requirements.",
    "بررسی ابزارهای دیجیتال برای سازمان‌دهی اطلاعات، گردش کار و تصمیم‌گیری بهتر در آینده.":"Evaluate digital tools that may improve information management, workflows and future decisions.",
    "از نقطه شروع تجاری تا فرصت‌های توسعه":"From commercial foundations to future opportunities",
    "حوزه‌های فعالیت راز صحرا در زنجیره صنعت طیور؛ از ارتباطات تأمین و تجارت تا توزیع و مسیرهای توسعه‌ای.":"Raz Sahra’s activity areas across the poultry value chain—from sourcing and trade relationships to distribution and potential development paths.",
    "از تمرکز اولیه بر تأمین و بازرگانی تا فرصت‌های آتی در تولید، زیرساخت و ابزارهای دیجیتال؛ وضعیت هر حوزه با توجه به مرحله توسعه آن مشخص شده است.":"From the initial sourcing and trade focus to potential production, infrastructure and digital opportunities, each field is described according to its current stage.",
    "از تمرکز اولیه بر تأمین و بازرگانی تا فرصت‌های آتی در تولید، زیرساخت و ابزارهای دیجیتال؛ وضعیت هر حوزه با توجه به مرحله توسعه آن مشخص شده است.":"Each field is presented according to its actual stage—from current sourcing priorities to potential production, infrastructure and digital development.",
    "نیاز واقعی":"Real need","تناسب تجاری":"Commercial fit","امکان‌پذیری":"Feasibility","ارزیابی مالی، فنی، عملیاتی و الزامات قانونی.":"Assess financial, technical and operational feasibility, including applicable requirements.",
    "شروع تنها پس از روشن‌شدن مسئولیت‌ها و پیش‌نیازها.":"Proceed only when responsibilities and prerequisites are clear.",
    "شروع از نیازهای مشخص و قابل ارزیابی تجاری":"Start from clear, commercially assessable needs",
    "بررسی تناسب شرکا و تعریف مسئولیت‌های روشن":"Assess partner fit and define responsibilities",
    "توسعه شبکه با توجه به ظرفیت و پایداری همکاری":"Develop the network in line with capacity and sustainable collaboration",
    "نقشه راه توسعه":"Development roadmap","قدم‌های سنجیده، نه وعده‌های شتاب‌زده":"Measured progress, not premature promises",
    "این نقشه راه، مسیرهای پیشنهادی توسعه را نمایش می‌دهد؛ نه فهرست دستاوردهای تکمیل‌شده.":"This roadmap describes proposed development paths—not a list of completed achievements.",
    "زیرساخت تجاری":"Commercial foundations","تعریف نیازها، فرایندها و چارچوب‌های همکاری":"Define requirements, processes and partnership frameworks",
    "شبکه تأمین و توزیع":"Sourcing and distribution network","شناخت شرکا و طراحی هماهنگی عملیاتی":"Identify partners and design operational coordination",
    "همکاری‌های تخصصی":"Specialist collaboration","توسعه روابط بر پایه ظرفیت و تناسب واقعی":"Build relationships around actual capacity and fit",
    "بررسی نیاز به سامانه مدیریت زنجیره ارزش":"Assess the need for value-chain management tools",
    "حوزه‌های فعالیت راز صحرا":"Raz Sahra’s activity areas","از نقطه شروع تجاری تا فرصت‌های توسعه":"From commercial foundations to growth opportunities",
    "حوزه‌های فعالیت راز صحرا در زنجیره صنعت طیور؛ از ارتباطات تأمین و تجارت تا توزیع و مسیرهای توسعه‌ای.":"Raz Sahra’s activity areas across poultry: sourcing, trade, distribution and carefully assessed development paths.",
    "تأمین و بازرگانی":"Sourcing & trade","شبکه توزیع و زنجیره تأمین":"Distribution & supply chain","همکاری با فعالان صنعت طیور":"Poultry-industry partnerships",
    "زیرساخت‌های کشاورزی و دامپروری":"Agriculture & livestock infrastructure","توسعه تولید و بسته‌بندی":"Production & packaging development","سامانه‌های دیجیتال مدیریت عملیات":"Digital operations systems",
    "تمرکز اولیه":"Current focus","در مسیر طراحی":"In design","حوزه همکاری":"Partnership opportunity","مسیر توسعه":"Development path","نیازمند ارزیابی":"Under assessment","چشم‌انداز آینده":"Future opportunity",
    "نمای کلی مدل همکاری":"Overview of the collaboration model","چارچوب پیشنهادی · نه سامانه عملیاتی زنده":"Proposed framework · not a live operating system",
    "زنجیره تأمین؛ با هماهنگی و مسئولیت روشن":"Supply chain: clear coordination and accountability",
    "راز صحرا، چارچوبی برای فکرکردن به ارتباط میان تأمین، توافق تجاری، توزیع و مشتری ارائه می‌کند. این نمایش، مدل مفهومی همکاری است و به‌معنی وجود سامانه ردیابی زنده یا شبکه عملیاتی متصل نیست.":"Raz Sahra presents a conceptual framework for coordinating sourcing, commercial agreements, distribution and customers. This diagram illustrates the intended model; it is not a claim of live tracking or a connected operational network.",
    "مدل موردنظر راز صحرا بر هماهنگی میان تأمین‌کننده، فرایندهای تجاری، توزیع و بازار تأکید دارد. ارتباط هر حلقه باید با مسئولیت، زمان‌بندی و توافق مشخص تعریف شود.":"The intended Raz Sahra model emphasises coordination among suppliers, commercial processes, distribution and market demand. Each hand-off should have clear ownership, timing and agreed terms.",
    "چارچوب هماهنگی میان تولید، تأمین، توافق تجاری، حمل‌ونقل و بازار.":"A coordination framework connecting production, sourcing, commercial agreements, transport and the market.",
    "مراحل همکاری":"Collaboration stages","فرایند باید قابل فهم و قابل پیگیری باشد.":"The process should be understandable and traceable.",
    "در هر مرحله لازم است اطلاعات و مسئولیت‌ها روشن باشند؛ جزئیات واقعی بر اساس نوع معامله و توافق طرفین تعیین می‌شود.":"At each stage, information and responsibilities must be clear. Specific requirements depend on the transaction and the parties’ agreement.",
    "شناخت نیاز و مشخصات":"Define needs and specifications","تعریف نوع محصول یا خدمت، مشخصات کیفی، حجم موردنیاز، زمان‌بندی و شرایط اولیه مورد انتظار.":"Define the product or service, quality requirements, volume, timing and initial terms.",
    "بررسی منبع و شرایط":"Assess the source and terms","گفت‌وگو با طرف‌های مرتبط، بررسی اطلاعات موجود و روشن‌کردن محدودیت‌ها، ظرفیت و شرایط تجاری.":"Discuss the proposal with relevant parties, review available information and clarify capacity, constraints and commercial terms.",
    "توافق بر مسئولیت‌ها":"Agree on responsibilities","مشخص‌کردن تعهدات هر طرف، شرایط پرداخت، مسئولیت تحویل، کیفیت مورد توافق و شیوه رسیدگی به اختلاف.":"Define each party’s obligations, payment terms, delivery responsibilities, quality criteria and dispute process.",
    "پیگیری و بازخورد":"Follow up and learn","ثبت تصمیم‌ها و بازخوردها برای بهبود همکاری‌های بعدی؛ ابزارها و روش پیگیری باید متناسب با عملیات واقعی انتخاب شوند.":"Record decisions and feedback to improve future cooperation. Follow-up methods should match the real operation.",
    "اصل شفافیت":"Transparency","اطلاعات کلیدی، شرایط معامله و انتظارهای طرفین باید تا حد امکان پیش از شروع همکاری روشن شوند. این شفافیت می‌تواند از سوءتفاهم و تصمیم‌گیری مبتنی بر اطلاعات ناقص جلوگیری کند.":"Key information, transaction terms and mutual expectations should be clarified before work begins. This helps reduce avoidable misunderstandings and decisions based on incomplete information.",
    "اصل تناسب":"Proportionality","فرایند واحدی برای همه معاملات مناسب نیست. نوع محصول، حساسیت کیفی، روش حمل، حجم سفارش و الزامات قانونی باید در طراحی هر همکاری لحاظ شوند.":"One process does not suit every transaction. Product type, quality sensitivity, transport, order size and legal requirements should shape each arrangement.",
    "معرفی شرکت":"Company overview","یک هویت شرکتی، یک برند تجاری روشن":"One corporate identity, one clear commercial brand",
    "«راهبران زنجیره ارزش صحرا» نام رسمی مجموعه و «راز صحرا | RAZ SAHRA» برند تجاری آن است. این هویت بر یک نگاه زنجیره‌ای به صنعت طیور بنا شده؛ از شناخت ظرفیت تولید و نیاز خریدار تا هماهنگی شرایط معامله و تحویل.":"Sahra Value Chain Leaders is the company name, while Raz Sahra is its commercial brand. The identity is grounded in a value-chain view of poultry—from production capacity and buyer needs to commercial terms and delivery coordination.",
    "رویکرد شرکت از نیازهای واقعی تجارت و تأمین آغاز می‌شود و مسیرهای توسعه آتی را به‌صورت مرحله‌ای و با توجه به امکان‌پذیری دنبال می‌کند.":"The company’s approach starts with real sourcing and trade requirements, then evaluates future growth in stages according to feasibility.",
    "برخی حوزه‌ها در مرحله بررسی و توسعه قرار دارند. این وب‌سایت مسیر و اصول موردنظر شرکت را معرفی می‌کند و به‌جای ادعای امکانات یا فعالیت‌های تأییدنشده، وضعیت هر حوزه را شفاف نشان می‌دهد.":"Some activities remain under review or development. This website distinguishes intended direction from capabilities that have not yet been verified.",
    "هویت و رویکرد":"Identity & approach","درباره راهبران زنجیره ارزش صحرا":"About Sahra Value Chain Leaders","فلسفه کسب‌وکار":"Business philosophy","آنچه می‌خواهیم در شیوه کارمان منعکس شود":"Principles behind our way of working",
    "توسعه رویکردی منظم برای تأمین، هماهنگی تجاری و همکاری میان حلقه‌های مرتبط زنجیره ارزش.":"Develop a disciplined approach to sourcing, commercial coordination and collaboration across the value chain.",
    "توسعه روابط با نگاه بلندمدت، شفافیت در تعهدات و مسئولیت‌پذیری در پیگیری.":"Build long-term relationships through clear commitments and accountable follow-through.",
    "تأکید بر کیفیت اطلاعات، زمان‌بندی، مستندسازی و پیگیری مسئولانه تعهدات تجاری.":"Prioritise information quality, timing, documentation and responsible follow-through.",
    "حرکت بر پایه ارزیابی امکان‌پذیری و ظرفیت واقعی، بدون جلوتر رفتن از شواهد و آمادگی اجرایی.":"Advance according to feasibility and actual capacity—without claiming more than evidence or readiness supports.",
    "یک هویت شرکتی، یک برند تجاری روشن":"One company identity, one clear commercial brand",
    "رویکرد زنجیره‌ای":"A value-chain perspective",
    "در بسیاری از فعالیت‌های تجاری، کیفیت تصمیم به ارتباط میان حلقه‌ها وابسته است. شناخت منبع تأمین، روشن‌بودن شرایط معامله، هماهنگی تحویل و توجه به بازخورد مشتری می‌تواند به فرایند قابل‌پیگیری‌تری کمک کند.":"In many commercial activities, decision quality depends on how well the links work together. Understanding the source, clarifying terms, coordinating delivery and listening to customer feedback can make the process more traceable.",
    "این چارچوب، جهت‌گیری طراحی‌شده برای توسعه کسب‌وکار است و نباید با وجود یک شبکه عملیاتی کامل یا فناوری اختصاصی فعال اشتباه گرفته شود.":"This is the intended direction for business development; it should not be mistaken for a fully operational network or an already deployed proprietary platform.",
    "گفت‌وگو درباره همکاری":"Discuss collaboration","با رویکردی روشن وارد گفت‌وگو شویم.":"Start with a clear conversation.","برای بررسی امکان همکاری، حوزه فعالیت و پیشنهاد خود را با ما در میان بگذارید.":"Tell us about your activity and proposal so a potential collaboration can be assessed.",
    "درخواست همکاری":"Partnership enquiry","گفت‌وگوی حرفه‌ای":"A professional conversation","برای شروع، کافی است زمینه همکاری را روشن کنیم.":"Start by clarifying the proposed collaboration.",
    "اطلاعات اولیه کمک می‌کند موضوع، نوع همکاری و شرایط مورد انتظار مشخص‌تر شوند. ثبت درخواست به‌معنی پذیرش پیشنهاد یا انعقاد قرارداد نیست.":"The initial details help clarify the proposal, collaboration type and expectations. Submitting a request does not mean it has been accepted or that a contract exists.",
    "مراحل مورد انتظار: ثبت اطلاعات اولیه، بررسی نوع همکاری، گفت‌وگو درباره شرایط و تعیین چارچوب احتمالی همکاری.":"Expected steps: record initial details, review the type of proposal, discuss the terms and decide whether a potential framework makes sense.",
    "نکته فنی: در حال حاضر سرور یا مقصد رسمی برای دریافت فرم پیکربندی نشده است. پس از تکمیل فرم، می‌توانید یک فایل درخواست روی دستگاه خود ذخیره کنید؛ این فرم به شرکت ارسال نمی‌شود.":"Technical note: there is currently no server or official endpoint configured to receive forms. Submitting this form creates a local file; it does not send the request to the company.",
    "فیلدهای ستاره‌دار ضروری هستند. لطفاً اطلاعات واقعی و قابل پیگیری وارد کنید.":"Fields marked with an asterisk are required. Enter accurate, reachable information.",
    "نام و نام خانوادگی / نام مجموعه *":"Full name or organisation *","نوع همکاری *":"Type of collaboration *","شماره تماس *":"Phone number *","ایمیل (اختیاری)":"Email (optional)","شهر / محدوده فعالیت":"City or area of operation","ظرفیت یا موضوع اصلی":"Capacity or main subject","شرح پیشنهاد و شرایط مورد انتظار *":"Proposal and expected terms *",
    "نام شما یا کسب‌وکار":"Your name or business","شماره تماس در دسترس":"A reachable phone number","برای مثال: استان یا شهر":"For example, a province or city","نوع محصول، ظرفیت یا خدمت":"Product, capacity or service","نوع همکاری، محصول یا خدمت، شرایط و زمان‌بندی را توضیح دهید.":"Describe the proposed collaboration, product or service, terms and timing.",
    "تأمین‌کننده":"Supplier","مرغداری یا فعال صنعت طیور":"Poultry farm or industry operator","توزیع‌کننده یا پخش":"Distributor","مشتری تجاری":"Business customer","شریک کشاورزی یا بازرگانی":"Agriculture or trade partner","سایر پیشنهادها":"Other",
    "برای ارتباط تجاری، طرح پیشنهاد یا پیگیری یک موضوع مرتبط با صنعت طیور، از این بخش استفاده کنید. مسیرهای رسمی تماس پس از تأیید اطلاعات شرکت درج خواهند شد.":"Use this section for business enquiries, proposals or follow-ups related to poultry. Official direct contact channels will be added after the company confirms them.",
    "اطلاعات رسمی تماس پس از تأیید از سوی شرکت در این بخش قرار می‌گیرد. برای جلوگیری از انتشار اطلاعات نادرست، شماره تلفن، نشانی و حساب شبکه اجتماعی فرضی نمایش داده نشده است.":"Official contact details will be published here once confirmed. No unverified phone number, address or social account has been invented.",
    "پیام خود را با جزئیات لازم آماده و پیش‌نویس را ذخیره کنید.":"Prepare your message and save a draft for later.",
    "ارسال آنلاین هنوز فعال نیست؛ فایل آماده‌شده را پس از تأیید مقصد رسمی ارسال کنید.":"Online submission is not enabled. Send the prepared file only after verifying the intended recipient.",
    "در حال حاضر ارسال مستقیم فرم به شرکت فعال نیست. می‌توانید اطلاعات را به‌صورت فایل محلی آماده کنید؛ فایل ساخته‌شده روی دستگاه شما باقی می‌ماند تا خودتان برای مقصد مورداعتماد ارسال کنید.":"The form does not send information to the company. It prepares a local file on your device so you can review it and send it yourself to a verified destination.",
    "موضوع پیام را مشخص کنید و راه تماس قابل پیگیری ارائه دهید.":"Choose a message topic and provide a reliable way to reach you.",
    "نام و نام خانوادگی *":"Full name *","نام شما":"Your name","شماره قابل تماس":"Reachable phone number","متن پیام *":"Message *","موضوع و درخواست خود را شرح دهید.":"Describe your question or request.",
    "درخواست همکاری تجاری":"Business partnership","تأمین یا خرید":"Sourcing or purchasing","توزیع و حمل‌ونقل":"Distribution and logistics","پرسش عمومی":"General enquiry","سایر موارد":"Other",
    "متوجه هستم که پیام از طریق وب‌سایت ارسال نمی‌شود و فقط فایل آن ساخته خواهد شد. *":"I understand this message will not be sent through the website; it will only prepare a file. *",
    "متوجه هستم که این فرم فعلاً درخواست را به شرکت ارسال نمی‌کند و فقط فایل اطلاعات را برای من آماده می‌کند. *":"I understand this form does not send the request to the company; it only prepares a local file. *",
    "مجله تخصصی راز صحرا":"Raz Sahra specialist magazine","راهنمای کاربردی برای فعالان صنعت طیور؛ از ارزیابی تأمین‌کننده و کنترل کیفیت تا حمل‌ونقل، قرارداد و مدیریت ریسک.":"Practical, in-depth guides for poultry professionals—from supplier assessment and quality control to logistics, contracts and risk management.",
    "دیدگاه و یادگیری":"Industry knowledge & analysis","هشت مقاله تخصصی برای تصمیم‌های دقیق‌تر در صنعت طیور":"Eight specialist articles for more informed poultry-industry decisions",
    "هشت مقاله تخصصی درباره تأمین، کیفیت، لجستیک، قرارداد و مدیریت ریسک؛ برای استفاده در تصمیم‌های واقعی کسب‌وکار.":"Eight detailed guides on sourcing, quality, logistics, contracts, poultry farming and food safety—written to support decisions in real operations.",
    "هشت مقاله تخصصی درباره تأمین، کیفیت، لجستیک، قرارداد و مدیریت ریسک؛ برای استفاده در تصمیم‌های واقعی کسب‌وکار.":"Eight detailed guides on sourcing, quality, logistics, contracts, poultry farming and food safety—designed for practical reference.",
    "پنج راهنمای کاربردی برای تصمیم‌های دقیق‌تر در صنعت طیور":"Eight in-depth articles for better poultry-industry decisions",
    "دانش کاربردی، نه شعارهای کلی":"Practical knowledge, not generic slogans",
    "چک‌لیست‌ها و چارچوب‌های تصمیم‌گیری برای فعالان صنعت طیور؛ همراه با امکان جست‌وجو و ذخیره مقاله برای مطالعه بعدی.":"In-depth, specialist guidance across the poultry value chain: sourcing, quality, logistics, agreements, farm management and food safety. Search the collection, save useful articles and return when you need a practical reference.",
    "راهنماهای تخصصی درباره تولید، کیفیت، تأمین، حمل و بازار؛ مطالبی که به تصمیم‌گیری کمک می‌کنند، نه فقط به خواندن.":"Specialist guidance on production, quality, sourcing, logistics and markets—built to support better decisions, not just page views.",
    "مجله تخصصی و دیدگاه‌ها":"Specialist magazine & industry analysis","مجله راز صحرا · راهنمای کاربردی":"Raz Sahra · Practical industry guide",
    "بینش دقیق‌تر برای تصمیم‌های تجاری بهتر.":"Better insight for better commercial decisions.",
    "هشت مقاله تخصصی برای تصمیم‌های دقیق‌تر در صنعت طیور":"Eight detailed articles for more informed poultry-industry decisions",
    "از انتخاب تأمین‌کننده تا کنترل کیفیت، لجستیک، قرارداد تجاری و مدیریت ریسک؛ مطالبی برای استفاده در کار واقعی.":"From supplier selection and product quality to logistics, trade agreements and risk management—guidance for real-world operations.",
    "در این شماره":"In this edition","مقاله‌های کامل، دسته‌بندی‌شده و قابل ذخیره":"In-depth, categorised guides you can save","ورود به مجله تخصصی":"Explore the magazine",
    "راهنمای اجرایی · ۸ دقیقه":"Practical guide · 8 min","کنترل کیفیت · ۷ دقیقه":"Quality control · 7 min","حمل و تحویل · ۶ دقیقه":"Logistics & delivery · 6 min","ویژه راز صحرا · ۱۲ دقیقه":"Raz Sahra feature · 12 min",
    "انتخاب تأمین‌کننده؛ فراتر از مقایسه قیمت":"Supplier selection beyond price comparisons","ظرفیت قابل تحویل، کیفیت، نظم و هزینه نهایی را چطور کنار هم بسنجیم؟":"How should you assess deliverable capacity, quality, reliability and total cost together?",
    "چک‌لیست دریافت و کنترل محصول":"A checklist for receiving and inspecting products","معیارهای پذیرش، مستندسازی مغایرت و قابلیت پیگیری محموله.":"Acceptance criteria, discrepancy records and traceable shipments.",
    "چطور تحویل محموله قابل پیش‌بینی می‌شود؟":"Making delivery more predictable","هماهنگی مقصد، زمان‌بندی، مسئولیت و رسید قابل پیگیری.":"Coordinate destinations, timing, ownership and delivery records.",
    "از ظرفیت تولید تا ارزش بازار؛ نگاه زنجیره‌ای":"From production capacity to market value","چرایی هماهنگی میان تولید، تأمین، فرآوری، حمل‌ونقل و بازار.":"Why production, sourcing, processing, transport and markets must work together.",
    "هویت و رویکرد":"Identity & approach","درباره راهبران زنجیره ارزش صحرا":"About Sahra Value Chain Leaders",
    "سیاست حریم خصوصی":"Privacy policy","شفافیت اطلاعات":"Information transparency","نسخه اولیه سیاست حریم خصوصی · متناسب با پیاده‌سازی فعلی":"Initial privacy notice · current implementation",
    "۱. وضعیت فعلی وب‌سایت":"1. Current website status",
    "وب‌سایت فعلی یک وب‌سایت ایستا است و در نسخه حاضر پایگاه‌داده، پنل کاربری یا سرویس سمت سرور برای دریافت فرم‌ها پیاده‌سازی نشده است. فرم‌های تماس و همکاری، پس از اعتبارسنجی در مرورگر، امکان ساخت فایل متنی روی دستگاه کاربر را فراهم می‌کنند. اطلاعات از طریق این فرم‌ها به شرکت ارسال نمی‌شود.":"The website is currently static. It does not include a database, account portal or server-side service for receiving form submissions. After browser-side validation, the contact and partnership forms create a text file on the visitor’s device. They do not transmit the information to the company.",
    "۲. اطلاعاتی که وارد می‌کنید":"2. Information you enter",
    "ممکن است در فرم‌ها نام، نام مجموعه، شماره تماس، ایمیل، محدوده فعالیت، موضوع و متن پیام را وارد کنید. این اطلاعات در مرورگر برای آماده‌سازی فایل به کار می‌روند. مسئولیت نگهداری فایل دانلودشده بر عهده کاربر است و کاربر باید پیش از ارسال آن، مقصد و محتوای فایل را بررسی کند.":"Forms may include your name or organisation, phone number, email, area of activity, topic and message. These details are used in the browser to prepare a file. You are responsible for storing the downloaded file and checking its contents and recipient before sending it.",
    "۳. ارتباطات شخص ثالث":"3. Third-party resources",
    "برای نمایش تایپ‌فیس و تصاویر نماینده، نسخه فعلی می‌تواند منابعی را از ارائه‌دهندگان بیرونی مانند Google Fonts و Wikimedia Commons بارگذاری کند. این درخواست‌ها مستقیماً از مرورگر انجام می‌شوند و تابع سیاست‌ها و شرایط سرویس‌های مربوطه هستند. در صورت استقرار نسخه محلی فونت‌ها و تصاویر، این بخش باید به‌روزرسانی شود.":"The website may load typefaces and representative images from external providers such as Google Fonts and Wikimedia Commons. These requests are made by the browser and are subject to the providers’ own policies and terms. This notice should be updated if those assets are hosted locally.",
    "۴. کوکی‌ها و رهگیری":"4. Cookies and tracking",
    "در کد فعلی، ابزار اختصاصی تحلیل رفتار، تبلیغات یا رهگیری کاربر تعبیه نشده است. زیرساخت میزبان وب‌سایت ممکن است طبق سازوکار و سیاست خودش اطلاعات فنی مربوط به درخواست‌ها را پردازش کند؛ برای جزئیات باید به سیاست میزبان مراجعه شود.":"The current code does not include an embedded behavioural analytics, advertising or user-tracking tool. The hosting provider may process technical request information according to its own systems and policies; consult the host’s privacy notice for details.",
    "۵. امنیت و مسئولیت کاربر":"5. Security and user responsibility",
    "از ثبت اطلاعات حساس یا غیرضروری در فرم خودداری کنید. این وب‌سایت برای انتقال امن اطلاعات خصوصی یا اسناد محرمانه طراحی نشده است. فایل درخواست را فقط از مسیر مورداعتماد و به مخاطب موردنظر ارسال کنید.":"Do not enter sensitive or unnecessary information. This website is not designed for securely transmitting private information or confidential documents. Send a prepared file only through a trusted channel to a verified recipient.",
    "۶. تغییرات این سیاست":"6. Changes to this policy",
    "اگر در آینده مقصد رسمی فرم، سامانه مدیریت محتوا، تحلیل‌گر یا سرویس دیگری افزوده شود، سیاست حریم خصوصی باید متناسب با اطلاعات واقعی جمع‌آوری‌شده، هدف پردازش، مدت نگهداری و راه‌های تماس بازنویسی شود.":"If an official form endpoint, content-management system, analytics tool or other service is added, this notice should be revised to reflect the actual information collected, processing purposes, retention and contact channels.",
    "۷. حقوق تصاویر و منابع بصری":"7. Image rights and visual sources",
    "تصویر مرغ آرین از Wikimedia Commons با انتساب به Tasnim News Agency و تحت":"The Arian chicken image is from Wikimedia Commons, credited to Tasnim News Agency and used under",
    "استفاده شده است؛ تصویر مزرعه اردک در دشت لار اثر Mahdi Kalhor و تحت":"; the duck-farm photo in the Lar plain is by Mahdi Kalhor and used under",
    "است. این تصاویر صرفاً نماینده بصری صنعت‌اند و نباید به‌عنوان تصویر تأسیسات یا دارایی اختصاصی شرکت تلقی شوند.":"These images are representative industry visuals and should not be interpreted as photographs of company-owned facilities or assets.",
    "جزئیات تصویر مرغ آرین":"Arian chicken image details","جزئیات تصویر مزرعه اردک":"Lar duck farm image details","۸. اطلاعات تماس":"8. Contact details",
    "اطلاعات تماس رسمی شرکت هنوز برای انتشار در این وب‌سایت ارائه نشده است؛ از درج نشانی یا شماره فرضی خودداری شده است. پس از تأیید اطلاعات رسمی، این بخش به‌روزرسانی خواهد شد.":"Official company contact details have not yet been confirmed for publication. No fictional phone number or address is provided. This section will be updated once verified information is available.",
    "فرم پیام":"Message form","فرم پیشنهاد همکاری":"Partnership proposal form","راه‌های ارتباط":"Contact options","دسترسی سریع":"Quick links","همکاری":"Partnerships",
    "دانستنی‌ها":"Magazine","دانستنی‌ها و اخبار":"Magazine","اخبار":"News","مطالعه مقاله‌ها":"Read articles","مقاله‌ها":"Articles",
    "حریم خصوصی":"Privacy","راهبران زنجیره ارزش صحرا":"Sahra Value Chain Leaders",
    "© راز صحرا. حقوق محتوای این وب‌سایت محفوظ است.":"© Raz Sahra. All website content rights reserved.",
    "محصولات جانبی":"Related products","مرغداری‌ها":"Poultry farms","توزیع‌کننده":"Distributor","تأمین و توزیع":"Sourcing & distribution",
    "بررسی ظرفیت و نیاز بازار":"Assess capacity and market need","چارچوب همکاری":"Partnership framework","مسئولیت‌پذیری":"Accountability","ارزش‌آفرینی":"Value creation","شفافیت":"Transparency",
    "ظرفیت واقعی،":"Real capacity,","توافق روشن":"clear terms","رشد پایدار،":"Sustainable growth,","با همکاری حرفه‌ای":"through professional collaboration",
    "ارتباطی حرفه‌ای، پیش از هر تعهد.":"Professional dialogue before commitment.","تجارت قابل اتکا از اطلاعات دقیق شروع می‌شود.":"Dependable trade starts with accurate information.","یک مسیر مشترک برای زنجیره‌ای منسجم‌تر.":"A shared path to a more connected chain.",
    "برای ایجاد همکاری‌های پایدار آماده‌ایم.":"We are ready to explore sustainable collaboration.","پیشنهاد همکاری خود را مطرح کنید":"Tell us about your proposal","حوزه همکاری خود را مطرح کنید.":"Tell us about your area of collaboration.",
    "از تأمین تا ارزش‌آفرینی":"From supply to value creation",
    "برخی زمینه‌های فعالیت معرفی‌شده در این وب‌سایت، برنامه‌های توسعه یا حوزه‌های در دست بررسی هستند؛ نمایش آن‌ها به معنی عملیاتی‌بودن، مالکیت زیرساخت یا اخذ مجوز مربوطه نیست.":"Some fields described here are plans or areas under assessment. Their inclusion does not imply that they are operational, that the company owns the associated infrastructure or that relevant permits have been obtained.",
    "راهنماهای تخصصی درباره تولید، کیفیت، تأمین، حمل و بازار؛ مطالبی که به تصمیم‌گیری کمک می‌کنند، نه فقط به خواندن.":"Specialist guidance on production, quality, sourcing, logistics and markets—to inform decisions, not simply fill a page.",
    "راهنماهای تخصصی برای فعالان زنجیره صنعت طیور":"Specialist guidance for poultry value-chain professionals",
    "اطلاعات رسمی تماس پس از تأیید از سوی شرکت در این بخش قرار می‌گیرد.":"Official contact details will be added here once the company confirms them."
  });
  Object.assign(dictionary,{
    "برای نمایش تایپ‌فیس و تصاویر نماینده، نسخه فعلی می‌تواند منابعی را از ارائه‌دهندگان بیرونی مانند Google Fonts و Wikimedia Commons بارگذاری کند. این درخواست‌ها مستقیماً از مرورگر انجام می‌شوند و تابع سیاست‌ها و شرایط سرویس‌های مربوطه هستند. در صورت استقرار نسخه محلی فونت‌ها و تصاویر، این بخش باید به‌روزرسانی شود.":"The current site may load fonts and representative images from external providers such as Google Fonts and Wikimedia Commons. These requests are subject to the providers’ own terms and policies. This notice should be updated if the assets are hosted locally.",
    "دامنه فعالیت، صنعت طیور را به‌صورت یک زنجیره کامل می‌بیند: تأمین و بازرگانی، ارتباط با تولیدکنندگان، هماهنگی توزیع و بررسی فرصت‌های توسعه‌ای. وضعیت هر حوزه شفاف و متناسب با مرحله واقعی آن بیان شده است.":"Our scope treats poultry as an interconnected value chain: sourcing and trade, producer relationships, distribution coordination and carefully assessed opportunities. Each field is described according to its actual stage.",
    "راز صحرا با تمرکز بر پیوند میان ظرفیت تولید، نیاز بازار و شبکه توزیع شکل گرفته است؛ رویکردی که به‌جای نگاه تک‌محصولی، صنعت طیور را به‌عنوان مجموعه‌ای از حلقه‌های به‌هم‌پیوسته می‌بیند.":"Raz Sahra is built around connecting production capacity, market demand and distribution. Rather than focusing on one product, it views poultry as a network of connected activities.",
    "تولیدکنندگان، تأمین‌کنندگان، فعالان فرآوری و بسته‌بندی، حمل‌ونقل و خریداران عمده هرکدام بخشی از تصویرند. گفت‌وگوی دقیق کمک می‌کند تناسب و امکان همکاری را بهتر بسنجیم.":"Producers, suppliers, processors, packers, logistics partners and wholesale buyers each play a part. Clear dialogue helps assess the fit and feasibility before commitments are made.",
    "اگر در تولید یا پرورش طیور فعالیت دارید، می‌توانیم درباره نوع محصول، ظرفیت قابل ارائه، زمان‌بندی و محدوده همکاری گفت‌وگو کنیم؛ روشن و بدون وعده‌های زودهنگام.":"If you work in poultry production or husbandry, we can discuss product type, deliverable capacity, timing and potential scope—clearly and without premature promises.",
    "مشخصات محصول، حجم قابل تحویل، زمان‌بندی، شرایط پرداخت و مسئولیت‌ها باید پیش از تعهد روشن باشند. شفافیت، هزینه سوءتفاهم را کمتر و پیگیری را دقیق‌تر می‌کند.":"Product specifications, deliverable volume, timing, payment terms and responsibilities should be clear before commitment. Transparency reduces avoidable misunderstanding and improves follow-up.",
    "راز صحرا با تمرکز بر ارتباط مؤثر میان حلقه‌های صنعت طیور، به دنبال شکل‌دادن به همکاری‌های روشن‌تر، تأمین قابل اتکاتر و تصمیم‌های تجاری سنجیده‌تر است.":"Raz Sahra aims to foster clearer cooperation, more dependable sourcing and better-informed commercial decisions by strengthening links across the poultry industry.",
    "از تولید و تأمین تا فرآوری، نگهداری، حمل و بازار؛ هر مرحله بر کیفیت، هزینه و تجربه حلقه بعدی اثر می‌گذارد. دیدن ارتباط‌ها، نقطه شروع تصمیم بهتر است.":"From production and sourcing to processing, storage, transport and markets, each stage influences the next. Understanding those connections is a starting point for better decisions.",
    "برای تأمین‌کنندگان، فرآوری‌کنندگان و خریداران عمده؛ تعریف مشخصات محصول، شرایط پرداخت و معیار تحویل، پایه یک توافق قابل پیگیری است.":"For suppliers, processors and wholesale buyers, clear specifications, payment terms and delivery criteria form the basis of a traceable agreement.",
    "نشان‌های وضعیت، جهت‌گیری فعلی و مسیرهای بررسی را توضیح می‌دهند و به‌معنی تأیید مستقل فعالیت جاری، ظرفیت اجرایی یا مجوز نیستند.":"Status labels describe current focus and areas under review. They do not independently verify current operations, capacity or permits.",
    "فعالان حمل‌ونقل، بسته‌بندی و توزیع می‌توانند زمینه فعالیت و دامنه خدمات خود را معرفی کنند تا تناسب احتمالی همکاری بررسی شود.":"Transport, packaging and distribution providers can introduce their services so a potential fit can be assessed.",
    "ارزیابی امکان توسعه تولید و بسته‌بندی، الزامات کیفیت، زیرساخت، سرمایه و مجوزهای لازم پیش از هرگونه اجرا.":"Evaluate production and packaging opportunities, including quality, infrastructure, capital and permit requirements before implementation.",
    "تعریف فرایندهای هماهنگی تأمین، تحویل، انتقال کالا و ارتباط میان طرف‌ها، متناسب با دامنه واقعی عملیات.":"Define sourcing, delivery, transfer and communication processes that fit the actual scope of operations.",
    "بررسی فرصت‌های توسعه زیرساخت و خدمات تخصصی با توجه به نیاز بازار، سرمایه‌گذاری و ملاحظات اجرایی.":"Assess infrastructure and specialist service opportunities against market needs, investment and practical constraints.",
    "تکیه بر گفت‌وگوی شفاف، انتظارات روشن و همکاری‌ای که منافع و مسئولیت‌های دو طرف را ببیند.":"Rely on transparent dialogue, clear expectations and collaboration that recognises the interests and responsibilities of both parties.",
    "پیشنهادهای مرتبط با تأمین، صنعت طیور و زنجیره توزیع برای بررسی اولیه قابل ثبت هستند.":"Proposals related to sourcing, poultry and distribution can be submitted for initial review.",
    "برای بررسی فرصت‌های همکاری تجاری و آشنایی با مسیرهای مشترک، با ما در ارتباط باشید.":"Contact us to discuss commercial collaboration and explore possible shared opportunities.",
    "شفافیت در توافق‌ها، مسئولیت‌پذیری در پیگیری، نظم اطلاعاتی و توسعه مرحله‌به‌مرحله.":"Clear agreements, accountable follow-up, disciplined information and staged development.",
    "توجه به کیفیت اطلاعات، زمان‌بندی، مستندسازی و پیگیری مسئولانه تعهدات تجاری.":"Prioritise information quality, timing, documentation and responsible follow-through on commitments.",
    "این اصول، چارچوبی برای توسعه روابط تجاری و طراحی فرایندهای آینده‌اند.":"These principles guide commercial relationships and the design of future processes.",
    "پیشنهاد همکاری مرتبط با تأمین یا توزیع خود را مطرح کنید.":"Tell us about your sourcing or distribution proposal.",
    "بررسی نیاز به سامانه مدیریت زنجیره ارزش":"Assess the need for value-chain management tools",
    "تعریف نیازها، فرایندها و چارچوب‌های همکاری":"Define requirements, processes and partnership frameworks",
    "شناخت شرکا و طراحی هماهنگی عملیاتی":"Identify partners and design operational coordination",
    "توسعه روابط بر پایه ظرفیت و تناسب واقعی":"Build relationships around actual capacity and fit",
    "ارزیابی مستقل فرصت‌های تولیدی، زیرساختی و دیجیتال":"Independently assess production, infrastructure and digital opportunities",
    "تعریف مسئله، مشتری و ارزش مورد انتظار از فعالیت.":"Define the problem, customer and expected value.",
    "بررسی تناسب شرکا، ظرفیت و مسیر تأمین یا توزیع.":"Assess partner fit, capacity and sourcing or distribution routes.",
    "راز صحرا. حقوق محتوای این وب‌سایت محفوظ است.":"Raz Sahra. All website content rights reserved.",
    "پرهیز از ادعاهای فراتر از امکانات تأییدشده":"Avoid claims that exceed verified capabilities",
    "ارزیابی فنی، اقتصادی و مجوزهای موردنیاز":"Technical, financial and permit requirements",
    "همکاری مرحله‌ای · مسئولیت مشترک":"Phased collaboration · shared responsibility",
    "مشخصات روشن · تحویل هماهنگ":"Clear specifications · coordinated delivery",
    "ظرفیت واقعی · برنامه روشن":"Real capacity · a clear plan",
    "نمای مفهومی زنجیره ارزش":"Conceptual value-chain view",
    "چارچوب فرایندی پیشنهادی":"Proposed process framework",
    "رفتن به محتوای اصلی":"Skip to main content",
    "دعوت به همکاری · ۰۱":"Partnership · 01","دعوت به همکاری · ۰۲":"Partnership · 02","دعوت به همکاری · ۰۳":"Partnership · 03",
    "بررسی فعالیت تولیدی":"Assess production activity","گفت‌وگو درباره فرصت":"Discuss the opportunity","نیاز، ظرفیت و کیفیت":"Need, capacity and quality",
    "درباره چشم‌انداز":"Our direction","هویت رسمی مجموعه":"Corporate identity","شبکه روابط تجاری":"Commercial network",
    "استعلام و توافق":"Enquiry and agreement","استراتژی توسعه":"Development strategy","چارچوب ارزیابی":"Evaluation framework",
    "اجرای مرحله‌ای":"Phased implementation","زمان و مسئولیت":"Timing and ownership","بازخورد و نیاز":"Feedback and demand",
    "ارسال و پیگیری":"Submit and follow up","توزیع و تحویل":"Distribution and delivery","شناخت زنجیره":"Understand the chain",
    "اصول عملیاتی":"Operating principles","فلسفه توسعه":"Development philosophy","کیفیت محصول":"Product quality","ثبت پیشنهاد":"Submit a proposal",
    "راه ارتباطی":"Contact channel","ثبت درخواست":"Submit an enquiry","طرح موضوع":"Raise a topic","لجستیک":"Logistics",
    "تا":"to","۲۰۲۶":"2026","۰۱":"01","۰۲":"02","۰۳":"03","۰۴":"04",
    "مجوز CC BY 4.0":"CC BY 4.0 licence","مجوز CC BY 3.0":"CC BY 3.0 licence",
    "استفاده شده است؛ تصویر مزرعه اردک در دشت لار اثر Mahdi Kalhor و تحت":"; the Lar plain duck-farm photo is by Mahdi Kalhor and used under",
    "این تصاویر صرفاً نماینده بصری صنعت‌اند و نباید به‌عنوان تصویر تأسیسات یا دارایی اختصاصی شرکت تلقی شوند.":"These images are representative industry visuals and should not be interpreted as photographs of company-owned facilities or assets.",
    "رویکرد شرکت از نیازهای واقعی تجارت و تأمین آغاز می‌شود و مسیرهای توسعه آتی را به‌صورت مرحله‌ای و با توجه به امکان‌پذیری دنبال می‌کند.":"The company’s approach begins with real sourcing and trade requirements, then evaluates future development in stages according to feasibility.",
    "نام و نام خانوادگی / نام مجموعه *":"Name or organisation *","شرح پیشنهاد و شرایط مورد انتظار *":"Proposal and expected terms *",
    "نام، موضوع، شماره تماس و پیام خود را وارد کنید.":"Enter your name, topic, phone number and message.",
    "برای شروع، کافی است زمینه همکاری را روشن کنیم.":"Start by clarifying the proposed collaboration.",
    "از تأمین تا ارزش‌آفرینی":"From supply to value creation","از تأمین":"From supply","ارزش‌آفرینی":"Value creation"
  });
  Object.assign(dictionary,{
    "برای نمایش تایپ‌فیس و تصاویر نماینده، نسخه فعلی می‌تواند منابعی را از ارائه‌دهندگان بیرونی مانند Google Fonts و Wikimedia Commons بارگذاری کند. این درخواست‌ها مستقیماً از مرورگر انجام می‌شوند و تابع سیاست‌ها و شرایط سرویس‌های مربوطه هستند. در صورت استقرار نسخه محلی فونت‌ها و تصاویر، این بخش باید به‌روزرسانی شود.":"The site may load fonts and representative images from external providers such as Google Fonts and Wikimedia Commons. Browser requests are subject to the providers’ own policies and terms. This notice should be updated if those assets are hosted locally.",
    "این سیاست وضعیت فعلی وب‌سایت، فرم‌های محلی و نحوه استفاده از منابع تصویری را توضیح می‌دهد و باید با تغییر واقعی زیرساخت بازبینی شود.":"This policy describes the current website, local form behaviour and visual assets. It should be reviewed whenever the infrastructure changes.",
    "استفاده شده است. تصاویر نماینده عمومی صنعت‌اند و نباید به‌عنوان تصویر تأسیسات یا دارایی اختصاصی شرکت برداشت شوند.":"is used under the stated licence. These are representative industry images and must not be taken as photographs of facilities owned by the company.",
    "شناخت نیازهای خریداران و تأمین‌کنندگان، بررسی گزینه‌های تأمین، مذاکره درباره شرایط و طراحی چارچوب روشن معاملات.":"Understand buyer and supplier needs, assess sourcing options, negotiate terms and define a clear transaction framework.",
    "بررسی نیاز به ابزارهای یکپارچه برای مستندسازی، مدیریت گردش کار و پشتیبانی از تصمیم‌های تجاری در مراحل بعدی.":"Assess whether integrated tools are needed to document activity, manage workflows and support commercial decisions in later stages.",
    "بررسی نیازها و توانمندی‌های تأمین‌کنندگان، مرغداری‌ها و کسب‌وکارهای مرتبط با صنعت طیور و محصولات جانبی.":"Assess needs and capabilities among suppliers, poultry farms and related businesses across the industry.",
    "بنر اصلی راز صحرا به‌صورت گرافیک اختصاصی برای این وب‌سایت تولید شده است. تصاویر موضوعی از منابعی مانند":"The main Raz Sahra banner is an original graphic created for this website. Editorial photographs are sourced from providers such as",
    "بررسی مسیر تبدیل‌شدن به مجموعه‌ای هماهنگ‌تر در تجارت و زنجیره تأمین، با توسعه متناسب با ظرفیت واقعی.":"Explore a more coordinated approach to trade and supply chain, expanding only when actual capacity allows.",
    "استفاده می‌کنند. تصویر مزرعه اردک در دشت لار اثر Mahdi Kalhor از Wikimedia Commons است و تحت":"are used for the editorial photographs. The duck-farm photo in the Lar plain is by Mahdi Kalhor on Wikimedia Commons and is used under",
    "دیدن ارتباط میان تأمین، عملیات، توزیع و نیاز مشتری به‌جای تصمیم‌گیری جداگانه درباره هر بخش.":"View sourcing, operations, distribution and customer demand as connected elements rather than separate decisions.",
    "با حرکت اسلایدها، تصویر بزرگ‌تر زنجیره دیده می‌شود.":"Each slide reveals another part of the wider value chain.",
    "نگاهی منسجم به تأمین، تجارت و همکاری پایدار":"A coordinated approach to sourcing, trade and lasting partnerships",
    "برای هماهنگی بهتر، از گفت‌وگو شروع کنیم.":"Better coordination starts with a conversation.",
    "راز صحرا | از تأمین تا ارزش‌آفرینی":"Raz Sahra | From supply to value creation",
    "چه چیزی پیش از توسعه بررسی می‌شود؟":"What should be assessed before expansion?",
    "آشنایی با مدل زنجیره تأمین":"Explore the supply-chain model",
    "دامنه فعالیت و مسیر توسعه":"Activity scope and development paths",
    "طرح پیشنهاد همکاری":"Submit a partnership proposal",
    "مشاهده مسیر توسعه":"Explore development paths",
    "طرح یک نیاز تجاری":"Describe a commercial need",
    "ابزارهای دیجیتال":"Digital tools","مجوز Unsplash":"Unsplash licence","مجوز Pexels":"Pexels licence",
    "آشنایی بیشتر":"Learn more","تأمین و خرید":"Sourcing and purchasing","و":"and"
  });
  var attributeDictionary={
    "باز کردن منو":"Open menu","بستن منو":"Close menu","اسلاید قبلی":"Previous slide","اسلاید بعدی":"Next slide",
    "اسلاید ۱":"Slide 1","اسلاید ۲":"Slide 2","اسلاید ۳":"Slide 3","اسلاید ۴":"Slide 4",
    "انتخاب اسلاید":"Choose a slide","انتخاب اسلاید همکاری":"Choose a partnership slide",
    "جست‌وجوی مقاله‌ها":"Search articles","ارتباط با ما":"Contact us","بازگشت به بالای صفحه":"Back to top",
    "راز صحرا، صفحه اصلی":"Raz Sahra home","مجله تخصصی":"Magazine","EN":"Switch to English","FA":"Switch to Persian",
    "لوگوی رسمی راهبران زنجیره ارزش صحرا":"Official Sahra Value Chain Leaders logo"
  };
  var nodeOriginals=new WeakMap(),attributeOriginals=new WeakMap();
  function preserveEdges(original, translated){
    var leading=(original.match(/^\s*/) || [''])[0],trailing=(original.match(/\s*$/)||[''])[0];
    return leading+translated+trailing;
  }
  function applyText(){
    var language=window.RSCurrentLanguage||'fa';
    var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{
      acceptNode:function(node){
        if(!node.parentElement)return NodeFilter.FILTER_REJECT;
        var tag=node.parentElement.tagName;
        if(/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|OPTION)$/i.test(tag))return NodeFilter.FILTER_REJECT;
        if(!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(node){
      if(!nodeOriginals.has(node))nodeOriginals.set(node,node.nodeValue);
      var original=nodeOriginals.get(node),key=original.trim();
      if(language==='fa'){node.nodeValue=original;return;}
      var translated=dictionary[key];
      if(translated)node.nodeValue=preserveEdges(original,translated);
    });
    var attrs=['placeholder','aria-label','title','alt'];
    document.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(function(el){
      attrs.forEach(function(attr){
        if(!el.hasAttribute(attr))return;
        var compound=attr+'|'+el.getAttribute(attr);
        if(!attributeOriginals.has(el))attributeOriginals.set(el,{});
        var state=attributeOriginals.get(el);
        if(!Object.prototype.hasOwnProperty.call(state,attr))state[attr]=el.getAttribute(attr);
        var original=state[attr];
        if(language==='fa'){el.setAttribute(attr,original);return;}
        var translated=attributeDictionary[original]||dictionary[original];
        if(translated)el.setAttribute(attr,translated);
      });
    });
    document.querySelectorAll('[data-language-label]').forEach(function(el){el.textContent=language==='fa'?'EN':'فا';});
    document.querySelectorAll('[data-language-toggle]').forEach(function(el){el.setAttribute('aria-label',language==='fa'?'Switch to English':'تغییر زبان به فارسی');el.setAttribute('title',language==='fa'?'English':'فارسی');});
    document.documentElement.lang=language;
    document.documentElement.dir=language==='fa'?'rtl':'ltr';
    document.documentElement.classList.toggle('lang-en',language==='en');
    document.documentElement.classList.toggle('lang-fa',language==='fa');
    var page=new URLSearchParams(window.location.search).get('page')||'home';
    var titles={home:{fa:'راز صحرا | از تأمین تا ارزش‌آفرینی',en:'Raz Sahra | From Supply to Value Creation'},about:{fa:'درباره ما | راز صحرا',en:'About | Raz Sahra'},business:{fa:'حوزه‌های فعالیت | راز صحرا',en:'Our Fields | Raz Sahra'},supply:{fa:'زنجیره تأمین | راز صحرا',en:'Supply Chain | Raz Sahra'},partnerships:{fa:'همکاری با ما | راز صحرا',en:'Partnerships | Raz Sahra'},contact:{fa:'ارتباط با ما | راز صحرا',en:'Contact | Raz Sahra'},insights:{fa:'مجله تخصصی | راز صحرا',en:'Specialist Magazine | Raz Sahra'},privacy:{fa:'حریم خصوصی | راز صحرا',en:'Privacy | Raz Sahra'}};
    if(titles[page])document.title=titles[page][language];
    var metaDescription=document.querySelector('meta[name="description"]');
    if(metaDescription)metaDescription.content=language==='en'?'Sahra Value Chain Leaders connects poultry production, sourcing, trade and distribution through clear commercial coordination.':'راهبران زنجیره ارزش صحرا؛ نگاه یکپارچه به تأمین، تجارت و توزیع در صنعت طیور، از تولید تا بازار.';
    var ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=document.title;
    var ogDescription=document.querySelector('meta[property="og:description"]');if(ogDescription)ogDescription.content=metaDescription?metaDescription.content:'';
    if(window.RSUpdateEmbers)window.RSUpdateEmbers();
  }
  function setLanguage(language,quiet){
    if(language!=='en')language='fa';
    window.RSCurrentLanguage=language;
    try{localStorage.setItem('rs-language',language);}catch(e){}
    applyText();
    if(!quiet&&document.querySelector('.page-view[data-page="insights"].active')&&window.RazSahraReloadArticles){
      window.RazSahraReloadArticles();
    }
    window.dispatchEvent(new CustomEvent('rs:languagechange',{detail:{language:language}}));
  }
  window.RSApplyLanguage=applyText;
  window.RSSetLanguage=setLanguage;
  document.addEventListener('click',function(event){
    var button=event.target.closest('[data-language-toggle]');
    if(!button)return;
    event.preventDefault();
    setLanguage(window.RSCurrentLanguage==='fa'?'en':'fa',false);
  });
  window.addEventListener('rs:pagechange',function(){applyText();});
  document.addEventListener('DOMContentLoaded',function(){applyText();});
  var initial='fa';try{initial=localStorage.getItem('rs-language')||'fa';}catch(e){}
  setLanguage(initial,true);
  if(initial==='en'&&document.querySelector('.page-view[data-page="insights"].active'))window.setTimeout(function(){if(window.RazSahraReloadArticles)window.RazSahraReloadArticles();},80);
})();