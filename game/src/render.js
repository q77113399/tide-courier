const W=960,H=600;
function roundRect(c,x,y,w,h,r){c.beginPath();c.roundRect(x,y,w,h,r)}
export function drawBackdrop(c,w,t){
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,'#102c42');g.addColorStop(.42,'#0b3043');g.addColorStop(1,'#071d31');c.fillStyle=g;c.fillRect(0,0,W,H);
 // moonlit horizon and distant islands
 const moon=c.createRadialGradient(730,120,4,730,120,150);moon.addColorStop(0,'#f8e7b044');moon.addColorStop(1,'#f8e7b000');c.fillStyle=moon;c.fillRect(550,0,360,300);c.fillStyle='#f3e4b8';c.beginPath();c.arc(730,119,35,0,Math.PI*2);c.fill();c.fillStyle='#9bb6a2';c.beginPath();c.arc(743,109,31,0,Math.PI*2);c.fill();
 c.fillStyle='#112c3d';c.beginPath();c.moveTo(0,280);c.quadraticCurveTo(96,236,194,266);c.quadraticCurveTo(280,207,380,267);c.quadraticCurveTo(480,220,558,269);c.quadraticCurveTo(710,211,812,268);c.quadraticCurveTo(900,228,960,253);c.lineTo(960,400);c.lineTo(0,400);c.fill();
 // tide lanes
 c.save();c.globalAlpha=.22;c.strokeStyle='#72c7c2';c.lineWidth=1;
 for(let i=0;i<8;i++){const y=175+i*48+(t*13%48);c.beginPath();for(let x=0;x<=W;x+=24){const yy=y+Math.sin(x*.012+t*1.25+i)*9;c.lineTo(x,yy)}c.stroke()}
 c.restore();
 // scattered glimmers
 c.save();for(let i=0;i<46;i++){const x=(i*197+Math.sin(t*.8+i)*24)%W,y=(i*83+Math.cos(t*.4+i)*13)%H;const a=.2+.45*(.5+.5*Math.sin(t*2+i));c.fillStyle=`rgba(188,239,220,${a})`;c.beginPath();c.arc(x,y,1+(i%3)*.45,0,6.28);c.fill()}c.restore();
 // foreground reef silhouettes
 c.fillStyle='#092535';for(let side of [0,1]){c.save();if(side)c.translate(W,0),c.scale(-1,1);c.beginPath();c.moveTo(0,410);c.bezierCurveTo(38,389,55,397,74,374);c.bezierCurveTo(89,397,105,397,123,380);c.bezierCurveTo(141,402,165,392,187,377);c.lineTo(200,600);c.lineTo(0,600);c.fill();c.restore()}
 c.fillStyle='#143e47';for(let i=0;i<19;i++){let x=i*56+15,y=554+Math.sin(i*8)*18;c.beginPath();c.ellipse(x,y,15,5,Math.sin(i)*.5,0,6.28);c.fill()}
 // foam traces
 c.strokeStyle='#92ddd044';c.lineWidth=2;for(let i=0;i<7;i++){const x=(i*177+t*32)%1050-45,y=430+(i*51)%140;c.beginPath();c.ellipse(x,y,19,3,.1,0,6.28);c.stroke()}
}
export function drawRock(c,r){c.save();c.translate(r.x,r.y);c.rotate(r.rot);const hue=r.kind<.3?'#786f75':'#536871';c.fillStyle=hue;c.strokeStyle='#a6b1a566';c.lineWidth=2;c.beginPath();for(let i=0;i<9;i++){const a=i*Math.PI*2/9,rr=r.r*(.78+(i*7%5)/22);i?c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):c.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}c.closePath();c.fill();c.stroke();c.fillStyle='#d9c1a22b';c.beginPath();c.ellipse(-r.r*.16,-r.r*.3,r.r*.34,r.r*.14,-.4,0,6.28);c.fill();c.restore()}
export function drawOrb(c,o,t){c.save();c.translate(o.x,o.y);const r=o.r+Math.sin(t*4+o.phase)*1.5;const color=o.type==='pearl'?'#a5fff2':'#ffd58c';c.globalAlpha=.16;c.fillStyle=color;c.beginPath();c.arc(0,0,r*2.6,0,6.28);c.fill();c.globalAlpha=1;c.fillStyle=color;c.beginPath();c.arc(0,0,r,0,6.28);c.fill();c.fillStyle='#fff8d9';c.beginPath();c.arc(-r*.28,-r*.3,r*.28,0,6.28);c.fill();c.strokeStyle='#fff7d899';c.lineWidth=1;c.beginPath();c.arc(0,0,r+5,0,6.28);c.stroke();c.restore()}
export function drawBoat(c,b,t,boost){c.save();c.translate(b.x,b.y+Math.sin(t*5)*2);c.rotate(Math.sin(t*2)*.035+b.vx*.0003);c.globalAlpha=b.invulnerable>0?.55+.45*Math.sin(t*30):1;
 const glow=c.createRadialGradient(0,0,2,0,0,54);glow.addColorStop(0,'#f6d68d45');glow.addColorStop(1,'#f6d68d00');c.fillStyle=glow;c.fillRect(-60,-60,120,120);
 c.fillStyle='#d28b62';c.beginPath();c.moveTo(0,29);c.quadraticCurveTo(27,18,24,-20);c.lineTo(-24,-20);c.quadraticCurveTo(-27,18,0,29);c.fill();c.strokeStyle='#ffe0a9';c.lineWidth=2;c.stroke();c.fillStyle='#723e42';c.beginPath();c.ellipse(0,2,18,13,0,0,6.28);c.fill();
 c.fillStyle='#e9c98a';c.beginPath();c.moveTo(0,-42);c.lineTo(0,-5);c.lineTo(20,-8);c.quadraticCurveTo(18,-35,0,-42);c.fill();c.fillStyle='#fff4cc';c.beginPath();c.arc(-2,-9,8,0,6.28);c.fill();c.strokeStyle='#f6d68a';c.lineWidth=2;c.beginPath();c.moveTo(-27,-21);c.quadraticCurveTo(-38,-8,-29,9);c.stroke();c.beginPath();c.moveTo(27,-21);c.quadraticCurveTo(38,-8,29,9);c.stroke();
 if(boost){c.fillStyle='#87efe4';c.globalAlpha=.8;c.beginPath();c.moveTo(-7,27);c.lineTo(0,54+Math.random()*8);c.lineTo(7,27);c.fill()}c.restore()}
export function drawParticles(c,ps){for(const p of ps){c.globalAlpha=Math.max(0,p.life/p.max);c.fillStyle=p.color;c.beginPath();c.arc(p.x,p.y,p.size,0,6.28);c.fill()}c.globalAlpha=1}
export function drawHUD(c,w){c.save();c.fillStyle='#071d2acc';roundRect(c,24,22,912,92,14);c.fill();c.strokeStyle='#a5ded533';c.stroke();
 c.fillStyle='#8db4b5';c.font='600 11px system-ui';c.letterSpacing='2px';c.fillText('月汐航程',46,49);c.fillStyle='#f5f0d9';c.font='700 23px system-ui';c.fillText(`${Math.max(0,Math.ceil(75-w.elapsed))} 秒`,46,82);
 c.fillStyle='#8db4b5';c.font='600 11px system-ui';c.fillText('郵袋分數',190,49);c.fillStyle='#ffe1a3';c.font='700 24px system-ui';c.fillText(w.score.toLocaleString(),190,82);
 c.fillStyle='#8db4b5';c.font='600 11px system-ui';c.fillText('月貝',380,49);c.fillStyle='#c5f5e7';c.font='700 24px system-ui';c.fillText(`${w.shells} ✦`,380,82);
 const pct=Math.max(0,(75-w.elapsed)/75);c.fillStyle='#284d59';roundRect(c,545,61,230,8,5);c.fill();c.fillStyle='#83d4c4';roundRect(c,545,61,230*pct,8,5);c.fill();c.fillStyle='#8db4b5';c.font='11px system-ui';c.fillText('返航潮汐',545,49);
 if(w.combo>1){c.fillStyle='#ffda8e';c.font='700 14px system-ui';c.fillText(`連收 ×${w.combo}`,690,91)}
 c.fillStyle='#ffd98e';c.font='600 12px system-ui';c.fillText('✦ 加速就緒',815,75);if(w.boost>0){c.fillStyle='#8be6d6';c.fillText('衝刺中',815,75)}c.restore()}
export function drawOverlay(c,w,opts){
 // clickable audio toggle
 c.save();c.fillStyle='#102f3fdd';roundRect(c,858,28,67,30,15);c.fill();c.strokeStyle='#b5dbcd55';c.stroke();c.fillStyle='#e4f0df';c.font='12px system-ui';c.textAlign='center';c.fillText(opts.sound?'♫　音效':'♫　靜音',891,48);c.textAlign='left';c.restore();
 c.canvas.onclick=e=>{const r=c.canvas.getBoundingClientRect(),x=(e.clientX-r.left)*960/r.width,y=(e.clientY-r.top)*600/r.height;if(x>850&&y<70)window.dispatchEvent(new Event('tide-sound'))};
 if(w.state==='playing')return;
 c.save();c.fillStyle='#061a29b8';c.fillRect(0,0,W,H);
 if(w.state==='title'){
   c.textAlign='center';c.fillStyle='#a5e0cf';c.font='600 12px system-ui';c.letterSpacing='5px';c.fillText('潮汐郵差　·　夜間航線 07',480,164);
   c.fillStyle='#f7e6b9';c.font='800 49px system-ui';c.letterSpacing='3px';c.fillText('把月光送到海的另一邊',480,233);
   c.fillStyle='#b4d1cf';c.font='16px system-ui';c.letterSpacing='1px';c.fillText('75 秒夜航　｜　拾起月貝，穿過漂移的礁群',480,274);
   c.fillStyle='#e7d39e';c.font='14px system-ui';c.fillText('← →　掌舵　　↑ ↓　調整航線　　空白鍵　潮汐衝刺',480,327);
   c.fillStyle='#78c6b7';roundRect(c,367,371,226,56,28);c.fill();c.fillStyle='#092432';c.font='700 17px system-ui';c.fillText('啟程　按 Enter',480,406);
   c.fillStyle='#75959b';c.font='12px system-ui';c.fillText(`最高郵袋紀錄　${w.best.toLocaleString()} 分`,480,466);
   c.fillStyle='#f7dfaa';c.font='22px system-ui';c.fillText('✧',305,219);c.fillText('✧',653,248);c.fillText('✦',690,180);
 } else {
   c.textAlign='center';c.fillStyle='#a5e0cf';c.font='600 12px system-ui';c.letterSpacing='5px';c.fillText('航線結算',480,177);
   c.fillStyle='#f7e6b9';c.font='800 43px system-ui';c.letterSpacing='2px';c.fillText(w.reason||'月灣已收到你的信',480,240);
   c.fillStyle='#8eb7b8';c.font='13px system-ui';c.letterSpacing='2px';c.fillText('今夜送達的月光',480,290);
   c.fillStyle='#ffe2a2';c.font='800 48px system-ui';c.letterSpacing='0px';c.fillText(w.score.toLocaleString(),480,346);
   c.fillStyle='#b7d7d0';c.font='14px system-ui';c.fillText(`月貝　${w.shells}　　最高紀錄　${w.best.toLocaleString()}`,480,384);
   c.fillStyle='#78c6b7';roundRect(c,372,416,216,52,26);c.fill();c.fillStyle='#092432';c.font='700 16px system-ui';c.fillText('再跑一趟　Enter',480,449);
   c.fillStyle='#8da9a7';c.font='12px system-ui';c.fillText('今晚的潮汐，還有另一條路',480,503);
 }
 c.restore();
}
