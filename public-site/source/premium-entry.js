import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { animate, stagger, inView } from 'motion';

const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hero=document.querySelector('.cinematic-hero');
if(!reduced){
 animate('.hero-copy h1 span,.hero-copy h1 em,.hero-copy>p,.hero-copy .actions',
  {opacity:[0,1],y:[28,0]},{duration:1.1,delay:stagger(.12),ease:[.16,1,.3,1]});
 inView('.product-copy,.product-art,.community-section h2',element=>{
  animate(element,{opacity:[.25,1],y:[35,0]},{duration:1.1,ease:[.16,1,.3,1]});
 },{amount:.15});
 document.querySelectorAll('.primary').forEach(button=>{
  button.addEventListener('pointerenter',()=>animate(button,{scale:1.035},{duration:.25}));
  button.addEventListener('pointerleave',()=>animate(button,{scale:1},{duration:.25}));
 });
}

// The supplied logo stays intact; Three.js renders the surrounding sculpture.
const host=document.getElementById('brand-scene');
try{
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
 renderer.setClearColor(0x000000,0);
 renderer.toneMapping=THREE.ACESFilmicToneMapping;
 renderer.toneMappingExposure=1.3;
 host.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(34,1,.1,50);
 camera.position.z=7.6;
 const pmrem=new THREE.PMREMGenerator(renderer),environment=new RoomEnvironment();
 const envTarget=pmrem.fromScene(environment,.03);
 scene.environment=envTarget.texture;environment.dispose();pmrem.dispose();
 scene.add(new THREE.AmbientLight(0xffffff,.5));
 const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(2,4,5);scene.add(light);
 const green=new THREE.PointLight(0x60efbb,28);green.position.set(-3,-1,2);scene.add(green);
 const silver=new THREE.MeshStandardMaterial({color:0xd8e1e2,metalness:1,roughness:.17});
 const accent=new THREE.MeshStandardMaterial({color:0x91ecbe,metalness:.8,roughness:.25,emissive:0x173e2e,emissiveIntensity:.4});
 const sculpture=new THREE.Group();scene.add(sculpture);
 const outer=new THREE.Mesh(new THREE.TorusGeometry(1.75,.065,16,160),silver);
 outer.rotation.set(.32,-.38,.25);sculpture.add(outer);
 const sweep=new THREE.Mesh(new THREE.TorusGeometry(2.0,.035,12,160),accent);
 sweep.rotation.set(.7,.6,-.55);sculpture.add(sweep);
 const arc=new THREE.Mesh(new THREE.TorusGeometry(2.24,.021,12,120,Math.PI*1.4),silver);
 arc.rotation.set(-.45,.35,.7);sculpture.add(arc);
 const satellite=new THREE.Mesh(new THREE.IcosahedronGeometry(.12,2),silver);scene.add(satellite);
 const points=new Float32Array(180*3);
 for(let i=0;i<180;i++){const t=i*2.3999632,r=2.5+(i%11)*.08;points[i*3]=Math.cos(t)*r;points[i*3+1]=Math.sin(t)*r;points[i*3+2]=Math.sin(i)*.7;}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(points,3));
 const stars=new THREE.Points(geometry,new THREE.PointsMaterial({color:0xc0d8d1,size:.016,transparent:true,opacity:.4}));scene.add(stars);
 let visible=true,last=0,pointerX=0,pointerY=0;
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;},{rootMargin:'100px'}).observe(hero);
 hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();pointerX=(event.clientX-rect.left)/rect.width-.5;pointerY=(event.clientY-rect.top)/rect.height-.5;},{passive:true});
 hero.addEventListener('pointerleave',()=>{pointerX=0;pointerY=0;},{passive:true});
 function resize(){const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}
 new ResizeObserver(resize).observe(host);resize();
 renderer.setAnimationLoop(time=>{
  if(!visible||document.hidden||(!reduced&&time-last<32))return;
  last=time;const t=reduced?0:time*.00012;
  outer.rotation.z=.25+t;sweep.rotation.z=-.55-t*.55;arc.rotation.z=.7+t*.8;
  sculpture.rotation.y+=((pointerX*.16)-sculpture.rotation.y)*.035;
  sculpture.rotation.x+=((-pointerY*.1)-sculpture.rotation.x)*.035;
  satellite.position.set(Math.cos(t*2)*2.15,Math.sin(t*2)*2.15,.3);
  stars.rotation.z=t*.06;renderer.render(scene,camera);
 });
 host.classList.add('scene-ready');
 document.querySelector('.orbital-visual').classList.add('has-webgl');
}catch(error){host.classList.add('scene-fallback');}

document.getElementById('chart-center').addEventListener('click',()=>centerPublicChart());
