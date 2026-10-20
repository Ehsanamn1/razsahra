/* RAZ SAHRA — lightweight motion, progress and discovery interactions */
(function(){
  'use strict';
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var progress=document.createElement('div');progress.className='rs-scroll-progress';progress.setAttribute('aria-hidden','true');document.body.appendChild(progress);
  var header=document.querySelector('.site-header');
  var ticking=false;
  function updateScroll(){
    var max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
    if(header)header.classList.toggle('is-scrolled',window.scrollY>12);
    ticking=false;
  }
  window.addEventListener('scroll',function(){if(!ticking){window.requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});
  window.addEventListener('resize',updateScroll,{passive:true});updateScroll();

  var revealSelectors='.section-heading,.business-card,.principle,.flow-item,.roadmap-item,.content-panel,.insight-main,.editorial-empty,.partnership-band,.intro-quote,.intro-copy,.final-cta-inner,.chain-flow,.chain-copy,.roadmap,.business-grid,.brand-story-grid,.collaboration-carousel,.magazine-heading';
  var items=Array.prototype.slice.call(document.querySelectorAll(revealSelectors));
  items.forEach(function(el,i){el.classList.add('rs-reveal');if(el.matches('.business-card,.principle,.flow-item,.roadmap-item')){el.classList.add('rs-reveal-delay-'+((i%3)+1));el.style.setProperty('--rs-motion-delay',((i%5)*55)+'ms');}});
  if(!reduce&&'IntersectionObserver' in window){
    var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('rs-visible');observer.unobserve(entry.target);}});},{threshold:.12,rootMargin:'0px 0px -30px 0px'});
    items.forEach(function(el){observer.observe(el);});
  }else{items.forEach(function(el){el.classList.add('rs-visible');});}

  // Small tactile feedback on interactive elements; no fake metrics or artificial urgency.
  document.querySelectorAll('.btn,.text-link,.nav-link,.business-card').forEach(function(el){
    el.addEventListener('pointerdown',function(){if(!reduce)el.style.transform='scale(.985)';});
    ['pointerup','pointercancel','pointerleave'].forEach(function(evt){el.addEventListener(evt,function(){el.style.removeProperty('transform');});});
  });

  // Interactive chain explorer: visitors can step through the value chain without fake metrics.
  document.querySelectorAll('.flow-item').forEach(function(item){
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.setAttribute('aria-pressed','false');
    function activate(){
      var wasActive=item.classList.contains('is-active');
      var group=item.parentElement;
      if(group)group.querySelectorAll('.flow-item').forEach(function(sibling){
        sibling.classList.remove('is-active');sibling.setAttribute('aria-pressed','false');
      });
      if(!wasActive){item.classList.add('is-active');item.setAttribute('aria-pressed','true');}
    }
    item.addEventListener('click',activate);
    item.addEventListener('keydown',function(event){
      if(event.key==='Enter'||event.key===' '){event.preventDefault();activate();}
    });
  });

  // Make outbound source-credit links safe and give image-bearing sections meaningful fallbacks.
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){a.setAttribute('rel','noopener noreferrer');});
  document.querySelectorAll('.hero-panel,.partnership-art,.insight-main').forEach(function(el){el.classList.add('rs-image-enhanced');});

  // Desktop pointer tilt: restrained 3D depth; disabled on touch and reduced-motion devices.
  if(!reduce&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    document.querySelectorAll('.business-card,.principle,.route-card,.partnership-art,.insight-main').forEach(function(card){
      card.addEventListener('pointermove',function(event){
        var rect=card.getBoundingClientRect(),x=(event.clientX-rect.left)/rect.width,y=(event.clientY-rect.top)/rect.height;
        card.style.transform='perspective(1000px) rotateX('+((.5-y)*3.5)+'deg) rotateY('+((x-.5)*4)+'deg) translateY(-3px)';
        card.style.setProperty('--rs-glint-x',(x*100)+'%');card.style.setProperty('--rs-glint-y',(y*100)+'%');
      });
      card.addEventListener('pointerleave',function(){card.style.removeProperty('transform');});
    });
  }

  // Give the mobile menu a polished open/close rhythm and close it after route selection.
  var mobileMenu=document.getElementById('mobile-menu');
  var mobileToggle=document.querySelector('.mobile-toggle');
  if(mobileMenu&&mobileToggle){
    mobileMenu.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click',function(){
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded','false');
        mobileToggle.setAttribute('aria-label',window.RSCurrentLanguage==='en'?'Open menu':'باز کردن منو');
      });
    });
    document.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&mobileMenu.classList.contains('open')){
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded','false');
        mobileToggle.setAttribute('aria-label',window.RSCurrentLanguage==='en'?'Open menu':'باز کردن منو');
        mobileToggle.focus();
      }
    });
  }


  // Mobile conversion dock: clear next steps without inventing a phone number or email.
  if(!document.querySelector('.rs-mobile-cta')){
    var dock=document.createElement('nav');
    dock.className='rs-mobile-cta';
    dock.setAttribute('aria-label','دسترسی سریع');
    dock.innerHTML='<a class="rs-cta-primary" href="?page=partnerships" data-route="partnerships"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/><path d="M8 12h8M12 8v8"/></svg>پیشنهاد همکاری</a><a class="rs-cta-secondary" href="?page=contact" data-route="contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="m4 7 8 6 8-6"/></svg>ارتباط با ما</a>';
    document.body.appendChild(dock);
  }
  updateMobileDockText();
  document.querySelectorAll('form input,form select,form textarea').forEach(function(field){
    field.addEventListener('focus',function(){document.body.classList.add('rs-form-focused');});
    field.addEventListener('blur',function(){window.setTimeout(function(){if(!document.activeElement||!document.activeElement.matches('input,select,textarea'))document.body.classList.remove('rs-form-focused');},80);});
  });
  window.addEventListener('pageshow',function(){document.body.classList.remove('rs-form-focused');});


  /* Article library: search, persistent bookmarks, local drafts and a focused reader. */
  var readerBackdrop=null,readerCurrentId=null,readerReturnFocus=null;
  function articleSaved(id){
    var saved=[];try{saved=JSON.parse(localStorage.getItem('rs-saved-articles')||'[]');}catch(e){}
    return saved.indexOf(id)!==-1;
  }
  function setArticleSaved(id,value){
    var saved=[];try{saved=JSON.parse(localStorage.getItem('rs-saved-articles')||'[]');}catch(e){}
    saved=saved.filter(function(existing){return existing!==id;});
    if(value)saved.push(id);
    try{localStorage.setItem('rs-saved-articles',JSON.stringify(saved));}catch(e){}
    document.querySelectorAll('[data-save-article="'+id+'"],[data-reader-save="'+id+'"]').forEach(function(button){
      button.setAttribute('aria-pressed',value?'true':'false');
      button.textContent=value?'♥ '+(window.RSCurrentLanguage==='en'?'Saved':'ذخیره‌شده'):'♡ '+(window.RSCurrentLanguage==='en'?'Save':'ذخیره');
    });
  }
  function buildReader(){
    if(readerBackdrop)return;
    readerBackdrop=document.createElement('div');
    readerBackdrop.className='article-reader-backdrop';
    readerBackdrop.setAttribute('role','presentation');
    readerBackdrop.innerHTML='<section class="article-reader-dialog" role="dialog" aria-modal="true" aria-labelledby="article-reader-title"><div class="article-reader-topbar"><span class="article-reader-brand">RAZ SAHRA · SPECIALIST MAGAZINE</span><div class="article-reader-actions"><button type="button" data-reader-save aria-pressed="false" aria-label="ذخیره مقاله">♡</button></div><button class="article-reader-close" type="button" aria-label="بستن مقاله" data-reader-close>×</button><div class="article-reader-progress" aria-hidden="true"><span></span></div></div><div class="article-reader-scroll"><img class="article-reader-cover" alt="" hidden><header class="article-reader-head"><div class="article-reader-meta"></div><h1 class="article-reader-title" id="article-reader-title"></h1><p class="article-reader-deck"></p></header><article class="article-reader-content"></article></div></section>';
    document.body.appendChild(readerBackdrop);
    readerBackdrop.addEventListener('click',function(event){if(event.target===readerBackdrop)closeReader();});
    readerBackdrop.querySelector('[data-reader-close]').addEventListener('click',closeReader);
    readerBackdrop.querySelector('.article-reader-scroll').addEventListener('scroll',function(){
      var pane=this,maxScroll=pane.scrollHeight-pane.clientHeight,percent=maxScroll>0?(pane.scrollTop/maxScroll)*100:0;
      var bar=readerBackdrop.querySelector('.article-reader-progress span');if(bar)bar.style.width=Math.max(0,Math.min(100,percent))+'%';
    },{passive:true});
    readerBackdrop.querySelector('[data-reader-save]').addEventListener('click',function(){
      if(!readerCurrentId)return;setArticleSaved(readerCurrentId,!articleSaved(readerCurrentId));
    });
  }
  function openArticleById(id,button){
    if(!id)return;
    var body=document.getElementById(id);
    var card=body&&body.closest('[data-article-card]');
    if(!card){
      var cards=document.querySelectorAll('[data-article-card]');
      cards.forEach(function(candidate){if(candidate.querySelector('#'+CSS.escape(id)))card=candidate;});
    }
    if(!card||!body)return;
    buildReader();
    readerReturnFocus=button||document.activeElement;
    readerCurrentId=id;
    var cover=card.querySelector('.article-cover');
    var readerCover=readerBackdrop.querySelector('.article-reader-cover');
    if(cover&&cover.getAttribute('src')){
      readerCover.src=cover.currentSrc||cover.src;readerCover.alt=cover.alt||'';readerCover.hidden=false;
    }else{readerCover.removeAttribute('src');readerCover.alt='';readerCover.hidden=true;}
    readerBackdrop.querySelector('.article-reader-title').textContent=(card.querySelector('h2')||{}).textContent||'';
    readerBackdrop.querySelector('.article-reader-deck').textContent=(card.querySelector('.article-excerpt')||{}).textContent||'';
    var meta=card.querySelector('.article-card-meta');
    readerBackdrop.querySelector('.article-reader-meta').textContent=meta?meta.innerText.replace(/\n/g,' · '):'';
    readerBackdrop.querySelector('.article-reader-content').innerHTML=body.innerHTML;
    var save=readerBackdrop.querySelector('[data-reader-save]');
    save.setAttribute('data-reader-save',id);save.setAttribute('aria-pressed',articleSaved(id)?'true':'false');
    save.textContent=articleSaved(id)?'♥ '+(window.RSCurrentLanguage==='en'?'Saved':'ذخیره‌شده'):'♡ '+(window.RSCurrentLanguage==='en'?'Save':'ذخیره');
    readerBackdrop.classList.add('is-open');
    document.body.classList.add('rs-reader-open');
    readerBackdrop.querySelector('.article-reader-scroll').scrollTop=0;var readingBar=readerBackdrop.querySelector('.article-reader-progress span');if(readingBar)readingBar.style.width='0%';
    window.setTimeout(function(){readerBackdrop.querySelector('[data-reader-close]').focus();},60);
    if(window.RSApplyLanguage)window.RSApplyLanguage();
    var url=new URL(window.location.href);
    if(url.searchParams.get('page')==='insights'&&url.searchParams.get('article')!==id){
      url.searchParams.set('article',id);window.history.replaceState({page:'insights',article:id},'',url.pathname+url.search);
    }
  }
  function closeReader(){
    if(!readerBackdrop||!readerBackdrop.classList.contains('is-open'))return;
    readerBackdrop.classList.remove('is-open');document.body.classList.remove('rs-reader-open');
    var url=new URL(window.location.href);
    if(url.searchParams.has('article')){url.searchParams.delete('article');window.history.replaceState({page:url.searchParams.get('page')||'home'},'',url.pathname+url.search);}
    var focus=readerReturnFocus;readerCurrentId=null;
    if(focus&&typeof focus.focus==='function')window.setTimeout(function(){focus.focus();},60);
  }
  window.RazSahraOpenArticle=function(id){openArticleById(id,null);};
  window.RazSahraCloseArticle=closeReader;
  function updateMobileDockText(){
    var dock=document.querySelector('.rs-mobile-cta');if(!dock)return;
    var en=window.RSCurrentLanguage==='en';
    dock.setAttribute('aria-label',en?'Quick access':'دسترسی سریع');
    dock.innerHTML=en
      ?'<a class="rs-cta-primary" href="?page=partnerships" data-route="partnerships"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/><path d="M8 12h8M12 8v8"/></svg>Partnerships</a><a class="rs-cta-secondary" href="?page=contact" data-route="contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="m4 7 8 6 8-6"/></svg>Contact us</a>'
      :'<a class="rs-cta-primary" href="?page=partnerships" data-route="partnerships"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/><path d="M8 12h8M12 8v8"/></svg>پیشنهاد همکاری</a><a class="rs-cta-secondary" href="?page=contact" data-route="contact"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 5h16v14H4z"/><path d="m4 7 8 6 8-6"/></svg>ارتباط با ما</a>';
  }
  window.addEventListener('rs:languagechange',function(){closeReader();updateEmbers();updateMobileDockText();});

  function updateSavedLabels(){
    document.querySelectorAll('[data-save-article]').forEach(function(button){
      var id=button.getAttribute('data-save-article'),active=articleSaved(id);
      button.setAttribute('aria-pressed',active?'true':'false');
      button.textContent=active?'♥ '+(window.RSCurrentLanguage==='en'?'Saved':'ذخیره‌شده'):'♡ '+(window.RSCurrentLanguage==='en'?'Save':'ذخیره');
    });
  }
  document.addEventListener('click',function(event){
    var openButton=event.target.closest('[data-article-open]');
    if(openButton){openArticleById(openButton.getAttribute('data-article-open'),openButton);return;}
    var saveButton=event.target.closest('[data-save-article]');
    if(saveButton){var saveId=saveButton.getAttribute('data-save-article');setArticleSaved(saveId,!articleSaved(saveId));return;}
    if(event.target.closest('[data-retry-articles]')){if(window.RazSahraReloadArticles)window.RazSahraReloadArticles();return;}
    var draftButton=event.target.closest('[data-save-draft]');
    if(draftButton){
      var form=draftButton.closest('form'),formType=form&&form.getAttribute('data-local-form'),draft={};
      if(form){Array.prototype.forEach.call(form.elements,function(field){if(field.name)draft[field.name]=field.type==='checkbox'?field.checked:field.value;});
        try{localStorage.setItem('rs-draft-'+formType,JSON.stringify(draft));var status=form.querySelector('.form-status');if(status){status.className='form-status success';status.textContent=window.RSCurrentLanguage==='en'?'Draft saved in this browser only; it has not been sent to the company.':'پیش‌نویس روی همین مرورگر ذخیره شد؛ هنوز برای شرکت ارسال نشده است.';}draftButton.textContent=window.RSCurrentLanguage==='en'?'Saved ✓':'ذخیره شد ✓';window.setTimeout(function(){draftButton.textContent=window.RSCurrentLanguage==='en'?'Save draft':'ذخیره پیش‌نویس';},1800);}
        catch(e){var statusError=form.querySelector('.form-status');if(statusError){statusError.className='form-status error';statusError.textContent=window.RSCurrentLanguage==='en'?'Local saving is unavailable in this browser. You can still prepare the request file.':'ذخیره محلی در این مرورگر در دسترس نیست؛ می‌توانید فایل درخواست را آماده کنید.';}}
      }return;
    }
    if(!event.target.closest('.site-header')){
      var menu=document.getElementById('mobile-menu'),toggle=document.querySelector('.mobile-toggle');
      if(menu&&menu.classList.contains('open')){menu.classList.remove('open');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',window.RSCurrentLanguage==='en'?'Open menu':'باز کردن منو');}}
    }
  });
  document.addEventListener('input',function(event){
    if(event.target&&event.target.id==='article-search'){
      var query=event.target.value.trim().toLocaleLowerCase(),visible=0;
      document.querySelectorAll('[data-article-card]').forEach(function(card){var hay=(card.innerText+' '+(card.getAttribute('data-keywords')||'')).toLocaleLowerCase(),match=!query||hay.indexOf(query)!==-1;card.hidden=!match;if(match)visible++;});
      var empty=document.getElementById('article-no-results');if(empty){empty.hidden=visible!==0;empty.textContent=window.RSCurrentLanguage==='en'?'No guide matched that search. Try a shorter phrase.':'مقاله‌ای با این عبارت پیدا نشد؛ عبارت کوتاه‌تری امتحان کنید.';}
    }
    if(event.target&&event.target.matches('form input,form textarea,form select'))event.target.removeAttribute('aria-invalid');
  });
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'){
      if(readerBackdrop&&readerBackdrop.classList.contains('is-open')){closeReader();return;}
      var menu=document.getElementById('mobile-menu'),toggle=document.querySelector('.mobile-toggle');
      if(menu&&menu.classList.contains('open')){menu.classList.remove('open');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',window.RSCurrentLanguage==='en'?'Open menu':'باز کردن منو');toggle.focus();}}
    }
  });
  window.addEventListener('popstate',function(){
    var article=new URLSearchParams(window.location.search).get('article');
    if(article&&document.querySelector('.page-view[data-page="insights"].active'))window.RazSahraOpenArticle(article);
    else closeReader();
  });
  document.querySelectorAll('form[data-local-form]').forEach(function(form){
    var key='rs-draft-'+form.getAttribute('data-local-form'),draft=null;
    try{draft=JSON.parse(localStorage.getItem(key)||'null');}catch(e){}
    if(draft){Array.prototype.forEach.call(form.elements,function(field){if(!field.name||!(field.name in draft))return;if(field.type==='checkbox')field.checked=!!draft[field.name];else field.value=draft[field.name];});}
  });

  /* Four-slide cinematic hero, three-slide collaboration story and magazine rail. */
  function setupCarousel(config){
    var root=document.querySelector(config.root);
    if(!root)return null;
    var slides=Array.prototype.slice.call(root.querySelectorAll(config.slide));
    if(slides.length<2)return null;
    var dots=Array.prototype.slice.call(root.querySelectorAll(config.dot));
    var current=0, timer=null, paused=false;
    function show(index){
      current=(index+slides.length)%slides.length;
      slides.forEach(function(slide,i){var active=i===current;slide.classList.toggle('is-active',active);slide.setAttribute('aria-hidden',active?'false':'true');slide.querySelectorAll('a,button').forEach(function(control){control.tabIndex=active?0:-1;});});
      dots.forEach(function(dot,i){dot.classList.toggle('is-active',i===current);dot.setAttribute('aria-current',i===current?'true':'false');});
      if(config.count){var count=root.querySelector(config.count);if(count)count.innerHTML=String(current+1).padStart(2,'0')+' <i>/ '+String(slides.length).padStart(2,'0')+'</i>';}
      if(config.progress){var bar=root.querySelector(config.progress);if(bar)bar.style.width=((current+1)/slides.length*100)+'%';}
    }
    function stop(){if(timer){window.clearInterval(timer);timer=null;}}
    function start(){stop();if(reduce||paused||document.hidden)return;timer=window.setInterval(function(){show(current+1);},config.interval||7000);}
    var previous=root.querySelector(config.prev),next=root.querySelector(config.next);
    if(previous)previous.addEventListener('click',function(){show(current-1);start();});
    if(next)next.addEventListener('click',function(){show(current+1);start();});
    dots.forEach(function(dot,i){dot.addEventListener('click',function(){show(i);start();});});
    root.addEventListener('mouseenter',function(){paused=true;stop();});
    root.addEventListener('mouseleave',function(){paused=false;start();});
    root.addEventListener('focusin',function(){paused=true;stop();});
    root.addEventListener('focusout',function(){window.setTimeout(function(){if(!root.contains(document.activeElement)){paused=false;start();}},60);});
    document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else start();});
    show(0);start();
    return {next:function(){show(current+1);start();},previous:function(){show(current-1);start();},show:show};
  }
  setupCarousel({root:'[data-hero-slider]',slide:'[data-hero-slide]',dot:'[data-hero-dot]',prev:'[data-hero-prev]',next:'[data-hero-next]',interval:5400});
  setupCarousel({root:'[data-cta-slider]',slide:'[data-cta-slide]',dot:'[data-cta-dot]',prev:'[data-cta-prev]',next:'[data-cta-next]',count:'[data-cta-count]',progress:'[data-cta-progress]',interval:6100});

  var magazine=document.querySelector('[data-magazine-carousel]'),magTrack=document.querySelector('[data-magazine-track]'),magTimer=null,magPaused=false;
  if(magazine&&magTrack){
    function scrollMagazine(direction){
      var card=magTrack.querySelector('.magazine-card'),distance=card?card.getBoundingClientRect().width+18:320;
      magazine.scrollBy({left:(direction==='next'?1:-1)*distance,behavior:reduce?'auto':'smooth'});
    }
    var magPrev=document.querySelector('[data-mag-prev]'),magNext=document.querySelector('[data-mag-next]');
    if(magPrev)magPrev.addEventListener('click',function(){scrollMagazine('prev');restartMag();});
    if(magNext)magNext.addEventListener('click',function(){scrollMagazine('next');restartMag();});
    function restartMag(){if(magTimer)window.clearInterval(magTimer);magTimer=null;if(!reduce&&!magPaused&&!document.hidden)magTimer=window.setInterval(function(){var max=magazine.scrollWidth-magazine.clientWidth;if(magazine.scrollLeft>=max-10)magazine.scrollTo({left:0,behavior:'smooth'});else scrollMagazine('next');},6800);}
    magazine.addEventListener('mouseenter',function(){magPaused=true;if(magTimer)window.clearInterval(magTimer);magTimer=null;});
    magazine.addEventListener('mouseleave',function(){magPaused=false;restartMag();});
    magazine.addEventListener('focusin',function(){magPaused=true;if(magTimer)window.clearInterval(magTimer);magTimer=null;});
    magazine.addEventListener('focusout',function(){window.setTimeout(function(){if(!magazine.contains(document.activeElement)){magPaused=false;restartMag();}},80);});
    restartMag();
  }

  /* Small ember motes add depth without blocking interaction or competing with text. */
  function addEmberField(host,count){
    if(!host||host.querySelector(':scope > .rs-particle-field'))return;
    var field=document.createElement('div');field.className='rs-particle-field';field.setAttribute('aria-hidden','true');
    for(var i=0;i<count;i++){
      var ember=document.createElement('span');ember.className='rs-particle';
      ember.style.setProperty('--ember-x',(1+Math.random()*98)+'%');
      ember.style.setProperty('--ember-y',(1+Math.random()*98)+'%');
      ember.style.setProperty('--ember-size',(3+Math.random()*4.5)+'px');
      ember.style.setProperty('--ember-duration',(4.6+Math.random()*6.8)+'s');
      ember.style.setProperty('--ember-delay',(-Math.random()*12)+'s');
      ember.style.setProperty('--ember-drift',(-50+Math.random()*100)+'px');
      field.appendChild(ember);
    }
    host.insertBefore(field,host.firstChild);
  }
  function updateEmbers(){
    if(reduce)return;
    document.querySelectorAll('.page-view,.page-view section,.site-footer,[data-hero-slider],.collaboration-carousel').forEach(function(host){
      var count=host.matches('.site-footer')?42:host.matches('.page-view')?44:host.matches('[data-hero-slider],.collaboration-carousel')?20:20;
      addEmberField(host,count);
    });
  }
  window.RSUpdateEmbers=updateEmbers;
  updateEmbers();

})();