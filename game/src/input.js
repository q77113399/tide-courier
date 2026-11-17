import { startWorld } from './world.js';
export function bindControls(canvas,w,ping){
 const set=(key,on)=>{w.keys[key]=on};
 window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowleft','a'].includes(k)){set('left',true);e.preventDefault()}if(['arrowright','d'].includes(k)){set('right',true);e.preventDefault()}if(['arrowup','w'].includes(k)){set('up',true);e.preventDefault()}if(['arrowdown','s'].includes(k)){set('down',true);e.preventDefault()}if(k===' '){e.preventDefault();activate()}if(k==='enter'&&(w.state==='title'||w.state==='ended'))startWorld(w)});
 window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();if(['arrowleft','a'].includes(k))set('left',false);if(['arrowright','d'].includes(k))set('right',false);if(['arrowup','w'].includes(k))set('up',false);if(['arrowdown','s'].includes(k))set('down',false)});
 function activate(){if(w.state==='title'||w.state==='ended'){startWorld(w);ping(520)}else if(w.state==='playing'&&w.boost<=0){w.boost=.42;w.invulnerable=Math.max(w.invulnerable,.38);ping(330,.1,'triangle')}}
 canvas.addEventListener('pointerdown',e=>{const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)*960/rect.width,y=(e.clientY-rect.top)*600/rect.height;if(w.state!=='playing'){if(x>790&&y<115){window.dispatchEvent(new Event('tide-sound'));return}activate()}else{activate();const b=w.boat;b.vx+=(x-b.x)*.45;b.vy+=(y-b.y)*.3}});
 window.addEventListener('pointerup',()=>{});
 return{activate};
}
