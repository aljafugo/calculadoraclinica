const readStore=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:fallback}catch{return fallback}};
const saveStore=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
const saved=new Set(readStore('medcalc-favorites',[]).filter(id=>calculators[id]));
const recent=readStore('vita-recent',[]).filter(id=>calculators[id]).slice(0,4);
const grid=document.querySelector('#calculatorGrid'), dialog=document.querySelector('#calculatorDialog'),content=document.querySelector('#dialogContent');
const categoryIcons={general:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 8v8M8 12h8"/></svg>',renal:'<svg viewBox="0 0 24 24"><path d="M9 4c-4.2.3-6 4-4.3 8.2 1.5 3.7 5.6 5.9 8.3 2.6 1.3-1.6 1.1-3.8-.1-5.2C11.5 7.9 10.9 5.2 9 4Z"/><path d="M15 4c4.2.3 6 4 4.3 8.2-1.5 3.7-5.6 5.9-8.3 2.6"/></svg>',cardio:'<svg viewBox="0 0 24 24"><path d="M20 8.5c0 5-8 10-8 10s-8-5-8-10A4.2 4.2 0 0 1 12 6a4.2 4.2 0 0 1 8 2.5Z"/><path d="m5.5 12 3-3 2.2 4 2.3-5 1.6 4H19"/></svg>',urgencias:'<svg viewBox="0 0 24 24"><path d="M12 3 20 6v5.7c0 4.8-3.2 7.7-8 9.3-4.8-1.6-8-4.5-8-9.3V6Z"/><path d="m13 7-4 6h3l-1 4 4-6h-3Z"/></svg>',metabolismo:'<svg viewBox="0 0 24 24"><circle cx="7" cy="8" r="2.2"/><circle cx="17" cy="7" r="2.2"/><circle cx="12" cy="17" r="2.2"/><path d="m8.8 9.3 2.1 5.4m4.3-6-2.1 5.6m-4-5.6 5.7-1.2"/></svg>'};

const star='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"/></svg>';
function toast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('visible');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('visible'),2500)}
function toggleSaved(id){saved.has(id)?saved.delete(id):saved.add(id);saveStore('medcalc-favorites',[...saved]);render();toast(saved.has(id)?'Añadida a Mi mochila':'Quitada de Mi mochila')}
function render(){
 grid.innerHTML=Object.entries(calculators).map(([id,c])=>`<article class="calc-card" data-id="${id}" data-category="${c.cat}" tabindex="0" aria-label="Abrir calculadora: ${c.title}"><span class="calc-icon" aria-hidden="true">${categoryIcons[c.cat]}</span><div class="card-head"><span class="category-label">${c.tag}</span><button class="save-button ${saved.has(id)?'saved':''}" data-save="${id}" aria-pressed="${saved.has(id)}" aria-label="${saved.has(id)?'Quitar':'Guardar'} ${c.title}">${star}</button></div><h3><button class="card-open" data-open="${id}">${c.title}</button></h3><p>${c.desc}</p><span class="card-code">${c.code}</span><span class="card-arrow" aria-hidden="true">↗</span></article>`).join('');
 document.querySelector('#savedList').innerHTML=saved.size?[...saved].map(id=>`<button class="saved-card" data-open="${id}"><div><small>${calculators[id].tag}</small><strong>${calculators[id].title}</strong></div><span>↗</span></button>`).join(''):'<div class="saved-placeholder"><strong>Tus herramientas, a mano.</strong><p>Guarda una calculadora con la estrella para encontrarla aquí.</p><a href="#herramientas">Explorar calculadoras →</a></div>';
 document.querySelector('#recentTools').innerHTML=recent.length?'<span>Abiertas recientemente</span>'+recent.map(id=>`<button data-open="${id}">${calculators[id].code}</button>`).join(''):'';
 filterCards();
}
const normalized=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function filterCards(){let term=normalized(document.querySelector('#searchInput').value),cat=document.querySelector('.category.active').dataset.filter,n=0;document.querySelectorAll('.calc-card').forEach(el=>{let c=calculators[el.dataset.id],yes=(cat==='all'||c.cat===cat)&&normalized(c.title+' '+c.tag+' '+c.code+' '+c.desc+' '+c.f.map(f=>f[0]).join(' ')).includes(term);el.hidden=!yes;if(yes)n++});document.querySelector('#emptyState').hidden=!!n;document.querySelector('#resultCount').textContent=n+' calculadoras';}
function openCalc(id){
 if(!calculators[id])return;
 const c=calculators[id];recent.splice(0,recent.length,id,...recent.filter(x=>x!==id).slice(0,3));saveStore('vita-recent',recent);render();
 const fields=c.f.map(([label,key,type,unit])=>{const [min,max]=bounds(id,key);return `<div class="field"><label for="f-${key}">${label}</label><div class="input-wrap">${type==='s'?`<select required id="f-${key}"><option value="">Selecciona una opción</option>${unit.map(x=>'<option>'+x+'</option>').join('')}</select>`:`<input id="f-${key}" type="number" inputmode="decimal" min="${min}" max="${max}" step="${key==='edad'?'1':'any'}" placeholder="—" required><span class="unit">${unit}</span>`}</div></div>`}).join('');
 content.innerHTML=`<div class="dialog-inner"><p class="dialog-kicker">${c.tag} / ${c.code}</p><h2 id="calcTitle">${c.title}</h2><p class="dialog-desc">${c.desc}</p><form id="calcForm"><div class="form-grid">${fields}</div><p class="form-error" role="alert" id="formError"></p><div class="form-actions"><button class="calculate" type="submit">Calcular resultado <span>→</span></button><button class="reset-button" type="reset">Limpiar</button></div></form><div id="resultMount" aria-live="polite"></div><details class="formula"><summary>Fórmula y uso clínico</summary><p>${formulas[id]}</p><p>${notes[id]||'Interpreta el resultado en el contexto clínico.'}</p><small>Fórmula contrastada: 3 de noviembre de 2026 · Límites de entrada para detectar errores de unidades, no intervalos de normalidad.</small>${sources[id]?`<a href="${sources[id][1]}" target="_blank" rel="noopener noreferrer">${sources[id][0]} ↗</a>`:''}</details></div>`;
 dialog.setAttribute('aria-labelledby','calcTitle');if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
 const form=document.querySelector('#calcForm');
 form.oninput=()=>{document.querySelector('#resultMount').replaceChildren();document.querySelector('#formError').textContent=''};
 form.onreset=()=>{document.querySelector('#resultMount').replaceChildren();document.querySelector('#formError').textContent=''};
 form.onsubmit=e=>{
 e.preventDefault();const v={};c.f.forEach(([,key])=>v[key]=document.getElementById('f-'+key).value);
 const error=validateValues(id,v);if(error){document.querySelector('#formError').textContent=error;return;}
 const [value,unit,note]=calculate(id,v);if(value!=='NT'&&!Number.isFinite(Number(value))){document.querySelector('#formError').textContent='Revisa los datos: no se puede calcular un resultado válido.';return;}
 const t=document.querySelector('#resultTemplate').content.cloneNode(true);t.querySelector('.result-value').textContent=value;t.querySelector('.result-unit').textContent=unit;t.querySelector('.result-note').textContent=note+(notes[id]?' '+notes[id]:'');
 const copyText=c.title+': '+value+' '+unit+'\n'+c.f.map(([label,key,type,u])=>label+': '+v[key]+(type==='n'?' '+u:'')).join('\n')+'\n'+note+'\n'+(notes[id]||'');
 t.querySelector('.copy-result').onclick=async e=>{const button=e.currentTarget;try{await navigator.clipboard.writeText(copyText);button.textContent='Copiado ✓';toast('Resultado copiado con los datos introducidos')}catch{const area=document.createElement('textarea');area.value=copyText;area.readOnly=true;area.className='copy-fallback';document.querySelector('#resultMount').append(area);area.focus();area.select();toast('Selecciona y copia el texto del resultado')}};
 document.querySelector('#resultMount').replaceChildren(t);
 };
}
document.addEventListener('click',e=>{const save=e.target.closest('[data-save]'),open=e.target.closest('[data-open]'),card=e.target.closest('.calc-card');if(save){toggleSaved(save.dataset.save);return;}if(open){openCalc(open.dataset.open);return;}if(card)openCalc(card.dataset.id)});
document.addEventListener('keydown',e=>{const card=e.target.closest('.calc-card');if(!card||e.target.closest('[data-save]')||!['Enter',' '].includes(e.key))return;e.preventDefault();openCalc(card.dataset.id)});
document.querySelectorAll('.category').forEach(b=>{b.setAttribute('aria-pressed',b.classList.contains('active'));b.onclick=()=>{document.querySelectorAll('.category').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',x===b)});filterCards()}});
document.querySelector('#searchInput').oninput=filterCards;
document.querySelector('#clearSearch').onclick=()=>{document.querySelector('#searchInput').value='';document.querySelector('[data-filter="all"]').click();};
document.querySelector('.close-dialog').onclick=()=>dialog.close();
dialog.onclick=e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}};
document.querySelectorAll('.bottom-nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelectorAll('.bottom-nav a').forEach(x=>x.classList.toggle('active',x===a))}));
let installPrompt;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e});
document.querySelector('#installApp').onclick=async()=>{if(installPrompt){await installPrompt.prompt();installPrompt=null}else toast('En el menú del navegador, elige Añadir a pantalla de inicio. En iPhone: Compartir → Añadir a inicio.')};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
