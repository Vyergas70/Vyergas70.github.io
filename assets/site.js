(function(){
  const h=document.getElementById('site-header');
  const b=document.getElementById('menu-button');
  const m=document.getElementById('mobile-nav');

  function scroll(){
    if(h) h.classList.toggle('scrolled', window.scrollY>40);
  }
  window.addEventListener('scroll',scroll,{passive:true});
  scroll();

  if(b&&m){
    b.addEventListener('click',()=>{
      const o=m.classList.toggle('open');
      b.setAttribute('aria-expanded',String(o));
    });
  }

  const src=document.getElementById('story-source');
  const out=document.getElementById('story-body');

  if(src&&out){
    // Word/LibreOffice copy-paste usually places every paragraph on its own
    // line, not with an extra blank line between paragraphs.  Therefore the
    // reader deliberately processes the story line-by-line.
    const text=src.value
      .replace(/\r\n?/g,'\n')
      .replace(/\u00a0/g,' ')
      .trim();

    const lines=text ? text.split('\n') : [];

    function addInline(el,t){
      const parts=t.split(/(\*[^*]+\*)/g);
      parts.forEach(p=>{
        if(p.startsWith('*')&&p.endsWith('*')&&p.length>2){
          const em=document.createElement('em');
          em.textContent=p.slice(1,-1);
          el.appendChild(em);
        }else{
          el.appendChild(document.createTextNode(p));
        }
      });
    }

    function isAutomaticHeading(t){
      // Numbered chapter headings such as:
      // I. Gyerekkor / IV. Hazatérés / 1. Fejezet
      if(t.length>100) return false;
      return /^(?:[IVXLCDM]+|\d+)\.\s+\S+/u.test(t);
    }

    lines.forEach(line=>{
      const t=line.trim();
      if(!t) return;

      if(t==='•'||t==='***'||t==='·'){
        const d=document.createElement('div');
        d.className='separator';
        d.textContent='•';
        out.appendChild(d);
        return;
      }

      // Explicit heading: ## A tárgyalás
      // Automatic numbered heading: I. Gyerekkor
      if(t.startsWith('## ') || isAutomaticHeading(t)){
        const h2=document.createElement('h2');
        h2.textContent=t.startsWith('## ') ? t.slice(3).trim() : t;
        out.appendChild(h2);
        return;
      }

      const p=document.createElement('p');
      if(t==='Ide jön a novella.'||t==='Ide jön a szöveg.'){
        p.className='placeholder';
      }
      addInline(p,t);
      out.appendChild(p);
    });
  }
})();
