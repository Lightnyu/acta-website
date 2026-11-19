/* ACTA — standalone frontend behaviour.
   Original hosted ACTA authentication/waitlist APIs are not duplicated here.
   Example workspace edits are fictional and local to this browser tab. */
(function(){
"use strict";
const SOURCE="https://ikhnaie.anatoliim.chatgpt.site";
const page=document.body.dataset.page;
const $=(s,scope=document)=>scope.querySelector(s);
const $$=(s,scope=document)=>Array.from(scope.querySelectorAll(s));
const safe=(s)=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function formatDate(str){
 const d=new Date(str+"T12:00:00");return Number.isNaN(d.getTime())?"":d.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"});
}
function today(){return new Date().toISOString().slice(0,10)}
const overlay=document.createElement("div");
overlay.className="acta-modal";overlay.hidden=true;
overlay.innerHTML='<div class="acta-modal-card" role="dialog" aria-modal="true" aria-labelledby="acta-modal-title"><h2 id="acta-modal-title"></h2><div class="acta-modal-body"></div><div class="acta-modal-actions"></div></div>';
document.body.appendChild(overlay);
const modalCard=$(".acta-modal-card",overlay);
let lastFocus=null;
function closeModal(){overlay.hidden=true;document.body.style.overflow="";lastFocus?.focus?.()}
function showModal(title,body,actions){
 lastFocus=document.activeElement;$("#acta-modal-title",overlay).textContent=title;
 $(".acta-modal-body",overlay).innerHTML=body;
 const row=$(".acta-modal-actions",overlay);row.innerHTML="";
 for(const a of actions||[{text:"Close",onClick:closeModal}]){
  const el=document.createElement(a.href?"a":"button");
  if(a.href){el.href=a.href;el.className="acta-modal-link"}else{el.type="button"}
  el.textContent=a.text;
  if(a.primary)el.classList.add("primary");
  if(a.onClick)el.addEventListener("click",a.onClick);
  row.appendChild(el);
 }
 overlay.hidden=false;document.body.style.overflow="hidden";
 const f=overlay.querySelector("input,textarea,button,a");f?.focus();
}
overlay.addEventListener("click",e=>{if(e.target===overlay)closeModal()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)closeModal()});

if("IntersectionObserver" in window){
 const reveal=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-revealed");reveal.unobserve(entry.target)}});
 },{rootMargin:"0px 0px -20px 0px",threshold:.03});
 $$(".reveal-target").forEach(el=>reveal.observe(el));
}else $$(".reveal-target").forEach(el=>el.classList.add("is-revealed"));

if(page==="home"){
 const release=new Date("2026-12-19T12:00:00Z").getTime();
 const fields=$$(".launch-clock-values strong"),box=$(".launch-clock-values");
 function tick(){
  const left=Math.max(0,release-Date.now());
  const days=Math.floor(left/86400000),hours=Math.floor(left%86400000/3600000),minutes=Math.floor(left%3600000/60000),seconds=Math.floor(left%60000/1000);
  [days,hours,minutes,seconds].forEach((v,i)=>{if(fields[i])fields[i].textContent=String(v).padStart(2,"0")});
  box?.setAttribute("aria-label",left>0?"Time until launch: "+days+" days and "+hours+" hours":"Launch countdown completed");
  const p=$(".launch-clock>p");if(p)p.textContent=left>0?"Public launch · 19 December 2026":"Launch date reached";
 }
 tick();setInterval(tick,1000);
 const form=$("[data-waitlist-form]");
 form?.addEventListener("submit",e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  showModal("Join the LIGHTNYU waitlist",'<p>Registration is handled by the original hosted service. This GitHub Pages version does not collect or transmit your email.</p><p>Continue to the live site to register for launch updates and the advertised offer.</p>',[
   {text:"Cancel",onClick:closeModal},{text:"Open registration",primary:true,href:SOURCE+"/#register-interest"}
  ]);
 });
 const topNav=$$(".launch-navigation a[href^='#']");
 const ids=topNav.map(x=>x.hash.slice(1));
 const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
 if("IntersectionObserver" in window&&sections.length){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{if(!entry.isIntersecting)return;topNav.forEach(a=>{const yes=a.hash.slice(1)===entry.target.id;a.classList.toggle("is-active",yes);if(yes)a.setAttribute("aria-current","page");else a.removeAttribute("aria-current")})});
  },{rootMargin:"-10% 0px -65% 0px"});
  sections.forEach(s=>observer.observe(s));
 }
}
if(page==="login"){
 const signIn=$('a[href^="/signin-with-chatgpt"]');
 if(signIn){signIn.href=SOURCE+"/login";signIn.setAttribute("aria-label","Continue to the existing secure sign-in service")}
 const panel=$("h1")?.closest("section")||$("main");
 if(panel){const p=document.createElement("p");p.className="acta-static-notice";p.textContent="Secure sign-in is handled by the original hosted service. This GitHub version does not have its own authentication backend.";panel.appendChild(p)}
}

if(page==="demo"){
 const list=$(".process-list"),detail=$(".process-detail"),workspace=$(".journey-workspace");
 if(!list||!detail)return;
 const sentTemplate=$(".simple-entry.sent",detail)?.cloneNode(true);
 const receivedTemplate=$(".simple-entry.received",detail)?.cloneNode(true)||sentTemplate?.cloneNode(true);
 const snapshot={
  id:"LNY-1004",title:"Kitchen repair follow-up",party:"Northfield Housing",status:"Action required",notes:"Keep the repair request, replies and supporting evidence together. This is a fictional example case.",
  entries:[
   {direction:"Sent",type:"Letter",title:"Initial repair request",date:"2026-11-07",via:"Royal Mail Signed For",reference:"SAMPLE REFERENCE",delivery:"Delivered",notes:"Requested a repair appointment and included photographs of the affected area. Sample correspondence.",file:true},
   {direction:"Received",type:"Email",title:"Repair team response",date:"2026-11-18",via:"Email",reference:"",delivery:"",notes:"The repairs team has offered an appointment. Review the proposed date and confirm availability. Sample correspondence.",file:false}
  ]
 };
 const defaults=[
  snapshot,
  {id:"LNY-1003",title:"Incorrect final energy bill",party:"Evergreen Energy",status:"Waiting for reply",notes:"Keep the billing dispute and supporting evidence together.",entries:[{direction:"Sent",type:"Letter",title:"Final bill dispute",date:"2026-11-10",via:"Royal Mail Signed For",reference:"BILL-EXAMPLE",delivery:"Delivered",notes:"Requested a corrected closing account and an explanation of the final charges."}]},
  {id:"LNY-1002",title:"Contents insurance claim",party:"Cedar Insurance",status:"Open",notes:"Record claim documents and any responses from the insurer.",entries:[{direction:"Sent",type:"Email",title:"Claim notification",date:"2026-11-12",via:"Email",reference:"CLAIM-EXAMPLE",delivery:"",notes:"Opened an example claim for household contents."}]},
  {id:"LNY-1001",title:"Council tax address update",party:"Westborough Council",status:"Waiting for reply",notes:"Monitor the council tax address update and confirmation.",entries:[{direction:"Sent",type:"Letter",title:"Address change notice",date:"2026-11-13",via:"Royal Mail",reference:"",delivery:"",notes:"Asked the council to update the recorded correspondence address."}]}
 ];
 let records;try{records=JSON.parse(sessionStorage.getItem("acta-example-processes")||"null")||defaults}catch{records=defaults}
 if(!Array.isArray(records)||!records.length)records=defaults;
 let selected=records[0]?.id||null;
 const statuses={"Open":"open","Waiting for reply":"waiting","Action required":"action","Closed":"closed"};
 const statusClass=s=>"status-"+(statuses[s]||"open");
 function persist(){try{sessionStorage.setItem("acta-example-processes",JSON.stringify(records))}catch{}}
 function record(){return records.find(r=>r.id===selected)}
 function renderList(){
  list.innerHTML=records.map(r=>'<button class="process-item '+(r.id===selected?'selected':'')+'" aria-pressed="'+(r.id===selected)+'" data-process="'+safe(r.id)+'"><div class="process-item-top"><strong>'+safe(r.title)+'</strong><span class="status '+statusClass(r.status)+'"><i></i>'+safe(r.status)+'</span></div><span class="process-counterparty">'+safe(r.party)+'</span><small>Ref: '+safe(r.id)+'</small><span class="process-item-meta">'+r.entries.length+' '+(r.entries.length===1?'item':'items')+' · example</span></button>').join("");
  const stats=$$(".journey-stats strong");if(stats.length>=3){stats[0].textContent=records.filter(r=>r.status!=="Closed").length;stats[1].textContent=records.filter(r=>r.status==="Waiting for reply").length;stats[2].textContent=records.reduce((n,r)=>n+r.entries.length,0)}
  const count=$(".process-count");if(count)count.textContent=records.length;
 }
 function entryNode(entry,i){
  const src=(entry.direction==="Received"?receivedTemplate:sentTemplate)||document.createElement("article");
  const n=src.cloneNode(true);
  n.className="simple-entry "+(entry.direction==="Received"?"received":"sent")+" is-revealed";
  n.dataset.entryIndex=String(i);n.id="entry-local-"+i;
  const dir=$(".entry-direction",n);if(dir){dir.textContent=entry.direction;dir.className="entry-direction "+(entry.direction==="Received"?"received":"sent")}
  const type=$(".entry-head strong",n);if(type)type.textContent=entry.type||"Letter";
  const subject=$(".entry-subject",n);if(subject)subject.textContent=entry.title;
  const time=$(".entry-head time",n);if(time){time.textContent=formatDate(entry.date);time.setAttribute("datetime",entry.date)}
  const dl=$(".entry-facts",n);
  if(dl){dl.innerHTML=('<div><dt>'+(entry.direction==="Received"?"Received":"Sent")+' via</dt><dd>'+safe(entry.via||"Not specified")+'</dd></div>')+
   (entry.reference?'<div><dt>Reference</dt><dd>'+safe(entry.reference)+'</dd></div>':"")+
   (entry.delivery?'<div><dt>Delivery</dt><dd class="delivered">'+safe(entry.delivery)+'</dd></div>':"")+
   '<div><dt>'+(entry.direction==="Received"?"Received":"Sent")+'</dt><dd>'+formatDate(entry.date)+'</dd></div>'}
  const notes=$(".entry-notes",n);if(notes)notes.textContent=entry.notes||"";
  if(!entry.file)$(".entry-files",n)?.remove();
  if(entry.direction==="Received")$(".delivery-actions",n)?.remove();
  const del=$(".delete-entry",n);if(del)del.setAttribute("aria-label","Delete correspondence: "+entry.title);
  return n;
 }
 function renderDetail(){
  const r=record();
  if(!r){detail.hidden=true;return}
  detail.hidden=false;
  const title=$(".process-detail-head h2",detail);if(title)title.textContent=r.title;
  const subtitle=$(".process-detail-head p:not(.eyebrow)",detail);if(subtitle)subtitle.textContent=r.party+" · Ref: "+r.id;
  const select=$(".process-status-form select",detail);if(select)select.value=r.status;
  const note=$(".process-notes-label",detail);if(note)note.textContent=r.notes||"No notes yet.";
  const noteBody=$(".process-notes>div>p",detail);if(noteBody)noteBody.textContent=r.notes||"No notes yet.";
  const noteDate=$(".process-notes>div>p:nth-of-type(2)",detail);if(noteDate)noteDate.hidden=true;
  const task=$(".process-notes .simple-task",detail);if(task)task.hidden=r.id!=="LNY-1004";
  const timeline=$(".simple-timeline",detail);
  if(timeline){timeline.innerHTML="";r.entries.forEach((entry,i)=>timeline.appendChild(entryNode(entry,i)))}
  const count=$(".timeline-heading span",detail);if(count)count.textContent=r.entries.length+" "+(r.entries.length===1?"item":"items")+" · oldest first";
 }
 function render(){if(selected&&!record())selected=records[0]?.id||null;renderList();renderDetail();persist()}
 function field(name,label,value="",type="text",required=false){
  const tag=type==="textarea"?'<textarea name="'+name+'" '+(required?'required':'')+'>'+safe(value)+'</textarea>':
    type==="select"?'<select name="'+name+'">'+(value||[]).map(v=>'<option>'+safe(v)+'</option>').join("")+'</select>':
    '<input name="'+name+'" type="'+type+'" value="'+safe(value)+'" '+(required?'required':'')+' '+(type==="text"?'maxlength="180"':'')+'>';
  return '<label>'+safe(label)+'</label>'+tag;
 }
 function formDataFromModal(){const f=$("form",overlay);if(!f||!f.reportValidity())return null;return Object.fromEntries(new FormData(f))}
 function editProcess(isNew=false){
  const r=isNew?{title:"",party:"",notes:"",status:"Open"}:record();
  if(!r)return;
  const body='<form id="acta-edit-process">'+field("title","Process title",r.title,"text",true)+field("party","Organisation or person",r.party,"text",true)+field("notes","Notes",r.notes,"textarea")+'</form>'+
   '<p class="acta-preview-alert">Example workspace — changes only last for this browser tab.</p>';
  showModal(isNew?"Create an example process":"Edit process",body,[
   {text:"Cancel",onClick:closeModal},{text:isNew?"Create process":"Save changes",primary:true,onClick:()=>{
    const v=formDataFromModal();if(!v)return;
    if(isNew){const id="LNY-"+(Date.now()%100000);records.unshift({id,title:v.title.trim(),party:v.party.trim(),notes:v.notes.trim(),status:"Open",entries:[]});selected=id}
    else{Object.assign(r,{title:v.title.trim(),party:v.party.trim(),notes:v.notes.trim()})}
    render();closeModal()
   }}
  ]);
 }
 function entryForm({reply=false,editIndex=null}={}){
  const r=record();if(!r)return;
  const editing=editIndex!==null,old=editing?r.entries[editIndex]:null;
  const direction=old?.direction||(reply?"Received":"Sent");
  const fields='<form id="acta-edit-entry">'+field("subject","Subject",old?.title||"","text",true)+
    '<label>Direction</label><select name="direction">'+["Sent","Received"].map(x=>'<option '+(x===direction?'selected':'')+'>'+x+'</option>').join("")+'</select>'+
    field("type","Document type",old?.type||"Letter","text",true)+field("date","Date",old?.date||today(),"date",true)+field("via","Sent / received via",old?.via||"Email","text")+
    field("reference","Tracking or reference",old?.reference||"","text")+
    '<label>Delivery outcome</label><select name="delivery">'+["","In transit","Delivered","Returned","Partially returned"].map(x=>'<option '+(x===(old?.delivery||"")?'selected':'')+' value="'+safe(x)+'">'+safe(x||"Not recorded")+'</option>').join("")+'</select>'+
    field("notes","Description / evidence notes",old?.notes||"","textarea")+'</form><p class="acta-preview-alert">Example only — no documents will be uploaded or sent.</p>';
  showModal(editing?"Edit correspondence":reply?"Add a reply":"Add correspondence",fields,[
   {text:"Cancel",onClick:closeModal},{text:editing?"Save changes":"Add correspondence",primary:true,onClick:()=>{
    const v=formDataFromModal();if(!v)return;
    const entry={direction:v.direction,type:v.type.trim(),title:v.subject.trim(),date:v.date,via:v.via.trim(),reference:v.reference.trim(),delivery:v.delivery,notes:v.notes.trim(),file:false};
    if(editing)r.entries[editIndex]=entry;else r.entries.push(entry);
    render();closeModal()
   }}
  ]);
 }
 function showOrganisations(){
  const names=[...new Set(records.map(r=>r.party).filter(Boolean))];
  showModal("Example organisations",'<p>Organisations linked to the example processes.</p><div class="acta-editor-list">'+names.map(n=>'<button type="button" data-organisation="'+safe(n)+'">'+safe(n)+'</button>').join("")+'</div>',[{text:"Close",onClick:closeModal}]);
  $$(".acta-editor-list button",overlay).forEach(b=>b.addEventListener("click",()=>{
   const r=records.find(x=>x.party===b.dataset.organisation);if(r){selected=r.id;render();closeModal()}
  }));
 }
 list.addEventListener("click",e=>{const b=e.target.closest("[data-process]");if(!b)return;selected=b.dataset.process;render();workspace?.classList.remove("mobile-list");workspace?.classList.add("mobile-detail")});
 detail.addEventListener("submit",e=>{if(e.target.matches(".process-status-form")){e.preventDefault();const r=record();if(r){r.status=$(".process-status-form select").value;render()}}});
 document.addEventListener("click",e=>{
  const button=e.target.closest("button");if(!button)return;
  if(button.closest(".acta-modal"))return;
  const txt=button.textContent.replace(/\s+/g," ").trim();
  if(button.closest(".hero-tools")&&txt==="New process"){editProcess(true);return}
  if(button.closest(".hero-tools nav")&&txt==="Organisations"){showOrganisations();return}
  if(button.closest(".hero-tools nav")&&txt==="Processes"){selected=records[0]?.id||null;render();return}
  if(button.closest(".workspace-note")&&txt.includes("Sign in")){location.href=SOURCE+"/login";return}
  if(button.getAttribute("aria-label")==="Find or filter processes"){
   if($("#acta-process-filter")){$("#acta-process-filter").remove();$$(".process-item",list).forEach(x=>x.hidden=false)}
   else{const f=document.createElement("input");f.id="acta-process-filter";f.type="search";f.placeholder="Find a process…";f.style.cssText="width:100%;padding:10px;border:1px solid #aec0d4;margin-bottom:12px";list.parentElement.insertBefore(f,list);f.addEventListener("input",()=>{$$(".process-item",list).forEach(x=>x.hidden=!x.textContent.toLowerCase().includes(f.value.toLowerCase()))});f.focus()}
   return
  }
  if(button.classList.contains("back-to-list")){workspace?.classList.add("mobile-list");workspace?.classList.remove("mobile-detail");return}
  if(!button.closest(".process-detail"))return;
  if(txt==="Add correspondence"){entryForm();return}
  if(button.classList.contains("process-delete-button")){
   showModal("Delete this example process?",'<p>The process and all its example correspondence will be removed from this tab.</p>',[
    {text:"Cancel",onClick:closeModal},{text:"Delete process",primary:true,onClick:()=>{records=records.filter(r=>r.id!==selected);selected=records[0]?.id||null;render();closeModal()}}
   ]);return;
  }
  if(button.getAttribute("aria-label")==="More process options"){editProcess(false);return}
  if(txt.includes("Edit notes")){editProcess(false);return}
  const card=button.closest(".simple-entry");if(!card)return;
  const index=Number(card.dataset.entryIndex),r=record(),entry=r?.entries[index];if(!entry)return;
  if(txt==="Delivered"||txt==="Returned"||txt==="Partially returned"){entry.delivery=txt;render();return}
  if(txt.includes("Edit / update evidence")){entryForm({editIndex:index});return}
  if(txt==="Add reply"){entryForm({reply:true});return}
  if(button.classList.contains("delete-entry")){
   showModal("Delete example correspondence?",'<p>Remove “'+safe(entry.title)+'” from this process?</p>',[
    {text:"Cancel",onClick:closeModal},{text:"Delete",primary:true,onClick:()=>{r.entries.splice(index,1);render();closeModal()}}
   ]);return;
  }
  if(button.classList.contains("evidence-file")){
   showModal("Example notice",'<p><strong>'+safe(entry.title)+'</strong></p><p>'+safe(entry.notes||"Fictional sample document")+'</p><p>This is a fictional record. The original demo does not provide a downloadable source document here.</p>',[{text:"Close",onClick:closeModal}]);
  }
 });
 render();
}
})();
