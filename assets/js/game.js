const canvas=document.querySelector("#world"),ctx=canvas.getContext("2d"),D=devicePixelRatio||1;let W,H;function resize(){W=Math.max(1,canvas.clientWidth);H=Math.max(1,canvas.clientHeight);canvas.width=W*D;canvas.height=H*D;ctx.setTransform(D,0,0,D,0,0)}addEventListener("resize",resize);resize();
const keys={};addEventListener("keydown",e=>{if(e.key.toLowerCase()==="i"){e.preventDefault();toggleInventory();return}keys[e.key.toLowerCase()]=true;if(e.code==="Space"){e.preventDefault();attack()};if(e.key==="p")togglePause()});addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
document.querySelectorAll("[data-key]").forEach(b=>{const k=b.dataset.key;b.addEventListener("pointerdown",()=>keys[k]=true);["pointerup","pointercancel","pointerleave"].forEach(x=>b.addEventListener(x,()=>keys[k]=false))});document.querySelector("[data-attack]").addEventListener("pointerdown",attack);
const playerSprite=new Image();playerSprite.src="./assets/player.svg";let playerMoving=false;let lastDir=1;let equippedItem=null;const quickbar=[null,null,null,null,null,null];let inventoryOpen=false;const inventory={slots:20,items:[{id:"potion",name:"Poção de vida",icon:"🧪",qty:3,max:10},{id:"wood",name:"Madeira",icon:"🪵",qty:5,max:99}]} ;let starterKitGranted=true;const player={x:0,y:0,r:15,hp:100,max:100,xp:0,next:100,level:1,gold:35,kills:0,speed:185,attackCd:0};let enemies=[],particles=[],paused=false,time=0,spawn=0,last=performance.now();
const world={w:2600,h:1800};player.x=world.w/2;player.y=world.h/2;

// Árvores decorativas: posições determinísticas para manter o mapa consistente.
const trees=[];
function normalizeTree(t){return {x:Number.isFinite(Number(t?.x))?Number(t.x):world.w/2,y:Number.isFinite(Number(t?.y))?Number(t.y):world.h/2,s:Number.isFinite(Number(t?.s))?Number(t.s):1,t:Number.isFinite(Number(t?.t))?Number(t.t):0,hp:Number.isFinite(Number(t?.hp))?Number(t.hp):3,maxHp:Number.isFinite(Number(t?.maxHp))?Number(t.maxHp):3,state:["standing","falling","fallen"].includes(t?.state)?t.state:"standing",fall:Number.isFinite(Number(t?.fall))?Number(t.fall):0,fallDir:Number(t?.fallDir)===-1?-1:1,drop:t?.drop&&Number.isFinite(Number(t.drop.x))&&Number.isFinite(Number(t.drop.y))?{x:Number(t.drop.x),y:Number(t.drop.y),qty:Math.max(1,Number(t.drop.qty)||1)}:null}}
let treeSeed=9127;
function rand(){treeSeed=(treeSeed*1664525+1013904223)>>>0;return treeSeed/4294967296}
for(let i=0;i<95;i++){
  let x=70+rand()*(world.w-140),y=70+rand()*(world.h-140);
  if(Math.hypot(x-player.x,y-player.y)<190){i--;continue}
  trees.push({x,y,s:0.8+rand()*0.65,t:i%3,hp:3,maxHp:3,state:"standing",fall:0,fallDir:rand()<.5?-1:1,drop:null});
}
function drawTree(t){
  const s=t.s;
  if(t.state==="fallen"){
    const a=t.fallDir>0?Math.PI/2:-Math.PI/2;
    ctx.save();ctx.translate(t.x,t.y+7*s);ctx.rotate(a);ctx.globalAlpha=.3;ctx.fillStyle="#132015";ctx.beginPath();ctx.ellipse(8*s,8*s,28*s,7*s,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
    ctx.fillStyle="#5a3b27";ctx.fillRect(-5*s,-30*s,10*s,58*s);ctx.fillStyle="#714a2c";ctx.fillRect(-3*s,-30*s,4*s,58*s);
    ctx.fillStyle=t.t===0?"#2f5b34":t.t===1?"#2a542f":"#35663a";ctx.beginPath();ctx.arc(0,-31*s,19*s,0,Math.PI*2);ctx.arc(-8*s,-20*s,14*s,0,Math.PI*2);ctx.fill();
    ctx.restore();return;
  }
  const a=t.state==="falling"?t.fallDir*(Math.PI/2)*t.fall:0;
  ctx.save();ctx.translate(t.x,t.y);ctx.rotate(a);
  ctx.globalAlpha=.38;ctx.fillStyle="#132015";ctx.beginPath();ctx.ellipse(0,18*s,24*s,9*s,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
  ctx.fillStyle=t.t===1?"#4b3525":"#5a3b27";ctx.fillRect(-5*s,4*s,10*s,23*s);
  ctx.fillStyle=t.t===1?"#69472d":"#714a2c";ctx.fillRect(-8*s,18*s,16*s,6*s);
  const greens=t.t===0?["#23482b","#2f5b34","#3c6d3b"]:t.t===1?["#1f4028","#2a542f","#3a6336"]:["#274c30","#35663a","#477744"];
  ctx.fillStyle=greens[0];ctx.beginPath();ctx.arc(-13*s,2*s,15*s,0,Math.PI*2);ctx.arc(11*s,1*s,17*s,0,Math.PI*2);ctx.arc(0,-12*s,20*s,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=greens[1];ctx.beginPath();ctx.arc(-8*s,-7*s,13*s,0,Math.PI*2);ctx.arc(9*s,-10*s,12*s,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=greens[2];ctx.beginPath();ctx.arc(-2*s,-17*s,8*s,0,Math.PI*2);ctx.fill();
  ctx.fillStyle="#6f8b45";ctx.globalAlpha=.45;ctx.beginPath();ctx.arc(-8*s,-12*s,4*s,0,Math.PI*2);ctx.arc(7*s,-6*s,3*s,0,Math.PI*2);ctx.fill();
  ctx.restore();
}
function enemy(){const a=Math.random()*Math.PI*2,d=480+Math.random()*420;let x=player.x+Math.cos(a)*d,y=player.y+Math.sin(a)*d;x=Math.max(35,Math.min(world.w-35,x));y=Math.max(35,Math.min(world.h-35,y));const tough=1+Math.min(2,Math.floor(player.level/3));enemies.push({x,y,r:13+Math.random()*4,hp:28*tough,max:28*tough,speed:42+Math.random()*25,damage:7*tough})}
function addItem(id,name,icon,qty,max=99){let item=inventory.items.find(x=>x.id===id);if(item)item.qty=Math.min(item.max||max,item.qty+qty);else if(inventory.items.length<inventory.slots)inventory.items.push({id,name,icon,qty,max});renderInventory();saveGame()}
function startTreeChop(t){if(!t||t.state!=="standing"||player.attackCd>0)return false;if(!equippedItem||!["woodenAxe","axe"].includes(equippedItem.id)){particles.push({x:player.x,y:player.y-35,t:.7,text:"EQUIPE UM MACHADO"});return false;}player.attackCd=.32;t.hp=Math.max(0,t.hp-1);particles.push({x:t.x,y:t.y-35*t.s,t:.5,text:"🪓 -1"});if(t.hp<=0){t.state="falling";t.fall=0;t.drop={x:t.x,y:t.y+8*t.s,qty:3+Math.floor(Math.random()*3)};particles.push({x:t.x,y:t.y-45*t.s,t:1,text:"🌳 ÁRVORE DERRUBADA"});}return true}
function attack(){if(paused||player.attackCd>0)return;
  // Árvores têm prioridade: se o jogador estiver perto de uma, o ataque sempre corta.
  let tree=null,treeDist=95;
  for(const t of trees){if(t.state!=="standing")continue;const d=Math.hypot(t.x-player.x,t.y+7*t.s-player.y);if(d<treeDist){treeDist=d;tree=t}}
  if(tree){startTreeChop(tree);return}
  // Ataque ofensivo ficará reservado para quando o sistema de combate voltar.
}
function treeBlocks(px,py){for(const t of trees){if(t.state!=="standing"&&t.state!=="falling")continue;const r=15*t.s;const dx=px-t.x,dy=py-(t.y+7*t.s);if(dx*dx+dy*dy<(player.r+r)*(player.r+r))return true}return false}function movePlayer(dx,dy){const nx=player.x+dx,ny=player.y+dy;if(!treeBlocks(nx,player.y))player.x=nx;if(!treeBlocks(player.x,ny))player.y=ny}function update(dt){if(paused)return;time+=dt;player.attackCd=Math.max(0,player.attackCd-dt);for(const t of trees){if(t.state==="falling"){t.fall=Math.min(1,t.fall+dt/.45);if(t.fall>=1)t.state="fallen"}}let dx=(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),dy=(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);playerMoving=!!(dx||dy);if(playerMoving){const n=Math.hypot(dx,dy);if(dx)lastDir=dx>0?1:-1;movePlayer(dx/n*player.speed*dt,dy/n*player.speed*dt)}player.x=Math.max(25,Math.min(world.w-25,player.x));player.y=Math.max(25,Math.min(world.h-25,player.y));for(let i=trees.length-1;i>=0;i--){const t=trees[i];if(t.state==="fallen"&&t.drop){const d=Math.hypot(player.x-t.drop.x,player.y-t.drop.y);if(d<30){const qty=t.drop.qty;addItem("wood","Madeira","🪵",qty,99);particles.push({x:t.drop.x,y:t.drop.y,t:1,text:"+"+qty+" MADEIRA"});t.drop=null}}}// Inimigos desativados temporariamente enquanto os sistemas de sobrevivência são desenvolvidos. enemies permanece vazio.if(player.xp>=player.next){player.xp-=player.next;player.level++;player.next=Math.floor(player.next*1.35);player.max+=15;player.hp=player.max;player.speed+=6;particles.push({x:player.x,y:player.y,t:1.3,text:"NÍVEL "+player.level+"!"})}particles.forEach(p=>p.t-=dt);particles=particles.filter(p=>p.t>0);if(player.hp<=0){player.hp=player.max*.5;player.gold=Math.max(0,player.gold-15);enemies=[];particles.push({x:player.x,y:player.y,t:1.5,text:"VOCÊ CAIU — RETORNOU"})}render()}
const grassTile=document.createElement("canvas");grassTile.width=96;grassTile.height=96;const g=grassTile.getContext("2d");g.fillStyle="#304b2d";g.fillRect(0,0,96,96);for(let i=0;i<170;i++){const x=(i*37)%96,y=(i*61)%96,h=2+(i%5),lean=((i*17)%7)-3;g.strokeStyle=i%5===0?"#45683a":i%3===0?"#385a32":"#294326";g.lineWidth=1;g.beginPath();g.moveTo(x,y);g.lineTo(x+lean,y-h);g.stroke()}for(let i=0;i<18;i++){const x=(i*53)%96,y=(i*29)%96;g.fillStyle=i%2?"#3d5f35":"#253e29";g.globalAlpha=.35;g.beginPath();g.arc(x,y,2+(i%3),0,Math.PI*2);g.fill()}g.globalAlpha=1;let grassPattern=null;function refreshGrassPattern(){grassPattern=ctx.createPattern(grassTile,"repeat")}refreshGrassPattern();function render(){ctx.clearRect(0,0,W,H);const safeX=Number.isFinite(player.x)?player.x:world.w/2,safeY=Number.isFinite(player.y)?player.y:world.h/2;player.x=safeX;player.y=safeY;const camX=Math.max(0,Math.min(world.w-W,safeX-W/2)),camY=Math.max(0,Math.min(world.h-H,safeY-H/2));ctx.save();ctx.translate(-camX,-camY);ctx.fillStyle=grassPattern||"#304b2d";ctx.fillRect(0,0,world.w,world.h);for(const t of trees)drawTree(t);for(const t of trees){if(t.state==="fallen"&&t.drop){ctx.font="18px Arial";ctx.textAlign="center";ctx.fillText("🪵",t.drop.x,t.drop.y-8);}}const bob=playerMoving?Math.sin(time*12)*1.5:0;ctx.save();ctx.imageSmoothingEnabled=false;if(playerSprite.complete&&playerSprite.naturalWidth>0)ctx.drawImage(playerSprite,Math.floor(player.x-24),Math.floor(player.y-32+bob),48,48);else{ctx.fillStyle="#d7b866";ctx.beginPath();ctx.arc(player.x,player.y,player.r+5,0,7);ctx.fill();ctx.fillStyle="#314a3a";ctx.beginPath();ctx.arc(player.x,player.y,player.r,0,7);ctx.fill()}drawHeldItem(bob);ctx.restore();ctx.restore();particles.forEach(p=>{const sx=p.x-camX,sy=p.y-camY-(1-p.t)*35;ctx.globalAlpha=Math.min(1,p.t*3);ctx.fillStyle="#e5c66f";ctx.font="bold 14px Arial";ctx.textAlign="center";ctx.fillText(p.text,sx,sy);ctx.globalAlpha=1});document.querySelector("#hp").style.width=Math.max(0,player.hp/player.max*100)+"%";document.querySelector("#xp").style.width=player.xp/player.next*100+"%";document.querySelector("#level").textContent="Lv."+player.level;document.querySelector("#gold").textContent=player.gold;document.querySelector("#kills").textContent=player.kills;document.querySelector("#enemyCount").textContent=enemies.length;document.querySelector("#timer").textContent=new Date(time*1000).toISOString().slice(14,19);document.querySelector("#zone").textContent=player.level>=5?"MINA ABANDONADA":player.level>=3?"RUÍNAS DE ELDOR":"FLORESTA SOMBRIA"}
function loop(now){const dt=Math.min(.033,(now-last)/1000);last=now;try{update(dt)}catch(e){console.error("Erro no loop do jogo:",e);renderSafe()}requestAnimationFrame(loop)}function renderSafe(){try{ctx.clearRect(0,0,W,H);ctx.fillStyle="#304b2d";ctx.fillRect(0,0,W,H);const x=Number.isFinite(player.x)?player.x:world.w/2,y=Number.isFinite(player.y)?player.y:world.h/2;ctx.fillStyle="#d7b866";ctx.beginPath();ctx.arc(x,y,20,0,Math.PI*2);ctx.fill()}catch(e){console.error("Falha crítica de renderização:",e)}}requestAnimationFrame(loop);
let inventoryTab="inventory";
const recipes=[
  {id:"torch",name:"Tocha",icon:"🔥",cost:[["wood",2]],output:{id:"torch",name:"Tocha",icon:"🔥",qty:1,max:20}},
  {id:"woodenPlank",name:"Tábua de madeira",icon:"🪵",cost:[["wood",3]],output:{id:"woodenPlank",name:"Tábua de madeira",icon:"🪵",qty:1,max:99}},
  {id:"woodenAxe",name:"Machado de madeira",icon:"🪓",cost:[["wood",5]],output:{id:"woodenAxe",name:"Machado de madeira",icon:"🪓",qty:1,max:1}}
];
function itemQty(id){const item=inventory.items.find(x=>x.id===id);return item?item.qty:0}
function hasMaterials(recipe){return recipe.cost.every(([id,qty])=>itemQty(id)>=qty)}
function craft(recipe){
  if(!hasMaterials(recipe))return;
  const existing=inventory.items.find(x=>x.id===recipe.output.id);
  if(existing&&(existing.qty+recipe.output.qty>(existing.max||99)))return;
  for(const [id,qty] of recipe.cost){const item=inventory.items.find(x=>x.id===id);item.qty-=qty;if(item.qty<=0)inventory.items.splice(inventory.items.indexOf(item),1)}
  addItem(recipe.output.id,recipe.output.name,recipe.output.icon,recipe.output.qty,recipe.output.max);
  document.querySelector("#itemInfo").textContent="Criado: "+recipe.output.name+".";
  renderCraft();
  saveGame();
}
function renderCraft(){
  const box=document.querySelector("#recipes");if(!box)return;box.innerHTML="";
  recipes.forEach(recipe=>{
    const row=document.createElement("div");row.className="recipe";
    const costText=recipe.cost.map(([id,q])=>q+"× "+(id==="wood"?"Madeira":id)).join(" · ");
    row.innerHTML='<span class="recipe-icon">'+recipe.icon+'</span><div class="recipe-main"><div class="recipe-name">'+recipe.name+'</div><div class="recipe-cost">'+costText+' · Você: '+recipe.cost.map(([id])=>itemQty(id)).join("/")+'</div></div>';
    const b=document.createElement("button");b.type="button";b.textContent="Criar";b.disabled=!hasMaterials(recipe);b.onclick=()=>craft(recipe);row.appendChild(b);box.appendChild(row);
  });
}
function switchInventoryTab(tab){
  inventoryTab=tab;
  const invGrid=document.querySelector("#inventoryGrid"),info=document.querySelector("#itemInfo"),craftPanel=document.querySelector("#craftPanel");
  const invTab=document.querySelector("#inventoryTab"),craftTab=document.querySelector("#craftTab");
  const showInv=tab==="inventory";
  invGrid.classList.toggle("hidden",!showInv);info.classList.toggle("hidden",!showInv);craftPanel.classList.toggle("hidden",showInv);
  invTab.classList.toggle("active",showInv);craftTab.classList.toggle("active",!showInv);
  invTab.setAttribute("aria-selected",showInv);craftTab.setAttribute("aria-selected",!showInv);
  if(!showInv)renderCraft();
}
function drawHeldItem(bob=0){
  if(!equippedItem)return;
  const x=player.x+lastDir*20,y=player.y+bob-1;
  ctx.save();ctx.translate(x,y);ctx.scale(lastDir,1);
  if(equippedItem.id==="axe"||equippedItem.id==="woodenAxe"){
    ctx.strokeStyle="#6b4328";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-2,9);ctx.lineTo(10,-9);ctx.stroke();
    ctx.fillStyle="#bfc5bd";ctx.beginPath();ctx.moveTo(7,-12);ctx.lineTo(18,-9);ctx.lineTo(12,-2);ctx.lineTo(5,-5);ctx.closePath();ctx.fill();
  }else if(equippedItem.id==="torch"){
    ctx.strokeStyle="#75482c";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(8,-7);ctx.stroke();
    ctx.fillStyle="#d87932";ctx.beginPath();ctx.moveTo(8,-8);ctx.quadraticCurveTo(3,-15,9,-20);ctx.quadraticCurveTo(15,-14,11,-7);ctx.closePath();ctx.fill();
    ctx.fillStyle="#f4d36b";ctx.beginPath();ctx.arc(9,-12,3,0,Math.PI*2);ctx.fill();
  }else{
    ctx.font="20px Arial";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(equippedItem.icon||"•",8,0);
  }
  ctx.restore();
}
function equipItem(item,index=null){
  if(!item)return;
  equippedItem=item;
  if(index!==null)quickbar[index]=item.id;
  else{
    const existing=quickbar.indexOf(item.id);
    if(existing<0){const empty=quickbar.indexOf(null);if(empty>=0)quickbar[empty]=item.id;}
  }
  renderQuickbar();saveGame();
}
function renderQuickbar(){
  const box=document.querySelector("#quickbar");if(!box)return;box.innerHTML="";
  quickbar.forEach((id,i)=>{
    const item=id?inventory.items.find(x=>x.id===id):null;
    const b=document.createElement("button");b.type="button";b.className="quick-slot"+(item?" filled":" empty")+(equippedItem&&item&&equippedItem.id===item.id?" active":"");
    b.innerHTML=item?'<span class="quick-key">'+(i+1)+'</span><span class="quick-icon">'+item.icon+'</span><span class="quick-qty">'+item.qty+'</span>':'<span class="quick-key">'+(i+1)+'</span><span class="quick-empty">＋</span>';
    b.title=item?"Equipar "+item.name:"Slot vazio";
    b.onclick=()=>item&&equipItem(item,i);
    box.appendChild(b);
  });
}
function updateQuickbarItems(){for(let i=0;i<quickbar.length;i++){if(quickbar[i]&&!inventory.items.some(x=>x.id===quickbar[i]))quickbar[i]=null;}renderQuickbar();}
addEventListener("keydown",e=>{const n=Number(e.key);if(n>=1&&n<=6){const id=quickbar[n-1];const item=id&&inventory.items.find(x=>x.id===id);if(item){e.preventDefault();equipItem(item,n-1)}}});
function renderInventory(){const grid=document.querySelector("#inventoryGrid");grid.innerHTML="";for(let i=0;i<inventory.slots;i++){const item=inventory.items[i];const b=document.createElement("button");b.className="slot"+(item?" filled":"");b.innerHTML=item?'<span class="item-icon">'+item.icon+'</span><small>'+item.qty+'</small>':"";if(item)b.title=item.name+" — clique para usar/equipar";b.onclick=()=>{if(!item)return;if(item.id!=="potion"){equipItem(item);document.querySelector("#itemInfo").textContent="Equipado: "+item.name+".";return}if(item.id==="potion"&&player.hp<player.max){player.hp=Math.min(player.max,player.hp+35);item.qty--;if(item.qty<=0)inventory.items.splice(i,1);renderInventory();document.querySelector("#itemInfo").textContent="Poção usada: +35 de vida.";saveGame() }else if(item.id==="potion")document.querySelector("#itemInfo").textContent="Sua vida já está cheia."};grid.appendChild(b)}document.querySelector("#inventoryCount").textContent=inventory.items.reduce((a,x)=>a+x.qty,0)+" / 20";updateQuickbarItems();}function toggleInventory(){inventoryOpen=!inventoryOpen;document.querySelector("#inventory").classList.toggle("hidden",!inventoryOpen);if(inventoryOpen){paused=true;inventoryTab="inventory";switchInventoryTab("inventory");renderInventory()}else paused=false}document.querySelector("#inventoryBtn").onclick=toggleInventory;document.querySelector("#inventoryTab").onclick=()=>switchInventoryTab("inventory");document.querySelector("#craftTab").onclick=()=>switchInventoryTab("craft");document.querySelector("#closeInventory").onclick=toggleInventory;function saveGame(){localStorage.setItem("minegame-topdown",JSON.stringify({player,inventory:inventory.items,trees,quickbar,equippedItem:equippedItem?equippedItem.id:null,starterKitGranted}))}function togglePause(){paused=!paused;document.querySelector("#paused").classList.toggle("hidden",!paused)}document.querySelector("#pause").onclick=togglePause;document.querySelector("#resume").onclick=togglePause;document.querySelector("#save").onclick=()=>{saveGame();document.querySelector("#save").textContent="Progresso salvo ✓";setTimeout(()=>document.querySelector("#save").textContent="Salvar progresso",1500)};try{const s=JSON.parse(localStorage.getItem("minegame-topdown"));if(s){Object.assign(player,s.player||s);player.x=Number.isFinite(Number(player.x))?Number(player.x):world.w/2;player.y=Number.isFinite(Number(player.y))?Number(player.y):world.h/2;player.hp=Number.isFinite(Number(player.hp))?Number(player.hp):100;player.max=Number.isFinite(Number(player.max))?Number(player.max):100;if(Array.isArray(s.inventory))inventory.items=s.inventory.filter(x=>x&&x.id).map(x=>({...x,qty:Math.max(0,Number(x.qty)||0)})).filter(x=>x.qty>0);if(Array.isArray(s.quickbar))for(let i=0;i<quickbar.length;i++)quickbar[i]=s.quickbar[i]||null;if(s.equippedItem)equippedItem=inventory.items.find(x=>x.id===s.equippedItem)||null;if(Array.isArray(s.trees)){trees.length=0;trees.push(...s.trees.map(normalizeTree))}starterKitGranted=s.starterKitGranted===true;if(!starterKitGranted&&!inventory.items.some(x=>x.id==="woodenAxe"||x.id==="axe")){inventory.items.push({id:"wood",name:"Madeira",icon:"🪵",qty:5,max:99});starterKitGranted=true;saveGame()}}}catch(e){console.warn("Save antigo/corrompido ignorado:",e)}
renderInventory();renderQuickbar();
