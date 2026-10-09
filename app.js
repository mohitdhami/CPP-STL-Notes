// search + nav + copy + scrollspy
const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];

function initCopy(){
  $$('pre').forEach(pre=>{
    if(pre.querySelector('.copy')) return;
    const b=document.createElement('button');
    b.className='copy'; b.textContent='Copy';
    b.onclick=async()=>{
      const code=pre.querySelector('code')?.innerText ?? pre.innerText;
      try{ await navigator.clipboard.writeText(code); b.textContent='Copied ✓'; }
      catch{ b.textContent='Select+Copy'; }
      setTimeout(()=>b.textContent='Copy',1400);
    };
    pre.appendChild(b);
  });
}

function initSearch(){
  const input=$('#q');
  const clear=$('#clearSearch');
  const cards=$$('[data-search]');
  const noRes=$('#noResults');
  if(!input) return;
  const run=()=>{
    const q=input.value.trim().toLowerCase();
    let visible=0;
    cards.forEach(c=>{
      const hay=(c.getAttribute('data-search')+' '+(c.innerText||'')).toLowerCase();
      const show=!q || hay.includes(q);
      c.style.display=show?'':'none';
      if(show) visible++;
    });
    // also filter method rows & table rows lightly
    $$('.method, tbody tr').forEach(el=>{
      if(!q) { el.style.display=''; return; }
      const t=(el.innerText||'').toLowerCase();
      // only hide if parent card is visible and row doesn't match AND query looks like method search
      if(q.length>=2 && !t.includes(q) && el.classList.contains('method')) el.style.display='none';
      else if(el.classList.contains('method')) el.style.display='';
    });
    if(noRes) noRes.style.display = (visible===0)?'block':'none';
  };
  input.addEventListener('input',run);
  clear?.addEventListener('click',()=>{input.value='';run();input.focus();});
}

function initNav(){
  const links=$$('.nav a');
  const secs=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const onScroll=()=>{
    let cur=null;
    secs.forEach(s=>{ if(s.getBoundingClientRect().top < 140) cur=s; });
    links.forEach(a=>a.classList.toggle('active', cur && a.getAttribute('href')==='#'+cur.id));
    $('#toTop').style.display = window.scrollY>600?'block':'none';
  };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  $('#toTop')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  $('#menuBtn')?.addEventListener('click',()=>$('.sidebar')?.scrollIntoView({behavior:'smooth'}));
}

document.addEventListener('DOMContentLoaded',()=>{initCopy();initSearch();initNav();});
