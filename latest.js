/* LIGHTNYU — self-contained behaviour for the approved ACTA homepage snapshot. */
(()=> {
  'use strict';
  const $=(s,root=document)=>root.querySelector(s);
  const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
  const cd=$('.launch-clock-values');
  const date=new Date('2027-01-01T00:00:00Z').getTime();
  const tick=()=>{
    let left=Math.max(0,date-Date.now());
    const parts=[Math.floor(left/86400000),Math.floor(left%86400000/3600000),Math.floor(left%3600000/60000),Math.floor(left%60000/1000)];
    $$('.launch-clock-values strong').forEach((el,i)=>el.textContent=String(parts[i]).padStart(2,'0'));
    cd?.setAttribute('aria-label',left?'Countdown to 1 January 2027':'Launch date reached');
  };tick();setInterval(tick,1000);
  const links=$$('.launch-navigation a[href^="#"]');
  const sections=links.map(a=>document.getElementById(a.hash.slice(1))).filter(Boolean);
  if('IntersectionObserver' in window){
    const nav=new IntersectionObserver(entries=>{
      for(const e of entries){if(!e.isIntersecting)continue;
        links.forEach(a=>{let active=a.hash.slice(1)===e.target.id;a.classList.toggle('is-active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
      }
    },{rootMargin:'-12% 0px -66% 0px'});
    sections.forEach(s=>nav.observe(s));
    const reveal=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-revealed');reveal.unobserve(e.target);}})},{threshold:.03,rootMargin:'0px 0px -20px 0px'});
    $$('.reveal-target').forEach(n=>reveal.observe(n));
  } else $$('.reveal-target').forEach(n=>n.classList.add('is-revealed'));
  const form=$('.launch-form');
  form?.addEventListener('submit',ev=>{
    ev.preventDefault();if(!form.reportValidity())return;
    const dialog=document.createElement('div');
    dialog.className='lightnyu-dialog-backdrop'; dialog.setAttribute('role','presentation');
    dialog.innerHTML='<div class="lightnyu-dialog" role="dialog" aria-modal="true" aria-labelledby="lightnyu-dialog-title"><h2 id="lightnyu-dialog-title">LIGHTNYU launch updates</h2><p>The registration service is still on the original hosted site. This preview does not collect or transmit your email.</p><div class="lightnyu-dialog-actions"><button type="button" class="lightnyu-dialog-dismiss">Cancel</button><a href="https://ikhnaie.anatoliim.chatgpt.site/#register-interest">Continue to registration</a></div></div>';
    document.body.appendChild(dialog);
    const close=()=>dialog.remove();
    $('.lightnyu-dialog-dismiss',dialog).addEventListener('click',close);
    dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
    const onKey=e=>{if(e.key==='Escape'){close();document.removeEventListener('keydown',onKey)}};document.addEventListener('keydown',onKey);
    $('.lightnyu-dialog-dismiss',dialog).focus();
  });
  const canvas=$('.beams-canvas');
  if(canvas && canvas.getContext){
    const ctx=canvas.getContext('2d',{alpha:true}); let w=0,h=0,dpr=1; const beams=[];
    const resize=()=>{ dpr=Math.min(window.devicePixelRatio||1,1.5); w=Math.max(1,canvas.clientWidth);h=Math.max(1,canvas.clientHeight); canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize();window.addEventListener('resize',resize,{passive:true});
    for(let i=0;i<13;i++){const t=i/12;beams.push({x:(t-.5)*1.75,offset:(i*59)%110,thick:95+i%3*31,speed:.7+(i%5)*.26,opacity:.13+(i%4)*.07});}
    const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let start=performance.now();
    const draw=now=>{
      if(!w||!h)return; const t=reduce?0:(now-start)/1000;
      ctx.clearRect(0,0,w,h);ctx.save();ctx.globalCompositeOperation='screen';
      const diag=h*1.5;
      beams.forEach((b,i)=>{
        const x=w*(.5+b.x)+((t*b.speed*10+b.offset)%(w+420))-(w+420)/2;
        const y0=-h*.42, y1=h*1.42;
        ctx.save();ctx.translate(x,0);ctx.rotate(-.25);
        const gradient=ctx.createLinearGradient(-b.thick,0,b.thick,0);
        gradient.addColorStop(0,'rgba(28,89,180,0)');gradient.addColorStop(.45,'rgba(71,140,247,'+b.opacity+')');gradient.addColorStop(.52,'rgba(150,206,255,'+(b.opacity*.85)+')');gradient.addColorStop(1,'rgba(50,93,169,0)');
        ctx.fillStyle=gradient;ctx.fillRect(-b.thick,y0,b.thick*2,diag);ctx.restore();
      });ctx.restore();
      if(!reduce)requestAnimationFrame(draw);
    };requestAnimationFrame(draw);
  }
})();
