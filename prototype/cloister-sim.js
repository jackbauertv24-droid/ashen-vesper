export const VIEW={width:1280,height:720};
export const LEVEL={width:4200,height:720,gate:2740,lever:2300};
export const platforms=[
  {x:0,y:600,w:900},{x:1010,y:600,w:1050},{x:2170,y:600,w:900},{x:3190,y:600,w:1010},
  {x:1270,y:505,w:260,h:95},{x:1530,y:430,w:300,h:170},{x:3340,y:505,w:250,h:95},
];
export const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
export const bodyBox=s=>({x:s.x-13,y:s.y-(s.crouching?84:120),w:26,h:s.crouching?84:120});
export function create(){return{
  x:160,y:600,vx:0,vy:0,grounded:true,facing:1,crouching:false,attackCrouched:false,attack:0,attackId:0,walk:0,
  hp:5,invulnerable:0,camera:0,time:0,leverOn:false,vialTaken:false,complete:false,deaths:0,
  enemy:{x:760,y:600,hp:3,home:760,facing:-1,lastHit:-1,mode:"patrol",timer:0},
  notice:"Cross the cloister and inspect its mechanisms.",noticeTime:6,events:[],
};}
function message(s,text){s.notice=text;s.noticeTime=4;}
function respawn(s){s.x=160;s.y=600;s.vx=s.vy=0;s.grounded=true;s.hp=5;s.invulnerable=1;s.deaths++;message(s,"Returned to the Cloister entrance. The lever and vial state are preserved.");}
function damage(s){if(s.invulnerable>0)return;s.hp--;s.invulnerable=1.1;s.events.push("hurt");message(s,"The Sexton struck. Watch its windup and step away.");if(s.hp<=0)respawn(s);}
export function step(s,input={},dt=1/60){
  dt=Math.min(Math.max(dt,0),1/30);s.events=[];s.time+=dt;s.noticeTime=Math.max(0,s.noticeTime-dt);s.invulnerable=Math.max(0,s.invulnerable-dt);
  const dir=Number(!!input.right)-Number(!!input.left);s.crouching=s.grounded&&(!!input.crouch||(s.attack>0&&s.attackCrouched));
  if(dir&&s.grounded&&!s.attack)s.facing=dir;
  if(input.attack&&!s.attack){s.attack=.42;s.attackId++;s.attackCrouched=s.crouching;s.events.push("swing");}
  s.attack=Math.max(0,s.attack-dt);
  if(s.grounded){s.vx=s.attack?0:dir*(s.crouching?90:235);if(input.jump&&!s.crouching){s.vy=-650;s.grounded=false;s.events.push("jump");}}
  const oldX=s.x,oldY=s.y,height=s.crouching?84:120;s.x=Math.max(20,Math.min(LEVEL.width-20,s.x+s.vx*dt));
  for(const p of platforms)if(oldY>p.y&&oldY-height<p.y+(p.h??150)){
    if(s.vx>0&&oldX+13<=p.x&&s.x+13>p.x)s.x=p.x-13;
    else if(s.vx<0&&oldX-13>=p.x+p.w&&s.x-13<p.x+p.w)s.x=p.x+p.w+13;
  }
  if(!s.leverOn&&oldX<LEVEL.gate&&s.x>=LEVEL.gate-28)s.x=LEVEL.gate-28;
  s.vy+=1850*dt;s.y+=s.vy*dt;s.grounded=false;
  for(const p of platforms)if(s.x+13>p.x&&s.x-13<p.x+p.w){
    if(s.vy>=0&&oldY<=p.y&&s.y>=p.y){s.y=p.y;s.vy=0;s.grounded=true;}
    else if(s.vy<0&&oldY-height>=p.y+(p.h??150)&&s.y-height<p.y+(p.h??150)){s.y=p.y+(p.h??150)+height;s.vy=0;}
  }
  if(s.y>850)respawn(s);if(s.grounded&&Math.abs(s.vx)>1)s.walk+=dt;else s.walk=0;
  if(input.interact&&Math.abs(s.x-LEVEL.lever)<90&&!s.leverOn){s.leverOn=true;s.events.push("gate");message(s,"The lever raises the cloister grate.");}
  if(!s.vialTaken&&Math.abs(s.x-1900)<38&&Math.abs(s.y-600)<130){s.vialTaken=true;s.hp=Math.min(5,s.hp+2);s.events.push("pickup");message(s,"Healing vial collected.");}
  const e=s.enemy,previous=e.timer;e.timer=Math.max(0,e.timer-dt);
  if(e.hp>0){
    const hit=s.attack>.12&&s.attack<.28?{x:s.facing>0?s.x+8:s.x-115,y:s.y-(s.attackCrouched?64:110),w:107,h:s.attackCrouched?57:82}:null;
    if(hit&&e.lastHit!==s.attackId&&overlaps(hit,{x:e.x-24,y:e.y-130,w:48,h:130})){e.lastHit=s.attackId;e.hp--;e.mode=e.hp?"hurt":"dead";e.timer=.35;s.events.push("hit");}
    else if(e.mode==="hurt"){if(!e.timer)e.mode="patrol";}
    else if(e.mode==="windup"){if(!e.timer){e.mode="strike";e.timer=.28;}}
    else if(e.mode==="strike"){if(previous>.16&&e.timer<=.16&&Math.abs(s.x-e.x)<105&&Math.abs(s.y-e.y)<100)damage(s);if(!e.timer){e.mode="recover";e.timer=.9;}}
    else if(e.mode==="recover"){if(!e.timer)e.mode="patrol";}
    else{const distance=s.x-e.x;e.facing=distance>0?1:-1;if(Math.abs(distance)<90&&Math.abs(s.y-e.y)<90){e.mode="windup";e.timer=.8;}else if(Math.abs(distance)<430){e.mode="approach";e.x=Math.max(e.home-250,Math.min(e.home+250,e.x+e.facing*78*dt));}else{e.mode="patrol";e.x=e.home+Math.sin(s.time*.5)*45;}}
  }
  if(s.x>4050&&!s.complete){s.complete=true;message(s,"Cloister blockout complete — the Cistern route is next.");s.noticeTime=999;}
  const focus=s.x+s.facing*80,screen=focus-s.camera;let target=s.camera;if(screen>760)target=focus-760;if(screen<420)target=focus-420;target=Math.max(0,Math.min(LEVEL.width-VIEW.width,target));s.camera+=(target-s.camera)*Math.min(1,dt*6);
}
