import { drawBackdrop, drawBoat, drawOrb, drawRock, drawHUD, drawOverlay, drawParticles } from './render.js';
import { makeWorld, stepWorld } from './world.js';
import { bindControls } from './input.js';

const canvas = document.querySelector('#sea');
const ctx = canvas.getContext('2d');
const world = makeWorld();
let last = performance.now();
let sound = true;
const audio = window.AudioContext ? new AudioContext() : null;
function ping(freq=520, duration=.09, type='sine') {
  if (!audio || !sound) return;
  if (audio.state === 'suspended') audio.resume();
  const osc=audio.createOscillator(), gain=audio.createGain(); osc.type=type; osc.frequency.value=freq;
  gain.gain.setValueAtTime(.045,audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
  osc.connect(gain).connect(audio.destination); osc.start(); osc.stop(audio.currentTime+duration);
}
const input=bindControls(canvas, world, ping);
window.addEventListener('tide-sound',()=>sound=!sound);
const shot=new URLSearchParams(location.search).get('shot');
if(shot==='play') {
  world.state='playing'; world.elapsed=31; world.score=1280; world.combo=4;
  world.boat.x=480; world.boat.y=408; world.boost=1.6; world.seedShot=true;
  world.rocks=[
    {x:236,y:282,r:30,rot:.45,kind:.7},
    {x:724,y:335,r:36,rot:1.2,kind:.2},
  ];
  world.orbs=[
    {x:356,y:249,r:14,type:'shell',phase:.8},
    {x:600,y:300,r:14,type:'pearl',phase:2.1},
  ];
}
if(shot==='end') {
  world.state='ended'; world.elapsed=75; world.score=2460; world.best=2460; world.shells=18;
  world.reason='抵達月汐灣'; world.boat.x=812; world.boat.y=510;
}
if(shot==='start'||!shot) { world.boat.x=790; world.boat.y=490; }

function frame(now) {
  const dt=Math.min((now-last)/1000,.034); last=now;
  if(!world.seedShot) stepWorld(world,dt,input,ping);
  ctx.clearRect(0,0,960,600);
  drawBackdrop(ctx,world,now/1000);
  world.rocks.forEach(r=>drawRock(ctx,r)); world.orbs.forEach(o=>drawOrb(ctx,o,now/1000));
  drawParticles(ctx,world.particles);
  drawBoat(ctx,world.boat,now/1000,world.boost>0);
  if(world.state!=='title') drawHUD(ctx,world);
  drawOverlay(ctx,world,{sound,toggleSound:()=>sound=!sound});
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
