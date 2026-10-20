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

  var revealSelectors='.section-heading,.business-card,.principle,.flow-item,.roadmap-item,.content-panel,.insight-main,.editorial-empty,.partnership-band,.intro-quote,.intro-copy,.final-cta-inner';
  var items=Array.prototype.slice.call(document.querySelectorAll(revealSelectors));
  items.forEach(function(el,i){el.classList.add('rs-reveal');if(el.matches('.business-card,.principle,.flow-item,.roadmap-item'))el.classList.add('rs-reveal-delay-'+((i%3)+1));});
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
        mobileToggle.setAttribute('aria-label','باز کردن منو');
      });
    });
    document.addEventListener('keydown',function(event){
      if(event.key==='Escape'&&mobileMenu.classList.contains('open')){
        mobileMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded','false');
        mobileToggle.setAttribute('aria-label','باز کردن منو');
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
  document.querySelectorAll('form input,form select,form textarea').forEach(function(field){
    field.addEventListener('focus',function(){document.body.classList.add('rs-form-focused');});
    field.addEventListener('blur',function(){window.setTimeout(function(){if(!document.activeElement||!document.activeElement.matches('input,select,textarea'))document.body.classList.remove('rs-form-focused');},80);});
  });
  window.addEventListener('pageshow',function(){document.body.classList.remove('rs-form-focused');});


  /* Editorial interactions: reading, bookmarks, search and local form drafts. */
  document.addEventListener('click',function(event){
    var openButton=event.target.closest('[data-article-open]');
    if(openButton){
      var body=document.getElementById(openButton.getAttribute('data-article-open'));
      if(body){var opening=body.hidden;body.hidden=!opening;openButton.setAttribute('aria-expanded',opening?'true':'false');openButton.innerHTML=opening?'بستن راهنما <span>↑</span>':'مطالعه راهنما <span>←</span>';
        if(opening&&window.matchMedia('(max-width: 700px)').matches)window.setTimeout(function(){body.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});},80);
      }return;
    }
    var saveButton=event.target.closest('[data-save-article]');
    if(saveButton){
      var id=saveButton.getAttribute('data-save-article'),saved=[];
      try{saved=JSON.parse(localStorage.getItem('rs-saved-articles')||'[]');}catch(e){}
      var index=saved.indexOf(id);if(index<0)saved.push(id);else saved.splice(index,1);
      try{localStorage.setItem('rs-saved-articles',JSON.stringify(saved));}catch(e){}
      saveButton.setAttribute('aria-pressed',index<0?'true':'false');saveButton.textContent=index<0?'♥ ذخیره‌شده':'♡ ذخیره';return;
    }
    if(event.target.closest('[data-retry-articles]')){
      var host=document.getElementById('article-library');if(host){window.location.reload();}return;
    }
    var draftButton=event.target.closest('[data-save-draft]');
    if(draftButton){
      var form=draftButton.closest('form'),formType=form&&form.getAttribute('data-local-form'),draft={};
      if(form){Array.prototype.forEach.call(form.elements,function(field){if(field.name)draft[field.name]=field.type==='checkbox'?field.checked:field.value;});
        try{localStorage.setItem('rs-draft-'+formType,JSON.stringify(draft));var status=form.querySelector('.form-status');if(status){status.className='form-status success';status.textContent='پیش‌نویس روی همین مرورگر ذخیره شد؛ هنوز برای شرکت ارسال نشده است.';}draftButton.textContent='ذخیره شد ✓';window.setTimeout(function(){draftButton.textContent='ذخیره پیش‌نویس';},1800);}
        catch(e){var statusError=form.querySelector('.form-status');if(statusError){statusError.className='form-status error';statusError.textContent='ذخیره محلی در این مرورگر در دسترس نیست؛ می‌توانید فایل درخواست را آماده کنید.';}}
      }return;
    }
    if(!event.target.closest('.site-header')){
      var menu=document.getElementById('mobile-menu'),toggle=document.querySelector('.mobile-toggle');
      if(menu&&menu.classList.contains('open')){menu.classList.remove('open');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','باز کردن منو');toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';}}
    }
  });
  document.addEventListener('input',function(event){
    if(event.target&&event.target.id==='article-search'){
      var query=event.target.value.trim().toLocaleLowerCase(),visible=0;
      document.querySelectorAll('[data-article-card]').forEach(function(card){var hay=(card.innerText+' '+(card.getAttribute('data-keywords')||'')).toLocaleLowerCase(),match=!query||hay.indexOf(query)!==-1;card.hidden=!match;if(match)visible++;});
      var empty=document.getElementById('article-no-results');if(empty)empty.hidden=visible!==0;
    }
    if(event.target&&event.target.matches('form input,form textarea,form select'))event.target.removeAttribute('aria-invalid');
  });
  document.addEventListener('keydown',function(event){
    if(event.key==='Escape'){var menu=document.getElementById('mobile-menu'),toggle=document.querySelector('.mobile-toggle');if(menu&&menu.classList.contains('open')){menu.classList.remove('open');if(toggle){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','باز کردن منو');toggle.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';toggle.focus();}}}
  });
  document.querySelectorAll('form[data-local-form]').forEach(function(form){
    var key='rs-draft-'+form.getAttribute('data-local-form'),draft=null;
    try{draft=JSON.parse(localStorage.getItem(key)||'null');}catch(e){}
    if(draft){Array.prototype.forEach.call(form.elements,function(field){if(!field.name||!(field.name in draft))return;if(field.type==='checkbox')field.checked=!!draft[field.name];else field.value=draft[field.name];});}
  });
})();