/* RAZ SAHRA — bilingual UI, Persian/English direction and preference */
(function(){
  'use strict';
  var dictionary={
    "صفحه اصلی":"Home","درباره ما":"About","حوزه‌های فعالیت":"Our fields","زنجیره تأمین":"Supply chain","همکاری با ما":"Partnerships","مجله تخصصی":"Magazine","ارتباط با ما":"Contact","حریم خصوصی":"Privacy",
    "شروع همکاری":"Start a partnership","پیشنهاد همکاری":"Partnership request","پیشنهاد همکاری تولیدکننده":"Producer partnership","ارتباط با راز صحرا":"Contact Raz Sahra",
    "راهبران زنجیره ارزش صحرا":"Sahra Value Chain Leaders","راز صحرا":"Raz Sahra","از تأمین تا ارزش‌آفرینی":"From supply to value creation",
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
})();