/* Shared interactions for all pages — reveals, counters, cursor, magnetic,
   nav state, smooth scroll, tabs, accordion. prefers-reduced-motion aware. */
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* smooth scroll (Lenis if loaded, graceful fallback) */
  if(!reduce && window.Lenis){
    var lenis=new Lenis({duration:1.1,easing:function(t){return Math.min(1,1.001-Math.pow(2,-10*t))}});
    function raf(t){lenis.raf(t);requestAnimationFrame(raf)} requestAnimationFrame(raf);
  }

  /* reveal on scroll */
  var rs=document.querySelectorAll('.r,.rule');
  if(!reduce && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.14});
    rs.forEach(function(el){io.observe(el)});
  } else { rs.forEach(function(el){el.classList.add('in')}); }

  /* count-up: <span data-count="600" data-pre="$" data-suf="K+">0</span> */
  function runCount(scope){
    scope.querySelectorAll('[data-count]').forEach(function(el){
      if(el.dataset.done) return; el.dataset.done='1';
      var target=+el.dataset.count, pre=el.dataset.pre||'', suf=el.dataset.suf||'', dur=1400, st=null, dec=((''+el.dataset.count).indexOf('.')>-1)?1:0;
      if(reduce){el.textContent=pre+target+suf;return;}
      function step(ts){ if(!st)st=ts; var p=Math.min((ts-st)/dur,1); var val=((1-Math.pow(1-p,3))*target).toFixed(dec);
        el.textContent=pre+val+suf; if(p<1)requestAnimationFrame(step); else el.textContent=pre+target+suf; }
      requestAnimationFrame(step);
    });
  }
  var statBlock=document.querySelector('.stats,.metrics');
  if(statBlock){ if(reduce){runCount(document);} else { new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)runCount(document)})},{threshold:.4}).observe(statBlock);} }

  /* nav stuck + scroll progress */
  var nav=document.querySelector('.nav'),prog=document.querySelector('.prog');
  function onScroll(){ var y=window.scrollY||document.documentElement.scrollTop;
    if(nav)nav.classList.toggle('stuck',y>60);
    if(prog){var h=document.documentElement;prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';} }
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  /* filter tabs (visual) */
  document.querySelectorAll('.tabs').forEach(function(group){
    group.querySelectorAll('.tab').forEach(function(t){t.addEventListener('click',function(){group.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on')});t.classList.add('on')})});
  });

  /* accordion */
  document.querySelectorAll('.acc-item').forEach(function(it){
    var head=it.querySelector('.acc-head'),body=it.querySelector('.acc-body');
    if(head&&body)head.addEventListener('click',function(){
      var open=it.classList.contains('open');
      it.classList.toggle('open');
      body.style.maxHeight=open?null:body.scrollHeight+'px';
    });
  });

  /* custom cursor + magnetic */
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    var cur=document.querySelector('.cur'),ring=document.querySelector('.ring');
    if(cur&&ring){var rx=0,ry=0,mx=0,my=0;
      addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;cur.style.transform='translate('+mx+'px,'+my+'px)'});
      (function loop(){rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();
      document.querySelectorAll('a,.card,.stat,.tab,.btn,.offer,.reel,[data-mag]').forEach(function(el){
        el.addEventListener('mouseenter',function(){document.body.classList.add('hov')});
        el.addEventListener('mouseleave',function(){document.body.classList.remove('hov')});
      });
    }
    document.querySelectorAll('[data-mag]').forEach(function(el){
      el.style.transition='transform .35s cubic-bezier(.16,1,.3,1)';
      el.addEventListener('mousemove',function(e){var r=el.getBoundingClientRect();el.style.transform='translate('+(e.clientX-r.left-r.width/2)*.25+'px,'+(e.clientY-r.top-r.height/2)*.35+'px)'});
      el.addEventListener('mouseleave',function(){el.style.transform='translate(0,0)'});
    });
  }
})();
