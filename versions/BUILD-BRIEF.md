# BUILD BRIEF — "Skin It 8 Ways" home pages

You are building ONE self-contained `index.html` home page for ONE design direction of Julianne Silla's portfolio. Read this whole brief. Output to `versions/<your-id>/index.html`.

## Non-negotiables (every direction)

1. **Self-contained static HTML** — all CSS in one `<style>`, all JS in one `<script>`. No build step, opens on double-click. Google Fonts via CDN link. Lenis + GSAP via CDN `<script>`.
2. **Real content only (HR-10/49)** — copy the EXACT values from `content/julz-content.json` (read it). **Inline** them into the HTML (do NOT `fetch()` the JSON — it breaks on `file://`). Zero lorem.
3. **All home sections, in order:** nav (with monogram + nav links + CTA) → hero (eyebrow, name, role line, tagline, CTA, portrait) → stats (5 count-up tiles) → about (big tagline + 2 paragraphs + 3 pillars) → work (eyebrow/heading/lead + 6 cards) → contact (heading, lead, CTA, 4 info tiles) → footer (3 items) → version badge bottom-right linking `../gallery.html`.
4. **INTERACTIVE — required, gated on `prefers-reduced-motion` (Julz's explicit ask):**
   - **Lenis** smooth scroll on every direction.
   - **Parallax** via GSAP **ScrollTrigger** — scroll-scrubbed multi-speed layers (transform/opacity only).
   - **A distinct 3D moment** — see your direction below (CSS `preserve-3d` tilt/flip for most; real Three.js scene for v5).
   - **Interactive elements** — magnetic CTAs, cursor-reactive hero/cards, scroll progress bar, scroll-aware nav.
   - `@media (prefers-reduced-motion: reduce)` MUST disable all parallax/3D/auto-motion and show static content. Keyboard focus-visible. AA contrast.
5. **Performance:** transform/opacity animations only; `will-change` sparingly; lazy-init Three.js below the fold; images `loading="lazy"` except the hero (`fetchpriority="high"`). Target LCP<2.5s / CLS<0.1.
6. **Distinctness (frontend-design):** commit FULLY to your aesthetic. Do not drift toward the others. The technique stack is shared; the look + the *expression* of the 3D/parallax must be unmistakably yours.

## Brand tokens (from content.json → tokens)
- Colors: char `#0E0D0C` · char2 `#15120F` · panel `#1A1612` · cream `#E5E2DD` · cream2 `#EFEBE2` · gold `#DBBF94` · goldHi `#F3E2BE` · goldDim `#8C7350` · onDark `#F0EBE1` · onDarkMut `#A99E8E` · line `#2A241D`
- Fonts: **Playfair Display** (serif/display) · **Inter** (body) · **Archivo** (grotesk/UI labels). Font link in content.json.
- Signature ease: `cubic-bezier(.16,1,.3,1)`. Max width 1240px.
- You MAY shift the palette per your direction brief (e.g. flip to light) — but stay within Julz's warm charcoal/champagne/cream world unless your brief says otherwise.

## Assets (paths are relative to `versions/<id>/`, i.e. start with `../../`)
- Hero portrait (best, pro): `../../assets/photos/julz-hero-pro.png` (fallback `../../assets/photos/julz-profile-card.jpg`)
- Reels: `../../preview/reel-1.jpg` … `reel-6.jpg`
- Work thumbs: `../../preview/work-1.png` … `work-6.png`
- Lifestyle: `../../assets/photos/portfolio-photo-01..03.jpg`, `hero-landscape.jpg`, `about-me-landscape.jpg`
- Case visuals: `../../assets/case-studies/v7-section-*-8K.png`, `campaigns-overview.png`
- Logo mark: `../../assets/brand/JS.png`
- Do NOT use `IMG_3039–3044` (not Julz) or `JULZ-AVATAR` (does not exist).

## Reusable interactive JS (adapt — proven in v6; build on it, don't just copy verbatim)
```html
<script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script>
(function(){
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;

  // Lenis smooth scroll
  if(!reduce && window.Lenis){
    var lenis = new Lenis({duration:1.15, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t))});
    function raf(t){lenis.raf(t); requestAnimationFrame(raf);} requestAnimationFrame(raf);
    if(window.ScrollTrigger){ lenis.on('scroll', ScrollTrigger.update); }
  }

  // reveals
  var rs=[].slice.call(document.querySelectorAll('.r'));
  if(!reduce && 'IntersectionObserver' in window){
    var io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.14});
    rs.forEach(el=>io.observe(el));
  } else rs.forEach(el=>el.classList.add('in'));

  // count-up
  var counted=false;
  function runCount(){ if(counted)return; counted=true;
    document.querySelectorAll('[data-count]').forEach(el=>{
      var t=+el.dataset.count, pre=el.dataset.pre||'', suf=el.dataset.suf||'', dur=1500, st=null;
      function step(ts){if(!st)st=ts; var p=Math.min((ts-st)/dur,1); el.textContent=pre+Math.floor((1-Math.pow(1-p,3))*t)+suf; if(p<1)requestAnimationFrame(step); else el.textContent=pre+t+suf;}
      requestAnimationFrame(step);
    });
  }
  var se=document.querySelector('.stats');
  if(se){ reduce ? runCount() : new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)runCount();}),{threshold:.4}).observe(se); }

  // nav + progress
  var nav=document.getElementById('nav'), prog=document.getElementById('prog');
  addEventListener('scroll',()=>{var h=document.documentElement,y=h.scrollTop; if(nav)nav.classList.toggle('stuck',y>40); if(prog)prog.style.width=(y/(h.scrollHeight-h.clientHeight)*100)+'%';},{passive:true});

  // magnetic
  if(!reduce && fine){
    document.querySelectorAll('[data-mag]').forEach(el=>{
      el.style.transition='transform .35s cubic-bezier(.16,1,.3,1)';
      el.addEventListener('mousemove',e=>{var r=el.getBoundingClientRect(); el.style.transform='translate('+(e.clientX-r.left-r.width/2)*.22+'px,'+(e.clientY-r.top-r.height/2)*.32+'px)';});
      el.addEventListener('mouseleave',()=>el.style.transform='translate(0,0)');
    });
  }

  // GSAP parallax (ADD your own scrubbed layers; example):
  if(!reduce && window.gsap && window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('[data-parallax]').forEach(el=>{
      var amt = parseFloat(el.dataset.parallax)||80;
      gsap.to(el,{yPercent:amt, ease:'none', scrollTrigger:{trigger:el, start:'top bottom', end:'bottom top', scrub:true}});
    });
  }

  // 3D tilt on [data-tilt] (CSS preserve-3d)
  if(!reduce && fine){
    document.querySelectorAll('[data-tilt]').forEach(el=>{
      el.addEventListener('mousemove',e=>{var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        el.style.transform='perspective(800px) rotateY('+(x*10)+'deg) rotateX('+(-y*10)+'deg)';});
      el.addEventListener('mouseleave',()=>el.style.transform='perspective(800px) rotateY(0) rotateX(0)');
    });
  }
})();
</script>
```

## YOUR DIRECTION
(The orchestrator fills this section per agent — palette move, the ONE memorable thing, and your distinct parallax/3D/interactive signature. Honor it precisely.)
