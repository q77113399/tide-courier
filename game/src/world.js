export function makeWorld(){return{state:'title',elapsed:0,score:0,best:Number(localStorage.getItem('tidepost-best')||0),shells:0,combo:0,comboTimer:0,boost:0,invulnerable:0,shake:0,rocks:[],orbs:[],particles:[],spawn:0,orbSpawn:0,boat:{x:480,y:390,vx:0,vy:0},reason:'',seedShot:false,keys:{}}}
export function startWorld(w){Object.assign(w,{state:'playing',elapsed:0,score:0,shells:0,combo:0,comboTimer:0,boost:0,invulnerable:1,shake:0,rocks:[],orbs:[],particles:[],spawn:.45,orbSpawn:.5,reason:'',boat:{x:480,y:392,vx:0,vy:0}})}
export function burst(w,x,y,color,count=12){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=30+Math.random()*180;w.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:.45+Math.random()*.5,max:.95,color,size:2+Math.random()*3})}}
export function stepWorld(w,dt,input,ping){
 if(w.state!=='playing')return;
 w.elapsed+=dt; w.boost=Math.max(0,w.boost-dt);w.invulnerable=Math.max(0,w.invulnerable-dt);w.shake=Math.max(0,w.shake-dt*24);w.comboTimer-=dt;
 if(w.comboTimer<=0)w.combo=0;
 const b=w.boat,axis=(w.keys.right?1:0)-(w.keys.left?1:0),vertical=(w.keys.down?1:0)-(w.keys.up?1:0),speed=w.boost>0?465:310;
 b.vx+=(axis*speed-b.vx)*Math.min(1,dt*8);b.vy+=(vertical*speed-b.vy)*Math.min(1,dt*8);b.x+=b.vx*dt;b.y+=b.vy*dt;b.x=Math.max(42,Math.min(918,b.x));b.y=Math.max(160,Math.min(525,b.y));
 w.spawn-=dt;if(w.spawn<=0){const level=Math.min(1.8,w.elapsed/35);w.rocks.push({x:Math.random()*820+70,y:-50,r:20+Math.random()*23,v:155+level*55+Math.random()*65,rot:Math.random()*6.28,spin:(Math.random()-.5)*1.2,kind:Math.random()});w.spawn=Math.max(.42,1.05-level*.35+Math.random()*.35)}
 w.orbSpawn-=dt;if(w.orbSpawn<=0){w.orbs.push({x:Math.random()*790+85,y:-20,r:13,type:Math.random()<.18?'pearl':'shell',phase:Math.random()*6.28});w.orbSpawn=.75+Math.random()*.6}
 for(const r of w.rocks){r.y+=r.v*dt;r.rot+=r.spin*dt;if(w.invulnerable<=0&&Math.hypot(r.x-b.x,r.y-b.y)<r.r+17){w.invulnerable=1.35;w.shake=8;w.combo=0;w.comboTimer=0;burst(w,b.x,b.y,'#ff947c',22);ping(115,.24,'saw');w.score=Math.max(0,w.score-100);r.y=680;if(w.score<=0&&w.elapsed>18){w.state='ended';w.reason='航船需要回港整修';w.best=Math.max(w.best,w.score);localStorage.setItem('tidepost-best',w.best)}}}
 for(const o of w.orbs){o.y+=145*dt;o.phase+=dt*3;if(Math.hypot(o.x-b.x,o.y-b.y)<o.r+20){o.y=700;w.shells++;w.combo++;w.comboTimer=2.7;const val=(o.type==='pearl'?180:100)*Math.min(3,w.combo);w.score+=val;burst(w,o.x,o.y,o.type==='pearl'?'#a9f5ef':'#ffda92',13);ping(o.type==='pearl'?880:660,.1)}}
 w.rocks=w.rocks.filter(o=>o.y<650);w.orbs=w.orbs.filter(o=>o.y<620);
 for(const p of w.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;p.vx*=.98;p.vy*=.98}w.particles=w.particles.filter(p=>p.life>0);
 if(w.elapsed>=75){w.state='ended';w.reason='平安抵達月汐灣';w.best=Math.max(w.best,w.score);localStorage.setItem('tidepost-best',w.best);burst(w,b.x,b.y,'#ffe3a1',36);ping(740,.35)}
}
