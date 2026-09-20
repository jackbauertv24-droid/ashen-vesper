import{LEVEL,platforms}from"./cloister-sim.js";
import * as run from"./run.js";
import { drawPortcullis } from "./portcullis.js";
import{IRON_SEXTON,DEATH_FADE,sextonFrame,sextonOffset}from"./iron-sexton.js";
import{loadHero,drawHero}from"./hero-render.js";
const canvas=document.querySelector("#game"),ctx=canvas.getContext("2d"),$=q=>document.querySelector(q);
const W=run.enter("cloister");
let heroArt=null;
let s=run.roomState(W),running=false,art={},atlas,last=0,acc=0,padPrevious={};const held=new Set,pulse={};
const keys={KeyA:"left",ArrowLeft:"left",KeyD:"right",ArrowRight:"right",Space:"jump",KeyW:"jump",ArrowUp:"jump",KeyS:"crouch",ArrowDown:"crouch",KeyJ:"attack",KeyX:"attack",KeyE:"interact"};
const load=path=>new Promise((ok,no)=>{const i=new Image;i.onload=()=>ok(i);i.onerror=()=>no(Error(path));i.src=path});

function start(){running=true;$("#start-overlay").classList.add("hidden");canvas.focus()}function reset(){s=run.restart(W,"cloister");held.clear();start()}$("#enter").onclick=start;$("#reset").onclick=reset;
addEventListener("keydown",e=>{if(document.activeElement!==canvas)return;const a=keys[e.code];if(a){e.preventDefault();held.add(a);if(!e.repeat&&!['left','right','crouch'].includes(a))pulse[a]=true}});addEventListener("keyup",e=>held.delete(keys[e.code]));addEventListener("blur",()=>held.clear());
for(const b of document.querySelectorAll("[data-control]")){b.onpointerdown=e=>{e.preventDefault();start();const a=b.dataset.control;held.add(a);if(!['left','right','crouch'].includes(a))pulse[a]=true;b.setPointerCapture(e.pointerId)};for(const n of["pointerup","pointercancel","lostpointercapture"])b.addEventListener(n,()=>held.delete(b.dataset.control))}
function input(){const i={left:held.has("left"),right:held.has("right"),crouch:held.has("crouch"),jump:!!pulse.jump,attack:!!pulse.attack,interact:!!pulse.interact},pad=[...(navigator.getGamepads?.()||[])].find(Boolean);if(pad){i.crouch||=pad.axes[1]>.5||pad.buttons[13]?.pressed;i.left||=pad.axes[0]<-.25||pad.buttons[14]?.pressed;i.right||=pad.axes[0]>.25||pad.buttons[15]?.pressed;for(const[a,n]of Object.entries({jump:0,attack:2,interact:1})){const down=!!pad.buttons[n]?.pressed;if(down&&!padPrevious[a])i[a]=true;padPrevious[a]=down}}return i}
// The lever sheet is 1024x512: two 512px cells, inactive then active, both
// pivoting on [256,464]. It was being sliced as two 1024px cells, so the off
// state squeezed the whole sheet (both levers) into one box and the on state
// sampled past the right edge and drew nothing.
const LEVER={cell:512,pivot:[256,464],scale:80/366};
function drawLever(){
  const S=LEVER.scale,D=LEVER.cell*S;
  ctx.drawImage(art.lever,s.leverOn?LEVER.cell:0,0,LEVER.cell,LEVER.cell,
    LEVEL.lever-LEVER.pivot[0]*S,600-LEVER.pivot[1]*S,D,D);
}
function platform(p){
  const H=p.h??150;ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,p.w,H);ctx.clip();for(let x=p.x;x<p.x+p.w;x+=240){ctx.drawImage(art.stone,x,p.y,240,80);for(let y=p.y+80;y<p.y+H;y+=80)ctx.drawImage(art.stone,0,180,art.stone.width,art.stone.height-180,x,y,240,80)}ctx.restore();
  ctx.save();ctx.beginPath();ctx.rect(p.x,p.y,p.w,60);ctx.clip();
  for(let x=p.x;x<p.x+p.w;x+=240)ctx.drawImage(art.capCenter,x,p.y-7.5,240,60);
  ctx.restore();
}

function enemy(){const e=s.enemy;const dying=e.hp<=0,fade=dying?1-e.deadFor/DEATH_FADE:1;if(fade<=0)return;const pose=dying?"hurt":sextonFrame(e,s.time),[col,row]=IRON_SEXTON.frames[pose],C=IRON_SEXTON.cell,S=IRON_SEXTON.scale,ax=IRON_SEXTON.anchor[0]-sextonOffset(pose);ctx.save();ctx.translate(e.x,e.y);ctx.scale(e.facing*IRON_SEXTON.sheetFacing,1);ctx.globalAlpha=dying?fade:(e.mode==='hurt'?.5:1);if(dying)ctx.translate(0,(1-fade)*10);ctx.drawImage(art.enemy,col*C,row*C,C,C,-ax*S,-IRON_SEXTON.anchor[1]*S,C*S,C*S);ctx.restore();if(dying)return;if(e.mode==='windup'){ctx.fillStyle="#ffcc77";ctx.font="28px Georgia";ctx.fillText("!",e.x-5,e.y-170)}ctx.fillStyle="#392832";ctx.fillRect(e.x-22,e.y-150,44,4);ctx.fillStyle="#d0a079";ctx.fillRect(e.x-22,e.y-150,44*e.hp/3,4)}
function draw(){if(!heroArt)return;ctx.fillStyle="#0b131b";ctx.fillRect(0,0,1280,720);const fog=ctx.createLinearGradient(0,0,0,720);fog.addColorStop(0,"#18242d");fog.addColorStop(1,"#081017");ctx.fillStyle=fog;ctx.fillRect(0,0,1280,720);ctx.save();ctx.translate(-s.camera*.18,0);ctx.globalAlpha=.42;for(let x=-40;x<5200;x+=320)ctx.drawImage(art.arch,119,41,786,945,x,90,430,520);ctx.restore();ctx.save();ctx.translate(-s.camera,0);for(const p of platforms)platform(p);drawLever();drawPortcullis(ctx,{x:LEVEL.gate,floorY:600,open:s.leverOn,grate:art.grate,stone:art.stone});if(!s.vialTaken)ctx.drawImage(art.vial,1868,520+Math.sin(s.time*3)*5,64,64);enemy();drawHero(ctx,s,heroArt);ctx.fillStyle="#d9bc82";ctx.font="17px Georgia";for(const[x,t]of[[180,"I · BROKEN ARCADE"],[1280,"II · VIAL LEDGE"],[2140,"III · LEVER COURT"],[3220,"IV · GATE WALK"]])ctx.fillText(t,x,220);ctx.fillText("E · PULL",LEVEL.lever-35,475);ctx.restore();$("#health").textContent="♥".repeat(s.hp)+"♡".repeat(5-s.hp);$("#progress").value=s.x/LEVEL.width*100;$("#notice").textContent=s.noticeTime?s.notice:"";$("#status").textContent=s.complete?"STAGE BLOCKOUT COMPLETE":s.x<1100?"BROKEN ARCADE":s.x<2100?"VIAL LEDGE":s.x<3000?"LEVER COURT":"GATE WALK"}
function tick(now){if(running){acc+=Math.min((now-last)/1000,.1);while(acc>=1/60){if(run.step(W,input(),1/60,{}))return;for(const k of Object.keys(pulse))delete pulse[k];acc-=1/60}}last=now;draw();requestAnimationFrame(tick)}
try{const paths=["art/contributions/08-ruined-cloister/v001/exports/cloister-arch-span-v001.png","art/contributions/world-02-ruined-cloister/v002/exports/platform-cap-center-v002.png","art/contributions/15-mechanisms/v001/exports/lever-v001.png","art/contributions/15-mechanisms/v003/exports/grate-v001.png","art/contributions/14-pickups-and-relics/v001/exports/healing-vial-v001.png","art/contributions/12-iron-sexton/v005/exports/iron-sexton-motion-v003.png","art/production/abbey/masonry-module-v001.png"];[art.arch,art.capCenter,art.lever,art.grate,art.vial,art.enemy,art.stone]=await Promise.all(paths.map(load));heroArt=await loadHero(load);window.cloister={ready:true,snapshot:()=>structuredClone(s)};requestAnimationFrame(tick)}catch(e){$("#notice").textContent="Stage art failed to load: "+e.message;console.error(e)}
