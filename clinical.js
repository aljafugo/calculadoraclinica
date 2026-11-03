const calculators={
 imc:{cat:'general',tag:'General',code:'IMC',title:'Índice de masa corporal',desc:'Clasificación del estado nutricional en adultos.',f:[['Peso','peso','n','kg'],['Estatura','altura','n','cm']],go:v=>{let n=v.peso/(v.altura/100)**2;return[n.toFixed(1),'kg/m²',n<18.5?'Bajo peso.':n<25?'Peso saludable.':n<30?'Sobrepeso.':'Obesidad.'];}},
 crcl:{cat:'renal',tag:'Renal',code:'CRCL',title:'Depuración de creatinina',desc:'Cockcroft–Gault para valoración y ajuste de medicamentos.',f:[['Edad','edad','n','años'],['Peso','peso','n','kg'],['Creatinina sérica','creat','n','mg/dL'],['Sexo','sexo','s',['Masculino','Femenino']]],go:v=>{let n=(140-v.edad)*v.peso/(72*v.creat);if(v.sexo==='Femenino')n*=.85;return[n.toFixed(1),'mL/min',n<30?'Reducción marcada de función renal.':n<60?'Función renal reducida.':'Función renal conservada.'];}},
 egfr:{cat:'renal',tag:'Renal',code:'CKD-EPI',title:'TFG estimada (CKD-EPI 2021)',desc:'Estimación de función renal para adultos.',f:[['Edad','edad','n','años'],['Creatinina sérica','creat','n','mg/dL'],['Sexo','sexo','s',['Masculino','Femenino']]],go:v=>{let k=v.sexo==='Femenino'?.7:.9,a=v.sexo==='Femenino'?-.241:-.302,s=v.sexo==='Femenino'?1.012:1,n=142*Math.min(v.creat/k,1)**a*Math.max(v.creat/k,1)**-1.2*.9938**v.edad*s;return[n.toFixed(0),'mL/min/1.73 m²',n<30?'TFG severamente disminuida.':n<60?'TFG disminuida.':'TFG estimada ≥60.'];}},
 map:{cat:'cardio',tag:'Cardiovascular',code:'PAM',title:'Presión arterial media',desc:'Estimación a partir de la presión sistólica y diastólica.',f:[['Presión sistólica','pas','n','mmHg'],['Presión diastólica','pad','n','mmHg']],go:v=>{let n=(+v.pas+2*v.pad)/3;return[n.toFixed(0),'mmHg',n<65?'PAM baja; valore perfusión y contexto.':'PAM ≥65 mmHg.'];}},
 shock:{cat:'urgencias',tag:'Urgencias',code:'SI',title:'Índice de choque',desc:'Relación frecuencia cardíaca / presión sistólica.',f:[['Frecuencia cardíaca','fc','n','lpm'],['Presión sistólica','pas','n','mmHg']],go:v=>{let n=v.fc/v.pas;return[n.toFixed(2),'',n>=.9?'Índice elevado; valore compromiso hemodinámico.':'Índice sin elevación habitual.'];}},
 qsofa:{cat:'urgencias',tag:'Urgencias',code:'qSOFA',title:'qSOFA',desc:'Cribado rápido ante sospecha de infección.',f:[['Frecuencia respiratoria ≥22','fr','s',['No','Sí']],['Estado mental alterado','mental','s',['No','Sí']],['Presión sistólica ≤100','pas','s',['No','Sí']]],go:v=>{let n=[v.fr,v.mental,v.pas].filter(x=>x==='Sí').length;return[n,'/ 3',n>=2?'Puntaje elevado: valore disfunción orgánica y escalamiento.':'Puntaje menor de 2.'];}},
 glasgow:{cat:'urgencias',tag:'Urgencias',code:'GCS',title:'Escala de Glasgow',desc:'Suma de respuesta ocular, verbal y motora.',f:[['Respuesta ocular','ocular','s',['4 — Espontánea','3 — A la voz','2 — Al dolor','1 — Ninguna']],['Respuesta verbal','verbal','s',['5 — Orientada','4 — Confusa','3 — Palabras','2 — Sonidos','1 — Ninguna']],['Respuesta motora','motora','s',['6 — Obedece órdenes','5 — Localiza dolor','4 — Retira al dolor','3 — Flexión anormal','2 — Extensión','1 — Ninguna']]],go:v=>{let n=+v.ocular[0]+ +v.verbal[0]+ +v.motora[0];return[n,'/ 15',n<=8?'Compromiso grave de conciencia.':n<=12?'Compromiso moderado de conciencia.':'Compromiso leve o sin alteración relevante.'];}},
 calcio:{cat:'metabolismo',tag:'Metabólico',code:'CA CORR.',title:'Calcio corregido',desc:'Corrección por albúmina.',f:[['Calcio total','calcio','n','mg/dL'],['Albúmina','albumina','n','g/dL']],go:v=>{let n=+v.calcio+.8*(4-v.albumina);return[n.toFixed(2),'mg/dL','Calcio corregido por albúmina.'];}},
 anion:{cat:'metabolismo',tag:'Metabólico',code:'AG',title:'Brecha aniónica',desc:'Sodio − (cloro + bicarbonato).',f:[['Sodio','na','n','mEq/L'],['Cloro','cl','n','mEq/L'],['Bicarbonato','hco3','n','mEq/L']],go:v=>{let n=v.na-v.cl-v.hco3;return[n.toFixed(0),'mEq/L',n>12?'Brecha elevada. Correlacione con estado ácido-base.':'Intervalo habitual sin elevación.'];}},
 osm:{cat:'metabolismo',tag:'Metabólico',code:'OSM',title:'Osmolaridad calculada',desc:'2 × Na + glucosa/18 + BUN/2.8.',f:[['Sodio','na','n','mEq/L'],['Glucosa','glu','n','mg/dL'],['BUN','bun','n','mg/dL']],go:v=>{let n=2*v.na+v.glu/18+v.bun/2.8;return[n.toFixed(0),'mOsm/kg','Osmolaridad sérica calculada.'];}},
 na:{cat:'metabolismo',tag:'Metabólico',code:'NA CORR.',title:'Sodio corregido por glucosa',desc:'Corrección de sodio en hiperglucemia.',f:[['Sodio medido','na','n','mEq/L'],['Glucosa','glu','n','mg/dL']],go:v=>{let n=+v.na+2.4*((v.glu-100)/100);return[n.toFixed(1),'mEq/L','Sodio corregido por hiperglucemia.'];}},
 bsa:{cat:'general',tag:'General',code:'SC',title:'Superficie corporal',desc:'Fórmula de Mosteller.',f:[['Peso','peso','n','kg'],['Estatura','altura','n','cm']],go:v=>{let n=Math.sqrt(v.peso*v.altura/3600);return[n.toFixed(2),'m²','Superficie corporal estimada.'];}},
 dosis:{cat:'general',tag:'General',code:'DOSIS',title:'Dosis por peso',desc:'Convierte una dosis por kilogramo en dosis total.',f:[['Peso','peso','n','kg'],['Dosis prescrita','dosis','n','mg/kg']],go:v=>{let n=v.peso*v.dosis;return[n.toFixed(1),'mg','Dosis total teórica. Compruebe la dosis máxima.'];}},
 cha:{cat:'cardio',tag:'Cardiovascular',code:'CHA₂DS₂-VASc',title:'CHA₂DS₂-VASc',desc:'Riesgo tromboembólico en fibrilación auricular.',f:[['Insuficiencia cardiaca','ic','s',['No','Sí']],['Hipertensión','hta','s',['No','Sí']],['Edad','edad','s',['<65','65–74','≥75']],['Diabetes','dm','s',['No','Sí']],['ACV/AIT/embolismo previo','acv','s',['No','Sí']],['Enfermedad vascular','vasc','s',['No','Sí']],['Sexo femenino','sexo','s',['No','Sí']]],go:v=>{let n=(v.ic==='Sí')+(v.hta==='Sí')+(v.edad==='≥75'?2:v.edad==='65–74'?1:0)+(v.dm==='Sí')+(v.acv==='Sí'?2:0)+(v.vasc==='Sí')+(v.sexo==='Sí');return[n,'puntos','Aplique las guías de anticoagulación vigentes.'];}}
};

const formulas={imc:'Peso (kg) / estatura (m)²',crcl:'(140 − edad) × peso / (72 × creatinina); × 0,85 para sexo femenino.',egfr:'142 × min(Scr/κ,1)^α × max(Scr/κ,1)^−1,200 × 0,9938^edad × 1,012 si femenino. κ: 0,7 femenino / 0,9 masculino; α: −0,241 / −0,302.',map:'(PAS + 2 × PAD) / 3',shock:'Frecuencia cardíaca / presión arterial sistólica',qsofa:'1 punto por cada criterio presente (0–3).',glasgow:'Respuesta ocular + verbal + motora (3–15).',calcio:'Calcio total + 0,8 × (4 − albúmina)',anion:'Na − (Cl + HCO₃), sin potasio.',osm:'2 × Na + glucosa/18 + BUN/2,8',na:'Na + 2,4 × (glucosa − 100) / 100',bsa:'√(peso × estatura / 3600)',dosis:'Peso × dosis prescrita en mg/kg por administración.',cha:'IC, HTA, diabetes, enfermedad vascular, edad 65–74 y sexo femenino: 1 punto; edad ≥75 y ACV/AIT/embolismo: 2 puntos.'};
const sources={egfr:['NIDDK · CKD-EPI 2021','https://www.niddk.nih.gov/research-funding/research-programs/kidney-clinical-research-epidemiology/laboratory/glomerular-filtration-rate-equations/adults'],qsofa:['Surviving Sepsis Campaign','https://www.sccm.org/survivingsepsiscampaign/guidelines-and-resources/surviving-sepsis-campaign-adult-guidelines'],glasgow:['Glasgow Coma Scale · valoración','https://www.glasgowcomascale.org/downloads/GCS-Assessment-Aid.pdf']};
const notes={crcl:'Estimación en adultos con creatinina estable. La selección del peso depende del contexto; no equivale a TFG normalizada. No confirma función renal normal.',egfr:'Solo adultos ≥18 años. Una medición aislada no diagnostica enfermedad renal crónica; interpretar junto con albuminuria, evolución y contexto.',qsofa:'No diagnostica ni descarta sepsis. No debe usarse como única herramienta de cribado.',glasgow:'Registra los componentes por separado. Con intubación, sedación u otros impedimentos, marca el componente no evaluable.',calcio:'Estimación con limitaciones; no sustituye al calcio ionizado, especialmente en enfermedad crítica o renal.',anion:'El intervalo depende del laboratorio y la albúmina; una cifra baja también requiere contexto.',na:'Coeficiente de Hillier (2,4). Aplicable a hiperglucemia ≥100 mg/dL; existen otras correcciones.',dosis:'Introduce una dosis ya prescrita por administración. No selecciona fármacos ni comprueba dosis máximas.',cha:'El sexo femenino es un modificador de riesgo. La decisión de anticoagulación depende de la guía y del contexto; algunas guías usan CHA₂DS₂-VA.',shock:'La interpretación depende de la edad, medicación y situación clínica.',imc:'Clasificación para adultos no gestantes. No interpreta composición corporal.',map:'Estimación; no establece por sí sola una perfusión adecuada.'};
calculators.qsofa.desc='Tres criterios clínicos ante sospecha de infección.';
calculators.qsofa.f[0][0]='Frecuencia respiratoria ≥22/min';
calculators.qsofa.f[2][0]='Presión sistólica ≤100 mmHg';
calculators.osm.title='Osmolalidad calculada';
calculators.crcl.go=v=>[((140-v.edad)*v.peso/(72*v.creat)*(v.sexo==='Femenino'?.85:1)).toFixed(1),'mL/min','Depuración estimada por Cockcroft–Gault.'];
calculators.anion.go=v=>[(v.na-v.cl-v.hco3).toFixed(0),'mEq/L','Brecha calculada sin potasio. Compare con el rango de su laboratorio.'];
calculators.glasgow.f.forEach(f=>f[3].push('NT — No evaluable'));
calculators.glasgow.go=v=>Object.values(v).some(x=>x.startsWith('NT'))?['NT','','No se calcula un total si algún componente no es evaluable.']: [Object.values(v).reduce((s,x)=>s+Number(x[0]),0),'/ 15','Ocular '+v.ocular[0]+' · Verbal '+v.verbal[0]+' · Motora '+v.motora[0]];

const REVIEW_DATE='2026-11-03';
Object.assign(sources,{
 imc:['CDC · IMC en adultos ≥20 años','https://www.cdc.gov/bmi/adult-calculator/index.html'],
 crcl:['Cockcroft y Gault · publicación original','https://doi.org/10.1159/000180580'],
 map:['American Heart Association · presión arterial','https://pmc.ncbi.nlm.nih.gov/articles/PMC11409525/'],
 shock:['Rady et al. · índice de choque','https://pubmed.ncbi.nlm.nih.gov/8092595/'],
 calcio:['Endotext · calcio y albúmina','https://www.ncbi.nlm.nih.gov/books/NBK279037/'],
 anion:['MSD Manual · equilibrio ácido-base','https://www.msdmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders'],
 osm:['NCBI · osmolalidad calculada','https://www.ncbi.nlm.nih.gov/sites/books/NBK589659/'],
 na:['Hillier et al. · sodio e hiperglucemia','https://pubmed.ncbi.nlm.nih.gov/10225241/'],
 bsa:['OpenStax · fórmula de Mosteller','https://openstax.org/books/pharmacology/pages/2-4-dosage-calculations'],
 dosis:['OpenStax · dosis por peso','https://openstax.org/books/pharmacology/pages/2-4-dosage-calculations'],
 cha:['ACC/AHA/ACCP/HRS · guía de FA 2023','https://www.jacc.org/doi/10.1016/j.jacc.2023.08.017']
});
Object.assign(notes,{
 imc:'Categorías CDC para personas ≥20 años, no gestantes. No usar estas categorías en niños o adolescentes. El IMC no mide directamente la grasa corporal.',
 map:'Aproximación habitual a frecuencia cardíaca normal. No equivale a una medición invasiva; una cifra aislada no demuestra perfusión adecuada.',
 shock:'Cociente FC/PAS en adultos. Un índice no elevado no descarta choque. Edad, embarazo y fármacos pueden modificar su interpretación.',
 osm:'Estimación total, no osmolalidad efectiva. Introduce nitrógeno ureico (BUN), no urea total. No incluye etanol u otros osmoles; no diagnostica por sí sola un estado hiperosmolar.',
 na:'Usa el coeficiente promedio de Hillier (2,4). No es universal: la relación no es lineal con hiperglucemia extrema. No calcula una pauta de corrección ni tratamiento.',
 bsa:'Superficie estimada por Mosteller. Confirma el método requerido por el protocolo antes de dosificar medicamentos.',
 dosis:'Conversión aritmética de una prescripción por administración, no de mg/kg/día. No calcula frecuencia, concentración, volumen, dosis máxima ni ajuste renal. Revisa el redondeo según el medicamento.',
 cha:'Puntuación CHA₂DS₂-VASc para adultos con fibrilación auricular. La edad se cuenta una sola vez. Sexo femenino aislado no indica anticoagulación. ESC 2024 utiliza CHA₂DS₂-VA; aplica la guía local y valora el riesgo hemorrágico.'
});
calculators.imc.desc='Índice de masa corporal y categorías CDC desde los 20 años.';
calculators.crcl.f[1][0]='Peso seleccionado para la ecuación';
calculators.dosis.f[1][0]='Dosis prescrita por administración';
calculators.dosis.go=v=>[Number((v.peso*v.dosis).toPrecision(10)).toString(),'mg por administración','Conversión aritmética; confirmar la prescripción.'];
calculators.map.go=v=>[((+v.pas+2*v.pad)/3).toFixed(1),'mmHg','Presión arterial media estimada.'];
calculators.shock.go=v=>[(v.fc/v.pas).toFixed(3),'','Índice de choque calculado (FC/PAS).'];
calculators.egfr.go=v=>{const female=v.sexo==='Femenino',k=female?.7:.9,a=female?-.241:-.302,n=142*Math.min(v.creat/k,1)**a*Math.max(v.creat/k,1)**-1.2*.9938**v.edad*(female?1.012:1);return[n.toFixed(1),'mL/min/1,73 m²','TFG estimada por CKD-EPI 2021, sin coeficiente racial.'];};
calculators.anion.go=v=>[(v.na-v.cl-v.hco3).toFixed(1),'mEq/L','Brecha calculada sin potasio. Compare con el rango de su laboratorio.'];
calculators.osm.go=v=>[(2*v.na+v.glu/18+v.bun/2.8).toFixed(1),'mOsm/kg','Osmolalidad sérica total calculada.'];
calculators.qsofa.go=v=>{const n=[v.fr,v.mental,v.pas].filter(x=>x==='Sí').length;return[n,'/ 3',n>=2?'Dos o más criterios: asociado a mayor riesgo de desenlaces adversos ante infección.':'Menos de dos criterios. Esto no excluye sepsis ni deterioro clínico.'];};
calculators.glasgow.f[0][3]=['4 — Espontánea','3 — Al sonido','2 — A la presión','1 — Ninguna','NT — No evaluable'];
calculators.glasgow.f[1][3]=['5 — Orientada','4 — Confusa','3 — Palabras','2 — Sonidos','1 — Ninguna','NT — No evaluable'];
calculators.glasgow.f[2][3]=['6 — Obedece órdenes','5 — Localiza','4 — Flexión normal / retira','3 — Flexión anormal','2 — Extensión','1 — Ninguna','NT — No evaluable'];
calculators.cha.f[0][0]='Insuficiencia cardíaca / disfunción ventricular';
calculators.cha.f[5][0]='Enfermedad vascular (IAM, EAP o placa aórtica)';
function bounds(id,key){
 const ranges={edad:[18,120],peso:[.1,500],altura:[20,260],creat:[.01,50],pas:[1,350],pad:[1,350],fc:[1,350],na:[50,250],cl:[20,250],hco3:[0,100],calcio:[.1,30],albumina:[.1,10],glu:[1,3000],bun:[0,500],dosis:[.000001,5000]};
 return id==='na'&&key==='glu'?[100,3000]:ranges[key]||[0,5000];
}
function validateValues(id,v){
 const c=calculators[id];if(!c)return 'Calculadora no disponible.';
 for(const [label,key,type,unit] of c.f){
  if(type==='s'){if(!unit.includes(v[key]))return 'Selecciona una opción en '+label+'.';continue;}
  if(v[key]===null||v[key]===undefined||String(v[key]).trim()===''||!Number.isFinite(Number(v[key])))return 'Completa '+label+' con un número válido.';
  const [min,max]=bounds(id,key);if(Number(v[key])<min||Number(v[key])>max)return label+': introduce un valor entre '+min+' y '+max+' '+unit+'. Comprueba las unidades.';
  if(key==='edad'&&!Number.isInteger(Number(v[key])))return 'Introduce la edad en años cumplidos.';
 }
 if(id==='map'&&Number(v.pad)>Number(v.pas))return 'La diastólica no puede superar la sistólica. Revisa los valores.';
 if(id==='calcio'&&+v.calcio+.8*(4-v.albumina)<=0)return 'La corrección produce un calcio no positivo. Revisa los valores y utiliza calcio ionizado.';
 return '';
}
function calculate(id,v){const error=validateValues(id,v);if(error)throw new Error(error);return calculators[id].go(v);}
