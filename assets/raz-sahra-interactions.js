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

  // Turn the chain diagram into an accessible, keyboard-friendly exploration path.
  document.querySelectorAll('.flow-item').forEach(function(item){
    item.setAttribute('tabindex','0');
    item.setAttribute('role','group');
    item.addEventListener('focus',function(){item.style.borderColor='rgba(183,122,83,.7)';});
    item.addEventListener('blur',function(){item.style.removeProperty('border-color');});
  });

  // Make outbound source-credit links safe and give image-bearing sections meaningful fallbacks.
  document.querySelectorAll('a[target="_blank"]').forEach(function(a){a.setAttribute('rel','noopener noreferrer');});
  document.querySelectorAll('.hero-panel,.partnership-art,.insight-main').forEach(function(el){el.classList.add('rs-image-enhanced');});
})();