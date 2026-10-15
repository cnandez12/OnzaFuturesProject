(()=>{var sf=0,Uc=1,rf=2;var Dr=1,of=2,Es=3,_i=0,Ie=1,Nn=2,Un=0,As=1,Fc=2,Oc=3,Bc=4,af=5;var Vi=100,lf=101,cf=102,hf=103,uf=104,ff=200,df=201,pf=202,mf=203,Vc=204,zc=205,gf=206,xf=207,_f=208,yf=209,vf=210,Sf=211,Mf=212,bf=213,Tf=214,Zo=0,Ko=1,Jo=2,gs=3,$o=4,jo=5,Qo=6,ta=7,Aa=0,Ef=1,Af=2,gn=0,kc=1,Gc=2,Hc=3,Lr=4,Wc=5,Xc=6,qc=7;var Yc=300,yi=301,zi=302,wa=303,Ca=304,Nr=306,ea=1e3,wn=1001,na=1002,be=1003,wf=1004;var Ur=1005;var Re=1006,Ra=1007;var vi=1008;var Je=1009,Zc=1010,Kc=1011,ws=1012,Ia=1013,xn=1014,ln=1015,_n=1016,Pa=1017,Da=1018,Cs=1020,Jc=35902,$c=35899,jc=1021,Qc=1022,cn=1023,Cn=1026,Si=1027,La=1028,Na=1029,Mi=1030,Ua=1031;var Fa=1033,Fr=33776,Or=33777,Br=33778,Vr=33779,Oa=35840,Ba=35841,Va=35842,za=35843,ka=36196,Ga=37492,Ha=37496,Wa=37488,Xa=37489,zr=37490,qa=37491,Ya=37808,Za=37809,Ka=37810,Ja=37811,$a=37812,ja=37813,Qa=37814,tl=37815,el=37816,nl=37817,il=37818,sl=37819,rl=37820,ol=37821,al=36492,ll=36494,cl=36495,hl=36283,ul=36284,kr=36285,fl=36286;var lr=2300,ia=2301,qo=2302,Ac=2303,wc=2400,Cc=2401,Rc=2402;var Cf=3200;var Gr=0,Rf=1,jn="",en="srgb",cr="srgb-linear",hr="linear",$t="srgb";var Yo=7680;var If=519,Pf=512,Df=513,Lf=514,dl=515,Nf=516,Uf=517,pl=518,Ff=519,Of=35044;var th="300 es",mn=2e3,xs=2001;function em(n){for(let t=n.length-1;t>=0;--t)if(n[t]>=65535)return!0;return!1}function nm(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function ur(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function Bf(){let n=ur("canvas");return n.style.display="block",n}var Du={},_s=null;function eh(...n){let t="THREE."+n.shift();_s?_s("log",t,...n):console.log(t,...n)}function Vf(n){let t=n[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=n[1];e&&e.isStackTrace?n[0]+=" "+e.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Rt(...n){n=Vf(n);let t="THREE."+n.shift();if(_s)_s("warn",t,...n);else{let e=n[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...n)}}function It(...n){n=Vf(n);let t="THREE."+n.shift();if(_s)_s("error",t,...n);else{let e=n[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...n)}}function Ui(...n){let t=n.join(" ");t in Du||(Du[t]=!0,Rt(...n))}function zf(n,t,e){return new Promise(function(i,s){function r(){switch(n.clientWaitSync(t,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:s();break;case n.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:i()}}setTimeout(r,e)})}var kf={[Zo]:Ko,[Jo]:Qo,[$o]:ta,[gs]:jo,[Ko]:Zo,[Qo]:Jo,[ta]:$o,[jo]:gs},Rn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[t]===void 0&&(i[t]=[]),i[t].indexOf(e)===-1&&i[t].push(e)}hasEventListener(t,e){let i=this._listeners;return i===void 0?!1:i[t]!==void 0&&i[t].indexOf(e)!==-1}removeEventListener(t,e){let i=this._listeners;if(i===void 0)return;let s=i[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let i=e[t.type];if(i!==void 0){t.target=this;let s=i.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,t);t.target=null}}},Ue=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var ic=Math.PI/180,sa=180/Math.PI;function Hr(){let n=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Ue[n&255]+Ue[n>>8&255]+Ue[n>>16&255]+Ue[n>>24&255]+"-"+Ue[t&255]+Ue[t>>8&255]+"-"+Ue[t>>16&15|64]+Ue[t>>24&255]+"-"+Ue[e&63|128]+Ue[e>>8&255]+"-"+Ue[e>>16&255]+Ue[e>>24&255]+Ue[i&255]+Ue[i>>8&255]+Ue[i>>16&255]+Ue[i>>24&255]).toLowerCase()}function qt(n,t,e){return Math.max(t,Math.min(e,n))}function im(n,t){return(n%t+t)%t}function sc(n,t,e){return(1-e)*n+e*t}function er(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ye(n,t){switch(t.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var oh=class oh{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,i=this.y,s=t.elements;return this.x=s[0]*e+s[3]*i+s[6],this.y=s[1]*e+s[4]*i+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(qt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y;return e*e+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let i=Math.cos(e),s=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*i-o*s+t.x,this.y=r*s+o*i+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};oh.prototype.isVector2=!0;var kt=oh,In=class{constructor(t=0,e=0,i=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=i,this._w=s}static slerpFlat(t,e,i,s,r,o,a){let l=i[s+0],c=i[s+1],h=i[s+2],f=i[s+3],u=r[o+0],m=r[o+1],_=r[o+2],S=r[o+3];if(f!==S||l!==u||c!==m||h!==_){let p=l*u+c*m+h*_+f*S;p<0&&(u=-u,m=-m,_=-_,S=-S,p=-p);let d=1-a;if(p<.9995){let M=Math.acos(p),C=Math.sin(M);d=Math.sin(d*M)/C,a=Math.sin(a*M)/C,l=l*d+u*a,c=c*d+m*a,h=h*d+_*a,f=f*d+S*a}else{l=l*d+u*a,c=c*d+m*a,h=h*d+_*a,f=f*d+S*a;let M=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=M,c*=M,h*=M,f*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,i,s,r,o){let a=i[s],l=i[s+1],c=i[s+2],h=i[s+3],f=r[o],u=r[o+1],m=r[o+2],_=r[o+3];return t[e]=a*_+h*f+l*m-c*u,t[e+1]=l*_+h*u+c*f-a*m,t[e+2]=c*_+h*m+a*u-l*f,t[e+3]=h*_-a*f-l*u-c*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,i,s){return this._x=t,this._y=e,this._z=i,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let i=t._x,s=t._y,r=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(i/2),h=a(s/2),f=a(r/2),u=l(i/2),m=l(s/2),_=l(r/2);switch(o){case"XYZ":this._x=u*h*f+c*m*_,this._y=c*m*f-u*h*_,this._z=c*h*_+u*m*f,this._w=c*h*f-u*m*_;break;case"YXZ":this._x=u*h*f+c*m*_,this._y=c*m*f-u*h*_,this._z=c*h*_-u*m*f,this._w=c*h*f+u*m*_;break;case"ZXY":this._x=u*h*f-c*m*_,this._y=c*m*f+u*h*_,this._z=c*h*_+u*m*f,this._w=c*h*f-u*m*_;break;case"ZYX":this._x=u*h*f-c*m*_,this._y=c*m*f+u*h*_,this._z=c*h*_-u*m*f,this._w=c*h*f+u*m*_;break;case"YZX":this._x=u*h*f+c*m*_,this._y=c*m*f+u*h*_,this._z=c*h*_-u*m*f,this._w=c*h*f-u*m*_;break;case"XZY":this._x=u*h*f-c*m*_,this._y=c*m*f-u*h*_,this._z=c*h*_+u*m*f,this._w=c*h*f+u*m*_;break;default:Rt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let i=e/2,s=Math.sin(i);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,i=e[0],s=e[4],r=e[8],o=e[1],a=e[5],l=e[9],c=e[2],h=e[6],f=e[10],u=i+a+f;if(u>0){let m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-l)*m,this._y=(r-c)*m,this._z=(o-s)*m}else if(i>a&&i>f){let m=2*Math.sqrt(1+i-a-f);this._w=(h-l)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+c)/m}else if(a>f){let m=2*Math.sqrt(1+a-i-f);this._w=(r-c)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(l+h)/m}else{let m=2*Math.sqrt(1+f-i-a);this._w=(o-s)/m,this._x=(r+c)/m,this._y=(l+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let i=t.dot(e)+1;return i<1e-8?(i=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=i):(this._x=0,this._y=-t.z,this._z=t.y,this._w=i)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=i),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(qt(this.dot(t),-1,1)))}rotateTowards(t,e){let i=this.angleTo(t);if(i===0)return this;let s=Math.min(1,e/i);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=e._x,l=e._y,c=e._z,h=e._w;return this._x=i*h+o*a+s*c-r*l,this._y=s*h+o*l+r*a-i*c,this._z=r*h+o*c+i*l-s*a,this._w=o*h-i*a-s*l-r*c,this._onChangeCallback(),this}slerp(t,e){let i=t._x,s=t._y,r=t._z,o=t._w,a=this.dot(t);a<0&&(i=-i,s=-s,r=-r,o=-o,a=-a);let l=1-e;if(a<.9995){let c=Math.acos(a),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+i*e,this._y=this._y*l+s*e,this._z=this._z*l+r*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,i){return this.copy(t).slerp(e,i)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),i=Math.random(),s=Math.sqrt(1-i),r=Math.sqrt(i);return this.set(s*Math.sin(t),s*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},ah=class ah{constructor(t=0,e=0,i=0){this.x=t,this.y=e,this.z=i}set(t,e,i){return i===void 0&&(i=this.z),this.x=t,this.y=e,this.z=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Lu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Lu.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*i+r[6]*s,this.y=r[1]*e+r[4]*i+r[7]*s,this.z=r[2]*e+r[5]*i+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=t.elements,o=1/(r[3]*e+r[7]*i+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*i+r[8]*s+r[12])*o,this.y=(r[1]*e+r[5]*i+r[9]*s+r[13])*o,this.z=(r[2]*e+r[6]*i+r[10]*s+r[14])*o,this}applyQuaternion(t){let e=this.x,i=this.y,s=this.z,r=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*s-a*i),h=2*(a*e-r*s),f=2*(r*i-o*e);return this.x=e+l*c+o*f-a*h,this.y=i+l*h+a*c-r*f,this.z=s+l*f+r*h-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,i=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*i+r[8]*s,this.y=r[1]*e+r[5]*i+r[9]*s,this.z=r[2]*e+r[6]*i+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let i=t.x,s=t.y,r=t.z,o=e.x,a=e.y,l=e.z;return this.x=s*l-r*a,this.y=r*o-i*l,this.z=i*a-s*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let i=t.dot(this)/e;return this.copy(t).multiplyScalar(i)}projectOnPlane(t){return rc.copy(this).projectOnVector(t),this.sub(rc)}reflect(t){return this.sub(rc.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let i=this.dot(t)/e;return Math.acos(qt(i,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,i=this.y-t.y,s=this.z-t.z;return e*e+i*i+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,i){let s=Math.sin(e)*t;return this.x=s*Math.sin(i),this.y=Math.cos(e)*t,this.z=s*Math.cos(i),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,i){return this.x=t*Math.sin(e),this.y=i,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),i=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=i,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,i=Math.sqrt(1-e*e);return this.x=i*Math.cos(t),this.y=e,this.z=i*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};ah.prototype.isVector3=!0;var z=ah,rc=new z,Lu=new In,lh=class lh{constructor(t,e,i,s,r,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c)}set(t,e,i,s,r,o,a,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=a,h[3]=e,h[4]=r,h[5]=l,h[6]=i,h[7]=o,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],this}extractBasis(t,e,i){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],h=i[4],f=i[7],u=i[2],m=i[5],_=i[8],S=s[0],p=s[3],d=s[6],M=s[1],C=s[4],y=s[7],A=s[2],b=s[5],T=s[8];return r[0]=o*S+a*M+l*A,r[3]=o*p+a*C+l*b,r[6]=o*d+a*y+l*T,r[1]=c*S+h*M+f*A,r[4]=c*p+h*C+f*b,r[7]=c*d+h*y+f*T,r[2]=u*S+m*M+_*A,r[5]=u*p+m*C+_*b,r[8]=u*d+m*y+_*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8];return e*o*h-e*a*c-i*r*h+i*a*l+s*r*c-s*o*l}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=h*o-a*c,u=a*l-h*r,m=c*r-o*l,_=e*f+i*u+s*m;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let S=1/_;return t[0]=f*S,t[1]=(s*c-h*i)*S,t[2]=(a*i-s*o)*S,t[3]=u*S,t[4]=(h*e-s*l)*S,t[5]=(s*r-a*e)*S,t[6]=m*S,t[7]=(i*l-c*e)*S,t[8]=(o*e-i*r)*S,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,i,s,r,o,a){let l=Math.cos(r),c=Math.sin(r);return this.set(i*l,i*c,-i*(l*o+c*a)+o+t,-s*c,s*l,-s*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return Ui("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(oc.makeScale(t,e)),this}rotate(t){return Ui("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(oc.makeRotation(-t)),this}translate(t,e){return Ui("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(oc.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,i,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<9;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<9;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t}clone(){return new this.constructor().fromArray(this.elements)}};lh.prototype.isMatrix3=!0;var Nt=lh,oc=new Nt,Nu=new Nt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Uu=new Nt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function sm(){let n={enabled:!0,workingColorSpace:cr,spaces:{},convert:function(s,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===$t&&(s.r=Kn(s.r),s.g=Kn(s.g),s.b=Kn(s.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===$t&&(s.r=ms(s.r),s.g=ms(s.g),s.b=ms(s.b))),s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===jn?hr:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,o){return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(s,r){return Ui("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(s,r)},toWorkingColorSpace:function(s,r){return Ui("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(s,r)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[cr]:{primaries:t,whitePoint:i,transfer:hr,toXYZ:Nu,fromXYZ:Uu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:en},outputColorSpaceConfig:{drawingBufferColorSpace:en}},[en]:{primaries:t,whitePoint:i,transfer:$t,toXYZ:Nu,fromXYZ:Uu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:en}}}),n}var Xt=sm();function Kn(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function ms(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var es,ra=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let i;if(t instanceof HTMLCanvasElement)i=t;else{es===void 0&&(es=ur("canvas")),es.width=t.width,es.height=t.height;let s=es.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),i=es}return i.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=ur("canvas");e.width=t.width,e.height=t.height;let i=e.getContext("2d");i.drawImage(t,0,0,t.width,t.height);let s=i.getImageData(0,0,t.width,t.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Kn(r[o]/255)*255;return i.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let i=0;i<e.length;i++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[i]=Math.floor(Kn(e[i]/255)*255):e[i]=Kn(e[i]);return{data:e,width:t.width,height:t.height}}else return Rt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},rm=0,ys=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:rm++}),this.uuid=Hr(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let i={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(ac(s[o].image)):r.push(ac(s[o]))}else r=ac(s);i.url=r}return e||(t.images[this.uuid]=i),i}};function ac(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?ra.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Rt("Texture: Unable to serialize Texture."),{})}var om=0,lc=new z,Ze=class n extends Rn{constructor(t=n.DEFAULT_IMAGE,e=n.DEFAULT_MAPPING,i=wn,s=wn,r=Re,o=vi,a=cn,l=Je,c=n.DEFAULT_ANISOTROPY,h=jn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:om++}),this.uuid=Hr(),this.name="",this.source=new ys(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=i,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new kt(0,0),this.repeat=new kt(1,1),this.center=new kt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Nt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(lc).x}get height(){return this.source.getSize(lc).y}get depth(){return this.source.getSize(lc).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let i=t[e];if(i===void 0){Rt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Rt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&i&&s.isVector2&&i.isVector2||s&&i&&s.isVector3&&i.isVector3||s&&i&&s.isMatrix3&&i.isMatrix3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),e||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Yc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ea:t.x=t.x-Math.floor(t.x);break;case wn:t.x=t.x<0?0:1;break;case na:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ea:t.y=t.y-Math.floor(t.y);break;case wn:t.y=t.y<0?0:1;break;case na:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Ze.DEFAULT_IMAGE=null;Ze.DEFAULT_MAPPING=Yc;Ze.DEFAULT_ANISOTROPY=1;var ch=class ch{constructor(t=0,e=0,i=0,s=1){this.x=t,this.y=e,this.z=i,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,i,s){return this.x=t,this.y=e,this.z=i,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,i=this.y,s=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*i+o[8]*s+o[12]*r,this.y=o[1]*e+o[5]*i+o[9]*s+o[13]*r,this.z=o[2]*e+o[6]*i+o[10]*s+o[14]*r,this.w=o[3]*e+o[7]*i+o[11]*s+o[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,i,s,r,l=t.elements,c=l[0],h=l[4],f=l[8],u=l[1],m=l[5],_=l[9],S=l[2],p=l[6],d=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-S)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+S)<.1&&Math.abs(_+p)<.1&&Math.abs(c+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let C=(c+1)/2,y=(m+1)/2,A=(d+1)/2,b=(h+u)/4,T=(f+S)/4,g=(_+p)/4;return C>y&&C>A?C<.01?(i=0,s=.707106781,r=.707106781):(i=Math.sqrt(C),s=b/i,r=T/i):y>A?y<.01?(i=.707106781,s=0,r=.707106781):(s=Math.sqrt(y),i=b/s,r=g/s):A<.01?(i=.707106781,s=.707106781,r=0):(r=Math.sqrt(A),i=T/r,s=g/r),this.set(i,s,r,e),this}let M=Math.sqrt((p-_)*(p-_)+(f-S)*(f-S)+(u-h)*(u-h));return Math.abs(M)<.001&&(M=1),this.x=(p-_)/M,this.y=(f-S)/M,this.z=(u-h)/M,this.w=Math.acos((c+m+d-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=qt(this.x,t.x,e.x),this.y=qt(this.y,t.y,e.y),this.z=qt(this.z,t.z,e.z),this.w=qt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=qt(this.x,t,e),this.y=qt(this.y,t,e),this.z=qt(this.z,t,e),this.w=qt(this.w,t,e),this}clampLength(t,e){let i=this.length();return this.divideScalar(i||1).multiplyScalar(qt(i,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,i){return this.x=t.x+(e.x-t.x)*i,this.y=t.y+(e.y-t.y)*i,this.z=t.z+(e.z-t.z)*i,this.w=t.w+(e.w-t.w)*i,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ch.prototype.isVector4=!0;var he=ch,oa=class extends Rn{constructor(t=1,e=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Re,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=i.depth,this.scissor=new he(0,0,t,e),this.scissorTest=!1,this.viewport=new he(0,0,t,e),this.textures=[];let s={width:t,height:e,depth:i.depth},r=new Ze(s),o=i.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Re,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,i=1){if(this.width!==t||this.height!==e||this.depth!==i){this.width=t,this.height=e,this.depth=i;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=i,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,i=t.textures.length;e<i;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new ys(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ke=class extends oa{constructor(t=1,e=1,i={}){super(t,e,i),this.isWebGLRenderTarget=!0}},fr=class extends Ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=be,this.minFilter=be,this.wrapR=wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var aa=class extends Ze{constructor(t=null,e=1,i=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:i,depth:s},this.magFilter=be,this.minFilter=be,this.wrapR=wn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var Ea=class Ea{constructor(t,e,i,s,r,o,a,l,c,h,f,u,m,_,S,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,i,s,r,o,a,l,c,h,f,u,m,_,S,p)}set(t,e,i,s,r,o,a,l,c,h,f,u,m,_,S,p){let d=this.elements;return d[0]=t,d[4]=e,d[8]=i,d[12]=s,d[1]=r,d[5]=o,d[9]=a,d[13]=l,d[2]=c,d[6]=h,d[10]=f,d[14]=u,d[3]=m,d[7]=_,d[11]=S,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ea().fromArray(this.elements)}copy(t){let e=this.elements,i=t.elements;return e[0]=i[0],e[1]=i[1],e[2]=i[2],e[3]=i[3],e[4]=i[4],e[5]=i[5],e[6]=i[6],e[7]=i[7],e[8]=i[8],e[9]=i[9],e[10]=i[10],e[11]=i[11],e[12]=i[12],e[13]=i[13],e[14]=i[14],e[15]=i[15],this}copyPosition(t){let e=this.elements,i=t.elements;return e[12]=i[12],e[13]=i[13],e[14]=i[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,i){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),i.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(t,e,i){return this.set(t.x,e.x,i.x,0,t.y,e.y,i.y,0,t.z,e.z,i.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,i=t.elements,s=1/ns.setFromMatrixColumn(t,0).length(),r=1/ns.setFromMatrixColumn(t,1).length(),o=1/ns.setFromMatrixColumn(t,2).length();return e[0]=i[0]*s,e[1]=i[1]*s,e[2]=i[2]*s,e[3]=0,e[4]=i[4]*r,e[5]=i[5]*r,e[6]=i[6]*r,e[7]=0,e[8]=i[8]*o,e[9]=i[9]*o,e[10]=i[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,i=t.x,s=t.y,r=t.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(s),c=Math.sin(s),h=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let u=o*h,m=o*f,_=a*h,S=a*f;e[0]=l*h,e[4]=-l*f,e[8]=c,e[1]=m+_*c,e[5]=u-S*c,e[9]=-a*l,e[2]=S-u*c,e[6]=_+m*c,e[10]=o*l}else if(t.order==="YXZ"){let u=l*h,m=l*f,_=c*h,S=c*f;e[0]=u+S*a,e[4]=_*a-m,e[8]=o*c,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=m*a-_,e[6]=S+u*a,e[10]=o*l}else if(t.order==="ZXY"){let u=l*h,m=l*f,_=c*h,S=c*f;e[0]=u-S*a,e[4]=-o*f,e[8]=_+m*a,e[1]=m+_*a,e[5]=o*h,e[9]=S-u*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){let u=o*h,m=o*f,_=a*h,S=a*f;e[0]=l*h,e[4]=_*c-m,e[8]=u*c+S,e[1]=l*f,e[5]=S*c+u,e[9]=m*c-_,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){let u=o*l,m=o*c,_=a*l,S=a*c;e[0]=l*h,e[4]=S-u*f,e[8]=_*f+m,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-c*h,e[6]=m*f+_,e[10]=u-S*f}else if(t.order==="XZY"){let u=o*l,m=o*c,_=a*l,S=a*c;e[0]=l*h,e[4]=-f,e[8]=c*h,e[1]=u*f+S,e[5]=o*h,e[9]=m*f-_,e[2]=_*f-m,e[6]=a*h,e[10]=S*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(am,t,lm)}lookAt(t,e,i){let s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),ai.crossVectors(i,Qe),ai.lengthSq()===0&&(Math.abs(i.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),ai.crossVectors(i,Qe)),ai.normalize(),To.crossVectors(Qe,ai),s[0]=ai.x,s[4]=To.x,s[8]=Qe.x,s[1]=ai.y,s[5]=To.y,s[9]=Qe.y,s[2]=ai.z,s[6]=To.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let i=t.elements,s=e.elements,r=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],h=i[1],f=i[5],u=i[9],m=i[13],_=i[2],S=i[6],p=i[10],d=i[14],M=i[3],C=i[7],y=i[11],A=i[15],b=s[0],T=s[4],g=s[8],E=s[12],P=s[1],R=s[5],D=s[9],L=s[13],I=s[2],U=s[6],W=s[10],k=s[14],J=s[3],B=s[7],X=s[11],K=s[15];return r[0]=o*b+a*P+l*I+c*J,r[4]=o*T+a*R+l*U+c*B,r[8]=o*g+a*D+l*W+c*X,r[12]=o*E+a*L+l*k+c*K,r[1]=h*b+f*P+u*I+m*J,r[5]=h*T+f*R+u*U+m*B,r[9]=h*g+f*D+u*W+m*X,r[13]=h*E+f*L+u*k+m*K,r[2]=_*b+S*P+p*I+d*J,r[6]=_*T+S*R+p*U+d*B,r[10]=_*g+S*D+p*W+d*X,r[14]=_*E+S*L+p*k+d*K,r[3]=M*b+C*P+y*I+A*J,r[7]=M*T+C*R+y*U+A*B,r[11]=M*g+C*D+y*W+A*X,r[15]=M*E+C*L+y*k+A*K,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[12],o=t[1],a=t[5],l=t[9],c=t[13],h=t[2],f=t[6],u=t[10],m=t[14],_=t[3],S=t[7],p=t[11],d=t[15],M=l*m-c*u,C=a*m-c*f,y=a*u-l*f,A=o*m-c*h,b=o*u-l*h,T=o*f-a*h;return e*(S*M-p*C+d*y)-i*(_*M-p*A+d*b)+s*(_*C-S*A+d*T)-r*(_*y-S*b+p*T)}determinantAffine(){let t=this.elements,e=t[0],i=t[4],s=t[8],r=t[1],o=t[5],a=t[9],l=t[2],c=t[6],h=t[10];return e*(o*h-a*c)-i*(r*h-a*l)+s*(r*c-o*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,i){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=i),this}invert(){let t=this.elements,e=t[0],i=t[1],s=t[2],r=t[3],o=t[4],a=t[5],l=t[6],c=t[7],h=t[8],f=t[9],u=t[10],m=t[11],_=t[12],S=t[13],p=t[14],d=t[15],M=e*a-i*o,C=e*l-s*o,y=e*c-r*o,A=i*l-s*a,b=i*c-r*a,T=s*c-r*l,g=h*S-f*_,E=h*p-u*_,P=h*d-m*_,R=f*p-u*S,D=f*d-m*S,L=u*d-m*p,I=M*L-C*D+y*R+A*P-b*E+T*g;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let U=1/I;return t[0]=(a*L-l*D+c*R)*U,t[1]=(s*D-i*L-r*R)*U,t[2]=(S*T-p*b+d*A)*U,t[3]=(u*b-f*T-m*A)*U,t[4]=(l*P-o*L-c*E)*U,t[5]=(e*L-s*P+r*E)*U,t[6]=(p*y-_*T-d*C)*U,t[7]=(h*T-u*y+m*C)*U,t[8]=(o*D-a*P+c*g)*U,t[9]=(i*P-e*D-r*g)*U,t[10]=(_*b-S*y+d*M)*U,t[11]=(f*y-h*b-m*M)*U,t[12]=(a*E-o*R-l*g)*U,t[13]=(e*R-i*E+s*g)*U,t[14]=(S*C-_*A-p*M)*U,t[15]=(h*A-f*C+u*M)*U,this}scale(t){let e=this.elements,i=t.x,s=t.y,r=t.z;return e[0]*=i,e[4]*=s,e[8]*=r,e[1]*=i,e[5]*=s,e[9]*=r,e[2]*=i,e[6]*=s,e[10]*=r,e[3]*=i,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],i=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,i,s))}makeTranslation(t,e,i){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,i,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),i=Math.sin(t);return this.set(1,0,0,0,0,e,-i,0,0,i,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,0,i,0,0,1,0,0,-i,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),i=Math.sin(t);return this.set(e,-i,0,0,i,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let i=Math.cos(e),s=Math.sin(e),r=1-i,o=t.x,a=t.y,l=t.z,c=r*o,h=r*a;return this.set(c*o+i,c*a-s*l,c*l+s*a,0,c*a+s*l,h*a+i,h*l-s*o,0,c*l-s*a,h*l+s*o,r*l*l+i,0,0,0,0,1),this}makeScale(t,e,i){return this.set(t,0,0,0,0,e,0,0,0,0,i,0,0,0,0,1),this}makeShear(t,e,i,s,r,o){return this.set(1,i,r,0,t,1,o,0,e,s,1,0,0,0,0,1),this}compose(t,e,i){let s=this.elements,r=e._x,o=e._y,a=e._z,l=e._w,c=r+r,h=o+o,f=a+a,u=r*c,m=r*h,_=r*f,S=o*h,p=o*f,d=a*f,M=l*c,C=l*h,y=l*f,A=i.x,b=i.y,T=i.z;return s[0]=(1-(S+d))*A,s[1]=(m+y)*A,s[2]=(_-C)*A,s[3]=0,s[4]=(m-y)*b,s[5]=(1-(u+d))*b,s[6]=(p+M)*b,s[7]=0,s[8]=(_+C)*T,s[9]=(p-M)*T,s[10]=(1-(u+S))*T,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,i){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let r=this.determinantAffine();if(r===0)return i.set(1,1,1),e.identity(),this;let o=ns.set(s[0],s[1],s[2]).length(),a=ns.set(s[4],s[5],s[6]).length(),l=ns.set(s[8],s[9],s[10]).length();r<0&&(o=-o),un.copy(this);let c=1/o,h=1/a,f=1/l;return un.elements[0]*=c,un.elements[1]*=c,un.elements[2]*=c,un.elements[4]*=h,un.elements[5]*=h,un.elements[6]*=h,un.elements[8]*=f,un.elements[9]*=f,un.elements[10]*=f,e.setFromRotationMatrix(un),i.x=o,i.y=a,i.z=l,this}makePerspective(t,e,i,s,r,o,a=mn,l=!1){let c=this.elements,h=2*r/(e-t),f=2*r/(i-s),u=(e+t)/(e-t),m=(i+s)/(i-s),_,S;if(l)_=r/(o-r),S=o*r/(o-r);else if(a===mn)_=-(o+r)/(o-r),S=-2*o*r/(o-r);else if(a===xs)_=-o/(o-r),S=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=m,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,i,s,r,o,a=mn,l=!1){let c=this.elements,h=2/(e-t),f=2/(i-s),u=-(e+t)/(e-t),m=-(i+s)/(i-s),_,S;if(l)_=1/(o-r),S=o/(o-r);else if(a===mn)_=-2/(o-r),S=-(o+r)/(o-r);else if(a===xs)_=-1/(o-r),S=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=m,c[2]=0,c[6]=0,c[10]=_,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,i=t.elements;for(let s=0;s<16;s++)if(e[s]!==i[s])return!1;return!0}fromArray(t,e=0){for(let i=0;i<16;i++)this.elements[i]=t[i+e];return this}toArray(t=[],e=0){let i=this.elements;return t[e]=i[0],t[e+1]=i[1],t[e+2]=i[2],t[e+3]=i[3],t[e+4]=i[4],t[e+5]=i[5],t[e+6]=i[6],t[e+7]=i[7],t[e+8]=i[8],t[e+9]=i[9],t[e+10]=i[10],t[e+11]=i[11],t[e+12]=i[12],t[e+13]=i[13],t[e+14]=i[14],t[e+15]=i[15],t}};Ea.prototype.isMatrix4=!0;var ne=Ea,ns=new z,un=new ne,am=new z(0,0,0),lm=new z(1,1,1),ai=new z,To=new z,Qe=new z,Fu=new ne,Ou=new In,Pn=class n{constructor(t=0,e=0,i=0,s=n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=i,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,i,s=this._order){return this._x=t,this._y=e,this._z=i,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,i=!0){let s=t.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],h=s[9],f=s[2],u=s[6],m=s[10];switch(e){case"XYZ":this._y=Math.asin(qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-qt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(qt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:Rt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,i){return Fu.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Fu,e,i)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ou.setFromEuler(this),this.setFromQuaternion(Ou,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Pn.DEFAULT_ORDER="XYZ";var dr=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},cm=0,Bu=new z,is=new In,Hn=new ne,Eo=new z,nr=new z,hm=new z,um=new In,Vu=new z(1,0,0),zu=new z(0,1,0),ku=new z(0,0,1),Gu={type:"added"},fm={type:"removed"},ss={type:"childadded",child:null},cc={type:"childremoved",child:null},Te=class n extends Rn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:cm++}),this.uuid=Hr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let t=new z,e=new Pn,i=new In,s=new z(1,1,1);function r(){i.setFromEuler(e,!1)}function o(){e.setFromQuaternion(i,void 0,!1)}e._onChange(r),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new ne},normalMatrix:{value:new Nt}}),this.matrix=new ne,this.matrixWorld=new ne,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new dr,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.multiply(is),this}rotateOnWorldAxis(t,e){return is.setFromAxisAngle(t,e),this.quaternion.premultiply(is),this}rotateX(t){return this.rotateOnAxis(Vu,t)}rotateY(t){return this.rotateOnAxis(zu,t)}rotateZ(t){return this.rotateOnAxis(ku,t)}translateOnAxis(t,e){return Bu.copy(t).applyQuaternion(this.quaternion),this.position.add(Bu.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Vu,t)}translateY(t){return this.translateOnAxis(zu,t)}translateZ(t){return this.translateOnAxis(ku,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Hn.copy(this.matrixWorld).invert())}lookAt(t,e,i){t.isVector3?Eo.copy(t):Eo.set(t,e,i);let s=this.parent;this.updateWorldMatrix(!0,!1),nr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hn.lookAt(nr,Eo,this.up):Hn.lookAt(Eo,nr,this.up),this.quaternion.setFromRotationMatrix(Hn),s&&(Hn.extractRotation(s.matrixWorld),is.setFromRotationMatrix(Hn),this.quaternion.premultiply(is.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(It("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Gu),ss.child=t,this.dispatchEvent(ss),ss.child=null):It("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(fm),cc.child=t,this.dispatchEvent(cc),cc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Hn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Hn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Hn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Gu),ss.child=t,this.dispatchEvent(ss),ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let i=0,s=this.children.length;i<s;i++){let o=this.children[i].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,i=[]){this[t]===e&&i.push(this);let s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(t,e,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,t,hm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nr,um,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(t){t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,i=t.y,s=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*i-r[8]*s,r[13]+=i-r[1]*e-r[5]*i-r[9]*s,r[14]+=s-r[2]*e-r[6]*i-r[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let i=0,s=e.length;i<s;i++)e[i].updateMatrixWorld(t)}updateWorldMatrix(t,e,i=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),e===!0){let r=this.children;for(let o=0,a=r.length;o<a;o++)r[o].updateWorldMatrix(!1,!0,i)}}toJSON(t){let e=t===void 0||typeof t=="string",i={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(a=>({...a})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(t.materials,this.material[l]));s.material=a}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];s.animations.push(r(t.animations,l))}}if(e){let a=o(t.geometries),l=o(t.materials),c=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),m=o(t.animations),_=o(t.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),h.length>0&&(i.images=h),f.length>0&&(i.shapes=f),u.length>0&&(i.skeletons=u),m.length>0&&(i.animations=m),_.length>0&&(i.nodes=_)}return i.object=s,i;function o(a){let l=[];for(let c in a){let h=a[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let i=0;i<t.children.length;i++){let s=t.children[i];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Te.DEFAULT_UP=new z(0,1,0);Te.DEFAULT_MATRIX_AUTO_UPDATE=!0;Te.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Zn=class extends Te{constructor(){super(),this.isGroup=!0,this.type="Group"}},dm={type:"move"},vs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let i of t.hand.values())this._getHandJoint(e,i)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,i){let s=null,r=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(let S of t.hand.values()){let p=e.getJointPose(S,i),d=this._getHandJoint(c,S);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}let h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),m=.02,_=.005;c.inputState.pinching&&u>m+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&u<=m-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,i),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(s=e.getPose(t.targetRaySpace,i),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(dm)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let i=new Zn;i.matrixAutoUpdate=!1,i.visible=!1,t.joints[e.jointName]=i,t.add(i)}return t.joints[e.jointName]}},Gf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},li={h:0,s:0,l:0},Ao={h:0,s:0,l:0};function hc(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*6*(2/3-e):n}var Gt=class{constructor(t,e,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,i)}set(t,e,i){if(e===void 0&&i===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,i);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=en){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Xt.colorSpaceToWorking(this,e),this}setRGB(t,e,i,s=Xt.workingColorSpace){return this.r=t,this.g=e,this.b=i,Xt.colorSpaceToWorking(this,s),this}setHSL(t,e,i,s=Xt.workingColorSpace){if(t=im(t,1),e=qt(e,0,1),i=qt(i,0,1),e===0)this.r=this.g=this.b=i;else{let r=i<=.5?i*(1+e):i+e-i*e,o=2*i-r;this.r=hc(o,r,t+1/3),this.g=hc(o,r,t),this.b=hc(o,r,t-1/3)}return Xt.colorSpaceToWorking(this,s),this}setStyle(t,e=en){function i(r){r!==void 0&&parseFloat(r)<1&&Rt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Rt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);Rt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=en){let i=Gf[t.toLowerCase()];return i!==void 0?this.setHex(i,e):Rt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Kn(t.r),this.g=Kn(t.g),this.b=Kn(t.b),this}copyLinearToSRGB(t){return this.r=ms(t.r),this.g=ms(t.g),this.b=ms(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=en){return Xt.workingToColorSpace(Fe.copy(this),t),Math.round(qt(Fe.r*255,0,255))*65536+Math.round(qt(Fe.g*255,0,255))*256+Math.round(qt(Fe.b*255,0,255))}getHexString(t=en){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Xt.workingColorSpace){Xt.workingToColorSpace(Fe.copy(this),e);let i=Fe.r,s=Fe.g,r=Fe.b,o=Math.max(i,s,r),a=Math.min(i,s,r),l,c,h=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=h<=.5?f/(o+a):f/(2-o-a),o){case i:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-i)/f+2;break;case r:l=(i-s)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=Xt.workingColorSpace){return Xt.workingToColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=en){Xt.workingToColorSpace(Fe.copy(this),t);let e=Fe.r,i=Fe.g,s=Fe.b;return t!==en?`color(${t} ${e.toFixed(3)} ${i.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(i*255)},${Math.round(s*255)})`}offsetHSL(t,e,i){return this.getHSL(li),this.setHSL(li.h+t,li.s+e,li.l+i)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,i){return this.r=t.r+(e.r-t.r)*i,this.g=t.g+(e.g-t.g)*i,this.b=t.b+(e.b-t.b)*i,this}lerpHSL(t,e){this.getHSL(li),t.getHSL(Ao);let i=sc(li.h,Ao.h,e),s=sc(li.s,Ao.s,e),r=sc(li.l,Ao.l,e);return this.setHSL(i,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,i=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*i+r[6]*s,this.g=r[1]*e+r[4]*i+r[7]*s,this.b=r[2]*e+r[5]*i+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Fe=new Gt;Gt.NAMES=Gf;var Fi=class extends Te{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Pn,this.environmentIntensity=1,this.environmentRotation=new Pn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},fn=new z,Wn=new z,uc=new z,Xn=new z,rs=new z,os=new z,Hu=new z,fc=new z,dc=new z,pc=new z,mc=new he,gc=new he,xc=new he,fi=class n{constructor(t=new z,e=new z,i=new z){this.a=t,this.b=e,this.c=i}static getNormal(t,e,i,s){s.subVectors(i,e),fn.subVectors(t,e),s.cross(fn);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,i,s,r){fn.subVectors(s,e),Wn.subVectors(i,e),uc.subVectors(t,e);let o=fn.dot(fn),a=fn.dot(Wn),l=fn.dot(uc),c=Wn.dot(Wn),h=Wn.dot(uc),f=o*c-a*a;if(f===0)return r.set(0,0,0),null;let u=1/f,m=(c*l-a*h)*u,_=(o*h-a*l)*u;return r.set(1-m-_,_,m)}static containsPoint(t,e,i,s){return this.getBarycoord(t,e,i,s,Xn)===null?!1:Xn.x>=0&&Xn.y>=0&&Xn.x+Xn.y<=1}static getInterpolation(t,e,i,s,r,o,a,l){return this.getBarycoord(t,e,i,s,Xn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Xn.x),l.addScaledVector(o,Xn.y),l.addScaledVector(a,Xn.z),l)}static getInterpolatedAttribute(t,e,i,s,r,o){return mc.setScalar(0),gc.setScalar(0),xc.setScalar(0),mc.fromBufferAttribute(t,e),gc.fromBufferAttribute(t,i),xc.fromBufferAttribute(t,s),o.setScalar(0),o.addScaledVector(mc,r.x),o.addScaledVector(gc,r.y),o.addScaledVector(xc,r.z),o}static isFrontFacing(t,e,i,s){return fn.subVectors(i,e),Wn.subVectors(t,e),fn.cross(Wn).dot(s)<0}set(t,e,i){return this.a.copy(t),this.b.copy(e),this.c.copy(i),this}setFromPointsAndIndices(t,e,i,s){return this.a.copy(t[e]),this.b.copy(t[i]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,i,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,i),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return fn.subVectors(this.c,this.b),Wn.subVectors(this.a,this.b),fn.cross(Wn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return n.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return n.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,i,s,r){return n.getInterpolation(t,this.a,this.b,this.c,e,i,s,r)}containsPoint(t){return n.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return n.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let i=this.a,s=this.b,r=this.c,o,a;rs.subVectors(s,i),os.subVectors(r,i),fc.subVectors(t,i);let l=rs.dot(fc),c=os.dot(fc);if(l<=0&&c<=0)return e.copy(i);dc.subVectors(t,s);let h=rs.dot(dc),f=os.dot(dc);if(h>=0&&f<=h)return e.copy(s);let u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return o=l/(l-h),e.copy(i).addScaledVector(rs,o);pc.subVectors(t,r);let m=rs.dot(pc),_=os.dot(pc);if(_>=0&&m<=_)return e.copy(r);let S=m*c-l*_;if(S<=0&&c>=0&&_<=0)return a=c/(c-_),e.copy(i).addScaledVector(os,a);let p=h*_-m*f;if(p<=0&&f-h>=0&&m-_>=0)return Hu.subVectors(r,s),a=(f-h)/(f-h+(m-_)),e.copy(s).addScaledVector(Hu,a);let d=1/(p+S+u);return o=S*d,a=u*d,e.copy(i).addScaledVector(rs,o).addScaledVector(os,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Dn=class{constructor(t=new z(1/0,1/0,1/0),e=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e+=3)this.expandByPoint(dn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,i=t.count;e<i;e++)this.expandByPoint(dn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,i=t.length;e<i;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let i=dn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(i),this.max.copy(t).add(i),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let i=t.geometry;if(i!==void 0){let r=i.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,dn):dn.fromBufferAttribute(r,o),dn.applyMatrix4(t.matrixWorld),this.expandByPoint(dn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),wo.copy(t.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wo.copy(i.boundingBox)),wo.applyMatrix4(t.matrixWorld),this.union(wo)}let s=t.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,dn),dn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,i;return t.normal.x>0?(e=t.normal.x*this.min.x,i=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,i=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,i+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,i+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,i+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,i+=t.normal.z*this.min.z),e<=-t.constant&&i>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(ir),Co.subVectors(this.max,ir),as.subVectors(t.a,ir),ls.subVectors(t.b,ir),cs.subVectors(t.c,ir),ci.subVectors(ls,as),hi.subVectors(cs,ls),Pi.subVectors(as,cs);let e=[0,-ci.z,ci.y,0,-hi.z,hi.y,0,-Pi.z,Pi.y,ci.z,0,-ci.x,hi.z,0,-hi.x,Pi.z,0,-Pi.x,-ci.y,ci.x,0,-hi.y,hi.x,0,-Pi.y,Pi.x,0];return!_c(e,as,ls,cs,Co)||(e=[1,0,0,0,1,0,0,0,1],!_c(e,as,ls,cs,Co))?!1:(Ro.crossVectors(ci,hi),e=[Ro.x,Ro.y,Ro.z],_c(e,as,ls,cs,Co))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,dn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(dn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(qn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),qn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),qn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),qn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),qn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),qn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),qn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),qn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(qn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},qn=[new z,new z,new z,new z,new z,new z,new z,new z],dn=new z,wo=new Dn,as=new z,ls=new z,cs=new z,ci=new z,hi=new z,Pi=new z,ir=new z,Co=new z,Ro=new z,Di=new z;function _c(n,t,e,i,s){for(let r=0,o=n.length-3;r<=o;r+=3){Di.fromArray(n,r);let a=s.x*Math.abs(Di.x)+s.y*Math.abs(Di.y)+s.z*Math.abs(Di.z),l=t.dot(Di),c=e.dot(Di),h=i.dot(Di);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>a)return!1}return!0}var xe=new z,Io=new kt,pm=0,ke=class extends Rn{constructor(t,e,i=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:pm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=i,this.usage=Of,this.updateRanges=[],this.gpuType=ln,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,i){t*=this.itemSize,i*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[i+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,i=this.count;e<i;e++)Io.fromBufferAttribute(this,e),Io.applyMatrix3(t),this.setXY(e,Io.x,Io.y);else if(this.itemSize===3)for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix3(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyMatrix4(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyMatrix4(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}applyNormalMatrix(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.applyNormalMatrix(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}transformDirection(t){for(let e=0,i=this.count;e<i;e++)xe.fromBufferAttribute(this,e),xe.transformDirection(t),this.setXYZ(e,xe.x,xe.y,xe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let i=this.array[t*this.itemSize+e];return this.normalized&&(i=er(i,this.array)),i}setComponent(t,e,i){return this.normalized&&(i=Ye(i,this.array)),this.array[t*this.itemSize+e]=i,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=er(e,this.array)),e}setX(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=er(e,this.array)),e}setY(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=er(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=er(e,this.array)),e}setW(t,e){return this.normalized&&(e=Ye(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,i){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),i=Ye(i,this.array)),this.array[t+0]=e,this.array[t+1]=i,this}setXYZ(t,e,i,s){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),i=Ye(i,this.array),s=Ye(s,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this}setXYZW(t,e,i,s,r){return t*=this.itemSize,this.normalized&&(e=Ye(e,this.array),i=Ye(i,this.array),s=Ye(s,this.array),r=Ye(r,this.array)),this.array[t+0]=e,this.array[t+1]=i,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}};var pr=class extends ke{constructor(t,e,i){super(new Uint16Array(t),e,i)}};var mr=class extends ke{constructor(t,e,i){super(new Uint32Array(t),e,i)}};var Me=class extends ke{constructor(t,e,i){super(new Float32Array(t),e,i)}},mm=new Dn,sr=new z,yc=new z,Jn=class{constructor(t=new z,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let i=this.center;e!==void 0?i.copy(e):mm.setFromPoints(t).getCenter(i);let s=0;for(let r=0,o=t.length;r<o;r++)s=Math.max(s,i.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let i=this.center.distanceToSquared(t);return e.copy(t),i>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;sr.subVectors(t,this.center);let e=sr.lengthSq();if(e>this.radius*this.radius){let i=Math.sqrt(e),s=(i-this.radius)*.5;this.center.addScaledVector(sr,s/i),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(yc.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(sr.copy(t.center).add(yc)),this.expandByPoint(sr.copy(t.center).sub(yc))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},gm=0,an=new ne,vc=new Te,hs=new z,tn=new Dn,rr=new Dn,Se=new z,Ge=class n extends Rn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=Hr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(em(t)?mr:pr)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,i=0){this.groups.push({start:t,count:e,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let r=new Nt().getNormalMatrix(t);i.applyNormalMatrix(r),i.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return an.makeRotationFromQuaternion(t),this.applyMatrix4(an),this}rotateX(t){return an.makeRotationX(t),this.applyMatrix4(an),this}rotateY(t){return an.makeRotationY(t),this.applyMatrix4(an),this}rotateZ(t){return an.makeRotationZ(t),this.applyMatrix4(an),this}translate(t,e,i){return an.makeTranslation(t,e,i),this.applyMatrix4(an),this}scale(t,e,i){return an.makeScale(t,e,i),this.applyMatrix4(an),this}lookAt(t){return vc.lookAt(t),vc.updateMatrix(),this.applyMatrix4(vc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(hs).negate(),this.translate(hs.x,hs.y,hs.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let i=[];for(let s=0,r=t.length;s<r;s++){let o=t[s];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Me(i,3))}else{let i=Math.min(t.length,e.count);for(let s=0;s<i;s++){let r=t[s];e.setXYZ(s,r.x,r.y,r.z||0)}t.length>e.count&&Rt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Dn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){It("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let i=0,s=e.length;i<s;i++){let r=e[i];tn.setFromBufferAttribute(r),this.morphTargetsRelative?(Se.addVectors(this.boundingBox.min,tn.min),this.boundingBox.expandByPoint(Se),Se.addVectors(this.boundingBox.max,tn.max),this.boundingBox.expandByPoint(Se)):(this.boundingBox.expandByPoint(tn.min),this.boundingBox.expandByPoint(tn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&It('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Jn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){It("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(t){let i=this.boundingSphere.center;if(tn.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){let a=e[r];rr.setFromBufferAttribute(a),this.morphTargetsRelative?(Se.addVectors(tn.min,rr.min),tn.expandByPoint(Se),Se.addVectors(tn.max,rr.max),tn.expandByPoint(Se)):(tn.expandByPoint(rr.min),tn.expandByPoint(rr.max))}tn.getCenter(i);let s=0;for(let r=0,o=t.count;r<o;r++)Se.fromBufferAttribute(t,r),s=Math.max(s,i.distanceToSquared(Se));if(e)for(let r=0,o=e.length;r<o;r++){let a=e[r],l=this.morphTargetsRelative;for(let c=0,h=a.count;c<h;c++)Se.fromBufferAttribute(a,c),l&&(hs.fromBufferAttribute(t,c),Se.add(hs)),s=Math.max(s,i.distanceToSquared(Se))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&It('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){It("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=e.position,s=e.normal,r=e.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new ke(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let g=0;g<i.count;g++)a[g]=new z,l[g]=new z;let c=new z,h=new z,f=new z,u=new kt,m=new kt,_=new kt,S=new z,p=new z;function d(g,E,P){c.fromBufferAttribute(i,g),h.fromBufferAttribute(i,E),f.fromBufferAttribute(i,P),u.fromBufferAttribute(r,g),m.fromBufferAttribute(r,E),_.fromBufferAttribute(r,P),h.sub(c),f.sub(c),m.sub(u),_.sub(u);let R=1/(m.x*_.y-_.x*m.y);isFinite(R)&&(S.copy(h).multiplyScalar(_.y).addScaledVector(f,-m.y).multiplyScalar(R),p.copy(f).multiplyScalar(m.x).addScaledVector(h,-_.x).multiplyScalar(R),a[g].add(S),a[E].add(S),a[P].add(S),l[g].add(p),l[E].add(p),l[P].add(p))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let g=0,E=M.length;g<E;++g){let P=M[g],R=P.start,D=P.count;for(let L=R,I=R+D;L<I;L+=3)d(t.getX(L+0),t.getX(L+1),t.getX(L+2))}let C=new z,y=new z,A=new z,b=new z;function T(g){A.fromBufferAttribute(s,g),b.copy(A);let E=a[g];C.copy(E),C.sub(A.multiplyScalar(A.dot(E))).normalize(),y.crossVectors(b,E);let R=y.dot(l[g])<0?-1:1;o.setXYZW(g,C.x,C.y,C.z,R)}for(let g=0,E=M.length;g<E;++g){let P=M[g],R=P.start,D=P.count;for(let L=R,I=R+D;L<I;L+=3)T(t.getX(L+0)),T(t.getX(L+1)),T(t.getX(L+2))}this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==e.count)i=new ke(new Float32Array(e.count*3),3),this.setAttribute("normal",i);else for(let u=0,m=i.count;u<m;u++)i.setXYZ(u,0,0,0);let s=new z,r=new z,o=new z,a=new z,l=new z,c=new z,h=new z,f=new z;if(t)for(let u=0,m=t.count;u<m;u+=3){let _=t.getX(u+0),S=t.getX(u+1),p=t.getX(u+2);s.fromBufferAttribute(e,_),r.fromBufferAttribute(e,S),o.fromBufferAttribute(e,p),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),a.fromBufferAttribute(i,_),l.fromBufferAttribute(i,S),c.fromBufferAttribute(i,p),a.add(h),l.add(h),c.add(h),i.setXYZ(_,a.x,a.y,a.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let u=0,m=e.count;u<m;u+=3)s.fromBufferAttribute(e,u+0),r.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,r),f.subVectors(s,r),h.cross(f),i.setXYZ(u+0,h.x,h.y,h.z),i.setXYZ(u+1,h.x,h.y,h.z),i.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,i=t.count;e<i;e++)Se.fromBufferAttribute(t,e),Se.normalize(),t.setXYZ(e,Se.x,Se.y,Se.z)}toNonIndexed(){function t(a,l){let c=a.array,h=a.itemSize,f=a.normalized,u=new c.constructor(l.length*h),m=0,_=0;for(let S=0,p=l.length;S<p;S++){a.isInterleavedBufferAttribute?m=l[S]*a.data.stride+a.offset:m=l[S]*h;for(let d=0;d<h;d++)u[_++]=c[m++]}return new ke(u,h,f)}if(this.index===null)return Rt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new n,i=this.index.array,s=this.attributes;for(let a in s){let l=s[a],c=t(l,i);e.setAttribute(a,c)}let r=this.morphAttributes;for(let a in r){let l=[],c=r[a];for(let h=0,f=c.length;h<f;h++){let u=c[h],m=t(u,i);l.push(m)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let i=this.attributes;for(let l in i){let c=i[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){let m=c[f];h.push(m.toJSON(t.data))}h.length>0&&(s[l]=h,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let i=t.index;i!==null&&this.setIndex(i.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let r=t.morphAttributes;for(let c in r){let h=[],f=r[c];for(let u=0,m=f.length;u<m;u++)h.push(f[u].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let c=0,h=o.length;c<h;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Sc=new z,xm=new z,_m=new Nt,pn=class{constructor(t=new z(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,i,s){return this.normal.set(t,e,i),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,i){let s=Sc.subVectors(i,e).cross(xm.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,i=!0){let s=t.delta(Sc),r=this.normal.dot(s);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let o=-(t.start.dot(this.normal)+this.constant)/r;return i===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(s,o)}intersectsLine(t){let e=this.distanceToPoint(t.start),i=this.distanceToPoint(t.end);return e<0&&i>0||i<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let i=e||_m.getNormalMatrix(t),s=this.coplanarPoint(Sc).applyMatrix4(t),r=this.normal.applyMatrix3(i).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},ym=0,Ln=class extends Rn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ym++}),this.uuid=Hr(),this.name="",this.type="Material",this.blending=As,this.side=_i,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Vc,this.blendDst=zc,this.blendEquation=Vi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=gs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=If,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yo,this.stencilZFail=Yo,this.stencilZPass=Yo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let i=t[e];if(i===void 0){Rt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){Rt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(i):s&&s.isVector2&&i&&i.isVector2||s&&s.isEuler&&i&&i.isEuler||s&&s.isVector3&&i&&i.isVector3?s.copy(i):this[e]=i}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(t).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(t).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(t).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(t).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(t).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function s(r){let o=[];for(let a in r){let l=r[a];delete l.metadata,o.push(l)}return o}if(e){let r=s(t.textures),o=s(t.images);r.length>0&&(i.textures=r),o.length>0&&(i.images=o)}return i}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Gt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(i=>new pn().fromJSON(i))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let i=t.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new kt().fromArray(i)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new kt().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,i=null;if(e!==null){let s=e.length;i=new Array(s);for(let r=0;r!==s;++r)i[r]=e[r].clone()}return this.clippingPlanes=i,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var Yn=new z,Mc=new z,Po=new z,Do=new z,gr=class{constructor(t=new z,e=new z(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Yn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let i=e.dot(this.direction);return i<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Yn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Yn.copy(this.origin).addScaledVector(this.direction,e),Yn.distanceToSquared(t))}distanceSqToSegment(t,e,i,s){Mc.copy(t).add(e).multiplyScalar(.5),Po.copy(e).sub(t).normalize(),Do.copy(this.origin).sub(Mc);let r=t.distanceTo(e)*.5,o=-this.direction.dot(Po),a=Do.dot(this.direction),l=-Do.dot(Po),c=Do.lengthSq(),h=Math.abs(1-o*o),f,u,m,_;if(h>0)if(f=o*l-a,u=o*a-l,_=r*h,f>=0)if(u>=-_)if(u<=_){let S=1/h;f*=S,u*=S,m=f*(f+o*u+2*a)+u*(o*f+u+2*l)+c}else u=r,f=Math.max(0,-(o*u+a)),m=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(o*u+a)),m=-f*f+u*(u+2*l)+c;else u<=-_?(f=Math.max(0,-(-o*r+a)),u=f>0?-r:Math.min(Math.max(-r,-l),r),m=-f*f+u*(u+2*l)+c):u<=_?(f=0,u=Math.min(Math.max(-r,-l),r),m=u*(u+2*l)+c):(f=Math.max(0,-(o*r+a)),u=f>0?r:Math.min(Math.max(-r,-l),r),m=-f*f+u*(u+2*l)+c);else u=o>0?-r:r,f=Math.max(0,-(o*u+a)),m=-f*f+u*(u+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(Mc).addScaledVector(Po,u),m}intersectSphere(t,e){if(t.radius<0)return null;Yn.subVectors(t.center,this.origin);let i=Yn.dot(this.direction),s=Yn.dot(Yn)-i*i,r=t.radius*t.radius;if(s>r)return null;let o=Math.sqrt(r-s),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(t.normal)+t.constant)/e;return i>=0?i:null}intersectPlane(t,e){let i=this.distanceToPlane(t);return i===null?null:this.at(i,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let i,s,r,o,a,l,c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(i=(t.min.x-u.x)*c,s=(t.max.x-u.x)*c):(i=(t.max.x-u.x)*c,s=(t.min.x-u.x)*c),h>=0?(r=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(r=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),i>o||r>s||((r>i||isNaN(i))&&(i=r),(o<s||isNaN(s))&&(s=o),f>=0?(a=(t.min.z-u.z)*f,l=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,l=(t.min.z-u.z)*f),i>l||a>s)||((a>i||i!==i)&&(i=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(i>=0?i:s,e)}intersectsBox(t){return this.intersectBox(t,Yn)!==null}intersectTriangle(t,e,i,s,r){let o=this.origin,a=this.direction,l=a.x,c=a.y,h=a.z,f=t.x-o.x,u=t.y-o.y,m=t.z-o.z,_=e.x-o.x,S=e.y-o.y,p=e.z-o.z,d=i.x-o.x,M=i.y-o.y,C=i.z-o.z,y=Math.abs(l),A=Math.abs(c),b=Math.abs(h),T,g,E,P,R,D,L,I,U,W,k,J;if(y>=A&&y>=b?(E=l,D=f,U=_,J=d,l>=0?(T=c,g=h,P=u,R=m,L=S,I=p,W=M,k=C):(T=h,g=c,P=m,R=u,L=p,I=S,W=C,k=M)):A>=b?(E=c,D=u,U=S,J=M,c>=0?(T=h,g=l,P=m,R=f,L=p,I=_,W=C,k=d):(T=l,g=h,P=f,R=m,L=_,I=p,W=d,k=C)):(E=h,D=m,U=p,J=C,h>=0?(T=l,g=c,P=f,R=u,L=_,I=S,W=d,k=M):(T=c,g=l,P=u,R=f,L=S,I=_,W=M,k=d)),E===0)return null;let B=T/E,X=g/E,K=1/E,it=P-B*D,rt=R-X*D,Ht=L-B*U,Lt=I-X*U,Ut=W-B*J,Z=k-X*J,Q=Ut*Lt-Z*Ht,xt=it*Z-rt*Ut,Pt=Ht*rt-Lt*it;if(s){if(Q<0||xt<0||Pt<0)return null}else if((Q<0||xt<0||Pt<0)&&(Q>0||xt>0||Pt>0))return null;let gt=Q+xt+Pt;if(gt===0)return null;let Dt=K*(Q*D+xt*U+Pt*J);return(gt>0?Dt<0:Dt>0)?null:this.at(Dt/gt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xr=class extends Ln{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=Aa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Wu=new ne,Li=new gr,Lo=new Jn,Xu=new z,No=new z,Uo=new z,Fo=new z,bc=new z,Oo=new z,qu=new z,Bo=new z,ie=class extends Te{constructor(t=new Ge,e=new xr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){let i=this.geometry,s=i.attributes.position,r=i.morphAttributes.position,o=i.morphTargetsRelative;e.fromBufferAttribute(s,t);let a=this.morphTargetInfluences;if(r&&a){Oo.set(0,0,0);for(let l=0,c=r.length;l<c;l++){let h=a[l],f=r[l];h!==0&&(bc.fromBufferAttribute(f,t),o?Oo.addScaledVector(bc,h):Oo.addScaledVector(bc.sub(e),h))}e.add(Oo)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Lo.copy(i.boundingSphere),Lo.applyMatrix4(r),Li.copy(t.ray).recast(t.near),!(Lo.containsPoint(Li.origin)===!1&&(Li.intersectSphere(Lo,Xu)===null||Li.origin.distanceToSquared(Xu)>(t.far-t.near)**2))&&(Wu.copy(r).invert(),Li.copy(t.ray).applyMatrix4(Wu),!(i.boundingBox!==null&&Li.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(t,e,Li)))}_computeIntersections(t,e,i){let s,r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let _=0,S=u.length;_<S;_++){let p=u[_],d=o[p.materialIndex],M=Math.max(p.start,m.start),C=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let y=M,A=C;y<A;y+=3){let b=a.getX(y),T=a.getX(y+1),g=a.getX(y+2);s=Vo(this,d,t,i,c,h,f,b,T,g),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let _=Math.max(0,m.start),S=Math.min(a.count,m.start+m.count);for(let p=_,d=S;p<d;p+=3){let M=a.getX(p),C=a.getX(p+1),y=a.getX(p+2);s=Vo(this,o,t,i,c,h,f,M,C,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let _=0,S=u.length;_<S;_++){let p=u[_],d=o[p.materialIndex],M=Math.max(p.start,m.start),C=Math.min(l.count,Math.min(p.start+p.count,m.start+m.count));for(let y=M,A=C;y<A;y+=3){let b=y,T=y+1,g=y+2;s=Vo(this,d,t,i,c,h,f,b,T,g),s&&(s.faceIndex=Math.floor(y/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let _=Math.max(0,m.start),S=Math.min(l.count,m.start+m.count);for(let p=_,d=S;p<d;p+=3){let M=p,C=p+1,y=p+2;s=Vo(this,o,t,i,c,h,f,M,C,y),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function vm(n,t,e,i,s,r,o,a){let l;if(t.side===Ie?l=i.intersectTriangle(o,r,s,!0,a):l=i.intersectTriangle(s,r,o,t.side===_i,a),l===null)return null;Bo.copy(a),Bo.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(Bo);return c<e.near||c>e.far?null:{distance:c,point:Bo.clone(),object:n}}function Vo(n,t,e,i,s,r,o,a,l,c){n.getVertexPosition(a,No),n.getVertexPosition(l,Uo),n.getVertexPosition(c,Fo);let h=vm(n,t,e,i,No,Uo,Fo,qu);if(h){let f=new z;fi.getBarycoord(qu,No,Uo,Fo,f),s&&(h.uv=fi.getInterpolatedAttribute(s,a,l,c,f,new kt)),r&&(h.uv1=fi.getInterpolatedAttribute(r,a,l,c,f,new kt)),o&&(h.normal=fi.getInterpolatedAttribute(o,a,l,c,f,new z),h.normal.dot(i.direction)>0&&h.normal.multiplyScalar(-1));let u={a,b:l,c,normal:new z,materialIndex:0};fi.getNormal(No,Uo,Fo,u.normal),h.face=u,h.barycoord=f}return h}var _r=class extends Ze{constructor(t=null,e=1,i=1,s,r,o,a,l,c=be,h=be,f,u){super(null,o,a,l,c,h,s,r,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var yr=class extends ke{constructor(t,e,i,s=1){super(t,e,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},us=new ne,Yu=new ne,zo=[],Zu=new Dn,Sm=new ne,or=new ie,ar=new Jn,vr=class extends ie{constructor(t,e,i){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new yr(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<i;s++)this.setMatrixAt(s,Sm)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Dn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,us),Zu.copy(t.boundingBox).applyMatrix4(us),this.boundingBox.union(Zu)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Jn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<e;i++)this.getMatrixAt(i,us),ar.copy(t.boundingSphere).applyMatrix4(us),this.boundingSphere.union(ar)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let i=e.morphTargetInfluences,s=this.morphTexture.source.data.data,r=i.length+1,o=t*r+1;for(let a=0;a<i.length;a++)i[a]=s[o+a]}raycast(t,e){let i=this.matrixWorld,s=this.count;if(or.geometry=this.geometry,or.material=this.material,or.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ar.copy(this.boundingSphere),ar.applyMatrix4(i),t.ray.intersectsSphere(ar)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,us),Yu.multiplyMatrices(i,us),or.matrixWorld=Yu,or.raycast(t,zo);for(let o=0,a=zo.length;o<a;o++){let l=zo[o];l.instanceId=r,l.object=this,e.push(l)}zo.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new yr(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let i=e.morphTargetInfluences,s=i.length+1;this.morphTexture===null&&(this.morphTexture=new _r(new Float32Array(s*this.count),s,this.count,La,ln));let r=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=s*t;return r[l]=a,r.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Ni=new Jn,Mm=new kt(.5,.5),ko=new z,Ss=class{constructor(t=new pn,e=new pn,i=new pn,s=new pn,r=new pn,o=new pn){this.planes=[t,e,i,s,r,o]}set(t,e,i,s,r,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(i),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(t){let e=this.planes;for(let i=0;i<6;i++)e[i].copy(t.planes[i]);return this}setFromProjectionMatrix(t,e=mn,i=!1){let s=this.planes,r=t.elements,o=r[0],a=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],m=r[7],_=r[8],S=r[9],p=r[10],d=r[11],M=r[12],C=r[13],y=r[14],A=r[15];if(s[0].setComponents(c-o,m-h,d-_,A-M).normalize(),s[1].setComponents(c+o,m+h,d+_,A+M).normalize(),s[2].setComponents(c+a,m+f,d+S,A+C).normalize(),s[3].setComponents(c-a,m-f,d-S,A-C).normalize(),i)s[4].setComponents(l,u,p,y).normalize(),s[5].setComponents(c-l,m-u,d-p,A-y).normalize();else if(s[4].setComponents(c-l,m-u,d-p,A-y).normalize(),e===mn)s[5].setComponents(c+l,m+u,d+p,A+y).normalize();else if(e===xs)s[5].setComponents(l,u,p,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ni.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ni.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ni)}intersectsSprite(t){Ni.center.set(0,0,0);let e=Mm.distanceTo(t.center);return Ni.radius=.7071067811865476+e,Ni.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ni)}intersectsSphere(t){let e=this.planes,i=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(i)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let i=0;i<6;i++){let s=e[i];if(ko.x=s.normal.x>0?t.max.x:t.min.x,ko.y=s.normal.y>0?t.max.y:t.min.y,ko.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(ko)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let i=0;i<6;i++)if(e[i].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Ms=class extends Ln{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},Ku=new ne,Ic=new gr,Go=new Jn,Ho=new z,Sr=class extends Te{constructor(t=new Ge,e=new Ms){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let i=this.geometry,s=this.matrixWorld,r=t.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Go.copy(i.boundingSphere),Go.applyMatrix4(s),Go.radius+=r,t.ray.intersectsSphere(Go)===!1)return;Ku.copy(s).invert(),Ic.copy(t.ray).applyMatrix4(Ku);let a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){let u=Math.max(0,o.start),m=Math.min(c.count,o.start+o.count);for(let _=u,S=m;_<S;_++){let p=c.getX(_);Ho.fromBufferAttribute(f,p),Ju(Ho,p,l,s,t,e,this)}}else{let u=Math.max(0,o.start),m=Math.min(f.count,o.start+o.count);for(let _=u,S=m;_<S;_++)Ho.fromBufferAttribute(f,_),Ju(Ho,_,l,s,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,i=Object.keys(e);if(i.length>0){let s=e[i[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){let a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}};function Ju(n,t,e,i,s,r,o){let a=Ic.distanceSqToPoint(n);if(a<e){let l=new z;Ic.closestPointToPoint(n,l),l.applyMatrix4(i);let c=s.ray.origin.distanceTo(l);if(c<s.near||c>s.far)return;r.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}var Mr=class extends Ze{constructor(t=[],e=yi,i,s,r,o,a,l,c,h){super(t,e,i,s,r,o,a,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}};var di=class extends Ze{constructor(t,e,i=xn,s,r,o,a=be,l=be,c,h=Cn,f=1){if(h!==Cn&&h!==Si)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let u={width:t,height:e,depth:f};super(u,s,r,o,a,l,h,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new ys(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},la=class extends di{constructor(t,e=xn,i=yi,s,r,o=be,a=be,l,c=Cn){let h={width:t,height:t,depth:1},f=[h,h,h,h,h,h];super(t,t,e,i,s,r,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},br=class extends Ze{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},pi=class n extends Ge{constructor(t=1,e=1,i=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:i,widthSegments:s,heightSegments:r,depthSegments:o};let a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);let l=[],c=[],h=[],f=[],u=0,m=0;_("z","y","x",-1,-1,i,e,t,o,r,0),_("z","y","x",1,-1,i,e,-t,o,r,1),_("x","z","y",1,1,t,i,e,s,o,2),_("x","z","y",1,-1,t,i,-e,s,o,3),_("x","y","z",1,-1,t,e,i,s,r,4),_("x","y","z",-1,-1,t,e,-i,s,r,5),this.setIndex(l),this.setAttribute("position",new Me(c,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(f,2));function _(S,p,d,M,C,y,A,b,T,g,E){let P=y/T,R=A/g,D=y/2,L=A/2,I=b/2,U=T+1,W=g+1,k=0,J=0,B=new z;for(let X=0;X<W;X++){let K=X*R-L;for(let it=0;it<U;it++){let rt=it*P-D;B[S]=rt*M,B[p]=K*C,B[d]=I,c.push(B.x,B.y,B.z),B[S]=0,B[p]=0,B[d]=b>0?1:-1,h.push(B.x,B.y,B.z),f.push(it/T),f.push(1-X/g),k+=1}}for(let X=0;X<g;X++)for(let K=0;K<T;K++){let it=u+K+U*X,rt=u+K+U*(X+1),Ht=u+(K+1)+U*(X+1),Lt=u+(K+1)+U*X;l.push(it,rt,Lt),l.push(rt,Ht,Lt),J+=6}a.addGroup(m,J,E),m+=J,u+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var ca=class n extends Ge{constructor(t=[],e=[],i=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:i,detail:s};let r=[],o=[];a(s),c(i),h(),this.setAttribute("position",new Me(r,3)),this.setAttribute("normal",new Me(r.slice(),3)),this.setAttribute("uv",new Me(o,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let C=new z,y=new z,A=new z;for(let b=0;b<e.length;b+=3)m(e[b+0],C),m(e[b+1],y),m(e[b+2],A),l(C,y,A,M)}function l(M,C,y,A){let b=A+1,T=[];for(let g=0;g<=b;g++){T[g]=[];let E=M.clone().lerp(y,g/b),P=C.clone().lerp(y,g/b),R=b-g;for(let D=0;D<=R;D++)D===0&&g===b?T[g][D]=E:T[g][D]=E.clone().lerp(P,D/R)}for(let g=0;g<b;g++)for(let E=0;E<2*(b-g)-1;E++){let P=Math.floor(E/2);E%2===0?(u(T[g][P+1]),u(T[g+1][P]),u(T[g][P])):(u(T[g][P+1]),u(T[g+1][P+1]),u(T[g+1][P]))}}function c(M){let C=new z;for(let y=0;y<r.length;y+=3)C.x=r[y+0],C.y=r[y+1],C.z=r[y+2],C.normalize().multiplyScalar(M),r[y+0]=C.x,r[y+1]=C.y,r[y+2]=C.z}function h(){let M=new z;for(let C=0;C<r.length;C+=3){M.x=r[C+0],M.y=r[C+1],M.z=r[C+2];let y=p(M)/2/Math.PI+.5,A=d(M)/Math.PI+.5;o.push(y,1-A)}_(),f()}function f(){for(let M=0;M<o.length;M+=6){let C=o[M+0],y=o[M+2],A=o[M+4],b=Math.max(C,y,A),T=Math.min(C,y,A);b>.9&&T<.1&&(C<.2&&(o[M+0]+=1),y<.2&&(o[M+2]+=1),A<.2&&(o[M+4]+=1))}}function u(M){r.push(M.x,M.y,M.z)}function m(M,C){let y=M*3;C.x=t[y+0],C.y=t[y+1],C.z=t[y+2]}function _(){let M=new z,C=new z,y=new z,A=new z,b=new kt,T=new kt,g=new kt;for(let E=0,P=0;E<r.length;E+=9,P+=6){M.set(r[E+0],r[E+1],r[E+2]),C.set(r[E+3],r[E+4],r[E+5]),y.set(r[E+6],r[E+7],r[E+8]),b.set(o[P+0],o[P+1]),T.set(o[P+2],o[P+3]),g.set(o[P+4],o[P+5]),A.copy(M).add(C).add(y).divideScalar(3);let R=p(A);S(b,P+0,M,R),S(T,P+2,C,R),S(g,P+4,y,R)}}function S(M,C,y,A){A<0&&M.x===1&&(o[C]=M.x-1),y.x===0&&y.z===0&&(o[C]=A/2/Math.PI+.5)}function p(M){return Math.atan2(M.z,-M.x)}function d(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.vertices,t.indices,t.radius,t.detail)}};var Tr=class n extends ca{constructor(t=1,e=0){let i=(1+Math.sqrt(5))/2,s=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new n(t.radius,t.detail)}};var Er=class n extends Ge{constructor(t=1,e=1,i=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:i,heightSegments:s};let r=t/2,o=e/2,a=Math.floor(i),l=Math.floor(s),c=a+1,h=l+1,f=t/a,u=e/l,m=[],_=[],S=[],p=[];for(let d=0;d<h;d++){let M=d*u-o;for(let C=0;C<c;C++){let y=C*f-r;_.push(y,-M,0),S.push(0,0,1),p.push(C/a),p.push(1-d/l)}}for(let d=0;d<l;d++)for(let M=0;M<a;M++){let C=M+c*d,y=M+c*(d+1),A=M+1+c*(d+1),b=M+1+c*d;m.push(C,y,b),m.push(y,A,b)}this.setIndex(m),this.setAttribute("position",new Me(_,3)),this.setAttribute("normal",new Me(S,3)),this.setAttribute("uv",new Me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.width,t.height,t.widthSegments,t.heightSegments)}};var Oi=class n extends Ge{constructor(t=1,e=.4,i=12,s=48,r=Math.PI*2,o=0,a=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:i,tubularSegments:s,arc:r,thetaStart:o,thetaLength:a},i=Math.floor(i),s=Math.floor(s);let l=[],c=[],h=[],f=[],u=new z,m=new z,_=new z;for(let S=0;S<=i;S++){let p=o+S/i*a;for(let d=0;d<=s;d++){let M=d/s*r;m.x=(t+e*Math.cos(p))*Math.cos(M),m.y=(t+e*Math.cos(p))*Math.sin(M),m.z=e*Math.sin(p),c.push(m.x,m.y,m.z),u.x=t*Math.cos(M),u.y=t*Math.sin(M),_.subVectors(m,u).normalize(),h.push(_.x,_.y,_.z),f.push(d/s),f.push(S/i)}}for(let S=1;S<=i;S++)for(let p=1;p<=s;p++){let d=(s+1)*S+p-1,M=(s+1)*(S-1)+p-1,C=(s+1)*(S-1)+p,y=(s+1)*S+p;l.push(d,M,y),l.push(M,C,y)}this.setIndex(l),this.setAttribute("position",new Me(c,3)),this.setAttribute("normal",new Me(h,3)),this.setAttribute("uv",new Me(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new n(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}};function ki(n){let t={};for(let e in n){t[e]={};for(let i in n[e]){let s=n[e][i];if($u(s))s.isRenderTargetTexture?(Rt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][i]=null):t[e][i]=s.clone();else if(Array.isArray(s))if($u(s[0])){let r=[];for(let o=0,a=s.length;o<a;o++)r[o]=s[o].clone();t[e][i]=r}else t[e][i]=s.slice();else t[e][i]=s}}return t}function Oe(n){let t={};for(let e=0;e<n.length;e++){let i=ki(n[e]);for(let s in i)t[s]=i[s]}return t}function $u(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function bm(n){let t=[];for(let e=0;e<n.length;e++)t.push(n[e].clone());return t}function nh(n){let t=n.getRenderTarget();return t===null?n.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:Xt.workingColorSpace}var Hf={clone:ki,merge:Oe},Tm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Em=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,nn=class extends Ln{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Tm,this.fragmentShader=Em,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=bm(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let o=this.uniforms[s].value;o&&o.isTexture?e.uniforms[s]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[s]={type:"m4",value:o.toArray()}:e.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let i={};for(let s in this.extensions)this.extensions[s]===!0&&(i[s]=!0);return Object.keys(i).length>0&&(e.extensions=i),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let i in t.uniforms){let s=t.uniforms[i];switch(this.uniforms[i]={},s.type){case"t":this.uniforms[i].value=e[s.value]||null;break;case"c":this.uniforms[i].value=new Gt().setHex(s.value);break;case"v2":this.uniforms[i].value=new kt().fromArray(s.value);break;case"v3":this.uniforms[i].value=new z().fromArray(s.value);break;case"v4":this.uniforms[i].value=new he().fromArray(s.value);break;case"m3":this.uniforms[i].value=new Nt().fromArray(s.value);break;case"m4":this.uniforms[i].value=new ne().fromArray(s.value);break;default:this.uniforms[i].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let i in t.extensions)this.extensions[i]=t.extensions[i];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},ha=class extends nn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},$n=class extends Ln{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Gt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gr,this.normalScale=new kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Ar=class extends Ln{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Gt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Gr,this.normalScale=new kt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Pn,this.combine=Aa,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ua=class extends Ln{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Cf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},fa=class extends Ln{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function fs(n,t){return!n||n.constructor===t?n:typeof t.BYTES_PER_ELEMENT=="number"?new t(n):Array.prototype.slice.call(n)}function Tc(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var mi=class{constructor(t,e,i,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(i),this.sampleValues=e,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,i=this._cachedIndex,s=e[i],r=e[i-1];n:{t:{let o;e:{i:if(!(t<s)){for(let a=i+2;;){if(s===void 0){if(t<r)break i;return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(r=s,s=e[++i],t<s)break t}o=e.length;break e}if(!(t>=r)){let a=e[1];t<a&&(i=2,r=a);for(let l=i-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(s=r,r=e[--i-1],t>=r)break t}o=i,i=0;break e}break n}for(;i<o;){let a=i+o>>>1;t<e[a]?o=a:i=a+1}if(s=e[i],r=e[i-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return i=e.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,r,s)}return this.interpolate_(i,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,i=this.sampleValues,s=this.valueSize,r=t*s;for(let o=0;o!==s;++o)e[o]=i[r+o];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},da=class extends mi{constructor(t,e,i,s){super(t,e,i,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:wc,endingEnd:wc}}intervalChanged_(t,e,i){let s=this.parameterPositions,r=t-2,o=t+1,a=s[r],l=s[o];if(a===void 0)switch(this.getSettings_().endingStart){case Cc:r=t,a=2*e-i;break;case Rc:r=s.length-2,a=e+s[r]-s[r+1];break;default:r=t,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case Cc:o=t,l=2*i-e;break;case Rc:o=1,l=i+s[1]-s[0];break;default:o=t-1,l=e}let c=(i-e)*.5,h=this.valueSize;this._weightPrev=c/(e-a),this._weightNext=c/(l-i),this._offsetPrev=r*h,this._offsetNext=o*h}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,m=this._weightNext,_=(i-e)/(s-e),S=_*_,p=S*_,d=-u*p+2*u*S-u*_,M=(1+u)*p+(-1.5-2*u)*S+(-.5+u)*_+1,C=(-1-m)*p+(1.5+m)*S+.5*_,y=m*p-m*S;for(let A=0;A!==a;++A)r[A]=d*o[h+A]+M*o[c+A]+C*o[l+A]+y*o[f+A];return r}},pa=class extends mi{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=(i-e)/(s-e),f=1-h;for(let u=0;u!==a;++u)r[u]=o[c+u]*f+o[l+u]*h;return r}},ma=class extends mi{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t){return this.copySampleValue_(t-1)}},ga=class extends mi{interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=t*a,c=l-a,h=this.inTangents,f=this.outTangents;if(!h||!f){let _=(i-e)/(s-e),S=1-_;for(let p=0;p!==a;++p)r[p]=o[c+p]*S+o[l+p]*_;return r}let u=a*2,m=t-1;for(let _=0;_!==a;++_){let S=o[c+_],p=o[l+_],d=m*u+_*2,M=f[d],C=f[d+1],y=t*u+_*2,A=h[y],b=h[y+1],T=wm(i,e,M,A,s);r[_]=Wf(T,S,C,b,p)}return r}};function Wf(n,t,e,i,s){let r=1-n;return r*r*r*t+3*r*r*n*e+3*r*n*n*i+n*n*n*s}function Am(n,t,e,i,s){let r=1-n;return 3*r*r*(e-t)+6*r*n*(i-e)+3*n*n*(s-i)}function wm(n,t,e,i,s){let r=(n-t)/(s-t);for(let o=0;o<8;o++){let a=Wf(r,t,e,i,s)-n;if(Math.abs(a)<1e-10)break;let l=Am(r,t,e,i,s);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-a/l))}return r}var sn=class{constructor(t,e,i,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=fs(e,this.TimeBufferType),this.values=fs(i,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,i;if(e.toJSON!==this.toJSON)i=e.toJSON(t);else{i={name:t.name,times:fs(t.times,Array),values:fs(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(i.interpolation=s),Tc(t.settings)&&(i.settings={inTangents:fs(t.settings.inTangents,Array),outTangents:fs(t.settings.outTangents,Array)})}return i.type=t.ValueTypeName,i}InterpolantFactoryMethodDiscrete(t){return new ma(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new pa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new da(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new ga(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case lr:e=this.InterpolantFactoryMethodDiscrete;break;case ia:e=this.InterpolantFactoryMethodLinear;break;case qo:e=this.InterpolantFactoryMethodSmooth;break;case Ac:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Rt("KeyframeTrack:",i),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return lr;case this.InterpolantFactoryMethodLinear:return ia;case this.InterpolantFactoryMethodSmooth:return qo;case this.InterpolantFactoryMethodBezier:return Ac}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let i=0,s=e.length;i!==s;++i)e[i]*=t;Tc(this.settings)&&(ju(this.settings.inTangents,t),ju(this.settings.outTangents,t))}return this}trim(t,e){let i=this.times,s=i.length,r=0,o=s-1;for(;r!==s&&i[r]<t;)++r;for(;o!==-1&&i[o]>e;)--o;if(++o,r!==0||o!==s){r>=o&&(o=Math.max(o,1),r=o-1);let a=this.getValueSize();this.times=i.slice(r,o),this.values=this.values.slice(r*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(It("KeyframeTrack: Invalid value size in track.",this),t=!1);let i=this.times,s=this.values,r=i.length;r===0&&(It("KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==r;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){It("KeyframeTrack: Time is not a valid number.",this,a,l),t=!1;break}if(o!==null&&o>l){It("KeyframeTrack: Out of order keys.",this,a,l,o),t=!1;break}o=l}if(s!==void 0&&nm(s))for(let a=0,l=s.length;a!==l;++a){let c=s[a];if(isNaN(c)){It("KeyframeTrack: Value is not a valid number.",this,a,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),i=this.getValueSize(),s=this.getInterpolation()===qo,r=t.length-1,o=1;for(let a=1;a<r;++a){let l=!1,c=t[a],h=t[a+1];if(c!==h&&(a!==1||c!==t[0]))if(s)l=!0;else{let f=a*i,u=f-i,m=f+i;for(let _=0;_!==i;++_){let S=e[f+_];if(S!==e[u+_]||S!==e[m+_]){l=!0;break}}}if(l){if(a!==o){t[o]=t[a];let f=a*i,u=o*i;for(let m=0;m!==i;++m)e[u+m]=e[f+m]}++o}}if(r>0){t[o]=t[r];for(let a=r*i,l=o*i,c=0;c!==i;++c)e[l+c]=e[a+c];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*i)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),i=this.constructor,s=new i(this.name,t,e);return s.createInterpolant=this.createInterpolant,Tc(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function ju(n,t){for(let e=0,i=n.length;e!==i;e+=2)n[e]*=t}sn.prototype.ValueTypeName="";sn.prototype.TimeBufferType=Float32Array;sn.prototype.ValueBufferType=Float32Array;sn.prototype.DefaultInterpolation=ia;var gi=class extends sn{constructor(t,e,i){super(t,e,i)}};gi.prototype.ValueTypeName="bool";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=lr;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var xa=class extends sn{constructor(t,e,i,s){super(t,e,i,s)}};xa.prototype.ValueTypeName="color";var _a=class extends sn{constructor(t,e,i,s){super(t,e,i,s)}};_a.prototype.ValueTypeName="number";var ya=class extends mi{constructor(t,e,i,s){super(t,e,i,s)}interpolate_(t,e,i,s){let r=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-e)/(s-e),c=t*a;for(let h=c+a;c!==h;c+=4)In.slerpFlat(r,0,o,c-a,o,c,l);return r}},wr=class extends sn{constructor(t,e,i,s){super(t,e,i,s)}InterpolantFactoryMethodLinear(t){return new ya(this.times,this.values,this.getValueSize(),t)}};wr.prototype.ValueTypeName="quaternion";wr.prototype.InterpolantFactoryMethodSmooth=void 0;var xi=class extends sn{constructor(t,e,i){super(t,e,i)}};xi.prototype.ValueTypeName="string";xi.prototype.ValueBufferType=Array;xi.prototype.DefaultInterpolation=lr;xi.prototype.InterpolantFactoryMethodLinear=void 0;xi.prototype.InterpolantFactoryMethodSmooth=void 0;var va=class extends sn{constructor(t,e,i,s){super(t,e,i,s)}};va.prototype.ValueTypeName="vector";var Sa=class{constructor(t,e,i){let s=this,r=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=i,this._abortController=null,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){let f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){let m=c[f],_=c[f+1];if(m.global&&(m.lastIndex=0),m.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Xf=new Sa,Ma=class{constructor(t){this.manager=t!==void 0?t:Xf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let i=this;return new Promise(function(s,r){i.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}};Ma.DEFAULT_MATERIAL_NAME="__DEFAULT";var bs=class extends Te{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Gt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}};var Ec=new ne,Qu=new z,tf=new z,Cr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new kt(512,512),this.mapType=Je,this.map=null,this.mapPass=null,this.matrix=new ne,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ss,this._frameExtents=new kt(1,1),this._viewportCount=1,this._viewports=[new he(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;Qu.setFromMatrixPosition(t.matrixWorld),e.position.copy(Qu),tf.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(tf),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,i,s){Ec.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),i.setFromProjectionMatrix(Ec,t.coordinateSystem,t.reversedDepth);let r=this._frameExtents,o=s?s.z/r.x:1,a=s?s.w/r.y:1,l=s?s.x/r.x:0,c=s?s.y/r.y:0;t.coordinateSystem===xs||t.reversedDepth?e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,1,0,0,0,0,1):e.set(.5*o,0,0,.5*o+l,0,.5*a,0,.5*a+c,0,0,.5,.5,0,0,0,1),e.multiply(Ec)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Wo=new z,Xo=new In,An=new z,Rr=class extends Te{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ne,this.projectionMatrix=new ne,this.projectionMatrixInverse=new ne,this.coordinateSystem=mn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Wo,Xo,An),An.x===1&&An.y===1&&An.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wo,Xo,An.set(1,1,1)).invert()}updateWorldMatrix(t,e,i=!1){super.updateWorldMatrix(t,e,i),this.matrixWorld.decompose(Wo,Xo,An),An.x===1&&An.y===1&&An.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Wo,Xo,An.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},ui=new z,ef=new kt,nf=new kt,Ce=class extends Rr{constructor(t=50,e=1,i=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=i,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=sa*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ic*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return sa*2*Math.atan(Math.tan(ic*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,i){ui.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(ui.x,ui.y).multiplyScalar(-t/ui.z),ui.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ui.x,ui.y).multiplyScalar(-t/ui.z)}getViewSize(t,e){return this.getViewBounds(t,ef,nf),e.subVectors(nf,ef)}setViewOffset(t,e,i,s,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ic*.5*this.fov)/this.zoom,i=2*e,s=this.aspect*i,r=-.5*s,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,e-=o.offsetY*i/c,s*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-i,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var Pc=class extends Cr{constructor(){super(new Ce(90,1,.5,500)),this.isPointLightShadow=!0}},Bi=class extends bs{constructor(t,e,i=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=s,this.shadow=new Pc}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},Ts=class extends Rr{constructor(t=-1,e=1,i=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=i,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,i,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=i,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=i-t,o=i+t,a=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=h*this.view.offsetY,l=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Dc=class extends Cr{constructor(){super(new Ts(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ir=class extends bs{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Te.DEFAULT_UP),this.updateMatrix(),this.target=new Te,this.shadow=new Dc}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}},Pr=class extends bs{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}};var ds=-90,ps=1,ba=class extends Te{constructor(t,e,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ce(ds,ps,t,e);s.layers=this.layers,this.add(s);let r=new Ce(ds,ps,t,e);r.layers=this.layers,this.add(r);let o=new Ce(ds,ps,t,e);o.layers=this.layers,this.add(o);let a=new Ce(ds,ps,t,e);a.layers=this.layers,this.add(a);let l=new Ce(ds,ps,t,e);l.layers=this.layers,this.add(l);let c=new Ce(ds,ps,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[i,s,r,o,a,l]=e;for(let c of e)this.remove(c);if(t===mn)i.up.set(0,1,0),i.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===xs)i.up.set(0,-1,0),i.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,o,a,l,c,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;let S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(i,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(i,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(i,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(i,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(i,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),i.texture.generateMipmaps=S,t.setRenderTarget(i,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(f,u,m),t.xr.enabled=_,i.texture.needsPMREMUpdate=!0}},Ta=class extends Ce{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}};var ih="\\[\\]\\.:\\/",Cm=new RegExp("["+ih+"]","g"),sh="[^"+ih+"]",Rm="[^"+ih.replace("\\.","")+"]",Im=/((?:WC+[\/:])*)/.source.replace("WC",sh),Pm=/(WCOD+)?/.source.replace("WCOD",Rm),Dm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",sh),Lm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",sh),Nm=new RegExp("^"+Im+Pm+Dm+Lm+"$"),Um=["material","materials","bones","map"],Lc=class{constructor(t,e,i){let s=i||le.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let i=this._targetGroup.nCachedObjects_,s=this._bindings[i];s!==void 0&&s.getValue(t,e)}setValue(t,e){let i=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=i.length;s!==r;++s)i[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,i=t.length;e!==i;++e)t[e].unbind()}},le=class n{constructor(t,e,i){this.path=e,this.parsedPath=i||n.parseTrackName(e),this.node=n.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,i){return t&&t.isAnimationObjectGroup?new n.Composite(t,e,i):new n(t,e,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Cm,"")}static parseTrackName(t){let e=Nm.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=i.nodeName&&i.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=i.nodeName.substring(s+1);Um.indexOf(r)!==-1&&(i.nodeName=i.nodeName.substring(0,s),i.objectName=r)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(e);if(i!==void 0)return i}if(t.children){let i=function(r){for(let o=0;o<r.length;o++){let a=r[o];if(a.name===e||a.uuid===e)return a;let l=i(a.children);if(l)return l}return null},s=i(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)t[e++]=i[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let i=this.resolvedProperty;for(let s=0,r=i.length;s!==r;++s)i[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,i=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=n.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){Rt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=e.objectIndex;switch(i){case"materials":if(!t.material){It("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){It("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){It("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){It("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){It("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){It("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(c!==void 0){if(t[c]===void 0){It("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let o=t[s];if(o===void 0){let c=e.nodeName;It("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?a=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){It("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){It("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=r}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};le.Composite=Lc;le.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};le.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};le.prototype.GetterByBindingType=[le.prototype._getValue_direct,le.prototype._getValue_array,le.prototype._getValue_arrayElement,le.prototype._getValue_toArray];le.prototype.SetterByBindingTypeAndVersioning=[[le.prototype._setValue_direct,le.prototype._setValue_direct_setNeedsUpdate,le.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[le.prototype._setValue_array,le.prototype._setValue_array_setNeedsUpdate,le.prototype._setValue_array_setMatrixWorldNeedsUpdate],[le.prototype._setValue_arrayElement,le.prototype._setValue_arrayElement_setNeedsUpdate,le.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[le.prototype._setValue_fromArray,le.prototype._setValue_fromArray_setNeedsUpdate,le.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var oS=new Float32Array(1);var hh=class hh{constructor(t,e,i,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,i,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let i=0;i<4;i++)this.elements[i]=t[i+e];return this}set(t,e,i,s){let r=this.elements;return r[0]=t,r[2]=e,r[1]=i,r[3]=s,this}};hh.prototype.isMatrix2=!0;var Nc=hh;function rh(n,t,e,i){let s=Fm(i);switch(e){case jc:return n*t;case La:return n*t/s.components*s.byteLength;case Na:return n*t/s.components*s.byteLength;case Mi:return n*t*2/s.components*s.byteLength;case Ua:return n*t*2/s.components*s.byteLength;case Qc:return n*t*3/s.components*s.byteLength;case cn:return n*t*4/s.components*s.byteLength;case Fa:return n*t*4/s.components*s.byteLength;case Fr:case Or:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Br:case Vr:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ba:case za:return Math.max(n,16)*Math.max(t,8)/4;case Oa:case Va:return Math.max(n,8)*Math.max(t,8)/2;case ka:case Ga:case Wa:case Xa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*8;case Ha:case zr:case qa:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Ya:return Math.floor((n+3)/4)*Math.floor((t+3)/4)*16;case Za:return Math.floor((n+4)/5)*Math.floor((t+3)/4)*16;case Ka:return Math.floor((n+4)/5)*Math.floor((t+4)/5)*16;case Ja:return Math.floor((n+5)/6)*Math.floor((t+4)/5)*16;case $a:return Math.floor((n+5)/6)*Math.floor((t+5)/6)*16;case ja:return Math.floor((n+7)/8)*Math.floor((t+4)/5)*16;case Qa:return Math.floor((n+7)/8)*Math.floor((t+5)/6)*16;case tl:return Math.floor((n+7)/8)*Math.floor((t+7)/8)*16;case el:return Math.floor((n+9)/10)*Math.floor((t+4)/5)*16;case nl:return Math.floor((n+9)/10)*Math.floor((t+5)/6)*16;case il:return Math.floor((n+9)/10)*Math.floor((t+7)/8)*16;case sl:return Math.floor((n+9)/10)*Math.floor((t+9)/10)*16;case rl:return Math.floor((n+11)/12)*Math.floor((t+9)/10)*16;case ol:return Math.floor((n+11)/12)*Math.floor((t+11)/12)*16;case al:case ll:case cl:return Math.ceil(n/4)*Math.ceil(t/4)*16;case hl:case ul:return Math.ceil(n/4)*Math.ceil(t/4)*8;case kr:case fl:return Math.ceil(n/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function Fm(n){switch(n){case Je:case Zc:return{byteLength:1,components:1};case ws:case Kc:case _n:return{byteLength:2,components:1};case Pa:case Da:return{byteLength:2,components:4};case xn:case Ia:case ln:return{byteLength:4,components:1};case Jc:case $c:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Rt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function dd(){let n=null,t=!1,e=null,i=null;function s(r,o){i=n.requestAnimationFrame(s),e(r,o)}return{start:function(){t!==!0&&e!==null&&n!==null&&(i=n.requestAnimationFrame(s),t=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){n=r}}}function Bm(n){let t=new WeakMap;function e(a,l){let c=a.array,h=a.usage,f=c.byteLength,u=n.createBuffer();n.bindBuffer(l,u),n.bufferData(l,c,h),a.onUploadCallback();let m;if(c instanceof Float32Array)m=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)m=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?m=n.HALF_FLOAT:m=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=n.SHORT;else if(c instanceof Uint32Array)m=n.UNSIGNED_INT;else if(c instanceof Int32Array)m=n.INT;else if(c instanceof Int8Array)m=n.BYTE;else if(c instanceof Uint8Array)m=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){let h=l.array,f=l.updateRanges;if(n.bindBuffer(c,a),f.length===0)n.bufferSubData(c,0,h);else{f.sort((m,_)=>m.start-_.start);let u=0;for(let m=1;m<f.length;m++){let _=f[u],S=f[m];S.start<=_.start+_.count+1?_.count=Math.max(_.count,S.start+S.count-_.start):(++u,f[u]=S)}f.length=u+1;for(let m=0,_=f.length;m<_;m++){let S=f[m];n.bufferSubData(c,S.start*h.BYTES_PER_ELEMENT,h,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);l&&(n.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}var Vm=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,zm=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,km=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Gm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Hm=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Wm=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Xm=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,qm=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ym=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,Zm=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Km=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Jm=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,$m=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,jm=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Qm=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,tg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,eg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,ng=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ig=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,sg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,rg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ag=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,lg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,hg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,ug=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,fg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,dg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,pg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,mg="gl_FragColor = linearToOutputTexel( gl_FragColor );",gg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,xg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,_g=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,yg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,vg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Sg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Mg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,bg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Tg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Eg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Ag=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,wg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Cg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Rg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ig=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Pg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,Dg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ng=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Ug=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Fg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Og=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Bg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Vg=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,zg=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,kg=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,Gg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Hg=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Wg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Xg=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,qg=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Yg=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Zg=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Kg=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Jg=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$g=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,jg=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Qg=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,t0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,e0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,n0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,i0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,s0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,r0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,o0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,a0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,l0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,c0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,h0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,u0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,f0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,d0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,p0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,m0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,g0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,x0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,_0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,y0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,v0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,S0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,M0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,b0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,T0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,E0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,A0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,w0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,C0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,R0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,I0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,P0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,D0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,L0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,N0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,U0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,F0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,O0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,B0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,V0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,z0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,k0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,G0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,H0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,W0=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,X0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,q0=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Y0=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Z0=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,J0=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$0=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,j0=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Q0=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,tx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ex=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ix=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,sx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,rx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ox=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,ax=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,lx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,hx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ux=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,dx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,px=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,_x=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,zt={alphahash_fragment:Vm,alphahash_pars_fragment:zm,alphamap_fragment:km,alphamap_pars_fragment:Gm,alphatest_fragment:Hm,alphatest_pars_fragment:Wm,aomap_fragment:Xm,aomap_pars_fragment:qm,batching_pars_vertex:Ym,batching_vertex:Zm,begin_vertex:Km,beginnormal_vertex:Jm,bsdfs:$m,iridescence_fragment:jm,bumpmap_pars_fragment:Qm,clipping_planes_fragment:tg,clipping_planes_pars_fragment:eg,clipping_planes_pars_vertex:ng,clipping_planes_vertex:ig,color_fragment:sg,color_pars_fragment:rg,color_pars_vertex:og,color_vertex:ag,common:lg,cube_uv_reflection_fragment:cg,defaultnormal_vertex:hg,displacementmap_pars_vertex:ug,displacementmap_vertex:fg,emissivemap_fragment:dg,emissivemap_pars_fragment:pg,colorspace_fragment:mg,colorspace_pars_fragment:gg,envmap_fragment:xg,envmap_common_pars_fragment:_g,envmap_pars_fragment:yg,envmap_pars_vertex:vg,envmap_physical_pars_fragment:Pg,envmap_vertex:Sg,fog_vertex:Mg,fog_pars_vertex:bg,fog_fragment:Tg,fog_pars_fragment:Eg,gradientmap_pars_fragment:Ag,lightmap_pars_fragment:wg,lights_lambert_fragment:Cg,lights_lambert_pars_fragment:Rg,lights_pars_begin:Ig,lights_toon_fragment:Dg,lights_toon_pars_fragment:Lg,lights_phong_fragment:Ng,lights_phong_pars_fragment:Ug,lights_physical_fragment:Fg,lights_physical_pars_fragment:Og,lights_fragment_begin:Bg,lights_fragment_maps:Vg,lights_fragment_end:zg,lightprobes_pars_fragment:kg,logdepthbuf_fragment:Gg,logdepthbuf_pars_fragment:Hg,logdepthbuf_pars_vertex:Wg,logdepthbuf_vertex:Xg,map_fragment:qg,map_pars_fragment:Yg,map_particle_fragment:Zg,map_particle_pars_fragment:Kg,metalnessmap_fragment:Jg,metalnessmap_pars_fragment:$g,morphinstance_vertex:jg,morphcolor_vertex:Qg,morphnormal_vertex:t0,morphtarget_pars_vertex:e0,morphtarget_vertex:n0,normal_fragment_begin:i0,normal_fragment_maps:s0,normal_pars_fragment:r0,normal_pars_vertex:o0,normal_vertex:a0,normalmap_pars_fragment:l0,clearcoat_normal_fragment_begin:c0,clearcoat_normal_fragment_maps:h0,clearcoat_pars_fragment:u0,iridescence_pars_fragment:f0,opaque_fragment:d0,packing:p0,premultiplied_alpha_fragment:m0,project_vertex:g0,dithering_fragment:x0,dithering_pars_fragment:_0,roughnessmap_fragment:y0,roughnessmap_pars_fragment:v0,shadowmap_pars_fragment:S0,shadowmap_pars_vertex:M0,shadowmap_vertex:b0,shadowmask_pars_fragment:T0,skinbase_vertex:E0,skinning_pars_vertex:A0,skinning_vertex:w0,skinnormal_vertex:C0,specularmap_fragment:R0,specularmap_pars_fragment:I0,tonemapping_fragment:P0,tonemapping_pars_fragment:D0,transmission_fragment:L0,transmission_pars_fragment:N0,uv_pars_fragment:U0,uv_pars_vertex:F0,uv_vertex:O0,worldpos_vertex:B0,background_vert:V0,background_frag:z0,backgroundCube_vert:k0,backgroundCube_frag:G0,cube_vert:H0,cube_frag:W0,depth_vert:X0,depth_frag:q0,distance_vert:Y0,distance_frag:Z0,equirect_vert:K0,equirect_frag:J0,linedashed_vert:$0,linedashed_frag:j0,meshbasic_vert:Q0,meshbasic_frag:tx,meshlambert_vert:ex,meshlambert_frag:nx,meshmatcap_vert:ix,meshmatcap_frag:sx,meshnormal_vert:rx,meshnormal_frag:ox,meshphong_vert:ax,meshphong_frag:lx,meshphysical_vert:cx,meshphysical_frag:hx,meshtoon_vert:ux,meshtoon_frag:fx,points_vert:dx,points_frag:px,shadow_vert:mx,shadow_frag:gx,sprite_vert:xx,sprite_frag:_x},ft={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Nt}},envmap:{envMap:{value:null},envMapRotation:{value:new Nt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Nt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Nt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Nt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Nt},normalScale:{value:new kt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Nt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Nt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Nt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Nt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new z},probesMax:{value:new z},probesResolution:{value:new z}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0},uvTransform:{value:new Nt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new kt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Nt},alphaMap:{value:null},alphaMapTransform:{value:new Nt},alphaTest:{value:0}}},On={basic:{uniforms:Oe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:Oe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Gt(0)},envMapIntensity:{value:1}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:Oe([ft.common,ft.specularmap,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,ft.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:Oe([ft.common,ft.envmap,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.roughnessmap,ft.metalnessmap,ft.fog,ft.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:Oe([ft.common,ft.aomap,ft.lightmap,ft.emissivemap,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.gradientmap,ft.fog,ft.lights,{emissive:{value:new Gt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:Oe([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,ft.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:Oe([ft.points,ft.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:Oe([ft.common,ft.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:Oe([ft.common,ft.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:Oe([ft.common,ft.bumpmap,ft.normalmap,ft.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:Oe([ft.sprite,ft.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new Nt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Nt}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distance:{uniforms:Oe([ft.common,ft.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distance_vert,fragmentShader:zt.distance_frag},shadow:{uniforms:Oe([ft.lights,ft.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};On.physical={uniforms:Oe([On.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Nt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Nt},clearcoatNormalScale:{value:new kt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Nt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Nt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Nt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Nt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Nt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Nt},transmissionSamplerSize:{value:new kt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Nt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Nt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Nt},anisotropyVector:{value:new kt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Nt}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};var ml={r:0,b:0,g:0},yx=new ne,pd=new Nt;pd.set(-1,0,0,0,1,0,0,0,1);function vx(n,t,e,i,s,r){let o=new Gt(0),a=s===!0?0:1,l,c,h=null,f=0,u=null;function m(M){let C=M.isScene===!0?M.background:null;if(C&&C.isTexture){let y=M.backgroundBlurriness>0;C=t.get(C,y)}return C}function _(M){let C=!1,y=m(M);y===null?p(o,a):y&&y.isColor&&(p(y,1),C=!0);let A=n.xr.getEnvironmentBlendMode();A==="additive"?e.buffers.color.setClear(0,0,0,1,r):A==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(n.autoClear||C)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function S(M,C){let y=m(C);y&&(y.isCubeTexture||y.mapping===Nr)?(c===void 0&&(c=new ie(new pi(1,1,1),new nn({name:"BackgroundCubeMaterial",uniforms:ki(On.backgroundCube.uniforms),vertexShader:On.backgroundCube.vertexShader,fragmentShader:On.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,b,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=C.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(yx.makeRotationFromEuler(C.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(pd),c.material.toneMapped=Xt.getTransfer(y.colorSpace)!==$t,(h!==y||f!==y.version||u!==n.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=n.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new ie(new Er(2,2),new nn({name:"BackgroundMaterial",uniforms:ki(On.background.uniforms),vertexShader:On.background.vertexShader,fragmentShader:On.background.fragmentShader,side:_i,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=C.backgroundIntensity,l.material.toneMapped=Xt.getTransfer(y.colorSpace)!==$t,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==n.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=n.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,C){M.getRGB(ml,nh(n)),e.buffers.color.setClear(ml.r,ml.g,ml.b,C,r)}function d(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,C=1){o.set(M),a=C,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(M){a=M,p(o,a)},render:_,addToRenderList:S,dispose:d}}function Sx(n,t){let e=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},s=u(null),r=s,o=!1;function a(R,D,L,I,U){let W=!1,k=f(R,I,L,D);r!==k&&(r=k,c(r.object)),W=m(R,I,L,U),W&&_(R,I,L,U),U!==null&&t.update(U,n.ELEMENT_ARRAY_BUFFER),(W||o)&&(o=!1,y(R,D,L,I),U!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return n.createVertexArray()}function c(R){return n.bindVertexArray(R)}function h(R){return n.deleteVertexArray(R)}function f(R,D,L,I){let U=I.wireframe===!0,W=i[D.id];W===void 0&&(W={},i[D.id]=W);let k=R.isInstancedMesh===!0?R.id:0,J=W[k];J===void 0&&(J={},W[k]=J);let B=J[L.id];B===void 0&&(B={},J[L.id]=B);let X=B[U];return X===void 0&&(X=u(l()),B[U]=X),X}function u(R){let D=[],L=[],I=[];for(let U=0;U<e;U++)D[U]=0,L[U]=0,I[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:L,attributeDivisors:I,object:R,attributes:{},index:null}}function m(R,D,L,I){let U=r.attributes,W=D.attributes,k=0,J=L.getAttributes();for(let B in J)if(J[B].location>=0){let K=U[B],it=W[B];if(it===void 0&&(B==="instanceMatrix"&&R.instanceMatrix&&(it=R.instanceMatrix),B==="instanceColor"&&R.instanceColor&&(it=R.instanceColor)),K===void 0||K.attribute!==it||it&&K.data!==it.data)return!0;k++}return r.attributesNum!==k||r.index!==I}function _(R,D,L,I){let U={},W=D.attributes,k=0,J=L.getAttributes();for(let B in J)if(J[B].location>=0){let K=W[B];K===void 0&&(B==="instanceMatrix"&&R.instanceMatrix&&(K=R.instanceMatrix),B==="instanceColor"&&R.instanceColor&&(K=R.instanceColor));let it={};it.attribute=K,K&&K.data&&(it.data=K.data),U[B]=it,k++}r.attributes=U,r.attributesNum=k,r.index=I}function S(){let R=r.newAttributes;for(let D=0,L=R.length;D<L;D++)R[D]=0}function p(R){d(R,0)}function d(R,D){let L=r.newAttributes,I=r.enabledAttributes,U=r.attributeDivisors;L[R]=1,I[R]===0&&(n.enableVertexAttribArray(R),I[R]=1),U[R]!==D&&(n.vertexAttribDivisor(R,D),U[R]=D)}function M(){let R=r.newAttributes,D=r.enabledAttributes;for(let L=0,I=D.length;L<I;L++)D[L]!==R[L]&&(n.disableVertexAttribArray(L),D[L]=0)}function C(R,D,L,I,U,W,k){k===!0?n.vertexAttribIPointer(R,D,L,U,W):n.vertexAttribPointer(R,D,L,I,U,W)}function y(R,D,L,I){S();let U=I.attributes,W=L.getAttributes(),k=D.defaultAttributeValues;for(let J in W){let B=W[J];if(B.location>=0){let X=U[J];if(X===void 0&&(J==="instanceMatrix"&&R.instanceMatrix&&(X=R.instanceMatrix),J==="instanceColor"&&R.instanceColor&&(X=R.instanceColor)),X!==void 0){let K=X.normalized,it=X.itemSize,rt=t.get(X);if(rt===void 0)continue;let Ht=rt.buffer,Lt=rt.type,Ut=rt.bytesPerElement,Z=Lt===n.INT||Lt===n.UNSIGNED_INT||X.gpuType===Ia;if(X.isInterleavedBufferAttribute){let Q=X.data,xt=Q.stride,Pt=X.offset;if(Q.isInstancedInterleavedBuffer){for(let gt=0;gt<B.locationSize;gt++)d(B.location+gt,Q.meshPerAttribute);R.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let gt=0;gt<B.locationSize;gt++)p(B.location+gt);n.bindBuffer(n.ARRAY_BUFFER,Ht);for(let gt=0;gt<B.locationSize;gt++)C(B.location+gt,it/B.locationSize,Lt,K,xt*Ut,(Pt+it/B.locationSize*gt)*Ut,Z)}else{if(X.isInstancedBufferAttribute){for(let Q=0;Q<B.locationSize;Q++)d(B.location+Q,X.meshPerAttribute);R.isInstancedMesh!==!0&&I._maxInstanceCount===void 0&&(I._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Q=0;Q<B.locationSize;Q++)p(B.location+Q);n.bindBuffer(n.ARRAY_BUFFER,Ht);for(let Q=0;Q<B.locationSize;Q++)C(B.location+Q,it/B.locationSize,Lt,K,it*Ut,it/B.locationSize*Q*Ut,Z)}}else if(k!==void 0){let K=k[J];if(K!==void 0)switch(K.length){case 2:n.vertexAttrib2fv(B.location,K);break;case 3:n.vertexAttrib3fv(B.location,K);break;case 4:n.vertexAttrib4fv(B.location,K);break;default:n.vertexAttrib1fv(B.location,K)}}}}M()}function A(){E();for(let R in i){let D=i[R];for(let L in D){let I=D[L];for(let U in I){let W=I[U];for(let k in W)h(W[k].object),delete W[k];delete I[U]}}delete i[R]}}function b(R){if(i[R.id]===void 0)return;let D=i[R.id];for(let L in D){let I=D[L];for(let U in I){let W=I[U];for(let k in W)h(W[k].object),delete W[k];delete I[U]}}delete i[R.id]}function T(R){for(let D in i){let L=i[D];for(let I in L){let U=L[I];if(U[R.id]===void 0)continue;let W=U[R.id];for(let k in W)h(W[k].object),delete W[k];delete U[R.id]}}}function g(R){for(let D in i){let L=i[D],I=R.isInstancedMesh===!0?R.id:0,U=L[I];if(U!==void 0){for(let W in U){let k=U[W];for(let J in k)h(k[J].object),delete k[J];delete U[W]}delete L[I],Object.keys(L).length===0&&delete i[D]}}}function E(){P(),o=!0,r!==s&&(r=s,c(r.object))}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:E,resetDefaultState:P,dispose:A,releaseStatesOfGeometry:b,releaseStatesOfObject:g,releaseStatesOfProgram:T,initAttributes:S,enableAttribute:p,disableUnusedAttributes:M}}function Mx(n,t,e){let i;function s(l){i=l}function r(l,c){n.drawArrays(i,l,c),e.update(c,i,1)}function o(l,c,h){h!==0&&(n.drawArraysInstanced(i,l,c,h),e.update(c,i,h))}function a(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,h);let u=0;for(let m=0;m<h;m++)u+=c[m];e.update(u,i,1)}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a}function bx(n,t,e,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let T=t.get("EXT_texture_filter_anisotropic");s=n.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(T){return!(T!==cn&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let g=T===_n&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(T!==Je&&T!==ln&&!g&&i.convert(T)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(Rt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let f=e.logarithmicDepthBuffer===!0,u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&u===!1&&Rt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let m=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=n.getParameter(n.MAX_TEXTURE_SIZE),p=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),d=n.getParameter(n.MAX_VERTEX_ATTRIBS),M=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),C=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),b=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:m,maxVertexTextures:_,maxTextureSize:S,maxCubemapSize:p,maxAttributes:d,maxVertexUniforms:M,maxVaryings:C,maxFragmentUniforms:y,maxSamples:A,samples:b}}function Tx(n){let t=this,e=null,i=0,s=!1,r=!1,o=new pn,a=new Nt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let m=f.length!==0||u||i!==0||s;return s=u,i=f.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,m){let _=f.clippingPlanes,S=f.clipIntersection,p=f.clipShadows,d=n.get(f);if(!s||_===null||_.length===0||r&&!p)r?h(null):c();else{let M=r?0:i,C=M*4,y=d.clippingState||null;l.value=y,y=h(_,u,C,m);for(let A=0;A!==C;++A)y[A]=e[A];d.clippingState=y,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=i>0),t.numPlanes=i,t.numIntersection=0}function h(f,u,m,_){let S=f!==null?f.length:0,p=null;if(S!==0){if(p=l.value,_!==!0||p===null){let d=m+S*4,M=u.matrixWorldInverse;a.getNormalMatrix(M),(p===null||p.length<d)&&(p=new Float32Array(d));for(let C=0,y=m;C!==S;++C,y+=4)o.copy(f[C]).applyMatrix4(M,a),o.normal.toArray(p,y),p[y+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=S,t.numIntersection=0,p}}var Is=4,Ex=6,Ax=20,wx=256,Wr=new Ts,qf=new Gt,uh=null,fh=0,dh=0,ph=!1,Cx=new z,Gi=new z,Ds=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,i=.1,s=100,r={}){let{size:o=256,position:a=Cx}=r;uh=this._renderer.getRenderTarget(),fh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),ph=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,i,s,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Kf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Zf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(uh,fh,dh),this._renderer.xr.enabled=ph,t.scissorTest=!1,Rs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===yi||t.mapping===zi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),uh=this._renderer.getRenderTarget(),fh=this._renderer.getActiveCubeFace(),dh=this._renderer.getActiveMipmapLevel(),ph=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=e||this._allocateTargets();return this._textureToCubeUV(t,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,i={magFilter:Re,minFilter:Re,generateMipmaps:!1,type:_n,format:cn,colorSpace:cr,depthBuffer:!1},s=Yf(t,e,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Yf(t,e,i);let{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=Rx(r)),this._blurMaterial=Px(r,t,e),this._ggxMaterial=Ix(r,t,e)}return s}_compileMaterial(t){let e=new ie(new Ge,t);this._renderer.compile(e,Wr)}_sceneToCubeUV(t,e,i,s,r){let l=new Ce(90,1,e,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,m=f.toneMapping;f.getClearColor(qf),f.toneMapping=gn,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(s),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ie(new pi,new xr({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1})));let S=this._backgroundBox,p=S.material,d=!1,M=t.background;M?M.isColor&&(p.color.copy(M),t.background=null,d=!0):(p.color.copy(qf),d=!0);for(let C=0;C<6;C++){let y=C%3;y===0?(l.up.set(0,c[C],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[C],r.y,r.z)):y===1?(l.up.set(0,0,c[C]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[C],r.z)):(l.up.set(0,c[C],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[C]));let A=this._cubeSize;Rs(s,y*A,C>2?A:0,A,A),f.setRenderTarget(s),d&&f.render(S,l),f.render(t,l)}f.toneMapping=m,f.autoClear=u,t.background=M}_textureToCubeUV(t,e){let i=this._renderer,s=t.mapping===yi||t.mapping===zi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Kf()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Zf());let r=s?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=r;let a=r.uniforms;a.envMap.value=t;let l=this._cubeSize;Rs(e,0,0,3*l,2*l),i.setRenderTarget(e),i.render(o,Wr)}_applyPMREM(t){let e=this._renderer,i=e.autoClear;e.autoClear=!1;let s=this._lodMeshes.length;for(let r=1;r<s;r++)this._applyGGXFilter(t,r-1,r);e.autoClear=i}_applyGGXFilter(t,e,i){let s=this._renderer,r=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),h=e/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,m=f*u,{_lodMax:_}=this,S=this._sizeLods[i],p=3*S*(i>_-Is?i-_+Is:0),d=4*(this._cubeSize-S);l.envMap.value=t.texture,l.roughness.value=m,l.mipInt.value=_-e,Rs(r,p,d,3*S,2*S),s.setRenderTarget(r),s.render(a,Wr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=_-i,Rs(t,p,d,3*S,2*S),s.setRenderTarget(t),s.render(a,Wr)}_blur(t,e,i,s){let r=this._pingPongRenderTarget,o=Math.min(s,Math.PI)/Math.SQRT2;this._blurPass(t,r,e,i,o),this._blurPass(r,t,i,i,o)}_blurPass(t,e,i,s,r){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[s];l.material=a;let c=a.uniforms;c.envMap.value=t.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-i;let h=this._sizeLods[s],f=3*h*(s>this._lodMax-Is?s-this._lodMax+Is:0),u=4*(this._cubeSize-h);Rs(e,f,u,3*h,2*h),o.setRenderTarget(e),o.render(l,Wr)}};function Rx(n){let t=[],e=[],i=n,s=n-Is+1+Ex;for(let r=0;r<s;r++){let o=Math.pow(2,i);t.push(o);let a=1/(o-2),l=-a,c=1+a,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,m=3,_=new Float32Array(m*u*f),S=new Float32Array(m*u*f);for(let d=0;d<f;d++){let M=d%3*2/3-1,C=d>2?0:-1,y=[M,C,0,M+2/3,C,0,M+2/3,C+1,0,M,C,0,M+2/3,C+1,0,M,C+1,0];_.set(y,m*u*d);for(let A=0;A<u;A++){let b=h[A*2]*2-1,T=h[A*2+1]*2-1;d===0?Gi.set(1,T,b):d===1?Gi.set(-b,1,-T):d===2?Gi.set(-b,T,1):d===3?Gi.set(-1,T,-b):d===4?Gi.set(-b,-1,T):Gi.set(b,T,-1),Gi.toArray(S,(d*u+A)*m)}}let p=new Ge;p.setAttribute("position",new ke(_,m)),p.setAttribute("outputDirection",new ke(S,m)),e.push(new ie(p,null)),i>Is&&i--}return{lodMeshes:e,sizeLods:t}}function Yf(n,t,e){let i=new Ke(n,t,e);return i.texture.mapping=Nr,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Rs(n,t,e,i,s){n.viewport.set(t,e,i,s),n.scissor.set(t,e,i,s)}function Ix(n,t,e){return new nn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:wx,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:yl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Px(n,t,e){return new nn({name:"SphericalGaussianBlur",defines:{SAMPLES:Ax,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:yl(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Zf(){return new nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:yl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Kf(){return new nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:yl(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function yl(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var xl=class extends Ke{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let i={width:t,height:t,depth:1},s=[i,i,i,i,i,i];this.texture=new Mr(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new pi(5,5,5),r=new nn({name:"CubemapFromEquirect",uniforms:ki(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Ie,blending:Un});r.uniforms.tEquirect.value=e;let o=new ie(s,r),a=e.minFilter;return e.minFilter===vi&&(e.minFilter=Re),new ba(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,i=!0,s=!0){let r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,i,s);t.setRenderTarget(r)}};function Dx(n){let t=new WeakMap,e=new WeakMap,i=null;function s(u,m=!1){return u==null?null:m?o(u):r(u)}function r(u){if(u&&u.isTexture){let m=u.mapping;if(m===wa||m===Ca)if(t.has(u)){let _=t.get(u).texture;return a(_,u.mapping)}else{let _=u.image;if(_&&_.height>0){let S=new xl(_.height);return S.fromEquirectangularTexture(n,u),t.set(u,S),u.addEventListener("dispose",c),a(S.texture,u.mapping)}else return null}}return u}function o(u){if(u&&u.isTexture){let m=u.mapping,_=m===wa||m===Ca,S=m===yi||m===zi;if(_||S){let p=e.get(u),d=p!==void 0?p.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==d)return i===null&&(i=new Ds(n)),p=_?i.fromEquirectangular(u,p):i.fromCubemap(u,p),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),p.texture;if(p!==void 0)return p.texture;{let M=u.image;return _&&M&&M.height>0||S&&M&&l(M)?(i===null&&(i=new Ds(n)),p=_?i.fromEquirectangular(u):i.fromCubemap(u),p.texture.pmremVersion=u.pmremVersion,e.set(u,p),u.addEventListener("dispose",h),p.texture):null}}}return u}function a(u,m){return m===wa?u.mapping=yi:m===Ca&&(u.mapping=zi),u}function l(u){let m=0,_=6;for(let S=0;S<_;S++)u[S]!==void 0&&m++;return m===_}function c(u){let m=u.target;m.removeEventListener("dispose",c);let _=t.get(m);_!==void 0&&(t.delete(m),_.dispose())}function h(u){let m=u.target;m.removeEventListener("dispose",h);let _=e.get(m);_!==void 0&&(e.delete(m),_.dispose())}function f(){t=new WeakMap,e=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:s,dispose:f}}function Lx(n){let t={};function e(i){if(t[i]!==void 0)return t[i];let s=n.getExtension(i);return t[i]=s,s}return{has:function(i){return e(i)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(i){let s=e(i);return s===null&&Ui("WebGLRenderer: "+i+" extension not supported."),s}}}function Nx(n,t,e,i){let s={},r=new WeakMap;function o(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let _ in u.attributes)t.remove(u.attributes[_]);u.removeEventListener("dispose",o),delete s[u.id];let m=r.get(u);m&&(t.remove(m),r.delete(u)),i.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,e.memory.geometries++),u}function l(f){let u=f.attributes;for(let m in u)t.update(u[m],n.ARRAY_BUFFER)}function c(f){let u=[],m=f.index,_=f.attributes.position,S=0;if(_===void 0)return;if(m!==null){let M=m.array;S=m.version;for(let C=0,y=M.length;C<y;C+=3){let A=M[C+0],b=M[C+1],T=M[C+2];u.push(A,b,b,T,T,A)}}else{let M=_.array;S=_.version;for(let C=0,y=M.length/3-1;C<y;C+=3){let A=C+0,b=C+1,T=C+2;u.push(A,b,b,T,T,A)}}let p=new(_.count>=65535?mr:pr)(u,1);p.version=S;let d=r.get(f);d&&t.remove(d),r.set(f,p)}function h(f){let u=r.get(f);if(u){let m=f.index;m!==null&&u.version<m.version&&c(f)}else c(f);return r.get(f)}return{get:a,update:l,getWireframeAttribute:h}}function Ux(n,t,e){let i;function s(f){i=f}let r,o;function a(f){r=f.type,o=f.bytesPerElement}function l(f,u){n.drawElements(i,u,r,f*o),e.update(u,i,1)}function c(f,u,m){m!==0&&(n.drawElementsInstanced(i,u,r,f*o,m),e.update(u,i,m))}function h(f,u,m){if(m===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,u,0,r,f,0,m);let S=0;for(let p=0;p<m;p++)S+=u[p];e.update(S,i,1)}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function Fx(n){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,o,a){switch(e.calls++,o){case n.TRIANGLES:e.triangles+=a*(r/3);break;case n.LINES:e.lines+=a*(r/2);break;case n.LINE_STRIP:e.lines+=a*(r-1);break;case n.LINE_LOOP:e.lines+=a*r;break;case n.POINTS:e.points+=a*r;break;default:It("WebGLInfo: Unknown draw mode:",o);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:i}}function Ox(n,t,e){let i=new WeakMap,s=new he;function r(o,a,l){let c=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,u=i.get(a);if(u===void 0||u.count!==f){let E=function(){T.dispose(),i.delete(a),a.removeEventListener("dispose",E)};u!==void 0&&u.texture.dispose();let m=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,S=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],d=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],C=0;m===!0&&(C=1),_===!0&&(C=2),S===!0&&(C=3);let y=a.attributes.position.count*C,A=1;y>t.maxTextureSize&&(A=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let b=new Float32Array(y*A*4*f),T=new fr(b,y,A,f);T.type=ln,T.needsUpdate=!0;let g=C*4;for(let P=0;P<f;P++){let R=p[P],D=d[P],L=M[P],I=y*A*4*P;for(let U=0;U<R.count;U++){let W=U*g;m===!0&&(s.fromBufferAttribute(R,U),b[I+W+0]=s.x,b[I+W+1]=s.y,b[I+W+2]=s.z,b[I+W+3]=0),_===!0&&(s.fromBufferAttribute(D,U),b[I+W+4]=s.x,b[I+W+5]=s.y,b[I+W+6]=s.z,b[I+W+7]=0),S===!0&&(s.fromBufferAttribute(L,U),b[I+W+8]=s.x,b[I+W+9]=s.y,b[I+W+10]=s.z,b[I+W+11]=L.itemSize===4?s.w:1)}}u={count:f,texture:T,size:new kt(y,A)},i.set(a,u),a.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,e);else{let m=0;for(let S=0;S<c.length;S++)m+=c[S];let _=a.morphTargetsRelative?1:1-m;l.getUniforms().setValue(n,"morphTargetBaseInfluence",_),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",u.texture,e),l.getUniforms().setValue(n,"morphTargetsTextureSize",u.size)}return{update:r}}function Bx(n,t,e,i,s){let r=new WeakMap;function o(c){let h=s.render.frame,f=c.geometry,u=t.get(c,f);if(r.get(u)!==h&&(t.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(e.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,n.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){let m=c.skeleton;r.get(m)!==h&&(m.update(),r.set(m,h))}return u}function a(){r=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:o,dispose:a}}var Vx={[kc]:"LINEAR_TONE_MAPPING",[Gc]:"REINHARD_TONE_MAPPING",[Hc]:"CINEON_TONE_MAPPING",[Lr]:"ACES_FILMIC_TONE_MAPPING",[Xc]:"AGX_TONE_MAPPING",[qc]:"NEUTRAL_TONE_MAPPING",[Wc]:"CUSTOM_TONE_MAPPING"};function zx(n,t,e,i,s,r){let o=new Ke(t,e,{type:n,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Ge;c.setAttribute("position",new Me([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Me([0,2,0,0,2,0],2));let h=new ha({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new ie(c,h),u=new Ts(-1,1,1,-1,0,1),m=null,_=null,S=!1,p,d=null,M=[],C=!1;this.setSize=function(y,A){o.setSize(y,A),a!==null&&a.setSize(y,A),l!==null&&l.setSize(y,A);for(let b=0;b<M.length;b++){let T=M[b];T.setSize&&T.setSize(y,A)}},this.setEffects=function(y){M=y,C=M.length>0&&M[0].isRenderPass===!0;let A=o.width,b=o.height;M.length>0&&a===null&&(a=new Ke(A,b,{type:_n,depthBuffer:!1,stencilBuffer:!1}),l=new Ke(A,b,{type:_n,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<M.length;T++){let g=M[T];g.setSize&&g.setSize(A,b)}},this.begin=function(y,A){if(S||y.toneMapping===gn&&M.length===0)return!1;if(d=A,A!==null){let b=A.width,T=A.height;(o.width!==b||o.height!==T)&&this.setSize(b,T)}return C===!1&&y.setRenderTarget(o),p=y.toneMapping,y.toneMapping=gn,!0},this.hasRenderPass=function(){return C},this.end=function(y,A){y.toneMapping=p,S=!0;let b=o,T=a;for(let g=0;g<M.length;g++){let E=M[g];E.enabled!==!1&&(E.render(y,T,b,A),E.needsSwap!==!1&&(b=T,T=T===a?l:a))}if(m!==y.outputColorSpace||_!==y.toneMapping){m=y.outputColorSpace,_=y.toneMapping,h.defines={},Xt.getTransfer(m)===$t&&(h.defines.SRGB_TRANSFER="");let g=Vx[_];g&&(h.defines[g]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=b.texture,y.setRenderTarget(d),y.render(f,u),d=null,S=!1},this.isCompositing=function(){return S},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}var md=new Ze,xh=new di(1,1),gd=new fr,xd=new aa,_d=new Mr,Jf=[],$f=[],jf=new Float32Array(16),Qf=new Float32Array(9),td=new Float32Array(4);function Ls(n,t,e){let i=n[0];if(i<=0||i>0)return n;let s=t*e,r=Jf[s];if(r===void 0&&(r=new Float32Array(s),Jf[s]=r),t!==0){i.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,n[o].toArray(r,a)}return r}function _e(n,t){if(n.length!==t.length)return!1;for(let e=0,i=n.length;e<i;e++)if(n[e]!==t[e])return!1;return!0}function ye(n,t){for(let e=0,i=t.length;e<i;e++)n[e]=t[e]}function vl(n,t){let e=$f[t];e===void 0&&(e=new Int32Array(t),$f[t]=e);for(let i=0;i!==t;++i)e[i]=n.allocateTextureUnit();return e}function kx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1f(this.addr,t),e[0]=t)}function Gx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;n.uniform2fv(this.addr,t),ye(e,t)}}function Hx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(n.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(_e(e,t))return;n.uniform3fv(this.addr,t),ye(e,t)}}function Wx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;n.uniform4fv(this.addr,t),ye(e,t)}}function Xx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(_e(e,t))return;n.uniformMatrix2fv(this.addr,!1,t),ye(e,t)}else{if(_e(e,i))return;td.set(i),n.uniformMatrix2fv(this.addr,!1,td),ye(e,i)}}function qx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(_e(e,t))return;n.uniformMatrix3fv(this.addr,!1,t),ye(e,t)}else{if(_e(e,i))return;Qf.set(i),n.uniformMatrix3fv(this.addr,!1,Qf),ye(e,i)}}function Yx(n,t){let e=this.cache,i=t.elements;if(i===void 0){if(_e(e,t))return;n.uniformMatrix4fv(this.addr,!1,t),ye(e,t)}else{if(_e(e,i))return;jf.set(i),n.uniformMatrix4fv(this.addr,!1,jf),ye(e,i)}}function Zx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t)}function Kx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;n.uniform2iv(this.addr,t),ye(e,t)}}function Jx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;n.uniform3iv(this.addr,t),ye(e,t)}}function $x(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;n.uniform4iv(this.addr,t),ye(e,t)}}function jx(n,t){let e=this.cache;e[0]!==t&&(n.uniform1ui(this.addr,t),e[0]=t)}function Qx(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(n.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(_e(e,t))return;n.uniform2uiv(this.addr,t),ye(e,t)}}function t_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(n.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(_e(e,t))return;n.uniform3uiv(this.addr,t),ye(e,t)}}function e_(n,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(n.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(_e(e,t))return;n.uniform4uiv(this.addr,t),ye(e,t)}}function n_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s);let r;this.type===n.SAMPLER_2D_SHADOW?(xh.compareFunction=e.isReversedDepthBuffer()?pl:dl,r=xh):r=md,e.setTexture2D(t||r,s)}function i_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture3D(t||xd,s)}function s_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTextureCube(t||_d,s)}function r_(n,t,e){let i=this.cache,s=e.allocateTextureUnit();i[0]!==s&&(n.uniform1i(this.addr,s),i[0]=s),e.setTexture2DArray(t||gd,s)}function o_(n){switch(n){case 5126:return kx;case 35664:return Gx;case 35665:return Hx;case 35666:return Wx;case 35674:return Xx;case 35675:return qx;case 35676:return Yx;case 5124:case 35670:return Zx;case 35667:case 35671:return Kx;case 35668:case 35672:return Jx;case 35669:case 35673:return $x;case 5125:return jx;case 36294:return Qx;case 36295:return t_;case 36296:return e_;case 35678:case 36198:case 36298:case 36306:case 35682:return n_;case 35679:case 36299:case 36307:return i_;case 35680:case 36300:case 36308:case 36293:return s_;case 36289:case 36303:case 36311:case 36292:return r_}}function a_(n,t){n.uniform1fv(this.addr,t)}function l_(n,t){let e=Ls(t,this.size,2);n.uniform2fv(this.addr,e)}function c_(n,t){let e=Ls(t,this.size,3);n.uniform3fv(this.addr,e)}function h_(n,t){let e=Ls(t,this.size,4);n.uniform4fv(this.addr,e)}function u_(n,t){let e=Ls(t,this.size,4);n.uniformMatrix2fv(this.addr,!1,e)}function f_(n,t){let e=Ls(t,this.size,9);n.uniformMatrix3fv(this.addr,!1,e)}function d_(n,t){let e=Ls(t,this.size,16);n.uniformMatrix4fv(this.addr,!1,e)}function p_(n,t){n.uniform1iv(this.addr,t)}function m_(n,t){n.uniform2iv(this.addr,t)}function g_(n,t){n.uniform3iv(this.addr,t)}function x_(n,t){n.uniform4iv(this.addr,t)}function __(n,t){n.uniform1uiv(this.addr,t)}function y_(n,t){n.uniform2uiv(this.addr,t)}function v_(n,t){n.uniform3uiv(this.addr,t)}function S_(n,t){n.uniform4uiv(this.addr,t)}function M_(n,t,e){let i=this.cache,s=t.length,r=vl(e,s);_e(i,r)||(n.uniform1iv(this.addr,r),ye(i,r));let o;this.type===n.SAMPLER_2D_SHADOW?o=xh:o=md;for(let a=0;a!==s;++a)e.setTexture2D(t[a]||o,r[a])}function b_(n,t,e){let i=this.cache,s=t.length,r=vl(e,s);_e(i,r)||(n.uniform1iv(this.addr,r),ye(i,r));for(let o=0;o!==s;++o)e.setTexture3D(t[o]||xd,r[o])}function T_(n,t,e){let i=this.cache,s=t.length,r=vl(e,s);_e(i,r)||(n.uniform1iv(this.addr,r),ye(i,r));for(let o=0;o!==s;++o)e.setTextureCube(t[o]||_d,r[o])}function E_(n,t,e){let i=this.cache,s=t.length,r=vl(e,s);_e(i,r)||(n.uniform1iv(this.addr,r),ye(i,r));for(let o=0;o!==s;++o)e.setTexture2DArray(t[o]||gd,r[o])}function A_(n){switch(n){case 5126:return a_;case 35664:return l_;case 35665:return c_;case 35666:return h_;case 35674:return u_;case 35675:return f_;case 35676:return d_;case 5124:case 35670:return p_;case 35667:case 35671:return m_;case 35668:case 35672:return g_;case 35669:case 35673:return x_;case 5125:return __;case 36294:return y_;case 36295:return v_;case 36296:return S_;case 35678:case 36198:case 36298:case 36306:case 35682:return M_;case 35679:case 36299:case 36307:return b_;case 35680:case 36300:case 36308:case 36293:return T_;case 36289:case 36303:case 36311:case 36292:return E_}}var _h=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.setValue=o_(e.type)}},yh=class{constructor(t,e,i){this.id=t,this.addr=i,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=A_(e.type)}},vh=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,i){let s=this.seq;for(let r=0,o=s.length;r!==o;++r){let a=s[r];a.setValue(t,e[a.id],i)}}},mh=/(\w+)(\])?(\[|\.)?/g;function ed(n,t){n.seq.push(t),n.map[t.id]=t}function w_(n,t,e){let i=n.name,s=i.length;for(mh.lastIndex=0;;){let r=mh.exec(i),o=mh.lastIndex,a=r[1],l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){ed(e,c===void 0?new _h(a,n,t):new yh(a,n,t));break}else{let f=e.map[a];f===void 0&&(f=new vh(a),ed(e,f)),e=f}}}var Ps=class{constructor(t,e){this.seq=[],this.map={};let i=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);w_(a,l,this)}let s=[],r=[];for(let o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(o):r.push(o);s.length>0&&(this.seq=s.concat(r))}setValue(t,e,i,s){let r=this.map[e];r!==void 0&&r.setValue(t,i,s)}setOptional(t,e,i){let s=e[i];s!==void 0&&this.setValue(t,i,s)}static upload(t,e,i,s){for(let r=0,o=e.length;r!==o;++r){let a=e[r],l=i[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,s)}}static seqWithValue(t,e){let i=[];for(let s=0,r=t.length;s!==r;++s){let o=t[s];o.id in e&&i.push(o)}return i}};function nd(n,t,e){let i=n.createShader(t);return n.shaderSource(i,e),n.compileShader(i),i}var C_=37297,R_=0;function I_(n,t){let e=n.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=s;o<r;o++){let a=o+1;i.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return i.join(`
`)}var id=new Nt;function P_(n){Xt._getMatrix(id,Xt.workingColorSpace,n);let t=`mat3( ${id.elements.map(e=>e.toFixed(4))} )`;switch(Xt.getTransfer(n)){case hr:return[t,"LinearTransferOETF"];case $t:return[t,"sRGBTransferOETF"];default:return Rt("WebGLProgram: Unsupported color space: ",n),[t,"LinearTransferOETF"]}}function sd(n,t,e){let i=n.getShaderParameter(t,n.COMPILE_STATUS),r=(n.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let a=parseInt(o[1]);return e.toUpperCase()+`

`+r+`

`+I_(n.getShaderSource(t),a)}else return r}function D_(n,t){let e=P_(t);return[`vec4 ${n}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}var L_={[kc]:"Linear",[Gc]:"Reinhard",[Hc]:"Cineon",[Lr]:"ACESFilmic",[Xc]:"AgX",[qc]:"Neutral",[Wc]:"Custom"};function N_(n,t){let e=L_[t];return e===void 0?(Rt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var gl=new z;function U_(){Xt.getLuminanceCoefficients(gl);let n=gl.x.toFixed(4),t=gl.y.toFixed(4),e=gl.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function F_(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qr).join(`
`)}function O_(n){let t=[];for(let e in n){let i=n[e];i!==!1&&t.push("#define "+e+" "+i)}return t.join(`
`)}function B_(n,t){let e={},i=n.getProgramParameter(t,n.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=n.getActiveAttrib(t,s),o=r.name,a=1;r.type===n.FLOAT_MAT2&&(a=2),r.type===n.FLOAT_MAT3&&(a=3),r.type===n.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:n.getAttribLocation(t,o),locationSize:a}}return e}function qr(n){return n!==""}function rd(n,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function od(n,t){return n.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var V_=/^[ \t]*#include +<([\w\d./]+)>/gm;function Sh(n){return n.replace(V_,k_)}var z_=new Map;function k_(n,t){let e=zt[t];if(e===void 0){let i=z_.get(t);if(i!==void 0)e=zt[i],Rt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">")}return Sh(e)}var G_=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ad(n){return n.replace(G_,H_)}function H_(n,t,e,i){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function ld(n){let t=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?t+=`
#define HIGH_PRECISION`:n.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var W_={[Dr]:"SHADOWMAP_TYPE_PCF",[Es]:"SHADOWMAP_TYPE_VSM"};function X_(n){return W_[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var q_={[yi]:"ENVMAP_TYPE_CUBE",[zi]:"ENVMAP_TYPE_CUBE",[Nr]:"ENVMAP_TYPE_CUBE_UV"};function Y_(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":q_[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var Z_={[zi]:"ENVMAP_MODE_REFRACTION"};function K_(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":Z_[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var J_={[Aa]:"ENVMAP_BLENDING_MULTIPLY",[Ef]:"ENVMAP_BLENDING_MIX",[Af]:"ENVMAP_BLENDING_ADD"};function $_(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":J_[n.combine]||"ENVMAP_BLENDING_NONE"}function j_(n){let t=n.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,i=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:i,maxMip:e}}function Q_(n,t,e,i){let s=n.getContext(),r=e.defines,o=e.vertexShader,a=e.fragmentShader,l=X_(e),c=Y_(e),h=K_(e),f=$_(e),u=j_(e),m=F_(e),_=O_(r),S=s.createProgram(),p,d,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(qr).join(`
`),p.length>0&&(p+=`
`),d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(qr).join(`
`),d.length>0&&(d+=`
`)):(p=[ld(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qr).join(`
`),d=[ld(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==gn?"#define TONE_MAPPING":"",e.toneMapping!==gn?zt.tonemapping_pars_fragment:"",e.toneMapping!==gn?N_("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,D_("linearToOutputTexel",e.outputColorSpace),U_(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qr).join(`
`)),o=Sh(o),o=rd(o,e),o=od(o,e),a=Sh(a),a=rd(a,e),a=od(a,e),o=ad(o),a=ad(a),e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,p=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,d=["#define varying in",e.glslVersion===th?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===th?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);let C=M+p+o,y=M+d+a,A=nd(s,s.VERTEX_SHADER,C),b=nd(s,s.FRAGMENT_SHADER,y);s.attachShader(S,A),s.attachShader(S,b),e.index0AttributeName!==void 0?s.bindAttribLocation(S,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(S,0,"position"),s.linkProgram(S);function T(R){if(n.debug.checkShaderErrors){let D=s.getProgramInfoLog(S)||"",L=s.getShaderInfoLog(A)||"",I=s.getShaderInfoLog(b)||"",U=D.trim(),W=L.trim(),k=I.trim(),J=!0,B=!0;if(s.getProgramParameter(S,s.LINK_STATUS)===!1)if(J=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(s,S,A,b);else{let X=sd(s,A,"vertex"),K=sd(s,b,"fragment");It("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(S,s.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+U+`
`+X+`
`+K)}else U!==""?Rt("WebGLProgram: Program Info Log:",U):(W===""||k==="")&&(B=!1);B&&(R.diagnostics={runnable:J,programLog:U,vertexShader:{log:W,prefix:p},fragmentShader:{log:k,prefix:d}})}s.deleteShader(A),s.deleteShader(b),g=new Ps(s,S),E=B_(s,S)}let g;this.getUniforms=function(){return g===void 0&&T(this),g};let E;this.getAttributes=function(){return E===void 0&&T(this),E};let P=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=s.getProgramParameter(S,C_)),P},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(S),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=R_++,this.cacheKey=t,this.usedTimes=1,this.program=S,this.vertexShader=A,this.fragmentShader=b,this}var ty=0,Mh=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,i){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(i)===!1&&(s.add(i),i.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let i of e)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,i=e.get(t);return i===void 0&&(i=new Set,e.set(t,i)),i}_getShaderStage(t){let e=this.shaderCache,i=e.get(t);return i===void 0&&(i=new bh(t),e.set(t,i)),i}},bh=class{constructor(t){this.id=ty++,this.code=t,this.usedTimes=0}};function ey(n){return n===Mi||n===zr||n===kr}function ny(n,t,e,i,s,r){let o=new dr,a=new Mh,l=new Set,c=[],h=new Map,f=i.logarithmicDepthBuffer,u=i.precision,m={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(g){return l.add(g),g===0?"uv":`uv${g}`}function S(g,E,P,R,D,L){let I=R.fog,U=D.geometry,W=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?R.environment:null,k=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,J=t.get(g.envMap||W,k),B=J&&J.mapping===Nr?J.image.height:null,X=m[g.type];g.precision!==null&&(u=i.getMaxPrecision(g.precision),u!==g.precision&&Rt("WebGLProgram.getParameters:",g.precision,"not supported, using",u,"instead."));let K=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,it=K!==void 0?K.length:0,rt=0;U.morphAttributes.position!==void 0&&(rt=1),U.morphAttributes.normal!==void 0&&(rt=2),U.morphAttributes.color!==void 0&&(rt=3);let Ht,Lt,Ut,Z;if(X){let se=On[X];Ht=se.vertexShader,Lt=se.fragmentShader}else{Ht=g.vertexShader,Lt=g.fragmentShader;let se=a.getVertexShaderStage(g),Kt=a.getFragmentShaderStage(g);a.update(g,se,Kt),Ut=se.id,Z=Kt.id}let Q=n.getRenderTarget(),xt=n.state.buffers.depth.getReversed(),Pt=D.isInstancedMesh===!0,gt=D.isBatchedMesh===!0,Dt=!!g.map,fe=!!g.matcap,Bt=!!J,Yt=!!g.aoMap,jt=!!g.lightMap,Ft=!!g.bumpMap&&g.wireframe===!1,ce=!!g.normalMap,ve=!!g.displacementMap,qe=!!g.emissiveMap,ue=!!g.metalnessMap,me=!!g.roughnessMap,O=g.anisotropy>0,Le=g.clearcoat>0,Qt=g.dispersion>0,w=g.retroreflectivity>0,x=g.iridescence>0,V=g.sheen>0,q=g.transmission>0,$=O&&!!g.anisotropyMap,st=Le&&!!g.clearcoatMap,ot=Le&&!!g.clearcoatNormalMap,j=Le&&!!g.clearcoatRoughnessMap,et=x&&!!g.iridescenceMap,at=x&&!!g.iridescenceThicknessMap,Et=V&&!!g.sheenColorMap,ut=V&&!!g.sheenRoughnessMap,lt=!!g.specularMap,At=!!g.specularColorMap,Ct=!!g.specularIntensityMap,Ot=q&&!!g.transmissionMap,F=q&&!!g.thicknessMap,ct=!!g.gradientMap,tt=!!g.alphaMap,ht=g.alphaTest>0,mt=!!g.alphaHash,nt=!!g.extensions,wt=gn;g.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(wt=n.toneMapping);let bt={shaderID:X,shaderType:g.type,shaderName:g.name,vertexShader:Ht,fragmentShader:Lt,defines:g.defines,customVertexShaderID:Ut,customFragmentShaderID:Z,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:u,batching:gt,batchingColor:gt&&D._colorsTexture!==null,instancing:Pt,instancingColor:Pt&&D.instanceColor!==null,instancingMorph:Pt&&D.morphTexture!==null,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:Xt.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:Dt,matcap:fe,envMap:Bt,envMapMode:Bt&&J.mapping,envMapCubeUVHeight:B,aoMap:Yt,lightMap:jt,bumpMap:Ft,normalMap:ce,displacementMap:ve,emissiveMap:qe,normalMapObjectSpace:ce&&g.normalMapType===Rf,normalMapTangentSpace:ce&&g.normalMapType===Gr,packedNormalMap:ce&&g.normalMapType===Gr&&ey(g.normalMap.format),metalnessMap:ue,roughnessMap:me,anisotropy:O,anisotropyMap:$,clearcoat:Le,clearcoatMap:st,clearcoatNormalMap:ot,clearcoatRoughnessMap:j,dispersion:Qt,retroreflection:w,iridescence:x,iridescenceMap:et,iridescenceThicknessMap:at,sheen:V,sheenColorMap:Et,sheenRoughnessMap:ut,specularMap:lt,specularColorMap:At,specularIntensityMap:Ct,transmission:q,transmissionMap:Ot,thicknessMap:F,gradientMap:ct,opaque:g.transparent===!1&&g.blending===As&&g.alphaToCoverage===!1,alphaMap:tt,alphaTest:ht,alphaHash:mt,combine:g.combine,mapUv:Dt&&_(g.map.channel),aoMapUv:Yt&&_(g.aoMap.channel),lightMapUv:jt&&_(g.lightMap.channel),bumpMapUv:Ft&&_(g.bumpMap.channel),normalMapUv:ce&&_(g.normalMap.channel),displacementMapUv:ve&&_(g.displacementMap.channel),emissiveMapUv:qe&&_(g.emissiveMap.channel),metalnessMapUv:ue&&_(g.metalnessMap.channel),roughnessMapUv:me&&_(g.roughnessMap.channel),anisotropyMapUv:$&&_(g.anisotropyMap.channel),clearcoatMapUv:st&&_(g.clearcoatMap.channel),clearcoatNormalMapUv:ot&&_(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:j&&_(g.clearcoatRoughnessMap.channel),iridescenceMapUv:et&&_(g.iridescenceMap.channel),iridescenceThicknessMapUv:at&&_(g.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&_(g.sheenColorMap.channel),sheenRoughnessMapUv:ut&&_(g.sheenRoughnessMap.channel),specularMapUv:lt&&_(g.specularMap.channel),specularColorMapUv:At&&_(g.specularColorMap.channel),specularIntensityMapUv:Ct&&_(g.specularIntensityMap.channel),transmissionMapUv:Ot&&_(g.transmissionMap.channel),thicknessMapUv:F&&_(g.thicknessMap.channel),alphaMapUv:tt&&_(g.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ce||O),vertexNormals:!!U.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:D.isPoints===!0&&!!U.attributes.uv&&(Dt||tt),fog:!!I,useFog:g.fog===!0,fogExp2:!!I&&I.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||U.attributes.normal===void 0&&ce===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:xt,skinning:D.isSkinnedMesh===!0,hasPositionAttribute:U.attributes.position!==void 0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:it,morphTextureStride:rt,numSunLights:E.sun.length,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numSunLightShadows:E.sunShadowMap.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numLightProbeGrids:L.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:g.dithering,shadowMapEnabled:n.shadowMap.enabled&&P.length>0,shadowMapType:n.shadowMap.type,toneMapping:wt,decodeVideoTexture:Dt&&g.map.isVideoTexture===!0&&Xt.getTransfer(g.map.colorSpace)===$t,decodeVideoTextureEmissive:qe&&g.emissiveMap.isVideoTexture===!0&&Xt.getTransfer(g.emissiveMap.colorSpace)===$t,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===Nn,flipSided:g.side===Ie,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:nt&&g.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(nt&&g.extensions.multiDraw===!0||gt)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return bt.vertexUv1s=l.has(1),bt.vertexUv2s=l.has(2),bt.vertexUv3s=l.has(3),l.clear(),bt}function p(g){let E=[];if(g.shaderID?E.push(g.shaderID):(E.push(g.customVertexShaderID),E.push(g.customFragmentShaderID)),g.defines!==void 0)for(let P in g.defines)E.push(P),E.push(g.defines[P]);return g.isRawShaderMaterial===!1&&(d(E,g),M(E,g),E.push(n.outputColorSpace)),E.push(g.customProgramCacheKey),E.join()}function d(g,E){g.push(E.precision),g.push(E.outputColorSpace),g.push(E.envMapMode),g.push(E.envMapCubeUVHeight),g.push(E.mapUv),g.push(E.alphaMapUv),g.push(E.lightMapUv),g.push(E.aoMapUv),g.push(E.bumpMapUv),g.push(E.normalMapUv),g.push(E.displacementMapUv),g.push(E.emissiveMapUv),g.push(E.metalnessMapUv),g.push(E.roughnessMapUv),g.push(E.anisotropyMapUv),g.push(E.clearcoatMapUv),g.push(E.clearcoatNormalMapUv),g.push(E.clearcoatRoughnessMapUv),g.push(E.iridescenceMapUv),g.push(E.iridescenceThicknessMapUv),g.push(E.sheenColorMapUv),g.push(E.sheenRoughnessMapUv),g.push(E.specularMapUv),g.push(E.specularColorMapUv),g.push(E.specularIntensityMapUv),g.push(E.transmissionMapUv),g.push(E.thicknessMapUv),g.push(E.combine),g.push(E.fogExp2),g.push(E.sizeAttenuation),g.push(E.morphTargetsCount),g.push(E.morphAttributeCount),g.push(E.numSunLights),g.push(E.numDirLights),g.push(E.numPointLights),g.push(E.numSpotLights),g.push(E.numSpotLightMaps),g.push(E.numHemiLights),g.push(E.numRectAreaLights),g.push(E.numSunLightShadows),g.push(E.numDirLightShadows),g.push(E.numPointLightShadows),g.push(E.numSpotLightShadows),g.push(E.numSpotLightShadowsWithMaps),g.push(E.numLightProbes),g.push(E.shadowMapType),g.push(E.toneMapping),g.push(E.numClippingPlanes),g.push(E.numClipIntersection),g.push(E.depthPacking)}function M(g,E){o.disableAll(),E.instancing&&o.enable(0),E.instancingColor&&o.enable(1),E.instancingMorph&&o.enable(2),E.matcap&&o.enable(3),E.envMap&&o.enable(4),E.normalMapObjectSpace&&o.enable(5),E.normalMapTangentSpace&&o.enable(6),E.clearcoat&&o.enable(7),E.iridescence&&o.enable(8),E.alphaTest&&o.enable(9),E.vertexColors&&o.enable(10),E.vertexAlphas&&o.enable(11),E.vertexUv1s&&o.enable(12),E.vertexUv2s&&o.enable(13),E.vertexUv3s&&o.enable(14),E.vertexTangents&&o.enable(15),E.anisotropy&&o.enable(16),E.alphaHash&&o.enable(17),E.batching&&o.enable(18),E.dispersion&&o.enable(19),E.retroreflection&&o.enable(24),E.batchingColor&&o.enable(20),E.gradientMap&&o.enable(21),E.packedNormalMap&&o.enable(22),E.vertexNormals&&o.enable(23),g.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reversedDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.decodeVideoTextureEmissive&&o.enable(20),E.alphaToCoverage&&o.enable(21),E.numLightProbeGrids>0&&o.enable(22),E.hasPositionAttribute&&o.enable(23),g.push(o.mask)}function C(g){let E=m[g.type],P;if(E){let R=On[E];P=Hf.clone(R.uniforms)}else P=g.uniforms;return P}function y(g,E){let P=h.get(E);return P!==void 0?++P.usedTimes:(P=new Q_(n,E,g,s),c.push(P),h.set(E,P)),P}function A(g){if(--g.usedTimes===0){let E=c.indexOf(g);c[E]=c[c.length-1],c.pop(),h.delete(g.cacheKey),g.destroy()}}function b(g){a.remove(g)}function T(){a.dispose()}return{getParameters:S,getProgramCacheKey:p,getUniforms:C,acquireProgram:y,releaseProgram:A,releaseShaderCache:b,programs:c,dispose:T}}function iy(){let n=new WeakMap;function t(o){return n.has(o)}function e(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function s(o,a,l){n.get(o)[a]=l}function r(){n=new WeakMap}return{has:t,get:e,remove:i,update:s,dispose:r}}function sy(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.material.id!==t.material.id?n.material.id-t.material.id:n.materialVariant!==t.materialVariant?n.materialVariant-t.materialVariant:n.z!==t.z?n.z-t.z:n.id-t.id}function cd(n,t){return n.groupOrder!==t.groupOrder?n.groupOrder-t.groupOrder:n.renderOrder!==t.renderOrder?n.renderOrder-t.renderOrder:n.z!==t.z?t.z-n.z:n.id-t.id}function hd(){let n=[],t=0,e=[],i=[],s=[];function r(){t=0,e.length=0,i.length=0,s.length=0}function o(u){let m=0;return u.isInstancedMesh&&(m+=2),u.isSkinnedMesh&&(m+=1),m}function a(u,m,_,S,p,d){let M=n[t];return M===void 0?(M={id:u.id,object:u,geometry:m,material:_,materialVariant:o(u),groupOrder:S,renderOrder:u.renderOrder,z:p,group:d},n[t]=M):(M.id=u.id,M.object=u,M.geometry=m,M.material=_,M.materialVariant=o(u),M.groupOrder=S,M.renderOrder=u.renderOrder,M.z=p,M.group=d),t++,M}function l(u,m,_,S,p,d,M){M.reversedDepth===!0&&(p=-p);let C=a(u,m,_,S,p,d);_.transmission>0?i.push(C):_.transparent===!0?s.push(C):e.push(C)}function c(u,m,_,S,p,d){let M=a(u,m,_,S,p,d);_.transmission>0?i.unshift(M):_.transparent===!0?s.unshift(M):e.unshift(M)}function h(u,m){e.length>1&&e.sort(u||sy),i.length>1&&i.sort(m||cd),s.length>1&&s.sort(m||cd)}function f(){for(let u=t,m=n.length;u<m;u++){let _=n[u];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:e,transmissive:i,transparent:s,init:r,push:l,unshift:c,finish:f,sort:h}}function ry(){let n=new WeakMap;function t(i,s){let r=n.get(i),o;return r===void 0?(o=new hd,n.set(i,[o])):s>=r.length?(o=new hd,r.push(o)):o=r[s],o}function e(){n=new WeakMap}return{get:t,dispose:e}}function oy(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new z,color:new Gt};break;case"SpotLight":e={position:new z,direction:new z,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new z,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new z,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":e={color:new Gt,position:new z,halfWidth:new z,halfHeight:new z};break}return n[t.id]=e,e}}}function ay(){let n={};return{get:function(t){if(n[t.id]!==void 0)return n[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new kt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[t.id]=e,e}}}var ly=0;function cy(n,t){return(t.castShadow?2:0)-(n.castShadow?2:0)+(t.map?1:0)-(n.map?1:0)}function hy(n){let t=new oy,e=ay(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new z);let s=new z,r=new ne,o=new ne;function a(c){let h=0,f=0,u=0;for(let D=0;D<9;D++)i.probe[D].set(0,0,0);let m=0,_=0,S=0,p=0,d=0,M=0,C=0,y=0,A=0,b=0,T=0,g=0,E=0,P=0;c.sort(cy);for(let D=0,L=c.length;D<L;D++){let I=c[D],U=I.color,W=I.intensity,k=I.distance,J=null;if(I.shadow&&I.shadow.map&&(I.shadow.map.texture.format===Mi?J=I.shadow.map.texture:J=I.shadow.map.depthTexture||I.shadow.map.texture),I.isAmbientLight)h+=U.r*W,f+=U.g*W,u+=U.b*W;else if(I.isLightProbe){for(let B=0;B<9;B++)i.probe[B].addScaledVector(I.sh.coefficients[B],W);P++}else if(I.isSunLight){let B=t.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let X=I.shadow,K=e.get(I);K.shadowIntensity=X.intensity,K.shadowBias=X.bias,K.shadowNormalBias=X.normalBias,K.shadowRadius=X.radius,K.shadowMapSize.copy(X.mapSize).multiply(X.getFrameExtents()),i.sunShadow[_]=K,i.sunShadowMap[_]=J;let it=X.getViewportCount();for(let rt=0;rt<it;rt++)i.sunShadowMatrix[S+rt]=X.getMatrix(rt),i.sunShadowCascade[S+rt]=X._cascadeData[rt];S+=it,_++}i.sun[m]=B,m++}else if(I.isDirectionalLight){let B=t.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let X=I.shadow,K=e.get(I);K.shadowIntensity=X.intensity,K.shadowBias=X.bias,K.shadowNormalBias=X.normalBias,K.shadowRadius=X.radius,K.shadowMapSize=X.mapSize,i.directionalShadow[p]=K,i.directionalShadowMap[p]=J,i.directionalShadowMatrix[p]=I.shadow.matrix,A++}i.directional[p]=B,p++}else if(I.isSpotLight){let B=t.get(I);B.position.setFromMatrixPosition(I.matrixWorld),B.color.copy(U).multiplyScalar(W),B.distance=k,B.coneCos=Math.cos(I.angle),B.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),B.decay=I.decay,i.spot[M]=B;let X=I.shadow;if(I.map&&(i.spotLightMap[g]=I.map,g++,X.updateMatrices(I),I.castShadow&&E++),i.spotLightMatrix[M]=X.matrix,I.castShadow){let K=e.get(I);K.shadowIntensity=X.intensity,K.shadowBias=X.bias,K.shadowNormalBias=X.normalBias,K.shadowRadius=X.radius,K.shadowMapSize=X.mapSize,i.spotShadow[M]=K,i.spotShadowMap[M]=J,T++}M++}else if(I.isRectAreaLight){let B=t.get(I);B.color.copy(U).multiplyScalar(W),B.halfWidth.set(I.width*.5,0,0),B.halfHeight.set(0,I.height*.5,0),i.rectArea[C]=B,C++}else if(I.isPointLight){let B=t.get(I);if(B.color.copy(I.color).multiplyScalar(I.intensity),B.distance=I.distance,B.decay=I.decay,I.castShadow){let X=I.shadow,K=e.get(I);K.shadowIntensity=X.intensity,K.shadowBias=X.bias,K.shadowNormalBias=X.normalBias,K.shadowRadius=X.radius,K.shadowMapSize=X.mapSize,K.shadowCameraNear=X.camera.near,K.shadowCameraFar=X.camera.far,i.pointShadow[d]=K,i.pointShadowMap[d]=J,i.pointShadowMatrix[d]=I.shadow.matrix,b++}i.point[d]=B,d++}else if(I.isHemisphereLight){let B=t.get(I);B.skyColor.copy(I.color).multiplyScalar(W),B.groundColor.copy(I.groundColor).multiplyScalar(W),i.hemi[y]=B,y++}}C>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ft.LTC_FLOAT_1,i.rectAreaLTC2=ft.LTC_FLOAT_2):(i.rectAreaLTC1=ft.LTC_HALF_1,i.rectAreaLTC2=ft.LTC_HALF_2)),i.ambient[0]=h,i.ambient[1]=f,i.ambient[2]=u;let R=i.hash;(R.sunLength!==m||R.directionalLength!==p||R.pointLength!==d||R.spotLength!==M||R.rectAreaLength!==C||R.hemiLength!==y||R.numSunShadows!==_||R.numDirectionalShadows!==A||R.numPointShadows!==b||R.numSpotShadows!==T||R.numSpotMaps!==g||R.numLightProbes!==P)&&(i.sun.length=m,i.directional.length=p,i.spot.length=M,i.rectArea.length=C,i.point.length=d,i.hemi.length=y,i.sunShadow.length=_,i.sunShadowMap.length=_,i.sunShadowMatrix.length=S,i.sunShadowCascade.length=S,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.directionalShadowMatrix.length=A,i.pointShadow.length=b,i.pointShadowMap.length=b,i.pointShadowMatrix.length=b,i.spotShadow.length=T,i.spotShadowMap.length=T,i.spotLightMatrix.length=T+g-E,i.spotLightMap.length=g,i.numSpotLightShadowsWithMaps=E,i.numLightProbes=P,R.sunLength=m,R.directionalLength=p,R.pointLength=d,R.spotLength=M,R.rectAreaLength=C,R.hemiLength=y,R.numSunShadows=_,R.numDirectionalShadows=A,R.numPointShadows=b,R.numSpotShadows=T,R.numSpotMaps=g,R.numLightProbes=P,i.version=ly++)}function l(c,h){let f=0,u=0,m=0,_=0,S=0,p=0,d=h.matrixWorldInverse;for(let M=0,C=c.length;M<C;M++){let y=c[M];if(y.isSunLight){let A=i.sun[f];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(d),f++}else if(y.isDirectionalLight){let A=i.directional[u];A.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(d),u++}else if(y.isSpotLight){let A=i.spot[_];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(d),A.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(d),_++}else if(y.isRectAreaLight){let A=i.rectArea[S];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(d),o.identity(),r.copy(y.matrixWorld),r.premultiply(d),o.extractRotation(r),A.halfWidth.set(y.width*.5,0,0),A.halfHeight.set(0,y.height*.5,0),A.halfWidth.applyMatrix4(o),A.halfHeight.applyMatrix4(o),S++}else if(y.isPointLight){let A=i.point[m];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(d),m++}else if(y.isHemisphereLight){let A=i.hemi[p];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(d),p++}}}return{setup:a,setupView:l,state:i}}function ud(n){let t=new hy(n),e=[],i=[],s=[];function r(u){f.camera=u,e.length=0,i.length=0,s.length=0}function o(u){e.push(u)}function a(u){i.push(u)}function l(u){s.push(u)}function c(){t.setup(e)}function h(u){t.setupView(e,u)}let f={lightsArray:e,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function uy(n){let t=new WeakMap;function e(s,r=0){let o=t.get(s),a;return o===void 0?(a=new ud(n),t.set(s,[a])):r>=o.length?(a=new ud(n),o.push(a)):a=o[r],a}function i(){t=new WeakMap}return{get:e,dispose:i}}var fy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,dy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,py=[new z(1,0,0),new z(-1,0,0),new z(0,1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1)],my=[new z(0,-1,0),new z(0,-1,0),new z(0,0,1),new z(0,0,-1),new z(0,-1,0),new z(0,-1,0)],fd=new ne,Xr=new z,gh=new z;function gy(n,t,e){let i=new Ss,s=new kt,r=new kt,o=new he,a=new ua,l=new fa,c={},h=e.maxTextureSize,f={[_i]:Ie,[Ie]:_i,[Nn]:Nn},u=new nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new kt},radius:{value:4}},vertexShader:fy,fragmentShader:dy}),m=u.clone();m.defines.HORIZONTAL_PASS=1;let _=new Ge;_.setAttribute("position",new ke(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let S=new ie(_,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Dr;let d=this.type;this.render=function(b,T,g){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||b.length===0)return;this.type===of&&(Rt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Dr);let E=n.getRenderTarget(),P=n.getActiveCubeFace(),R=n.getActiveMipmapLevel(),D=n.state;D.setBlending(Un),D.buffers.depth.getReversed()===!0?D.buffers.color.setClear(0,0,0,0):D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let L=d!==this.type;L&&T.traverse(function(I){I.material&&(Array.isArray(I.material)?I.material.forEach(U=>U.needsUpdate=!0):I.material.needsUpdate=!0)});for(let I=0,U=b.length;I<U;I++){let W=b[I],k=W.shadow;if(k===void 0){Rt("WebGLShadowMap:",W,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);let J=k.getFrameExtents();s.multiply(J),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/J.x),s.x=r.x*J.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/J.y),s.y=r.y*J.y,k.mapSize.y=r.y));let B=n.state.buffers.depth.getReversed();if(k.camera._reversedDepth=B,k.map===null||L===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Es){if(W.isPointLight){Rt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Ke(s.x,s.y,{format:Mi,type:_n,minFilter:Re,magFilter:Re,generateMipmaps:!1}),k.map.texture.name=W.name+".shadowMap",k.map.depthTexture=new di(s.x,s.y,ln),k.map.depthTexture.name=W.name+".shadowMapDepth",k.map.depthTexture.format=Cn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=be,k.map.depthTexture.magFilter=be}else W.isPointLight?(k.map=new xl(s.x),k.map.depthTexture=new la(s.x,xn)):(k.map=new Ke(s.x,s.y),k.map.depthTexture=new di(s.x,s.y,xn)),k.map.depthTexture.name=W.name+".shadowMap",k.map.depthTexture.format=Cn,this.type===Dr?(k.map.depthTexture.compareFunction=B?pl:dl,k.map.depthTexture.minFilter=Re,k.map.depthTexture.magFilter=Re):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=be,k.map.depthTexture.magFilter=be);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==s.x||k.map.height!==s.y)&&k.map.setSize(s.x,s.y);let X=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();W.isPointLight!==!0&&k.updateMatrices(W,g);for(let K=0;K<X;K++){let it=k.getCamera(K);if(W.isPointLight){let rt=k.camera,Ht=k.matrix,Lt=W.distance||rt.far;Lt!==rt.far&&(rt.far=Lt,rt.updateProjectionMatrix()),Xr.setFromMatrixPosition(W.matrixWorld),rt.position.copy(Xr),gh.copy(rt.position),gh.add(py[K]),rt.up.copy(my[K]),rt.lookAt(gh),rt.updateMatrixWorld(),Ht.makeTranslation(-Xr.x,-Xr.y,-Xr.z),fd.multiplyMatrices(rt.projectionMatrix,rt.matrixWorldInverse),k._frustum.setFromProjectionMatrix(fd,rt.coordinateSystem,rt.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)n.setRenderTarget(k.map,K),n.clear();else{K===0&&(n.setRenderTarget(k.map),n.clear());let rt=k.getViewport(K);o.set(r.x*rt.x,r.y*rt.y,r.x*rt.z,r.y*rt.w),D.viewport(o)}i=k.getFrustum(K),y(T,g,it,W,this.type)}k.isPointLightShadow!==!0&&this.type===Es&&M(k,g),k.needsUpdate=!1}d=this.type,p.needsUpdate=!1,n.setRenderTarget(E,P,R)};function M(b,T){let g=t.update(S);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null?b.mapPass=new Ke(s.x,s.y,{format:Mi,type:_n}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),u.uniforms.shadow_pass.value=b.map.depthTexture,u.uniforms.resolution.value.set(b.map.width,b.map.height),u.uniforms.radius.value=b.radius,n.setRenderTarget(b.mapPass),n.clear(),n.renderBufferDirect(T,null,g,u,S,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value.set(b.map.width,b.map.height),m.uniforms.radius.value=b.radius,n.setRenderTarget(b.map),n.clear(),n.renderBufferDirect(T,null,g,m,S,null)}function C(b,T,g,E){let P=null,R=g.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(R!==void 0)P=R;else if(P=g.isPointLight===!0?l:a,n.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let D=P.uuid,L=T.uuid,I=c[D];I===void 0&&(I={},c[D]=I);let U=I[L];U===void 0&&(U=P.clone(),I[L]=U,T.addEventListener("dispose",A)),P=U}if(P.visible=T.visible,P.wireframe=T.wireframe,E===Es?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:f[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,g.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let D=n.properties.get(P);D.light=g}return P}function y(b,T,g,E,P){if(b.visible===!1)return;if(b.layers.test(T.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&P===Es)&&(!b.frustumCulled||b.intersectsFrustum(i))){b.modelViewMatrix.multiplyMatrices(g.matrixWorldInverse,b.matrixWorld);let L=t.update(b),I=b.material;if(Array.isArray(I)){let U=L.groups;for(let W=0,k=U.length;W<k;W++){let J=U[W],B=I[J.materialIndex];if(B&&B.visible){let X=C(b,B,E,P);b.onBeforeShadow(n,b,T,g,L,X,J),n.renderBufferDirect(g,null,L,X,b,J),b.onAfterShadow(n,b,T,g,L,X,J)}}}else if(I.visible){let U=C(b,I,E,P);b.onBeforeShadow(n,b,T,g,L,U,null),n.renderBufferDirect(g,null,L,U,b,null),b.onAfterShadow(n,b,T,g,L,U,null)}}let D=b.children;for(let L=0,I=D.length;L<I;L++)y(D[L],T,g,E,P)}function A(b){b.target.removeEventListener("dispose",A);for(let g in c){let E=c[g],P=b.target.uuid;P in E&&(E[P].dispose(),delete E[P])}}}function xy(n,t){function e(){let F=!1,ct=new he,tt=null,ht=new he(0,0,0,0);return{setMask:function(mt){tt!==mt&&!F&&(n.colorMask(mt,mt,mt,mt),tt=mt)},setLocked:function(mt){F=mt},setClear:function(mt,nt,wt,bt,se){se===!0&&(mt*=bt,nt*=bt,wt*=bt),ct.set(mt,nt,wt,bt),ht.equals(ct)===!1&&(n.clearColor(mt,nt,wt,bt),ht.copy(ct))},reset:function(){F=!1,tt=null,ht.set(-1,0,0,0)}}}function i(){let F=!1,ct=!1,tt=null,ht=null,mt=null;return{setReversed:function(nt){if(ct!==nt){let wt=t.get("EXT_clip_control");nt?wt.clipControlEXT(wt.LOWER_LEFT_EXT,wt.ZERO_TO_ONE_EXT):wt.clipControlEXT(wt.LOWER_LEFT_EXT,wt.NEGATIVE_ONE_TO_ONE_EXT),ct=nt;let bt=mt;mt=null,this.setClear(bt)}},getReversed:function(){return ct},setTest:function(nt){nt?Q(n.DEPTH_TEST):xt(n.DEPTH_TEST)},setMask:function(nt){tt!==nt&&!F&&(n.depthMask(nt),tt=nt)},setFunc:function(nt){if(ct&&(nt=kf[nt]),ht!==nt){switch(nt){case Zo:n.depthFunc(n.NEVER);break;case Ko:n.depthFunc(n.ALWAYS);break;case Jo:n.depthFunc(n.LESS);break;case gs:n.depthFunc(n.LEQUAL);break;case $o:n.depthFunc(n.EQUAL);break;case jo:n.depthFunc(n.GEQUAL);break;case Qo:n.depthFunc(n.GREATER);break;case ta:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}ht=nt}},setLocked:function(nt){F=nt},setClear:function(nt){mt!==nt&&(mt=nt,ct&&(nt=1-nt),n.clearDepth(nt))},reset:function(){F=!1,tt=null,ht=null,mt=null,ct=!1}}}function s(){let F=!1,ct=null,tt=null,ht=null,mt=null,nt=null,wt=null,bt=null,se=null;return{setTest:function(Kt){F||(Kt?Q(n.STENCIL_TEST):xt(n.STENCIL_TEST))},setMask:function(Kt){ct!==Kt&&!F&&(n.stencilMask(Kt),ct=Kt)},setFunc:function(Kt,hn,Tn){(tt!==Kt||ht!==hn||mt!==Tn)&&(n.stencilFunc(Kt,hn,Tn),tt=Kt,ht=hn,mt=Tn)},setOp:function(Kt,hn,Tn){(nt!==Kt||wt!==hn||bt!==Tn)&&(n.stencilOp(Kt,hn,Tn),nt=Kt,wt=hn,bt=Tn)},setLocked:function(Kt){F=Kt},setClear:function(Kt){se!==Kt&&(n.clearStencil(Kt),se=Kt)},reset:function(){F=!1,ct=null,tt=null,ht=null,mt=null,nt=null,wt=null,bt=null,se=null}}}let r=new e,o=new i,a=new s,l=new WeakMap,c=new WeakMap,h={},f={},u={},m=new WeakMap,_=[],S=null,p=!1,d=null,M=null,C=null,y=null,A=null,b=null,T=null,g=new Gt(0,0,0),E=0,P=!1,R=null,D=null,L=null,I=null,U=null,W=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,J=0,B=n.getParameter(n.VERSION);B.indexOf("WebGL")!==-1?(J=parseFloat(/^WebGL (\d)/.exec(B)[1]),k=J>=1):B.indexOf("OpenGL ES")!==-1&&(J=parseFloat(/^OpenGL ES (\d)/.exec(B)[1]),k=J>=2);let X=null,K={},it=n.getParameter(n.SCISSOR_BOX),rt=n.getParameter(n.VIEWPORT),Ht=new he().fromArray(it),Lt=new he().fromArray(rt);function Ut(F,ct,tt,ht){let mt=new Uint8Array(4),nt=n.createTexture();n.bindTexture(F,nt),n.texParameteri(F,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(F,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let wt=0;wt<tt;wt++)F===n.TEXTURE_3D||F===n.TEXTURE_2D_ARRAY?n.texImage3D(ct,0,n.RGBA,1,1,ht,0,n.RGBA,n.UNSIGNED_BYTE,mt):n.texImage2D(ct+wt,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,mt);return nt}let Z={};Z[n.TEXTURE_2D]=Ut(n.TEXTURE_2D,n.TEXTURE_2D,1),Z[n.TEXTURE_CUBE_MAP]=Ut(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Z[n.TEXTURE_2D_ARRAY]=Ut(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Z[n.TEXTURE_3D]=Ut(n.TEXTURE_3D,n.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(n.DEPTH_TEST),o.setFunc(gs),Ft(!1),ce(Uc),Q(n.CULL_FACE),Yt(Un);function Q(F){h[F]!==!0&&(n.enable(F),h[F]=!0)}function xt(F){h[F]!==!1&&(n.disable(F),h[F]=!1)}function Pt(F,ct){return u[F]!==ct?(n.bindFramebuffer(F,ct),u[F]=ct,F===n.DRAW_FRAMEBUFFER&&(u[n.FRAMEBUFFER]=ct),F===n.FRAMEBUFFER&&(u[n.DRAW_FRAMEBUFFER]=ct),!0):!1}function gt(F,ct){let tt=_,ht=!1;if(F){tt=m.get(ct),tt===void 0&&(tt=[],m.set(ct,tt));let mt=F.textures;if(tt.length!==mt.length||tt[0]!==n.COLOR_ATTACHMENT0){for(let nt=0,wt=mt.length;nt<wt;nt++)tt[nt]=n.COLOR_ATTACHMENT0+nt;tt.length=mt.length,ht=!0}}else tt[0]!==n.BACK&&(tt[0]=n.BACK,ht=!0);ht&&n.drawBuffers(tt)}function Dt(F){return S!==F?(n.useProgram(F),S=F,!0):!1}let fe={[Vi]:n.FUNC_ADD,[lf]:n.FUNC_SUBTRACT,[cf]:n.FUNC_REVERSE_SUBTRACT};fe[hf]=n.MIN,fe[uf]=n.MAX;let Bt={[ff]:n.ZERO,[df]:n.ONE,[pf]:n.SRC_COLOR,[Vc]:n.SRC_ALPHA,[vf]:n.SRC_ALPHA_SATURATE,[_f]:n.DST_COLOR,[gf]:n.DST_ALPHA,[mf]:n.ONE_MINUS_SRC_COLOR,[zc]:n.ONE_MINUS_SRC_ALPHA,[yf]:n.ONE_MINUS_DST_COLOR,[xf]:n.ONE_MINUS_DST_ALPHA,[Sf]:n.CONSTANT_COLOR,[Mf]:n.ONE_MINUS_CONSTANT_COLOR,[bf]:n.CONSTANT_ALPHA,[Tf]:n.ONE_MINUS_CONSTANT_ALPHA};function Yt(F,ct,tt,ht,mt,nt,wt,bt,se,Kt){if(F===Un){p===!0&&(xt(n.BLEND),p=!1);return}if(p===!1&&(Q(n.BLEND),p=!0),F!==af){if(F!==d||Kt!==P){if((M!==Vi||A!==Vi)&&(n.blendEquation(n.FUNC_ADD),M=Vi,A=Vi),Kt)switch(F){case As:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fc:n.blendFunc(n.ONE,n.ONE);break;case Oc:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Bc:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:It("WebGLState: Invalid blending: ",F);break}else switch(F){case As:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Fc:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Oc:It("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Bc:It("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:It("WebGLState: Invalid blending: ",F);break}C=null,y=null,b=null,T=null,g.set(0,0,0),E=0,d=F,P=Kt}return}mt=mt||ct,nt=nt||tt,wt=wt||ht,(ct!==M||mt!==A)&&(n.blendEquationSeparate(fe[ct],fe[mt]),M=ct,A=mt),(tt!==C||ht!==y||nt!==b||wt!==T)&&(n.blendFuncSeparate(Bt[tt],Bt[ht],Bt[nt],Bt[wt]),C=tt,y=ht,b=nt,T=wt),(bt.equals(g)===!1||se!==E)&&(n.blendColor(bt.r,bt.g,bt.b,se),g.copy(bt),E=se),d=F,P=!1}function jt(F,ct){F.side===Nn?xt(n.CULL_FACE):Q(n.CULL_FACE);let tt=F.side===Ie;ct&&(tt=!tt),Ft(tt),F.blending===As&&F.transparent===!1?Yt(Un):Yt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),o.setFunc(F.depthFunc),o.setTest(F.depthTest),o.setMask(F.depthWrite),r.setMask(F.colorWrite);let ht=F.stencilWrite;a.setTest(ht),ht&&(a.setMask(F.stencilWriteMask),a.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),a.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),qe(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):xt(n.SAMPLE_ALPHA_TO_COVERAGE)}function Ft(F){R!==F&&(F?n.frontFace(n.CW):n.frontFace(n.CCW),R=F)}function ce(F){F!==sf?(Q(n.CULL_FACE),F!==D&&(F===Uc?n.cullFace(n.BACK):F===rf?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):xt(n.CULL_FACE),D=F}function ve(F){F!==L&&(k&&n.lineWidth(F),L=F)}function qe(F,ct,tt){F?(Q(n.POLYGON_OFFSET_FILL),(I!==ct||U!==tt)&&(I=ct,U=tt,o.getReversed()&&(ct=-ct),n.polygonOffset(ct,tt))):xt(n.POLYGON_OFFSET_FILL)}function ue(F){F?Q(n.SCISSOR_TEST):xt(n.SCISSOR_TEST)}function me(F){F===void 0&&(F=n.TEXTURE0+W-1),X!==F&&(n.activeTexture(F),X=F)}function O(F,ct,tt){tt===void 0&&(X===null?tt=n.TEXTURE0+W-1:tt=X);let ht=K[tt];ht===void 0&&(ht={type:void 0,texture:void 0},K[tt]=ht),(ht.type!==F||ht.texture!==ct)&&(X!==tt&&(n.activeTexture(tt),X=tt),n.bindTexture(F,ct||Z[F]),ht.type=F,ht.texture=ct)}function Le(){let F=K[X];F!==void 0&&F.type!==void 0&&(n.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function Qt(){try{n.compressedTexImage2D(...arguments)}catch(F){It("WebGLState:",F)}}function w(){try{n.compressedTexImage3D(...arguments)}catch(F){It("WebGLState:",F)}}function x(){try{n.texSubImage2D(...arguments)}catch(F){It("WebGLState:",F)}}function V(){try{n.texSubImage3D(...arguments)}catch(F){It("WebGLState:",F)}}function q(){try{n.compressedTexSubImage2D(...arguments)}catch(F){It("WebGLState:",F)}}function $(){try{n.compressedTexSubImage3D(...arguments)}catch(F){It("WebGLState:",F)}}function st(){try{n.texStorage2D(...arguments)}catch(F){It("WebGLState:",F)}}function ot(){try{n.texStorage3D(...arguments)}catch(F){It("WebGLState:",F)}}function j(){try{n.texImage2D(...arguments)}catch(F){It("WebGLState:",F)}}function et(){try{n.texImage3D(...arguments)}catch(F){It("WebGLState:",F)}}function at(F){return f[F]!==void 0?f[F]:n.getParameter(F)}function Et(F,ct){f[F]!==ct&&(n.pixelStorei(F,ct),f[F]=ct)}function ut(F){Ht.equals(F)===!1&&(n.scissor(F.x,F.y,F.z,F.w),Ht.copy(F))}function lt(F){Lt.equals(F)===!1&&(n.viewport(F.x,F.y,F.z,F.w),Lt.copy(F))}function At(F,ct){let tt=c.get(ct);tt===void 0&&(tt=new WeakMap,c.set(ct,tt));let ht=tt.get(F);ht===void 0&&(ht=n.getUniformBlockIndex(ct,F.name),tt.set(F,ht))}function Ct(F,ct){let ht=c.get(ct).get(F);l.get(ct)!==ht&&(n.uniformBlockBinding(ct,ht,F.__bindingPointIndex),l.set(ct,ht))}function Ot(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),h={},f={},X=null,K={},u={},m=new WeakMap,_=[],S=null,p=!1,d=null,M=null,C=null,y=null,A=null,b=null,T=null,g=new Gt(0,0,0),E=0,P=!1,R=null,D=null,L=null,I=null,U=null,Ht.set(0,0,n.canvas.width,n.canvas.height),Lt.set(0,0,n.canvas.width,n.canvas.height),r.reset(),o.reset(),a.reset()}return{buffers:{color:r,depth:o,stencil:a},enable:Q,disable:xt,bindFramebuffer:Pt,drawBuffers:gt,useProgram:Dt,setBlending:Yt,setMaterial:jt,setFlipSided:Ft,setCullFace:ce,setLineWidth:ve,setPolygonOffset:qe,setScissorTest:ue,activeTexture:me,bindTexture:O,unbindTexture:Le,compressedTexImage2D:Qt,compressedTexImage3D:w,texImage2D:j,texImage3D:et,pixelStorei:Et,getParameter:at,updateUBOMapping:At,uniformBlockBinding:Ct,texStorage2D:st,texStorage3D:ot,texSubImage2D:x,texSubImage3D:V,compressedTexSubImage2D:q,compressedTexSubImage3D:$,scissor:ut,viewport:lt,reset:Ot}}function _y(n,t,e,i,s,r,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new kt,h=new WeakMap,f=new Set,u,m=new WeakMap,_=!1;try{_=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(w,x){return _?new OffscreenCanvas(w,x):ur("canvas")}function p(w,x,V){let q=1,$=Qt(w);if(($.width>V||$.height>V)&&(q=V/Math.max($.width,$.height)),q<1)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap||typeof VideoFrame<"u"&&w instanceof VideoFrame){let st=Math.floor(q*$.width),ot=Math.floor(q*$.height);u===void 0&&(u=S(st,ot));let j=x?S(st,ot):u;return j.width=st,j.height=ot,j.getContext("2d").drawImage(w,0,0,st,ot),Rt("WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+st+"x"+ot+")."),j}else return"data"in w&&Rt("WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),w;return w}function d(w){return w.generateMipmaps}function M(w){n.generateMipmap(w)}function C(w){return w.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:w.isWebGL3DRenderTarget?n.TEXTURE_3D:w.isWebGLArrayRenderTarget||w.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(w,x,V,q,$,st=!1){if(w!==null){if(n[w]!==void 0)return n[w];Rt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ot;q&&(ot=t.get("EXT_texture_norm16"),ot||Rt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=x;if(x===n.RED&&(V===n.FLOAT&&(j=n.R32F),V===n.HALF_FLOAT&&(j=n.R16F),V===n.UNSIGNED_BYTE&&(j=n.R8),V===n.UNSIGNED_SHORT&&ot&&(j=ot.R16_EXT),V===n.SHORT&&ot&&(j=ot.R16_SNORM_EXT)),x===n.RED_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.R8UI),V===n.UNSIGNED_SHORT&&(j=n.R16UI),V===n.UNSIGNED_INT&&(j=n.R32UI),V===n.BYTE&&(j=n.R8I),V===n.SHORT&&(j=n.R16I),V===n.INT&&(j=n.R32I)),x===n.RG&&(V===n.FLOAT&&(j=n.RG32F),V===n.HALF_FLOAT&&(j=n.RG16F),V===n.UNSIGNED_BYTE&&(j=n.RG8),V===n.UNSIGNED_SHORT&&ot&&(j=ot.RG16_EXT),V===n.SHORT&&ot&&(j=ot.RG16_SNORM_EXT)),x===n.RG_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.RG8UI),V===n.UNSIGNED_SHORT&&(j=n.RG16UI),V===n.UNSIGNED_INT&&(j=n.RG32UI),V===n.BYTE&&(j=n.RG8I),V===n.SHORT&&(j=n.RG16I),V===n.INT&&(j=n.RG32I)),x===n.RGB_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.RGB8UI),V===n.UNSIGNED_SHORT&&(j=n.RGB16UI),V===n.UNSIGNED_INT&&(j=n.RGB32UI),V===n.BYTE&&(j=n.RGB8I),V===n.SHORT&&(j=n.RGB16I),V===n.INT&&(j=n.RGB32I)),x===n.RGBA_INTEGER&&(V===n.UNSIGNED_BYTE&&(j=n.RGBA8UI),V===n.UNSIGNED_SHORT&&(j=n.RGBA16UI),V===n.UNSIGNED_INT&&(j=n.RGBA32UI),V===n.BYTE&&(j=n.RGBA8I),V===n.SHORT&&(j=n.RGBA16I),V===n.INT&&(j=n.RGBA32I)),x===n.RGB&&(V===n.UNSIGNED_SHORT&&ot&&(j=ot.RGB16_EXT),V===n.SHORT&&ot&&(j=ot.RGB16_SNORM_EXT),V===n.UNSIGNED_INT_5_9_9_9_REV&&(j=n.RGB9_E5),V===n.UNSIGNED_INT_10F_11F_11F_REV&&(j=n.R11F_G11F_B10F)),x===n.RGBA){let et=st?hr:Xt.getTransfer($);V===n.FLOAT&&(j=n.RGBA32F),V===n.HALF_FLOAT&&(j=n.RGBA16F),V===n.UNSIGNED_BYTE&&(j=et===$t?n.SRGB8_ALPHA8:n.RGBA8),V===n.UNSIGNED_SHORT&&ot&&(j=ot.RGBA16_EXT),V===n.SHORT&&ot&&(j=ot.RGBA16_SNORM_EXT),V===n.UNSIGNED_SHORT_4_4_4_4&&(j=n.RGBA4),V===n.UNSIGNED_SHORT_5_5_5_1&&(j=n.RGB5_A1)}return(j===n.R16F||j===n.R32F||j===n.RG16F||j===n.RG32F||j===n.RGBA16F||j===n.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function A(w,x){let V;return w?x===null||x===xn||x===Cs?V=n.DEPTH24_STENCIL8:x===ln?V=n.DEPTH32F_STENCIL8:x===ws&&(V=n.DEPTH24_STENCIL8,Rt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===xn||x===Cs?V=n.DEPTH_COMPONENT24:x===ln?V=n.DEPTH_COMPONENT32F:x===ws&&(V=n.DEPTH_COMPONENT16),V}function b(w,x){return d(w)===!0||w.isFramebufferTexture&&w.minFilter!==be&&w.minFilter!==Re?Math.log2(Math.max(x.width,x.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?x.mipmaps.length:1}function T(w){let x=w.target;x.removeEventListener("dispose",T),E(x),x.isVideoTexture&&h.delete(x),x.isHTMLTexture&&f.delete(x)}function g(w){let x=w.target;x.removeEventListener("dispose",g),R(x)}function E(w){let x=i.get(w);if(x.__webglInit===void 0)return;let V=w.source,q=m.get(V);if(q){let $=q[x.__cacheKey];$.usedTimes--,$.usedTimes===0&&P(w),Object.keys(q).length===0&&m.delete(V)}i.remove(w)}function P(w){let x=i.get(w);n.deleteTexture(x.__webglTexture);let V=w.source,q=m.get(V);delete q[x.__cacheKey],o.memory.textures--}function R(w){let x=i.get(w);if(w.depthTexture&&(w.depthTexture.dispose(),i.remove(w.depthTexture)),w.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(x.__webglFramebuffer[q]))for(let $=0;$<x.__webglFramebuffer[q].length;$++)n.deleteFramebuffer(x.__webglFramebuffer[q][$]);else n.deleteFramebuffer(x.__webglFramebuffer[q]);x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer[q])}else{if(Array.isArray(x.__webglFramebuffer))for(let q=0;q<x.__webglFramebuffer.length;q++)n.deleteFramebuffer(x.__webglFramebuffer[q]);else n.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&n.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&n.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let q=0;q<x.__webglColorRenderbuffer.length;q++)x.__webglColorRenderbuffer[q]&&n.deleteRenderbuffer(x.__webglColorRenderbuffer[q]);x.__webglDepthRenderbuffer&&n.deleteRenderbuffer(x.__webglDepthRenderbuffer)}let V=w.textures;for(let q=0,$=V.length;q<$;q++){let st=i.get(V[q]);st.__webglTexture&&(n.deleteTexture(st.__webglTexture),o.memory.textures--),i.remove(V[q])}i.remove(w)}let D=0;function L(){D=0}function I(){return D}function U(w){D=w}function W(){let w=D;return w>=s.maxTextures&&Rt("WebGLTextures: Trying to use "+(w+1)+" texture units while this GPU supports only "+s.maxTextures),D+=1,w}function k(w){let x=[];return x.push(w.wrapS),x.push(w.wrapT),x.push(w.wrapR||0),x.push(w.magFilter),x.push(w.minFilter),x.push(w.anisotropy),x.push(w.internalFormat),x.push(w.format),x.push(w.type),x.push(w.generateMipmaps),x.push(w.premultiplyAlpha),x.push(w.flipY),x.push(w.unpackAlignment),x.push(w.colorSpace),x.join()}function J(w,x){let V=i.get(w);if(w.isVideoTexture&&O(w),w.isRenderTargetTexture===!1&&w.isExternalTexture!==!0&&w.version>0&&V.__version!==w.version){let q=w.image;if(q===null)Rt("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Rt("WebGLRenderer: Texture marked for update but image is incomplete");else{xt(V,w,x);return}}else w.isExternalTexture&&(V.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(n.TEXTURE_2D,V.__webglTexture,n.TEXTURE0+x)}function B(w,x){let V=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&V.__version!==w.version){xt(V,w,x);return}else w.isExternalTexture&&(V.__webglTexture=w.sourceTexture?w.sourceTexture:null);e.bindTexture(n.TEXTURE_2D_ARRAY,V.__webglTexture,n.TEXTURE0+x)}function X(w,x){let V=i.get(w);if(w.isRenderTargetTexture===!1&&w.version>0&&V.__version!==w.version){xt(V,w,x);return}e.bindTexture(n.TEXTURE_3D,V.__webglTexture,n.TEXTURE0+x)}function K(w,x){let V=i.get(w);if(w.isCubeDepthTexture!==!0&&w.version>0&&V.__version!==w.version){Pt(V,w,x);return}e.bindTexture(n.TEXTURE_CUBE_MAP,V.__webglTexture,n.TEXTURE0+x)}let it={[ea]:n.REPEAT,[wn]:n.CLAMP_TO_EDGE,[na]:n.MIRRORED_REPEAT},rt={[be]:n.NEAREST,[wf]:n.NEAREST_MIPMAP_NEAREST,[Ur]:n.NEAREST_MIPMAP_LINEAR,[Re]:n.LINEAR,[Ra]:n.LINEAR_MIPMAP_NEAREST,[vi]:n.LINEAR_MIPMAP_LINEAR},Ht={[Pf]:n.NEVER,[Ff]:n.ALWAYS,[Df]:n.LESS,[dl]:n.LEQUAL,[Lf]:n.EQUAL,[pl]:n.GEQUAL,[Nf]:n.GREATER,[Uf]:n.NOTEQUAL};function Lt(w,x){if(x.type===ln&&t.has("OES_texture_float_linear")===!1&&(x.magFilter===Re||x.magFilter===Ra||x.magFilter===Ur||x.magFilter===vi||x.minFilter===Re||x.minFilter===Ra||x.minFilter===Ur||x.minFilter===vi)&&Rt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(w,n.TEXTURE_WRAP_S,it[x.wrapS]),n.texParameteri(w,n.TEXTURE_WRAP_T,it[x.wrapT]),(w===n.TEXTURE_3D||w===n.TEXTURE_2D_ARRAY)&&n.texParameteri(w,n.TEXTURE_WRAP_R,it[x.wrapR]),n.texParameteri(w,n.TEXTURE_MAG_FILTER,rt[x.magFilter]),n.texParameteri(w,n.TEXTURE_MIN_FILTER,rt[x.minFilter]),x.compareFunction&&(n.texParameteri(w,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(w,n.TEXTURE_COMPARE_FUNC,Ht[x.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===be||x.minFilter!==Ur&&x.minFilter!==vi||x.type===ln&&t.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||i.get(x).__currentAnisotropy){let V=t.get("EXT_texture_filter_anisotropic");n.texParameterf(w,V.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,s.getMaxAnisotropy())),i.get(x).__currentAnisotropy=x.anisotropy}}}function Ut(w,x){let V=!1;w.__webglInit===void 0&&(w.__webglInit=!0,x.addEventListener("dispose",T));let q=x.source,$=m.get(q);$===void 0&&($={},m.set(q,$));let st=k(x);if(st!==w.__cacheKey){$[st]===void 0&&($[st]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,V=!0),$[st].usedTimes++;let ot=$[w.__cacheKey];ot!==void 0&&($[w.__cacheKey].usedTimes--,ot.usedTimes===0&&P(x)),w.__cacheKey=st,w.__webglTexture=$[st].texture}return V}function Z(w,x,V){return Math.floor(Math.floor(w/V)/x)}function Q(w,x,V,q){let st=w.updateRanges;if(st.length===0)e.texSubImage2D(n.TEXTURE_2D,0,0,0,x.width,x.height,V,q,x.data);else{st.sort((Et,ut)=>Et.start-ut.start);let ot=0;for(let Et=1;Et<st.length;Et++){let ut=st[ot],lt=st[Et],At=ut.start+ut.count,Ct=Z(lt.start,x.width,4),Ot=Z(ut.start,x.width,4);lt.start<=At+1&&Ct===Ot&&Z(lt.start+lt.count-1,x.width,4)===Ct?ut.count=Math.max(ut.count,lt.start+lt.count-ut.start):(++ot,st[ot]=lt)}st.length=ot+1;let j=e.getParameter(n.UNPACK_ROW_LENGTH),et=e.getParameter(n.UNPACK_SKIP_PIXELS),at=e.getParameter(n.UNPACK_SKIP_ROWS);e.pixelStorei(n.UNPACK_ROW_LENGTH,x.width);for(let Et=0,ut=st.length;Et<ut;Et++){let lt=st[Et],At=Math.floor(lt.start/4),Ct=Math.ceil(lt.count/4),Ot=At%x.width,F=Math.floor(At/x.width),ct=Ct,tt=1;e.pixelStorei(n.UNPACK_SKIP_PIXELS,Ot),e.pixelStorei(n.UNPACK_SKIP_ROWS,F),e.texSubImage2D(n.TEXTURE_2D,0,Ot,F,ct,tt,V,q,x.data)}w.clearUpdateRanges(),e.pixelStorei(n.UNPACK_ROW_LENGTH,j),e.pixelStorei(n.UNPACK_SKIP_PIXELS,et),e.pixelStorei(n.UNPACK_SKIP_ROWS,at)}}function xt(w,x,V){let q=n.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(q=n.TEXTURE_2D_ARRAY),x.isData3DTexture&&(q=n.TEXTURE_3D);let $=Ut(w,x),st=x.source;e.bindTexture(q,w.__webglTexture,n.TEXTURE0+V);let ot=i.get(st);if(st.version!==ot.__version||$===!0){if(e.activeTexture(n.TEXTURE0+V),(typeof ImageBitmap<"u"&&x.image instanceof ImageBitmap)===!1){let tt=Xt.getPrimaries(Xt.workingColorSpace),ht=x.colorSpace===jn?null:Xt.getPrimaries(x.colorSpace),mt=x.colorSpace===jn||tt===ht?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,mt)}e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment);let et=p(x.image,!1,s.maxTextureSize);et=Le(x,et);let at=r.convert(x.format,x.colorSpace),Et=r.convert(x.type),ut=y(x.internalFormat,at,Et,x.normalized,x.colorSpace,x.isVideoTexture);Lt(q,x);let lt,At=x.mipmaps,Ct=x.isVideoTexture!==!0,Ot=ot.__version===void 0||$===!0,F=st.dataReady,ct=b(x,et);if(x.isDepthTexture)ut=A(x.format===Si,x.type),Ot&&(Ct?e.texStorage2D(n.TEXTURE_2D,1,ut,et.width,et.height):e.texImage2D(n.TEXTURE_2D,0,ut,et.width,et.height,0,at,Et,null));else if(x.isDataTexture)if(At.length>0){Ct&&Ot&&e.texStorage2D(n.TEXTURE_2D,ct,ut,At[0].width,At[0].height);for(let tt=0,ht=At.length;tt<ht;tt++)lt=At[tt],Ct?F&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,lt.width,lt.height,at,Et,lt.data):e.texImage2D(n.TEXTURE_2D,tt,ut,lt.width,lt.height,0,at,Et,lt.data);x.generateMipmaps=!1}else Ct?(Ot&&e.texStorage2D(n.TEXTURE_2D,ct,ut,et.width,et.height),F&&Q(x,et,at,Et)):e.texImage2D(n.TEXTURE_2D,0,ut,et.width,et.height,0,at,Et,et.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){Ct&&Ot&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ct,ut,At[0].width,At[0].height,et.depth);for(let tt=0,ht=At.length;tt<ht;tt++)if(lt=At[tt],x.format!==cn)if(at!==null)if(Ct){if(F)if(x.layerUpdates.size>0){let mt=rh(lt.width,lt.height,x.format,x.type);for(let nt of x.layerUpdates){let wt=lt.data.subarray(nt*mt/lt.data.BYTES_PER_ELEMENT,(nt+1)*mt/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,nt,lt.width,lt.height,1,at,wt)}}else e.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,lt.width,lt.height,et.depth,at,lt.data)}else e.compressedTexImage3D(n.TEXTURE_2D_ARRAY,tt,ut,lt.width,lt.height,et.depth,0,lt.data,0,0);else Rt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ct?F&&e.texSubImage3D(n.TEXTURE_2D_ARRAY,tt,0,0,0,lt.width,lt.height,et.depth,at,Et,lt.data):e.texImage3D(n.TEXTURE_2D_ARRAY,tt,ut,lt.width,lt.height,et.depth,0,at,Et,lt.data);x.layerUpdates.size>0&&x.clearLayerUpdates()}else{Ct&&Ot&&e.texStorage2D(n.TEXTURE_2D,ct,ut,At[0].width,At[0].height);for(let tt=0,ht=At.length;tt<ht;tt++)lt=At[tt],x.format!==cn?at!==null?Ct?F&&e.compressedTexSubImage2D(n.TEXTURE_2D,tt,0,0,lt.width,lt.height,at,lt.data):e.compressedTexImage2D(n.TEXTURE_2D,tt,ut,lt.width,lt.height,0,lt.data):Rt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ct?F&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,lt.width,lt.height,at,Et,lt.data):e.texImage2D(n.TEXTURE_2D,tt,ut,lt.width,lt.height,0,at,Et,lt.data)}else if(x.isDataArrayTexture)if(Ct){if(Ot&&e.texStorage3D(n.TEXTURE_2D_ARRAY,ct,ut,et.width,et.height,et.depth),F)if(x.layerUpdates.size>0){let tt=rh(et.width,et.height,x.format,x.type);for(let ht of x.layerUpdates){let mt=et.data.subarray(ht*tt/et.data.BYTES_PER_ELEMENT,(ht+1)*tt/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,ht,et.width,et.height,1,at,Et,mt)}x.clearLayerUpdates()}else e.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,at,Et,et.data)}else e.texImage3D(n.TEXTURE_2D_ARRAY,0,ut,et.width,et.height,et.depth,0,at,Et,et.data);else if(x.isData3DTexture)Ct?(Ot&&e.texStorage3D(n.TEXTURE_3D,ct,ut,et.width,et.height,et.depth),F&&e.texSubImage3D(n.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,at,Et,et.data)):e.texImage3D(n.TEXTURE_3D,0,ut,et.width,et.height,et.depth,0,at,Et,et.data);else if(x.isFramebufferTexture){if(Ot)if(Ct)e.texStorage2D(n.TEXTURE_2D,ct,ut,et.width,et.height);else{let tt=et.width,ht=et.height;for(let mt=0;mt<ct;mt++)e.texImage2D(n.TEXTURE_2D,mt,ut,tt,ht,0,at,Et,null),tt>>=1,ht>>=1}}else if(x.isHTMLTexture){if("texElementImage2D"in n){let tt=n.canvas;if(tt.hasAttribute("layoutsubtree")||tt.setAttribute("layoutsubtree","true"),et.parentNode!==tt){tt.appendChild(et),f.add(x),tt.onpaint=ht=>{let mt=ht.changedElements;for(let nt of f)mt.includes(nt.image)&&(nt.needsUpdate=!0)},tt.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,et);else{let mt=n.RGBA,nt=n.RGBA,wt=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,mt,nt,wt,et)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(At.length>0){if(Ct&&Ot){let tt=Qt(At[0]);e.texStorage2D(n.TEXTURE_2D,ct,ut,tt.width,tt.height)}for(let tt=0,ht=At.length;tt<ht;tt++)lt=At[tt],Ct?F&&e.texSubImage2D(n.TEXTURE_2D,tt,0,0,at,Et,lt):e.texImage2D(n.TEXTURE_2D,tt,ut,at,Et,lt);x.generateMipmaps=!1}else if(Ct){if(Ot){let tt=Qt(et);e.texStorage2D(n.TEXTURE_2D,ct,ut,tt.width,tt.height)}F&&e.texSubImage2D(n.TEXTURE_2D,0,0,0,at,Et,et)}else e.texImage2D(n.TEXTURE_2D,0,ut,at,Et,et);d(x)&&M(q),ot.__version=st.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function Pt(w,x,V){if(x.image.length!==6)return;let q=Ut(w,x),$=x.source;e.bindTexture(n.TEXTURE_CUBE_MAP,w.__webglTexture,n.TEXTURE0+V);let st=i.get($);if($.version!==st.__version||q===!0){e.activeTexture(n.TEXTURE0+V);let ot=Xt.getPrimaries(Xt.workingColorSpace),j=x.colorSpace===jn?null:Xt.getPrimaries(x.colorSpace),et=x.colorSpace===jn||ot===j?n.NONE:n.BROWSER_DEFAULT_WEBGL;e.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,x.flipY),e.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),e.pixelStorei(n.UNPACK_ALIGNMENT,x.unpackAlignment),e.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);let at=x.isCompressedTexture||x.image[0].isCompressedTexture,Et=x.image[0]&&x.image[0].isDataTexture,ut=[];for(let nt=0;nt<6;nt++)!at&&!Et?ut[nt]=p(x.image[nt],!0,s.maxCubemapSize):ut[nt]=Et?x.image[nt].image:x.image[nt],ut[nt]=Le(x,ut[nt]);let lt=ut[0],At=r.convert(x.format,x.colorSpace),Ct=r.convert(x.type),Ot=y(x.internalFormat,At,Ct,x.normalized,x.colorSpace),F=x.isVideoTexture!==!0,ct=st.__version===void 0||q===!0,tt=$.dataReady,ht=b(x,lt);Lt(n.TEXTURE_CUBE_MAP,x);let mt;if(at){F&&ct&&e.texStorage2D(n.TEXTURE_CUBE_MAP,ht,Ot,lt.width,lt.height);for(let nt=0;nt<6;nt++){mt=ut[nt].mipmaps;for(let wt=0;wt<mt.length;wt++){let bt=mt[wt];x.format!==cn?At!==null?F?tt&&e.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt,0,0,bt.width,bt.height,At,bt.data):e.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt,Ot,bt.width,bt.height,0,bt.data):Rt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt,0,0,bt.width,bt.height,At,Ct,bt.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt,Ot,bt.width,bt.height,0,At,Ct,bt.data)}}}else{if(mt=x.mipmaps,F&&ct){mt.length>0&&ht++;let nt=Qt(ut[0]);e.texStorage2D(n.TEXTURE_CUBE_MAP,ht,Ot,nt.width,nt.height)}for(let nt=0;nt<6;nt++)if(Et){F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,ut[nt].width,ut[nt].height,At,Ct,ut[nt].data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Ot,ut[nt].width,ut[nt].height,0,At,Ct,ut[nt].data);for(let wt=0;wt<mt.length;wt++){let se=mt[wt].image[nt].image;F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt+1,0,0,se.width,se.height,At,Ct,se.data):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt+1,Ot,se.width,se.height,0,At,Ct,se.data)}}else{F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,0,0,At,Ct,ut[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,0,Ot,At,Ct,ut[nt]);for(let wt=0;wt<mt.length;wt++){let bt=mt[wt];F?tt&&e.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt+1,0,0,At,Ct,bt.image[nt]):e.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+nt,wt+1,Ot,At,Ct,bt.image[nt])}}}d(x)&&M(n.TEXTURE_CUBE_MAP),st.__version=$.version,x.onUpdate&&x.onUpdate(x)}w.__version=x.version}function gt(w,x,V,q,$,st){let ot=r.convert(V.format,V.colorSpace),j=r.convert(V.type),et=y(V.internalFormat,ot,j,V.normalized,V.colorSpace),at=i.get(x),Et=i.get(V);if(Et.__renderTarget=x,!at.__hasExternalTextures){let ut=Math.max(1,x.width>>st),lt=Math.max(1,x.height>>st);$===n.TEXTURE_3D||$===n.TEXTURE_2D_ARRAY?e.texImage3D($,st,et,ut,lt,x.depth,0,ot,j,null):e.texImage2D($,st,et,ut,lt,0,ot,j,null)}e.bindFramebuffer(n.FRAMEBUFFER,w),me(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,q,$,Et.__webglTexture,0,ue(x)):($===n.TEXTURE_2D||$>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,q,$,Et.__webglTexture,st),e.bindFramebuffer(n.FRAMEBUFFER,null)}function Dt(w,x,V){if(n.bindRenderbuffer(n.RENDERBUFFER,w),x.depthBuffer){let q=x.depthTexture,$=q&&q.isDepthTexture?q.type:null,st=A(x.stencilBuffer,$),ot=x.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;me(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ue(x),st,x.width,x.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,ue(x),st,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,st,x.width,x.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,ot,n.RENDERBUFFER,w)}else{let q=x.textures;for(let $=0;$<q.length;$++){let st=q[$],ot=r.convert(st.format,st.colorSpace),j=r.convert(st.type),et=y(st.internalFormat,ot,j,st.normalized,st.colorSpace);me(x)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,ue(x),et,x.width,x.height):V?n.renderbufferStorageMultisample(n.RENDERBUFFER,ue(x),et,x.width,x.height):n.renderbufferStorage(n.RENDERBUFFER,et,x.width,x.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function fe(w,x,V){let q=x.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(n.FRAMEBUFFER,w),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let $=i.get(x.depthTexture);if($.__renderTarget=x,(!$.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),q){if($.__webglInit===void 0&&($.__webglInit=!0,x.depthTexture.addEventListener("dispose",T)),$.__webglTexture===void 0){$.__webglTexture=n.createTexture(),e.bindTexture(n.TEXTURE_CUBE_MAP,$.__webglTexture),Lt(n.TEXTURE_CUBE_MAP,x.depthTexture);let at=r.convert(x.depthTexture.format),Et=r.convert(x.depthTexture.type),ut;x.depthTexture.format===Cn?ut=n.DEPTH_COMPONENT24:x.depthTexture.format===Si&&(ut=n.DEPTH24_STENCIL8);for(let lt=0;lt<6;lt++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,ut,x.width,x.height,0,at,Et,null)}}else J(x.depthTexture,0);let st=$.__webglTexture,ot=ue(x),j=q?n.TEXTURE_CUBE_MAP_POSITIVE_X+V:n.TEXTURE_2D,et=x.depthTexture.format===Si?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(x.depthTexture.format===Cn)me(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,et,j,st,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,et,j,st,0);else if(x.depthTexture.format===Si)me(x)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,et,j,st,0,ot):n.framebufferTexture2D(n.FRAMEBUFFER,et,j,st,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Bt(w){let x=i.get(w),V=w.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==w.depthTexture){let q=w.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),q){let $=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,q.removeEventListener("dispose",$)};q.addEventListener("dispose",$),x.__depthDisposeCallback=$}x.__boundDepthTexture=q}if(w.depthTexture&&!x.__autoAllocateDepthBuffer)if(V)for(let q=0;q<6;q++)fe(x.__webglFramebuffer[q],w,q);else{let q=w.texture.mipmaps;q&&q.length>0?fe(x.__webglFramebuffer[0],w,0):fe(x.__webglFramebuffer,w,0)}else if(V){x.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[q]),x.__webglDepthbuffer[q]===void 0)x.__webglDepthbuffer[q]=n.createRenderbuffer(),Dt(x.__webglDepthbuffer[q],w,!1);else{let $=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer[q];n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,st)}}else{let q=w.texture.mipmaps;if(q&&q.length>0?e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer[0]):e.bindFramebuffer(n.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=n.createRenderbuffer(),Dt(x.__webglDepthbuffer,w,!1);else{let $=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,st=x.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,st),n.framebufferRenderbuffer(n.FRAMEBUFFER,$,n.RENDERBUFFER,st)}}e.bindFramebuffer(n.FRAMEBUFFER,null)}function Yt(w,x,V){let q=i.get(w);x!==void 0&&gt(q.__webglFramebuffer,w,w.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),V!==void 0&&Bt(w)}function jt(w){let x=w.texture,V=i.get(w),q=i.get(x);w.addEventListener("dispose",g);let $=w.textures,st=w.isWebGLCubeRenderTarget===!0,ot=$.length>1;if(ot||(q.__webglTexture===void 0&&(q.__webglTexture=n.createTexture()),q.__version=x.version,o.memory.textures++),st){V.__webglFramebuffer=[];for(let j=0;j<6;j++)if(x.mipmaps&&x.mipmaps.length>0){V.__webglFramebuffer[j]=[];for(let et=0;et<x.mipmaps.length;et++)V.__webglFramebuffer[j][et]=n.createFramebuffer()}else V.__webglFramebuffer[j]=n.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){V.__webglFramebuffer=[];for(let j=0;j<x.mipmaps.length;j++)V.__webglFramebuffer[j]=n.createFramebuffer()}else V.__webglFramebuffer=n.createFramebuffer();if(ot)for(let j=0,et=$.length;j<et;j++){let at=i.get($[j]);at.__webglTexture===void 0&&(at.__webglTexture=n.createTexture(),o.memory.textures++)}if(w.samples>0&&me(w)===!1){V.__webglMultisampledFramebuffer=n.createFramebuffer(),V.__webglColorRenderbuffer=[],e.bindFramebuffer(n.FRAMEBUFFER,V.__webglMultisampledFramebuffer);for(let j=0;j<$.length;j++){let et=$[j];V.__webglColorRenderbuffer[j]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,V.__webglColorRenderbuffer[j]);let at=r.convert(et.format,et.colorSpace),Et=r.convert(et.type),ut=y(et.internalFormat,at,Et,et.normalized,et.colorSpace,w.isXRRenderTarget===!0),lt=ue(w);n.renderbufferStorageMultisample(n.RENDERBUFFER,lt,ut,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+j,n.RENDERBUFFER,V.__webglColorRenderbuffer[j])}n.bindRenderbuffer(n.RENDERBUFFER,null),w.depthBuffer&&(V.__webglDepthRenderbuffer=n.createRenderbuffer(),Dt(V.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(n.FRAMEBUFFER,null)}}if(st){e.bindTexture(n.TEXTURE_CUBE_MAP,q.__webglTexture),Lt(n.TEXTURE_CUBE_MAP,x);for(let j=0;j<6;j++)if(x.mipmaps&&x.mipmaps.length>0)for(let et=0;et<x.mipmaps.length;et++)gt(V.__webglFramebuffer[j][et],w,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,et);else gt(V.__webglFramebuffer[j],w,x,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);d(x)&&M(n.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ot){for(let j=0,et=$.length;j<et;j++){let at=$[j],Et=i.get(at),ut=n.TEXTURE_2D;(w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(ut=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(ut,Et.__webglTexture),Lt(ut,at),gt(V.__webglFramebuffer,w,at,n.COLOR_ATTACHMENT0+j,ut,0),d(at)&&M(ut)}e.unbindTexture()}else{let j=n.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(j=w.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),e.bindTexture(j,q.__webglTexture),Lt(j,x),x.mipmaps&&x.mipmaps.length>0)for(let et=0;et<x.mipmaps.length;et++)gt(V.__webglFramebuffer[et],w,x,n.COLOR_ATTACHMENT0,j,et);else gt(V.__webglFramebuffer,w,x,n.COLOR_ATTACHMENT0,j,0);d(x)&&M(j),e.unbindTexture()}w.depthBuffer&&Bt(w)}function Ft(w){let x=w.textures;for(let V=0,q=x.length;V<q;V++){let $=x[V];if(d($)){let st=C(w),ot=i.get($).__webglTexture;e.bindTexture(st,ot),M(st),e.unbindTexture()}}}let ce=[],ve=[];function qe(w){if(w.samples>0){if(me(w)===!1){let x=w.textures,V=w.width,q=w.height,$=n.COLOR_BUFFER_BIT,st=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ot=i.get(w),j=x.length>1;if(j)for(let at=0;at<x.length;at++)e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,null),e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,null,0);e.bindFramebuffer(n.READ_FRAMEBUFFER,ot.__webglMultisampledFramebuffer);let et=w.texture.mipmaps;et&&et.length>0?e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglFramebuffer[0]):e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglFramebuffer);for(let at=0;at<x.length;at++){if(w.resolveDepthBuffer&&(w.depthBuffer&&($|=n.DEPTH_BUFFER_BIT),w.stencilBuffer&&w.resolveStencilBuffer&&($|=n.STENCIL_BUFFER_BIT)),j){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,ot.__webglColorRenderbuffer[at]);let Et=i.get(x[at]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Et,0)}n.blitFramebuffer(0,0,V,q,0,0,V,q,$,n.NEAREST),l===!0&&(ce.length=0,ve.length=0,ce.push(n.COLOR_ATTACHMENT0+at),w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&(ce.push(st),ve.push(st),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,ve)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ce))}if(e.bindFramebuffer(n.READ_FRAMEBUFFER,null),e.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),j)for(let at=0;at<x.length;at++){e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.RENDERBUFFER,ot.__webglColorRenderbuffer[at]);let Et=i.get(x[at]).__webglTexture;e.bindFramebuffer(n.FRAMEBUFFER,ot.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+at,n.TEXTURE_2D,Et,0)}e.bindFramebuffer(n.DRAW_FRAMEBUFFER,ot.__webglMultisampledFramebuffer)}else if(w.depthBuffer&&w.storeMultisampledDepthBuffer===!1&&l){let x=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[x])}}}function ue(w){return Math.min(s.maxSamples,w.samples)}function me(w){let x=i.get(w);return w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function O(w){let x=o.render.frame;h.get(w)!==x&&(h.set(w,x),w.update())}function Le(w,x){let V=w.colorSpace,q=w.format,$=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||V!==cr&&V!==jn&&(Xt.getTransfer(V)===$t?(q!==cn||$!==Je)&&Rt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):It("WebGLTextures: Unsupported texture color space:",V)),x}function Qt(w){return typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement?(c.width=w.naturalWidth||w.width,c.height=w.naturalHeight||w.height):typeof VideoFrame<"u"&&w instanceof VideoFrame?(c.width=w.displayWidth,c.height=w.displayHeight):(c.width=w.width,c.height=w.height),c}this.allocateTextureUnit=W,this.resetTextureUnits=L,this.getTextureUnits=I,this.setTextureUnits=U,this.setTexture2D=J,this.setTexture2DArray=B,this.setTexture3D=X,this.setTextureCube=K,this.rebindTextures=Yt,this.setupRenderTarget=jt,this.updateRenderTargetMipmap=Ft,this.updateMultisampleRenderTarget=qe,this.setupDepthRenderbuffer=Bt,this.setupFrameBufferTexture=gt,this.useMultisampledRTT=me,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function yy(n,t){function e(i,s=jn){let r,o=Xt.getTransfer(s);if(i===Je)return n.UNSIGNED_BYTE;if(i===Pa)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Da)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Jc)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===$c)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Zc)return n.BYTE;if(i===Kc)return n.SHORT;if(i===ws)return n.UNSIGNED_SHORT;if(i===Ia)return n.INT;if(i===xn)return n.UNSIGNED_INT;if(i===ln)return n.FLOAT;if(i===_n)return n.HALF_FLOAT;if(i===jc)return n.ALPHA;if(i===Qc)return n.RGB;if(i===cn)return n.RGBA;if(i===Cn)return n.DEPTH_COMPONENT;if(i===Si)return n.DEPTH_STENCIL;if(i===La)return n.RED;if(i===Na)return n.RED_INTEGER;if(i===Mi)return n.RG;if(i===Ua)return n.RG_INTEGER;if(i===Fa)return n.RGBA_INTEGER;if(i===Fr||i===Or||i===Br||i===Vr)if(o===$t)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===Fr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Or)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Vr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===Fr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Or)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Br)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Vr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Oa||i===Ba||i===Va||i===za)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===Oa)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ba)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Va)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===za)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===ka||i===Ga||i===Ha||i===Wa||i===Xa||i===zr||i===qa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===ka||i===Ga)return o===$t?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Ha)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Wa)return r.COMPRESSED_R11_EAC;if(i===Xa)return r.COMPRESSED_SIGNED_R11_EAC;if(i===zr)return r.COMPRESSED_RG11_EAC;if(i===qa)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Ya||i===Za||i===Ka||i===Ja||i===$a||i===ja||i===Qa||i===tl||i===el||i===nl||i===il||i===sl||i===rl||i===ol)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===Ya)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Za)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Ka)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ja)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===$a)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===ja)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Qa)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===tl)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===el)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===nl)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===il)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sl)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===rl)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ol)return o===$t?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===al||i===ll||i===cl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===al)return o===$t?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ll)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===cl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===hl||i===ul||i===kr||i===fl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===hl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===ul)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===kr)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===fl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Cs?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:e}}var vy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Sy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Th=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let i=new br(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,i=new nn({vertexShader:vy,fragmentShader:Sy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new ie(new Er(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Eh=class extends Rn{constructor(t,e){super();let i=this,s=null,r=1,o=null,a="local-floor",l=1,c=null,h=null,f=null,u=null,m=null,_=null,S=typeof XRWebGLBinding<"u",p=new Th,d={},M=e.getContextAttributes(),C=null,y=null,A=[],b=[],T=new kt,g=null,E=null,P=new Ce;P.viewport=new he;let R=new Ce;R.viewport=new he;let D=[P,R],L=new Ta,I=null,U=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let Q=A[Z];return Q===void 0&&(Q=new vs,A[Z]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Z){let Q=A[Z];return Q===void 0&&(Q=new vs,A[Z]=Q),Q.getGripSpace()},this.getHand=function(Z){let Q=A[Z];return Q===void 0&&(Q=new vs,A[Z]=Q),Q.getHandSpace()};function W(Z){let Q=b.indexOf(Z.inputSource);if(Q===-1)return;let xt=A[Q];xt!==void 0&&(xt.update(Z.inputSource,Z.frame,c||o),xt.dispatchEvent({type:Z.type,data:Z.inputSource}))}function k(){s.removeEventListener("select",W),s.removeEventListener("selectstart",W),s.removeEventListener("selectend",W),s.removeEventListener("squeeze",W),s.removeEventListener("squeezestart",W),s.removeEventListener("squeezeend",W),s.removeEventListener("end",k),s.removeEventListener("inputsourceschange",J);for(let Z=0;Z<A.length;Z++){let Q=b[Z];Q!==null&&(b[Z]=null,A[Z].disconnect(Q))}I=null,U=null,p.reset();for(let Z in d)delete d[Z];if(t.setRenderTarget(C),m=null,u=null,f=null,s=null,y=null,Ut.stop(),i.isPresenting=!1,t.setPixelRatio(g),t.setSize(T.width,T.height,!1),E!==null){let Z=E.camera;Z.fov=E.fov,Z.zoom=E.zoom,Z.updateProjectionMatrix(),E=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,i.isPresenting===!0&&Rt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,i.isPresenting===!0&&Rt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return f===null&&S&&(f=new XRWebGLBinding(s,e)),f},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(C=t.getRenderTarget(),s.addEventListener("select",W),s.addEventListener("selectstart",W),s.addEventListener("selectend",W),s.addEventListener("squeeze",W),s.addEventListener("squeezestart",W),s.addEventListener("squeezeend",W),s.addEventListener("end",k),s.addEventListener("inputsourceschange",J),M.xrCompatible!==!0&&await e.makeXRCompatible(),g=t.getPixelRatio(),t.getSize(T),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let xt=null,Pt=null,gt=null;M.depth&&(gt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,xt=M.stencil?Si:Cn,Pt=M.stencil?Cs:xn);let Dt={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Dt),s.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),y=new Ke(u.textureWidth,u.textureHeight,{format:cn,type:Je,depthTexture:new di(u.textureWidth,u.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,xt),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{let xt={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,e,xt),s.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),y=new Ke(m.framebufferWidth,m.framebufferHeight,{format:cn,type:Je,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:m.ignoreDepthValues===!1,resolveStencilBuffer:m.ignoreDepthValues===!1,storeMultisampledDepthBuffer:m.ignoreDepthValues===!1,storeMultisampledStencilBuffer:m.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Ut.setContext(s),Ut.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function J(Z){for(let Q=0;Q<Z.removed.length;Q++){let xt=Z.removed[Q],Pt=b.indexOf(xt);Pt>=0&&(b[Pt]=null,A[Pt].disconnect(xt))}for(let Q=0;Q<Z.added.length;Q++){let xt=Z.added[Q],Pt=b.indexOf(xt);if(Pt===-1){for(let Dt=0;Dt<A.length;Dt++)if(Dt>=b.length){b.push(xt),Pt=Dt;break}else if(b[Dt]===null){b[Dt]=xt,Pt=Dt;break}if(Pt===-1)break}let gt=A[Pt];gt&&gt.connect(xt)}}let B=new z,X=new z;function K(Z,Q,xt){B.setFromMatrixPosition(Q.matrixWorld),X.setFromMatrixPosition(xt.matrixWorld);let Pt=B.distanceTo(X),gt=Q.projectionMatrix.elements,Dt=xt.projectionMatrix.elements,fe=gt[14]/(gt[10]-1),Bt=gt[14]/(gt[10]+1),Yt=(gt[9]+1)/gt[5],jt=(gt[9]-1)/gt[5],Ft=(gt[8]-1)/gt[0],ce=(Dt[8]+1)/Dt[0],ve=fe*Ft,qe=fe*ce,ue=Pt/(-Ft+ce),me=ue*-Ft;if(Q.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(me),Z.translateZ(ue),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert(),gt[10]===-1)Z.projectionMatrix.copy(Q.projectionMatrix),Z.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let O=fe+ue,Le=Bt+ue,Qt=ve-me,w=qe+(Pt-me),x=Yt*Bt/Le*O,V=jt*Bt/Le*O;Z.projectionMatrix.makePerspective(Qt,w,x,V,O,Le),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}}function it(Z,Q){Q===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(Q.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;let Q=Z.near,xt=Z.far;p.texture!==null&&(p.depthNear>0&&(Q=p.depthNear),p.depthFar>0&&(xt=p.depthFar)),L.near=R.near=P.near=Q,L.far=R.far=P.far=xt,(I!==L.near||U!==L.far)&&(s.updateRenderState({depthNear:L.near,depthFar:L.far}),I=L.near,U=L.far),L.layers.mask=Z.layers.mask|6,P.layers.mask=L.layers.mask&-5,R.layers.mask=L.layers.mask&-3;let Pt=Z.parent,gt=L.cameras;it(L,Pt);for(let Dt=0;Dt<gt.length;Dt++)it(gt[Dt],Pt);gt.length===2?K(L,P,R):L.projectionMatrix.copy(P.projectionMatrix),E===null&&Z.isPerspectiveCamera&&(E={camera:Z,fov:Z.fov,zoom:Z.zoom}),rt(Z,L,Pt)};function rt(Z,Q,xt){xt===null?Z.matrix.copy(Q.matrixWorld):(Z.matrix.copy(xt.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(Q.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(Q.projectionMatrix),Z.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=sa*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return L},this.getFoveation=function(){if(!(u===null&&m===null))return l},this.setFoveation=function(Z){l=Z,u!==null&&(u.fixedFoveation=Z),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=Z)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(L)},this.getCameraTexture=function(Z){return d[Z]};let Ht=null;function Lt(Z,Q){if(h=Q.getViewerPose(c||o),_=Q,h!==null){let xt=h.views;m!==null&&(t.setRenderTargetFramebuffer(y,m.framebuffer),t.setRenderTarget(y));let Pt=!1;xt.length!==L.cameras.length&&(L.cameras.length=0,Pt=!0);for(let Bt=0;Bt<xt.length;Bt++){let Yt=xt[Bt],jt=null;if(m!==null)jt=m.getViewport(Yt);else{let ce=f.getViewSubImage(u,Yt);jt=ce.viewport,Bt===0&&(t.setRenderTargetTextures(y,ce.colorTexture,ce.depthStencilTexture),t.setRenderTarget(y))}let Ft=D[Bt];Ft===void 0&&(Ft=new Ce,Ft.layers.enable(Bt),Ft.viewport=new he,D[Bt]=Ft),Ft.matrix.fromArray(Yt.transform.matrix),Ft.matrix.decompose(Ft.position,Ft.quaternion,Ft.scale),Ft.projectionMatrix.fromArray(Yt.projectionMatrix),Ft.projectionMatrixInverse.copy(Ft.projectionMatrix).invert(),Ft.viewport.set(jt.x,jt.y,jt.width,jt.height),Bt===0&&(L.matrix.copy(Ft.matrix),L.matrix.decompose(L.position,L.quaternion,L.scale)),Pt===!0&&L.cameras.push(Ft)}let gt=s.enabledFeatures;if(gt&&gt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&S){f=i.getBinding();let Bt=f.getDepthInformation(xt[0]);Bt&&Bt.isValid&&Bt.texture&&p.init(Bt,s.renderState)}if(gt&&gt.includes("camera-access")&&S){t.state.unbindTexture(),f=i.getBinding();for(let Bt=0;Bt<xt.length;Bt++){let Yt=xt[Bt].camera;if(Yt){let jt=d[Yt];jt||(jt=new br,d[Yt]=jt);let Ft=f.getCameraImage(Yt);jt.sourceTexture=Ft}}}}for(let xt=0;xt<A.length;xt++){let Pt=b[xt],gt=A[xt];Pt!==null&&gt!==void 0&&gt.update(Pt,Q,c||o)}Ht&&Ht(Z,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),_=null}let Ut=new dd;Ut.setAnimationLoop(Lt),this.setAnimationLoop=function(Z){Ht=Z},this.dispose=function(){}}},My=new ne,yd=new Nt;yd.set(-1,0,0,0,1,0,0,0,1);function by(n,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function i(p,d){d.color.getRGB(p.fogColor.value,nh(n)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function s(p,d,M,C,y){d.isNodeMaterial?d.uniformsNeedUpdate=!1:d.isMeshBasicMaterial?r(p,d):d.isMeshLambertMaterial?(r(p,d),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)):d.isMeshToonMaterial?(r(p,d),f(p,d)):d.isMeshPhongMaterial?(r(p,d),h(p,d),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)):d.isMeshStandardMaterial?(r(p,d),u(p,d),d.isMeshPhysicalMaterial&&m(p,d,y)):d.isMeshMatcapMaterial?(r(p,d),_(p,d)):d.isMeshDepthMaterial?r(p,d):d.isMeshDistanceMaterial?(r(p,d),S(p,d)):d.isMeshNormalMaterial?r(p,d):d.isLineBasicMaterial?(o(p,d),d.isLineDashedMaterial&&a(p,d)):d.isPointsMaterial?l(p,d,M,C):d.isSpriteMaterial?c(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function r(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===Ie&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===Ie&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);let M=t.get(d),C=M.envMap,y=M.envMapRotation;C&&(p.envMap.value=C,p.envMapRotation.value.setFromMatrix4(My.makeRotationFromEuler(y)).transpose(),C.isCubeTexture&&C.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(yd),p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap&&(p.lightMap.value=d.lightMap,p.lightMapIntensity.value=d.lightMapIntensity,e(d.lightMap,p.lightMapTransform)),d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function o(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function a(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function l(p,d,M,C){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*M,p.scale.value=C*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function c(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function h(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function f(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function u(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),d.envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,M){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===Ie&&p.clearcoatNormalScale.value.negate())),d.dispersion>0&&(p.dispersion.value=d.dispersion),d.retroreflectivity>0&&(p.retroreflectivity.value=d.retroreflectivity),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,d){d.matcap&&(p.matcap.value=d.matcap)}function S(p,d){let M=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Ty(n,t,e,i){let s={},r={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){let b=A.program;i.uniformBlockBinding(y,b)}function c(y,A){let b=s[y.id];b===void 0&&(p(y),b=h(y),s[y.id]=b,y.addEventListener("dispose",M));let T=A.program;i.updateUBOMapping(y,T);let g=t.render.frame;r[y.id]!==g&&(u(y),r[y.id]=g)}function h(y){let A=f();y.__bindingPointIndex=A;let b=n.createBuffer(),T=y.__size,g=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,b),n.bufferData(n.UNIFORM_BUFFER,T,g),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,b),b}function f(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return It("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){let A=s[y.id],b=y.uniforms,T=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let g=0,E=b.length;g<E;g++){let P=b[g];if(Array.isArray(P))for(let R=0,D=P.length;R<D;R++)m(P[R],g,R,T);else m(P,g,0,T)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function m(y,A,b,T){if(S(y,A,b,T)===!0){let g=y.__offset,E=y.value;if(Array.isArray(E)){let P=0;for(let R=0;R<E.length;R++){let D=E[R],L=d(D);_(D,y.__data,P),typeof D!="number"&&typeof D!="boolean"&&!D.isMatrix3&&!ArrayBuffer.isView(D)&&(P+=L.storage/Float32Array.BYTES_PER_ELEMENT)}}else _(E,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,g,y.__data)}}function _(y,A,b){typeof y=="number"||typeof y=="boolean"?A[0]=y:y.isMatrix3?(A[0]=y.elements[0],A[1]=y.elements[1],A[2]=y.elements[2],A[3]=0,A[4]=y.elements[3],A[5]=y.elements[4],A[6]=y.elements[5],A[7]=0,A[8]=y.elements[6],A[9]=y.elements[7],A[10]=y.elements[8],A[11]=0):ArrayBuffer.isView(y)?A.set(new y.constructor(y.buffer,y.byteOffset,A.length)):y.toArray(A,b)}function S(y,A,b,T){let g=y.value,E=A+"_"+b;if(T[E]===void 0)return typeof g=="number"||typeof g=="boolean"?T[E]=g:ArrayBuffer.isView(g)?T[E]=g.slice():T[E]=g.clone(),!0;{let P=T[E];if(typeof g=="number"||typeof g=="boolean"){if(P!==g)return T[E]=g,!0}else{if(ArrayBuffer.isView(g))return!0;if(P.equals(g)===!1)return P.copy(g),!0}}return!1}function p(y){let A=y.uniforms,b=0,T=16;for(let E=0,P=A.length;E<P;E++){let R=Array.isArray(A[E])?A[E]:[A[E]];for(let D=0,L=R.length;D<L;D++){let I=R[D],U=Array.isArray(I.value)?I.value:[I.value];for(let W=0,k=U.length;W<k;W++){let J=U[W],B=d(J),X=b%T,K=X%B.boundary,it=X+K;b+=K,it!==0&&T-it<B.storage&&(b+=T-it),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=b,b+=B.storage}}}let g=b%T;return g>0&&(b+=T-g),y.__size=b,y.__cache={},this}function d(y){let A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Rt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Rt("WebGLRenderer: Unsupported uniform value type.",y),A}function M(y){let A=y.target;A.removeEventListener("dispose",M);let b=o.indexOf(A.__bindingPointIndex);o.splice(b,1),n.deleteBuffer(s[A.id]),delete s[A.id],delete r[A.id]}function C(){for(let y in s)n.deleteBuffer(s[y]);o=[],s={},r={}}return{bind:l,update:c,dispose:C}}var Ey=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Fn=null;function Ay(){return Fn===null&&(Fn=new _r(Ey,16,16,Mi,_n),Fn.name="DFG_LUT",Fn.minFilter=Re,Fn.magFilter=Re,Fn.wrapS=wn,Fn.wrapT=wn,Fn.generateMipmaps=!1,Fn.needsUpdate=!0),Fn}var _l=class{constructor(t={}){let{canvas:e=Bf(),context:i=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:m=Je}=t;this.isWebGLRenderer=!0;let _;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=i.getContextAttributes().alpha}else _=o;let S=m,p=new Set([Fa,Ua,Na]),d=new Set([Je,xn,ws,Cs,Pa,Da]),M=new Uint32Array(4),C=new Int32Array(4),y=new z,A=null,b=null,T=[],g=[],E=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=gn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,R=!1,D=null,L=null,I=null,U=null;this._outputColorSpace=en;let W=0,k=0,J=null,B=-1,X=null,K=new he,it=new he,rt=null,Ht=new Gt(0),Lt=0,Ut=e.width,Z=e.height,Q=1,xt=null,Pt=null,gt=new he(0,0,Ut,Z),Dt=new he(0,0,Ut,Z),fe=!1,Bt=new Ss,Yt=!1,jt=!1,Ft=new ne,ce=new z,ve=new he,qe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ue=!1;function me(){return J===null?Q:1}let O=i;function Le(v,N){return e.getContext(v,N)}let Qt,w,x,V,q,$,st,ot,j,et,at,Et,ut,lt,At,Ct,Ot,F,ct,tt,ht,mt,nt;try{let v={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"186"}`),e.addEventListener("webglcontextlost",se,!1),e.addEventListener("webglcontextrestored",Kt,!1),e.addEventListener("webglcontextcreationerror",hn,!1),O===null){let N="webgl2";if(O=Le(N,v),O===null)throw Le(N)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}wt()}catch(v){throw e.removeEventListener("webglcontextlost",se,!1),e.removeEventListener("webglcontextrestored",Kt,!1),e.removeEventListener("webglcontextcreationerror",hn,!1),It("WebGLRenderer: "+v.message),v}function wt(){Qt=new Lx(O),Qt.init(),ht=new yy(O,Qt),w=new bx(O,Qt,t,ht),x=new xy(O,Qt),w.reversedDepthBuffer&&u&&x.buffers.depth.setReversed(!0),L=O.createFramebuffer(),I=O.createFramebuffer(),U=O.createFramebuffer(),V=new Fx(O),q=new iy,$=new _y(O,Qt,x,q,w,ht,V),st=new Dx(P),ot=new Bm(O),mt=new Sx(O,ot),j=new Nx(O,ot,V,mt),et=new Bx(O,j,ot,mt,V),F=new Ox(O,w,$),At=new Tx(q),at=new ny(P,st,Qt,w,mt,At),Et=new by(P,q),ut=new ry,lt=new uy(Qt),Ot=new vx(P,st,x,et,_,l),Ct=new gy(P,et,w),nt=new Ty(O,V,w,x),ct=new Mx(O,Qt,V),tt=new Ux(O,Qt,V),V.programs=at.programs,P.capabilities=w,P.extensions=Qt,P.properties=q,P.renderLists=ut,P.shadowMap=Ct,P.state=x,P.info=V}S!==Je&&(E=new zx(S,e.width,e.height,a,s,r));let bt=new Eh(P,O);this.xr=bt,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){let v=Qt.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=Qt.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(v){v!==void 0&&(Q=v,this.setSize(Ut,Z,!1))},this.getSize=function(v){return v.set(Ut,Z)},this.setSize=function(v,N,Y=!0){if(bt.isPresenting){Rt("WebGLRenderer: Can't change size while VR device is presenting.");return}Ut=v,Z=N,e.width=Math.floor(v*Q),e.height=Math.floor(N*Q),Y===!0&&(e.style.width=v+"px",e.style.height=N+"px"),E!==null&&E.setSize(e.width,e.height),this.setViewport(0,0,v,N)},this.getDrawingBufferSize=function(v){return v.set(Ut*Q,Z*Q).floor()},this.setDrawingBufferSize=function(v,N,Y){Ut=v,Z=N,Q=Y,e.width=Math.floor(v*Y),e.height=Math.floor(N*Y),this.setViewport(0,0,v,N)},this.setEffects=function(v){if(S===Je){It("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let N=0;N<v.length;N++)if(v[N].isOutputPass===!0){Rt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}E.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(K)},this.getViewport=function(v){return v.copy(gt)},this.setViewport=function(v,N,Y,G){v.isVector4?gt.set(v.x,v.y,v.z,v.w):gt.set(v,N,Y,G),x.viewport(K.copy(gt).multiplyScalar(Q).round())},this.getScissor=function(v){return v.copy(Dt)},this.setScissor=function(v,N,Y,G){v.isVector4?Dt.set(v.x,v.y,v.z,v.w):Dt.set(v,N,Y,G),x.scissor(it.copy(Dt).multiplyScalar(Q).round())},this.getScissorTest=function(){return fe},this.setScissorTest=function(v){x.setScissorTest(fe=v)},this.setOpaqueSort=function(v){xt=v},this.setTransparentSort=function(v){Pt=v},this.getClearColor=function(v){return v.copy(Ot.getClearColor())},this.setClearColor=function(){Ot.setClearColor(...arguments)},this.getClearAlpha=function(){return Ot.getClearAlpha()},this.setClearAlpha=function(){Ot.setClearAlpha(...arguments)},this.clear=function(v=!0,N=!0,Y=!0){let G=0;if(v){let H=!1;if(J!==null){let pt=J.texture.format;H=p.has(pt)}if(H){let pt=J.texture.type,yt=d.has(pt),dt=Ot.getClearColor(),St=Ot.getClearAlpha(),Tt=dt.r,Vt=dt.g,Wt=dt.b;yt?(M[0]=Tt,M[1]=Vt,M[2]=Wt,M[3]=St,O.clearBufferuiv(O.COLOR,0,M)):(C[0]=Tt,C[1]=Vt,C[2]=Wt,C[3]=St,O.clearBufferiv(O.COLOR,0,C))}else G|=O.COLOR_BUFFER_BIT}N&&(G|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(G|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&O.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),D=v},this.dispose=function(){e.removeEventListener("webglcontextlost",se,!1),e.removeEventListener("webglcontextrestored",Kt,!1),e.removeEventListener("webglcontextcreationerror",hn,!1),Ot.dispose(),ut.dispose(),lt.dispose(),q.dispose(),st.dispose(),et.dispose(),mt.dispose(),nt.dispose(),at.dispose(),bt.dispose(),bt.removeEventListener("sessionstart",bu),bt.removeEventListener("sessionend",Tu),Ii.stop()};function se(v){v.preventDefault(),eh("WebGLRenderer: Context Lost."),R=!0}function Kt(){eh("WebGLRenderer: Context Restored."),R=!1;let v=V.autoReset,N=Ct.enabled,Y=Ct.autoUpdate,G=Ct.needsUpdate,H=Ct.type;wt(),V.autoReset=v,Ct.enabled=N,Ct.autoUpdate=Y,Ct.needsUpdate=G,Ct.type=H}function hn(v){It("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Tn(v){let N=v.target;N.removeEventListener("dispose",Tn),Zp(N)}function Zp(v){Kp(v),q.remove(v)}function Kp(v){let N=q.get(v).programs;N!==void 0&&(N.forEach(function(Y){at.releaseProgram(Y)}),v.isShaderMaterial&&at.releaseShaderCache(v))}this.renderBufferDirect=function(v,N,Y,G,H,pt){N===null&&(N=qe);let yt=H.isMesh&&H.matrixWorld.determinantAffine()<0,dt=jp(v,N,Y,G,H);x.setMaterial(G,yt);let St=Y.index,Tt=1;if(G.wireframe===!0){if(St=j.getWireframeAttribute(Y),St===void 0)return;Tt=2}let Vt=Y.drawRange,Wt=Y.attributes.position,Mt=Vt.start*Tt,Jt=(Vt.start+Vt.count)*Tt;pt!==null&&(Mt=Math.max(Mt,pt.start*Tt),Jt=Math.min(Jt,(pt.start+pt.count)*Tt)),St!==null?(Mt=Math.max(Mt,0),Jt=Math.min(Jt,St.count)):Wt!=null&&(Mt=Math.max(Mt,0),Jt=Math.min(Jt,Wt.count));let ge=Jt-Mt;if(ge<0||ge===1/0)return;mt.setup(H,G,dt,Y,St);let ae,ee=ct;if(St!==null&&(ae=ot.get(St),ee=tt,ee.setIndex(ae)),H.isMesh)G.wireframe===!0?(x.setLineWidth(G.wireframeLinewidth*me()),ee.setMode(O.LINES)):ee.setMode(O.TRIANGLES);else if(H.isLine){let Ne=G.linewidth;Ne===void 0&&(Ne=1),x.setLineWidth(Ne*me()),H.isLineSegments?ee.setMode(O.LINES):H.isLineLoop?ee.setMode(O.LINE_LOOP):ee.setMode(O.LINE_STRIP)}else H.isPoints?ee.setMode(O.POINTS):H.isSprite&&ee.setMode(O.TRIANGLES);if(H.isBatchedMesh)if(Qt.get("WEBGL_multi_draw"))ee.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Ne=H._multiDrawStarts,_t=H._multiDrawCounts,ze=H._multiDrawCount,Zt=St?ot.get(St).bytesPerElement:1,on=q.get(G).currentProgram.getUniforms();for(let En=0;En<ze;En++)on.setValue(O,"_gl_DrawID",En),ee.render(Ne[En]/Zt,_t[En])}else if(H.isInstancedMesh)ee.renderInstances(Mt,ge,H.count);else if(Y.isInstancedBufferGeometry){let Ne=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,_t=Math.min(Y.instanceCount,Ne);ee.renderInstances(Mt,ge,_t)}else ee.render(Mt,ge)};function Mu(v,N,Y,G){D!==null&&v.isNodeMaterial&&D.setObject(G,v),Yt===!0&&At.setState(v,Y,!1),v.transparent===!0&&v.side===Nn&&v.forceSinglePass===!1?(v.side=Ie,v.needsUpdate=!0,bo(v,N,G),v.side=_i,v.needsUpdate=!0,bo(v,N,G),v.side=Nn):bo(v,N,G)}this.compile=function(v,N,Y=null){Y===null&&(Y=v),D!==null&&D.renderStart(v,N,Y),b=lt.get(Y),b.init(N),g.push(b),Y.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),v!==Y&&v.traverseVisible(function(H){H.isLight&&H.layers.test(N.layers)&&(b.pushLight(H),H.castShadow&&b.pushShadow(H))}),b.setupLights(),D!==null&&D.updateLights(b.state.lightsArray),jt=this.localClippingEnabled,Yt=At.init(this.clippingPlanes,jt),Yt===!0&&At.setGlobalState(this.clippingPlanes,N),D!==null&&Ct.render(b.state.shadowsArray,Y,N);let G=new Set;return v.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let pt=H.material;if(pt)if(Array.isArray(pt))for(let yt=0;yt<pt.length;yt++){let dt=pt[yt];Mu(dt,Y,N,H),G.add(dt)}else Mu(pt,Y,N,H),G.add(pt)}),b=g.pop(),D!==null&&D.renderEnd(),G},this.compileAsync=function(v,N,Y=null){let G=this.compile(v,N,Y);return new Promise(H=>{function pt(){if(G.forEach(function(yt){let St=q.get(yt).currentProgram;(St===void 0||St.isReady())&&G.delete(yt)}),G.size===0){H(v);return}setTimeout(pt,10)}Qt.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let ec=null;function Jp(v){ec&&ec(v)}function bu(){Ii.stop()}function Tu(){Ii.start()}let Ii=new dd;Ii.setAnimationLoop(Jp),typeof self<"u"&&Ii.setContext(self),this.setAnimationLoop=function(v){ec=v,bt.setAnimationLoop(v),v===null?Ii.stop():Ii.start()},bt.addEventListener("sessionstart",bu),bt.addEventListener("sessionend",Tu),this.render=function(v,N){if(N!==void 0&&N.isCamera!==!0){It("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;D!==null&&D.renderStart(v,N);let Y=bt.enabled===!0&&bt.isPresenting===!0,G=E!==null&&(J===null||Y)&&E.begin(P,J);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),bt.enabled===!0&&bt.isPresenting===!0&&(E===null||E.isCompositing()===!1)&&(bt.cameraAutoUpdate===!0&&bt.updateCamera(N),N=bt.getCamera()),v.isScene===!0&&v.onBeforeRender(P,v,N,J),b=lt.get(v,g.length),b.init(N),b.state.textureUnits=$.getTextureUnits(),g.push(b),Ft.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),Bt.setFromProjectionMatrix(Ft,mn,N.reversedDepth),jt=this.localClippingEnabled,Yt=At.init(this.clippingPlanes,jt),A=ut.get(v,T.length),A.init(),T.push(A),bt.enabled===!0&&bt.isPresenting===!0){let yt=P.xr.getDepthSensingMesh();yt!==null&&nc(yt,N,-1/0,P.sortObjects)}nc(v,N,0,P.sortObjects),A.finish(),D!==null&&D.updateLights(b.state.lightsArray),P.sortObjects===!0&&A.sort(xt,Pt),ue=bt.enabled===!1||bt.isPresenting===!1||bt.hasDepthSensing()===!1,ue&&Ot.addToRenderList(A,v),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Yt===!0&&At.beginShadows();let H=b.state.shadowsArray;if(Ct.render(H,v,N),Yt===!0&&At.endShadows(),(G&&E.hasRenderPass())===!1){let yt=A.opaque,dt=A.transmissive;if(b.setupLights(),N.isArrayCamera){let St=N.cameras;if(dt.length>0)for(let Tt=0,Vt=St.length;Tt<Vt;Tt++){let Wt=St[Tt];Au(yt,dt,v,Wt)}ue&&Ot.render(v);for(let Tt=0,Vt=St.length;Tt<Vt;Tt++){let Wt=St[Tt];Eu(A,v,Wt,Wt.viewport)}}else dt.length>0&&Au(yt,dt,v,N),ue&&Ot.render(v),Eu(A,v,N)}J!==null&&k===0&&($.updateMultisampleRenderTarget(J),$.updateRenderTargetMipmap(J)),G&&E.end(P),v.isScene===!0&&v.onAfterRender(P,v,N),mt.resetDefaultState(),B=-1,X=null,g.pop(),g.length>0?(b=g[g.length-1],$.setTextureUnits(b.state.textureUnits),Yt===!0&&At.setGlobalState(P.clippingPlanes,b.state.camera)):b=null,T.pop(),T.length>0?A=T[T.length-1]:A=null,D!==null&&D.renderEnd()};function nc(v,N,Y,G){if(v.visible===!1)return;if(v.layers.test(N.layers)){if(v.isGroup)Y=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(N);else if(v.isLightProbeGrid)b.pushLightProbeGrid(v);else if(v.isLight)b.pushLight(v),v.castShadow&&b.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||v.intersectsFrustum(Bt)){G&&ve.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ft);let yt=et.update(v),dt=v.material;dt.visible&&A.push(v,yt,dt,Y,ve.z,null,N)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||v.intersectsFrustum(Bt))){let yt=et.update(v),dt=v.material;if(G&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),ve.copy(v.boundingSphere.center)):(yt.boundingSphere===null&&yt.computeBoundingSphere(),ve.copy(yt.boundingSphere.center)),ve.applyMatrix4(v.matrixWorld).applyMatrix4(Ft)),Array.isArray(dt)){let St=yt.groups;for(let Tt=0,Vt=St.length;Tt<Vt;Tt++){let Wt=St[Tt],Mt=dt[Wt.materialIndex];Mt&&Mt.visible&&A.push(v,yt,Mt,Y,ve.z,Wt,N)}}else dt.visible&&A.push(v,yt,dt,Y,ve.z,null,N)}}let pt=v.children;for(let yt=0,dt=pt.length;yt<dt;yt++)nc(pt[yt],N,Y,G)}function Eu(v,N,Y,G){let{opaque:H,transmissive:pt,transparent:yt}=v;b.setupLightsView(Y),Yt===!0&&At.setGlobalState(P.clippingPlanes,Y),G&&x.viewport(K.copy(G)),H.length>0&&Mo(H,N,Y),pt.length>0&&Mo(pt,N,Y),yt.length>0&&Mo(yt,N,Y),x.buffers.depth.setTest(!0),x.buffers.depth.setMask(!0),x.buffers.color.setMask(!0),x.setPolygonOffset(!1)}function Au(v,N,Y,G){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[G.id]===void 0){let Mt=Qt.has("EXT_color_buffer_half_float")||Qt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[G.id]=new Ke(1,1,{generateMipmaps:!0,type:Mt?_n:Je,minFilter:vi,samples:Math.max(4,w.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Xt.workingColorSpace})}let pt=b.state.transmissionRenderTarget[G.id],yt=G.viewport||K;pt.setSize(yt.z*P.transmissionResolutionScale,yt.w*P.transmissionResolutionScale);let dt=P.getRenderTarget(),St=P.getActiveCubeFace(),Tt=P.getActiveMipmapLevel();P.setRenderTarget(pt),P.getClearColor(Ht),Lt=P.getClearAlpha(),Lt<1&&P.setClearColor(16777215,.5),P.clear(),ue&&Ot.render(Y);let Vt=P.toneMapping;P.toneMapping=gn;let Wt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),b.setupLightsView(G),Yt===!0&&At.setGlobalState(P.clippingPlanes,G),Mo(v,Y,G),$.updateMultisampleRenderTarget(pt),$.updateRenderTargetMipmap(pt),Qt.has("WEBGL_multisampled_render_to_texture")===!1){let Mt=!1;for(let Jt=0,ge=N.length;Jt<ge;Jt++){let ae=N[Jt],{object:ee,geometry:Ne,material:_t,group:ze}=ae;if(_t.side===Nn&&ee.layers.test(G.layers)){let Zt=_t.side;_t.side=Ie,_t.needsUpdate=!0,wu(ee,Y,G,Ne,_t,ze),_t.side=Zt,_t.needsUpdate=!0,Mt=!0}}Mt===!0&&($.updateMultisampleRenderTarget(pt),$.updateRenderTargetMipmap(pt))}P.setRenderTarget(dt,St,Tt),P.setClearColor(Ht,Lt),Wt!==void 0&&(G.viewport=Wt),P.toneMapping=Vt}function Mo(v,N,Y){let G=N.isScene===!0?N.overrideMaterial:null;for(let H=0,pt=v.length;H<pt;H++){let yt=v[H],{object:dt,geometry:St,group:Tt}=yt,Vt=yt.material;Vt.allowOverride===!0&&G!==null&&(Vt=G),dt.layers.test(Y.layers)&&wu(dt,N,Y,St,Vt,Tt)}}function wu(v,N,Y,G,H,pt){D!==null&&H.isNodeMaterial&&D.setObject(v,H),v.onBeforeRender(P,N,Y,G,H,pt),v.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),H.onBeforeRender(P,N,Y,G,v,pt),H.transparent===!0&&H.side===Nn&&H.forceSinglePass===!1?(H.side=Ie,H.needsUpdate=!0,P.renderBufferDirect(Y,N,G,H,v,pt),H.side=_i,H.needsUpdate=!0,P.renderBufferDirect(Y,N,G,H,v,pt),H.side=Nn):P.renderBufferDirect(Y,N,G,H,v,pt),v.onAfterRender(P,N,Y,G,H,pt)}function bo(v,N,Y){N.isScene!==!0&&(N=qe);let G=q.get(v),H=b.state.lights,pt=b.state.shadowsArray,yt=H.state.version,dt=at.getParameters(v,H.state,pt,N,Y,b.state.lightProbeGridArray),St=at.getProgramCacheKey(dt),Tt=G.programs;G.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?N.environment:null,G.fog=N.fog;let Vt=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;G.envMap=st.get(v.envMap||G.environment,Vt),G.envMapRotation=G.environment!==null&&v.envMap===null?N.environmentRotation:v.envMapRotation,Tt===void 0&&(v.addEventListener("dispose",Tn),Tt=new Map,G.programs=Tt);let Wt=Tt.get(St);if(Wt!==void 0){if(G.currentProgram===Wt&&G.lightsStateVersion===yt)return Ru(v,dt),Wt}else dt.uniforms=at.getUniforms(v),D!==null&&v.isNodeMaterial&&D.build(v,Y,dt),v.onBeforeCompile(dt,P),Wt=at.acquireProgram(dt,St),Tt.set(St,Wt),G.uniforms=dt.uniforms;let Mt=G.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Mt.clippingPlanes=At.uniform),Ru(v,dt),G.needsLights=tm(v),G.lightsStateVersion=yt,G.needsLights&&(Mt.ambientLightColor.value=H.state.ambient,Mt.lightProbe.value=H.state.probe,Mt.sunLights.value=H.state.sun,Mt.sunLightShadows.value=H.state.sunShadow,Mt.directionalLights.value=H.state.directional,Mt.directionalLightShadows.value=H.state.directionalShadow,Mt.spotLights.value=H.state.spot,Mt.spotLightShadows.value=H.state.spotShadow,Mt.rectAreaLights.value=H.state.rectArea,Mt.ltc_1.value=H.state.rectAreaLTC1,Mt.ltc_2.value=H.state.rectAreaLTC2,Mt.pointLights.value=H.state.point,Mt.pointLightShadows.value=H.state.pointShadow,Mt.hemisphereLights.value=H.state.hemi,Mt.sunShadowMatrix.value=H.state.sunShadowMatrix,Mt.sunShadowCascade.value=H.state.sunShadowCascade,Mt.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Mt.spotLightMatrix.value=H.state.spotLightMatrix,Mt.spotLightMap.value=H.state.spotLightMap,Mt.pointShadowMatrix.value=H.state.pointShadowMatrix),G.lightProbeGrid=b.state.lightProbeGridArray.length>0,G.currentProgram=Wt,G.uniformsList=null,Wt}function Cu(v){if(v.uniformsList===null){let N=v.currentProgram.getUniforms();v.uniformsList=Ps.seqWithValue(N.seq,v.uniforms)}return v.uniformsList}function Ru(v,N){let Y=q.get(v);Y.outputColorSpace=N.outputColorSpace,Y.batching=N.batching,Y.batchingColor=N.batchingColor,Y.instancing=N.instancing,Y.instancingColor=N.instancingColor,Y.instancingMorph=N.instancingMorph,Y.skinning=N.skinning,Y.morphTargets=N.morphTargets,Y.morphNormals=N.morphNormals,Y.morphColors=N.morphColors,Y.morphTargetsCount=N.morphTargetsCount,Y.numClippingPlanes=N.numClippingPlanes,Y.numIntersection=N.numClipIntersection,Y.vertexAlphas=N.vertexAlphas,Y.vertexTangents=N.vertexTangents,Y.toneMapping=N.toneMapping}function $p(v,N){if(v.length===0)return null;if(v.length===1)return v[0].texture!==null?v[0]:null;y.setFromMatrixPosition(N.matrixWorld);for(let Y=0,G=v.length;Y<G;Y++){let H=v[Y];if(H.texture!==null&&H.boundingBox.containsPoint(y))return H}return null}function jp(v,N,Y,G,H){N.isScene!==!0&&(N=qe),$.resetTextureUnits();let pt=N.fog,yt=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?N.environment:null,dt=J===null?P.outputColorSpace:J.isXRRenderTarget===!0?J.texture.colorSpace:Xt.workingColorSpace,St=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Tt=st.get(G.envMap||yt,St),Vt=G.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,Wt=!!Y.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Mt=!!Y.morphAttributes.position,Jt=!!Y.morphAttributes.normal,ge=!!Y.morphAttributes.color,ae=gn;G.toneMapped&&(J===null||J.isXRRenderTarget===!0)&&(ae=P.toneMapping);let ee=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Ne=ee!==void 0?ee.length:0,_t=q.get(G),ze=b.state.lights;if(Yt===!0&&(jt===!0||v!==X)){let re=v===X&&G.id===B;At.setState(G,v,re)}let Zt=!1;G.version===_t.__version?(_t.needsLights&&_t.lightsStateVersion!==ze.state.version||_t.outputColorSpace!==dt||H.isBatchedMesh&&_t.batching===!1||!H.isBatchedMesh&&_t.batching===!0||H.isBatchedMesh&&_t.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&_t.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&_t.instancing===!1||!H.isInstancedMesh&&_t.instancing===!0||H.isSkinnedMesh&&_t.skinning===!1||!H.isSkinnedMesh&&_t.skinning===!0||H.isInstancedMesh&&_t.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&_t.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&_t.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&_t.instancingMorph===!1&&H.morphTexture!==null||_t.envMap!==Tt||G.fog===!0&&_t.fog!==pt||_t.numClippingPlanes!==void 0&&(_t.numClippingPlanes!==At.numPlanes||_t.numIntersection!==At.numIntersection)||_t.vertexAlphas!==Vt||_t.vertexTangents!==Wt||_t.morphTargets!==Mt||_t.morphNormals!==Jt||_t.morphColors!==ge||_t.toneMapping!==ae||_t.morphTargetsCount!==Ne||!!_t.lightProbeGrid!=b.state.lightProbeGridArray.length>0)&&(Zt=!0):(Zt=!0,_t.__version=G.version);let on=_t.currentProgram;Zt===!0&&(on=bo(G,N,H),D&&G.isNodeMaterial&&D.onUpdateProgram(G,on,_t));let En=!1,si=!1,Qi=!1,te=on.getUniforms(),pe=_t.uniforms;if(x.useProgram(on.program)&&(En=!0,si=!0,Qi=!0),G.id!==B&&(B=G.id,si=!0),_t.needsLights){let re=$p(b.state.lightProbeGridArray,H);_t.lightProbeGrid!==re&&(_t.lightProbeGrid=re,si=!0)}if(En||X!==v){x.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),te.setValue(O,"projectionMatrix",v.projectionMatrix),te.setValue(O,"viewMatrix",v.matrixWorldInverse);let oi=te.map.cameraPosition;oi!==void 0&&oi.setValue(O,ce.setFromMatrixPosition(v.matrixWorld)),w.logarithmicDepthBuffer&&te.setValue(O,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&te.setValue(O,"isOrthographic",v.isOrthographicCamera===!0),X!==v&&(X=v,si=!0,Qi=!0)}if(_t.needsLights&&(ze.state.sunShadowMap.length>0&&te.setValue(O,"sunShadowMap",ze.state.sunShadowMap,$),ze.state.directionalShadowMap.length>0&&te.setValue(O,"directionalShadowMap",ze.state.directionalShadowMap,$),ze.state.spotShadowMap.length>0&&te.setValue(O,"spotShadowMap",ze.state.spotShadowMap,$),ze.state.pointShadowMap.length>0&&te.setValue(O,"pointShadowMap",ze.state.pointShadowMap,$)),H.isSkinnedMesh){te.setOptional(O,H,"bindMatrix"),te.setOptional(O,H,"bindMatrixInverse");let re=H.skeleton;re&&(re.boneTexture===null&&re.computeBoneTexture(),te.setValue(O,"boneTexture",re.boneTexture,$))}H.isBatchedMesh&&(te.setOptional(O,H,"batchingTexture"),te.setValue(O,"batchingTexture",H._matricesTexture,$),te.setOptional(O,H,"batchingIdTexture"),te.setValue(O,"batchingIdTexture",H._indirectTexture,$),te.setOptional(O,H,"batchingColorTexture"),H._colorsTexture!==null&&te.setValue(O,"batchingColorTexture",H._colorsTexture,$));let ri=Y.morphAttributes;if((ri.position!==void 0||ri.normal!==void 0||ri.color!==void 0)&&F.update(H,Y,on),(si||_t.receiveShadow!==H.receiveShadow)&&(_t.receiveShadow=H.receiveShadow,te.setValue(O,"receiveShadow",H.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&N.environment!==null&&(pe.envMapIntensity.value=N.environmentIntensity),pe.dfgLUT!==void 0&&(pe.dfgLUT.value=Ay()),si){if(te.setValue(O,"toneMappingExposure",P.toneMappingExposure),_t.needsLights&&Qp(pe,Qi),pt&&G.fog===!0&&Et.refreshFogUniforms(pe,pt),Et.refreshMaterialUniforms(pe,G,Q,Z,b.state.transmissionRenderTarget[v.id]),_t.needsLights&&_t.lightProbeGrid){let re=_t.lightProbeGrid;pe.probesSH.value=re.texture,pe.probesMin.value.copy(re.boundingBox.min),pe.probesMax.value.copy(re.boundingBox.max),pe.probesResolution.value.copy(re.resolution)}Ps.upload(O,Cu(_t),pe,$)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Ps.upload(O,Cu(_t),pe,$),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&te.setValue(O,"center",H.center),te.setValue(O,"modelViewMatrix",H.modelViewMatrix),te.setValue(O,"normalMatrix",H.normalMatrix),te.setValue(O,"modelMatrix",H.matrixWorld),G.uniformsGroups!==void 0){let re=G.uniformsGroups;for(let oi=0,ts=re.length;oi<ts;oi++){let Pu=re[oi];nt.update(Pu,on),nt.bind(Pu,on)}}return on}function Qp(v,N){v.ambientLightColor.needsUpdate=N,v.lightProbe.needsUpdate=N,v.sunLights.needsUpdate=N,v.sunLightShadows.needsUpdate=N,v.directionalLights.needsUpdate=N,v.directionalLightShadows.needsUpdate=N,v.pointLights.needsUpdate=N,v.pointLightShadows.needsUpdate=N,v.spotLights.needsUpdate=N,v.spotLightShadows.needsUpdate=N,v.rectAreaLights.needsUpdate=N,v.hemisphereLights.needsUpdate=N}function tm(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return J},this.setRenderTargetTextures=function(v,N,Y){let G=q.get(v);G.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),q.get(v.texture).__webglTexture=N,q.get(v.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:Y,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,N){let Y=q.get(v);Y.__webglFramebuffer=N,Y.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(v,N=0,Y=0){J=v,W=N,k=Y;let G=null,H=!1,pt=!1;if(v){let dt=q.get(v);if(dt.__useDefaultFramebuffer!==void 0){x.bindFramebuffer(O.FRAMEBUFFER,dt.__webglFramebuffer),K.copy(v.viewport),it.copy(v.scissor),rt=v.scissorTest,x.viewport(K),x.scissor(it),x.setScissorTest(rt),B=-1;return}else if(dt.__webglFramebuffer===void 0)$.setupRenderTarget(v);else if(dt.__hasExternalTextures)$.rebindTextures(v,q.get(v.texture).__webglTexture,q.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let Vt=v.depthTexture;if(dt.__boundDepthTexture!==Vt){if(Vt!==null&&q.has(Vt)&&(v.width!==Vt.image.width||v.height!==Vt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$.setupDepthRenderbuffer(v)}}let St=v.texture;(St.isData3DTexture||St.isDataArrayTexture||St.isCompressedArrayTexture)&&(pt=!0);let Tt=q.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Tt[N])?G=Tt[N][Y]:G=Tt[N],H=!0):v.samples>0&&$.useMultisampledRTT(v)===!1?G=q.get(v).__webglMultisampledFramebuffer:Array.isArray(Tt)?G=Tt[Y]:G=Tt,K.copy(v.viewport),it.copy(v.scissor),rt=v.scissorTest}else K.copy(gt).multiplyScalar(Q).floor(),it.copy(Dt).multiplyScalar(Q).floor(),rt=fe;if(Y!==0&&(G=L),x.bindFramebuffer(O.FRAMEBUFFER,G)&&x.drawBuffers(v,G),x.viewport(K),x.scissor(it),x.setScissorTest(rt),H){let dt=q.get(v.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+N,dt.__webglTexture,Y)}else if(pt){let dt=N;for(let St=0;St<v.textures.length;St++){let Tt=q.get(v.textures[St]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+St,Tt.__webglTexture,Y,dt)}}else if(v!==null&&Y!==0){let dt=q.get(v.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,dt.__webglTexture,Y)}B=-1};function Iu(v){let N=q.get(v);return(N.__readFormat!==v.format||N.__readType!==v.type)&&(N.__readFormat=v.format,N.__readType=v.type,N.__formatReadable=w.textureFormatReadable(v.format),N.__typeReadable=w.textureTypeReadable(v.type)),N}this.readRenderTargetPixels=function(v,N,Y,G,H,pt,yt,dt=0){if(!(v&&v.isWebGLRenderTarget)){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let St=q.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&yt!==void 0&&(St=St[yt]),St){x.bindFramebuffer(O.FRAMEBUFFER,St);try{let Tt=v.textures[dt],Vt=Tt.format,Wt=Tt.type;v.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+dt);let Mt=Iu(Tt);if(Mt.__formatReadable===!1){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Mt.__typeReadable===!1){It("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=v.width-G&&Y>=0&&Y<=v.height-H&&O.readPixels(N,Y,G,H,ht.convert(Vt),ht.convert(Wt),pt)}finally{let Tt=J!==null?q.get(J).__webglFramebuffer:null;x.bindFramebuffer(O.FRAMEBUFFER,Tt)}}},this.readRenderTargetPixelsAsync=async function(v,N,Y,G,H,pt,yt,dt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let St=q.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&yt!==void 0&&(St=St[yt]),St)if(N>=0&&N<=v.width-G&&Y>=0&&Y<=v.height-H){x.bindFramebuffer(O.FRAMEBUFFER,St);let Tt=v.textures[dt],Vt=Tt.format,Wt=Tt.type;v.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+dt);let Mt=Iu(Tt);if(Mt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Mt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Jt=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Jt),O.bufferData(O.PIXEL_PACK_BUFFER,pt.byteLength,O.STREAM_READ),O.readPixels(N,Y,G,H,ht.convert(Vt),ht.convert(Wt),0),O.bindBuffer(O.PIXEL_PACK_BUFFER,null);let ge=J!==null?q.get(J).__webglFramebuffer:null;x.bindFramebuffer(O.FRAMEBUFFER,ge);let ae=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await zf(O,ae,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Jt),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,pt),O.bindBuffer(O.PIXEL_PACK_BUFFER,null),O.deleteBuffer(Jt),O.deleteSync(ae),pt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,N=null,Y=0){let G=Math.pow(2,-Y),H=Math.floor(v.image.width*G),pt=Math.floor(v.image.height*G),yt=N!==null?N.x:0,dt=N!==null?N.y:0;$.setTexture2D(v,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,yt,dt,H,pt),x.unbindTexture()},this.copyTextureToTexture=function(v,N,Y=null,G=null,H=0,pt=0){let yt,dt,St,Tt,Vt,Wt,Mt,Jt,ge,ae=v.isCompressedTexture?v.mipmaps[pt]:v.image;if(Y!==null)yt=Y.max.x-Y.min.x,dt=Y.max.y-Y.min.y,St=Y.isBox3?Y.max.z-Y.min.z:1,Tt=Y.min.x,Vt=Y.min.y,Wt=Y.isBox3?Y.min.z:0;else{let pe=Math.pow(2,-H);yt=Math.floor(ae.width*pe),dt=Math.floor(ae.height*pe),v.isDataArrayTexture?St=ae.depth:v.isData3DTexture?St=Math.floor(ae.depth*pe):St=1,Tt=0,Vt=0,Wt=0}G!==null?(Mt=G.x,Jt=G.y,ge=G.z):(Mt=0,Jt=0,ge=0);let ee=ht.convert(N.format),Ne=ht.convert(N.type),_t;N.isData3DTexture?($.setTexture3D(N,0),_t=O.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?($.setTexture2DArray(N,0),_t=O.TEXTURE_2D_ARRAY):($.setTexture2D(N,0),_t=O.TEXTURE_2D),x.activeTexture(O.TEXTURE0),x.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,N.flipY),x.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),x.pixelStorei(O.UNPACK_ALIGNMENT,N.unpackAlignment);let ze=x.getParameter(O.UNPACK_ROW_LENGTH),Zt=x.getParameter(O.UNPACK_IMAGE_HEIGHT),on=x.getParameter(O.UNPACK_SKIP_PIXELS),En=x.getParameter(O.UNPACK_SKIP_ROWS),si=x.getParameter(O.UNPACK_SKIP_IMAGES);x.pixelStorei(O.UNPACK_ROW_LENGTH,ae.width),x.pixelStorei(O.UNPACK_IMAGE_HEIGHT,ae.height),x.pixelStorei(O.UNPACK_SKIP_PIXELS,Tt),x.pixelStorei(O.UNPACK_SKIP_ROWS,Vt),x.pixelStorei(O.UNPACK_SKIP_IMAGES,Wt);let Qi=v.isDataArrayTexture||v.isData3DTexture,te=N.isDataArrayTexture||N.isData3DTexture;if(v.isDepthTexture){let pe=q.get(v),ri=q.get(N),re=q.get(pe.__renderTarget),oi=q.get(ri.__renderTarget);x.bindFramebuffer(O.READ_FRAMEBUFFER,re.__webglFramebuffer),x.bindFramebuffer(O.DRAW_FRAMEBUFFER,oi.__webglFramebuffer);for(let ts=0;ts<St;ts++)Qi&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,q.get(v).__webglTexture,H,Wt+ts),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,q.get(N).__webglTexture,pt,ge+ts)),O.blitFramebuffer(Tt,Vt,yt,dt,Mt,Jt,yt,dt,O.DEPTH_BUFFER_BIT,O.NEAREST);x.bindFramebuffer(O.READ_FRAMEBUFFER,null),x.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(H!==0||v.isRenderTargetTexture||q.has(v)){let pe=q.get(v),ri=q.get(N);x.bindFramebuffer(O.READ_FRAMEBUFFER,I),x.bindFramebuffer(O.DRAW_FRAMEBUFFER,U);for(let re=0;re<St;re++)Qi?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,pe.__webglTexture,H,Wt+re):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,pe.__webglTexture,H),te?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,ri.__webglTexture,pt,ge+re):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ri.__webglTexture,pt),H!==0?O.blitFramebuffer(Tt,Vt,yt,dt,Mt,Jt,yt,dt,O.COLOR_BUFFER_BIT,O.NEAREST):te?O.copyTexSubImage3D(_t,pt,Mt,Jt,ge+re,Tt,Vt,yt,dt):O.copyTexSubImage2D(_t,pt,Mt,Jt,Tt,Vt,yt,dt);x.bindFramebuffer(O.READ_FRAMEBUFFER,null),x.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else te?v.isDataTexture||v.isData3DTexture?O.texSubImage3D(_t,pt,Mt,Jt,ge,yt,dt,St,ee,Ne,ae.data):N.isCompressedArrayTexture?O.compressedTexSubImage3D(_t,pt,Mt,Jt,ge,yt,dt,St,ee,ae.data):O.texSubImage3D(_t,pt,Mt,Jt,ge,yt,dt,St,ee,Ne,ae):v.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,pt,Mt,Jt,yt,dt,ee,Ne,ae.data):v.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,pt,Mt,Jt,ae.width,ae.height,ee,ae.data):O.texSubImage2D(O.TEXTURE_2D,pt,Mt,Jt,yt,dt,ee,Ne,ae);x.pixelStorei(O.UNPACK_ROW_LENGTH,ze),x.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Zt),x.pixelStorei(O.UNPACK_SKIP_PIXELS,on),x.pixelStorei(O.UNPACK_SKIP_ROWS,En),x.pixelStorei(O.UNPACK_SKIP_IMAGES,si),pt===0&&N.generateMipmaps&&O.generateMipmap(_t),x.unbindTexture()},this.initRenderTarget=function(v){q.get(v).__webglFramebuffer===void 0&&$.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?$.setTextureCube(v,0):v.isData3DTexture?$.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?$.setTexture2DArray(v,0):$.setTexture2D(v,0),x.unbindTexture()},this.resetState=function(){W=0,k=0,J=null,x.reset(),mt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return mn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=Xt._getDrawingBufferColorSpace(t),e.unpackColorSpace=Xt._getUnpackColorSpace()}};var Sl=class extends Fi{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new pi;t.deleteAttribute("uv");let e=new $n({side:Ie}),i=new $n,s=new Bi(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let r=new ie(t,e);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);let o=new vr(t,i,6),a=new Te;a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),a.updateMatrix(),o.setMatrixAt(0,a.matrix),a.position.set(-5.607,-.754,-.758),a.rotation.set(0,.994,0),a.scale.set(1.97,1.534,3.955),a.updateMatrix(),o.setMatrixAt(1,a.matrix),a.position.set(6.167,.857,7.803),a.rotation.set(0,.561,0),a.scale.set(3.927,6.285,3.687),a.updateMatrix(),o.setMatrixAt(2,a.matrix),a.position.set(-2.017,.018,6.124),a.rotation.set(0,.333,0),a.scale.set(2.002,4.566,2.064),a.updateMatrix(),o.setMatrixAt(3,a.matrix),a.position.set(2.291,-.756,-2.621),a.rotation.set(0,-.286,0),a.scale.set(1.546,1.552,1.496),a.updateMatrix(),o.setMatrixAt(4,a.matrix),a.position.set(-2.193,-.369,-5.547),a.rotation.set(0,.516,0),a.scale.set(3.875,3.487,2.986),a.updateMatrix(),o.setMatrixAt(5,a.matrix),this.add(o);let l=new ie(t,Ns(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new ie(t,Ns(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new ie(t,Ns(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let f=new ie(t,Ns(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);let u=new ie(t,Ns(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);let m=new ie(t,Ns(100));m.position.set(0,20,0),m.scale.set(1,.1,1),this.add(m)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function Ns(n){return new Ar({color:0,emissive:16777215,emissiveIntensity:n})}function Ah(n,t){n.indexOf(t)===-1&&n.push(t)}function Qn(n,t){let e=n.indexOf(t);e>-1&&n.splice(e,1)}var Pe=(n,t,e)=>e>t?t:e<n?n:e;var yn=()=>{},He=()=>{};var Be={};var Yr=n=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n);var Hi=n=>typeof n=="object"&&n!==null;var Zr=n=>/^0[^.\s]+$/u.test(n);function Kr(n){let t;return()=>(t===void 0&&(t=n()),t)}var vn=n=>n;var Wi=(...n)=>n.reduce((t,e)=>i=>e(t(i)));var Bn=(n,t,e)=>{let i=t-n;return i?(e-n)/i:1};var Us=class{constructor(){this.subscriptions=[]}add(t){return Ah(this.subscriptions,t),()=>this.remove(t)}remove(t){Qn(this.subscriptions,t)}notify(t,e,i){let s=this.subscriptions.length;if(s)if(s===1)this.subscriptions[0](t,e,i);else for(let r=0;r<s;r++){let o=this.subscriptions[r];o&&o(t,e,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}};var De=n=>n*1e3,Ee=n=>n/1e3;var Jr=(n,t)=>t?n*(1e3/t):0;var vd=(n,t,e)=>{let i=t-n;return((e-n)%i+i)%i+n};var wh=(n,t,e)=>n*(3*(1-n)*((1-n)*t+n*e)+n*n);function bi(n,t,e,i){return n===t&&e===i?vn:s=>{let r=0,o=1,a=s;for(let l=0;;l++){a>=r&&a<=o||(a=(r+o)/2);let c=wh(a,n,e)-s;if(c*c<1e-28||l===40)break;c>0?o=a:r=a,a-=c*1e-7/(wh(a+1e-7,n,e)-s-c)}return wh(a,t,i)}}var Ml=n=>t=>t<=.5?n(2*t)/2:(2-n(2*(1-t)))/2;var Xi=n=>t=>1-n(1-t);var bl=bi(.33,1.53,.69,.99),Fs=Xi(bl),$r=Ml(Fs);var jr=n=>n>=1?1:(n*=2)<1?.5*Fs(n):.5*(2-Math.pow(2,-10*(n-1)));var Qr=n=>1-Math.sin(Math.acos(n)),Ch=Xi(Qr),to=Ml(Qr);var Rh=bi(.42,0,1,1),Ih=bi(0,0,.58,1),Os=bi(.42,0,.58,1);var eo=n=>Array.isArray(n)&&typeof n[0]!="number";function no(n,t){return eo(n)?n[vd(0,n.length,t)]:n}var qi=n=>Array.isArray(n)&&typeof n[0]=="number";var Sd={linear:vn,easeIn:Rh,easeInOut:Os,easeOut:Ih,circIn:Qr,circInOut:to,circOut:Ch,backIn:Fs,backInOut:$r,backOut:bl,anticipate:jr},Cy=n=>typeof n=="string",Bs=n=>{if(qi(n)){He(n.length===4,"Cubic bezier arrays must contain four numerical values.","cubic-bezier-length");let[t,e,i,s]=n;return bi(t,e,i,s)}else if(Cy(n))return He(Sd[n]!==void 0,`Invalid easing type '${n}'`,"invalid-easing-type"),Sd[n];return n};var rn={delta:0,timestamp:0,isProcessing:!1};var Tl;function Ry(){Tl=void 0}var oe={now:()=>(Tl===void 0&&oe.set(rn.isProcessing||Be.useManualTiming?rn.timestamp:performance.now()),Tl),set:n=>{Tl=n,queueMicrotask(Ry)}};var Vn=n=>Math.round(n*1e5)/1e5;var Iy=n=>t=>typeof t=="string"&&t.startsWith(n);var Py=Iy("var(--"),Vs=n=>Py(n)?Dy.test(n.split("/*")[0].trim()):!1,Dy=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function El(n){return typeof n!="string"?!1:n.split("/*")[0].includes("var(--")}var zn={test:n=>typeof n=="number",parse:parseFloat,transform:n=>n},ti={...zn,transform:n=>Pe(0,1,n)},io={...zn,default:1};var zs=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function Md(n){return n==null}var bd=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;var ks=(n,t)=>e=>!!(typeof e=="string"&&bd.test(e)&&e.startsWith(n)||t&&!Md(e)&&Object.prototype.hasOwnProperty.call(e,t)),Al=(n,t,e)=>i=>{if(typeof i!="string")return i;let[s,r,o,a]=i.match(zs);return{[n]:parseFloat(s),[t]:parseFloat(r),[e]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}};var Ly=n=>Pe(0,255,n),Ph={...zn,transform:n=>Math.round(Ly(n))},kn={test:ks("rgb","red"),parse:Al("red","green","blue"),transform:({red:n,green:t,blue:e,alpha:i=1})=>"rgba("+Ph.transform(n)+", "+Ph.transform(t)+", "+Ph.transform(e)+", "+Vn(ti.transform(i))+")"};function Ny(n){let t="",e="",i="",s="";return n.length>5?(t=n.substring(1,3),e=n.substring(3,5),i=n.substring(5,7),s=n.substring(7,9)):(t=n.substring(1,2),e=n.substring(2,3),i=n.substring(3,4),s=n.substring(4,5),t+=t,e+=e,i+=i,s+=s),{red:parseInt(t,16),green:parseInt(e,16),blue:parseInt(i,16),alpha:s?parseInt(s,16)/255:1}}var so={test:ks("#"),parse:Ny,transform:kn.transform};var ro=n=>({test:t=>typeof t=="string"&&t.endsWith(n)&&t.split(" ").length===1,parse:parseFloat,transform:t=>`${t}${n}`}),Sn=ro("deg"),Ti=ro("%"),vt=ro("px"),Td=ro("vh"),Ed=ro("vw"),Dh={...Ti,parse:n=>Ti.parse(n)/100,transform:n=>Ti.transform(n*100)};var Ei={test:ks("hsl","hue"),parse:Al("hue","saturation","lightness"),transform:({hue:n,saturation:t,lightness:e,alpha:i=1})=>"hsla("+Math.round(n)+", "+Ti.transform(Vn(t))+", "+Ti.transform(Vn(e))+", "+Vn(ti.transform(i))+")"};var de={test:n=>kn.test(n)||so.test(n)||Ei.test(n),parse:n=>kn.test(n)?kn.parse(n):Ei.test(n)?Ei.parse(n):so.parse(n),transform:n=>typeof n=="string"?n:n.hasOwnProperty("red")?kn.transform(n):Ei.transform(n),getAnimatableNone:n=>{let t=de.parse(n);return t.alpha=0,de.transform(t)}};var Ad=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;var Cd=new RegExp(zs.source),Rd=new RegExp(Ad.source,"i");function Uy(n){return isNaN(n)&&typeof n=="string"&&(Cd.test(n)||Rd.test(n))}var Id="number",Pd="color",Fy="var",Oy="var(",wd="${}",By=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;function Dd(n){let t=n.toString();return Cd.test(t)||Rd.test(t)}function Gs(n){let t=n.toString(),e=[],i={color:[],number:[],var:[]},s=[],r=0,a=t.replace(By,l=>(de.test(l)?(i.color.push(r),s.push(Pd),e.push(de.parse(l))):l.startsWith(Oy)?(i.var.push(r),s.push(Fy),e.push(l)):(i.number.push(r),s.push(Id),e.push(parseFloat(l))),++r,wd)).split(wd);return{values:e,split:a,indexes:i,types:s}}function Vy(n){return Gs(n).values}function Ld({split:n,types:t}){let e=n.length;return i=>{let s="";for(let r=0;r<e;r++)if(s+=n[r],i[r]!==void 0){let o=t[r];o===Id?s+=Vn(i[r]):o===Pd?s+=de.transform(i[r]):s+=i[r]}return s}}function zy(n){return Ld(Gs(n))}var ky=n=>typeof n=="number"?0:de.test(n)?de.getAnimatableNone(n):n,Gy=(n,t)=>typeof n=="number"?t?.trim().endsWith("/")?n:0:ky(n);function Hy(n){let t=Gs(n);return Ld(t)(t.values.map((i,s)=>Gy(i,t.split[s])))}var We={test:Uy,parse:Vy,createTransformer:zy,getAnimatableNone:Hy};function Lh(n,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?n+(t-n)*6*e:e<1/2?t:e<2/3?n+(t-n)*(2/3-e)*6:n}function Nd({hue:n,saturation:t,lightness:e,alpha:i}){n/=360,t/=100,e/=100;let s=0,r=0,o=0;if(!t)s=r=o=e;else{let a=e<.5?e*(1+t):e+t-e*t,l=2*e-a;s=Lh(l,a,n+1/3),r=Lh(l,a,n),o=Lh(l,a,n-1/3)}return{red:Math.round(s*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:i}}function Hs(n,t){return e=>e>0?t:n}var $e=(n,t,e)=>n+(t-n)*e;var Nh=(n,t,e)=>{let i=n*n,s=e*(t*t-i)+i;return s<0?0:Math.sqrt(s)},Wy=[so,kn,Ei],Xy=n=>Wy.find(t=>t.test(n));function Ud(n){let t=Xy(n);if(!t)return yn(!1,`'${n}' is not an animatable color. Use the equivalent color code instead.`,"color-not-animatable"),!1;let e=t.parse(n);return t===Ei&&(e=Nd(e)),e}var Uh=(n,t)=>{let e=Ud(n),i=Ud(t);if(!e||!i)return Hs(n,t);let s={...e};return r=>(s.red=Nh(e.red,i.red,r),s.green=Nh(e.green,i.green,r),s.blue=Nh(e.blue,i.blue,r),s.alpha=$e(e.alpha,i.alpha,r),kn.transform(s))};var wl=new Set(["none","hidden"]);function Fd(n,t){return wl.has(n)?e=>e<=0?n:t:e=>e>=1?t:n}function qy(n,t){return e=>$e(n,t,e)}function Cl(n){return typeof n=="number"?qy:typeof n=="string"?Vs(n)?Hs:de.test(n)?Uh:Ky:Array.isArray(n)?Od:typeof n=="object"?de.test(n)?Uh:Yy:Hs}function Od(n,t){let e=[...n],i=e.length,s=n.map((r,o)=>Cl(r)(r,t[o]));return r=>{for(let o=0;o<i;o++)e[o]=s[o](r);return e}}function Yy(n,t){let e={...n,...t},i={};for(let s in e)n[s]!==void 0&&t[s]!==void 0&&(i[s]=Cl(n[s])(n[s],t[s]));return s=>{for(let r in i)e[r]=i[r](s);return e}}function Zy(n,t){let e=[],i={color:0,var:0,number:0};for(let s=0;s<t.values.length;s++){let r=t.types[s],o=n.indexes[r][i[r]],a=n.values[o]??0;e[s]=a,i[r]++}return e}var Ky=(n,t)=>{let e=We.createTransformer(t),i=Gs(n),s=Gs(t);return i.indexes.var.length===s.indexes.var.length&&i.indexes.color.length===s.indexes.color.length&&i.indexes.number.length>=s.indexes.number.length?wl.has(n)&&!s.values.length||wl.has(t)&&!i.values.length?Fd(n,t):Wi(Od(Zy(i,s),s.values),e):(yn(!0,`Complex values '${n}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,"complex-values-different"),Hs(n,t))};var Bd=/^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;function Jy(n,t){let e=Bd.exec(n);if(!e)return;let i=Bd.exec(t);if(!i||e[2]!==i[2])return;let s=e[2],r=parseFloat(e[1]),o=parseFloat(i[1]);return a=>Vn($e(r,o,a))+s}function Ws(n,t,e){if(typeof n=="number"&&typeof t=="number"&&typeof e=="number")return $e(n,t,e);if(typeof n=="string"&&typeof t=="string"){let s=Jy(n,t);if(s)return s}return Cl(n)(n,t)}var oo=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function Vd(n){let t=new Set,e=new Set,i=!1,s=!1,r=new Set,o={delta:0,timestamp:0,isProcessing:!1};function a(c){r.has(c)&&(e.add(c),n()),c(o)}let l={schedule:(c,h=!1,f=!1)=>{let m=f&&i?t:e;return h&&r.add(c),m.add(c),c},cancel:c=>{e.delete(c),r.delete(c)},process:c=>{if(o=c,i){s=!0;return}i=!0;let h=t;t=e,e=h,t.forEach(a),t.clear(),i=!1,s&&(s=!1,l.process(c))}};return l}var $y=40;function zd(n,t,e={delta:0,timestamp:0,isProcessing:!1}){let i=!1,s=!0,r=()=>i=!0,o=oo.reduce((C,y)=>(C[y]=Vd(r),C),{}),{setup:a,read:l,resolveKeyframes:c,preUpdate:h,update:f,preRender:u,render:m,postRender:_}=o,S=()=>{let C=Be.useManualTiming,y=C?e.timestamp:performance.now();i=!1,C||(e.delta=s?1e3/60:Math.max(Math.min(y-e.timestamp,$y),1)),e.timestamp=y,e.isProcessing=!0,a.process(e),l.process(e),c.process(e),h.process(e),f.process(e),u.process(e),m.process(e),_.process(e),e.isProcessing=!1,i&&t&&(s=!1,n(S))},p=()=>{i=!0,s=!0,e.isProcessing||n(S)};return{schedule:oo.reduce((C,y)=>{let A=o[y];return C[y]=(b,T=!1,g=!1)=>(i||p(),A.schedule(b,T,g)),C},{}),cancel:C=>{for(let y=0;y<oo.length;y++)o[oo[y]].cancel(C)},state:e,steps:o}}var{schedule:Ae,cancel:kd,steps:vw}=zd(typeof requestAnimationFrame<"u"?requestAnimationFrame:vn,!0,rn);var Rl=n=>{let t=({timestamp:e})=>n(e);return{start:(e=!0)=>Ae.update(t,e),stop:()=>kd(t),now:()=>rn.isProcessing?rn.timestamp:oe.now()}};var Il=(n,t,e=10)=>{let i="",s=Math.max(Math.round(t/e),2);for(let r=0;r<s;r++)i+=Math.round(n(r/(s-1))*1e4)/1e4+", ";return`linear(${i.substring(0,i.length-2)})`};function Xs(n,t=50,e=2e4,i){let s=0,r=n.next(s);for(i?.push(r.value);!r.done&&s<e;)s+=t,r=n.next(s),i?.push(r.value);return s>=e?1/0:s}function ao(n,t=100,e){let{keyframes:i,velocity:s}=n,r=i&&i[i.length-1]-i[0],o=e({...n,velocity:s&&r?s*t/r:s,keyframes:[0,t]}),a=Math.min(Xs(o),2e4);return{type:"keyframes",ease:l=>o.next(a*l).value/t,duration:Ee(a)}}var we={stiffness:100,damping:10,mass:1,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05},Gd=n=>n<0?1/Math.max(1+n,we.minDamping):Math.max(1-n,we.minDamping);function Hd(n,t){if(!(n>1))return 1;let e=Math.sqrt(n*n-1),i=n-e,s=n+e,r=2*e*Math.exp(-t)*(1+t);return Wd(o=>s*Math.exp(-i*o)-i*Math.exp(-s*o)-r,o=>Math.exp(-s*o)-Math.exp(-i*o),t)/t}function Vh(n,t){return n*Math.sqrt(1-t*t)}var jy=12;function Wd(n,t,e){let i=e;for(let s=1;s<jy;s++)i=i-n(i)/t(i);return i}var Oh=.001;function Qy({duration:n=we.duration,bounce:t=we.bounce}){let e,i;yn(n<=De(we.maxDuration),"Spring duration must be 10 seconds or less","spring-duration-limit");let s=Gd(t);n=Pe(we.minDuration,we.maxDuration,Ee(n)),s<1?(e=c=>{let h=c*s,f=h*n,u=Vh(c,s),m=Math.exp(-f);return Oh-h/u*m},i=c=>{let f=c*s*n,u=s*s*c*c*n,m=Math.exp(-f),_=Vh(c*c,s);return(-e(c)+Oh>0?-1:1)*-u*m/_}):(e=c=>{let h=Math.exp(-c*n),f=c*n+1;return-Oh+h*f},i=c=>{let h=Math.exp(-c*n),f=-c*(n*n);return h*f});let r=5/n,o=Wd(e,i,r),a=o*Hd(s,o*n),l=a*a;return{stiffness:l,damping:s*2*Math.sqrt(l),duration:De(n)}}var zh=(n,t)=>(t?n>=0:n>0)&&n<1/0;function Bh(n,t){if(zh(n,t))return n}function tv(n){let t=Bh(n.stiffness),e=Bh(n.damping,!0),i=Bh(n.mass),s={...n,stiffness:t??we.stiffness,damping:e??we.damping,mass:i??we.mass,isResolvedFromDuration:!1,isTimeDefined:(t??e??i)===void 0&&(n.duration!==void 0||n.bounce!==void 0)};if(s.isTimeDefined){if(n.visualDuration){let r=Gd(n.bounce||0),o=2*Math.PI/(n.visualDuration*1.2)*Hd(r,2*Math.PI/1.2);s.stiffness=o*o,s.damping=2*r*Math.sqrt(s.stiffness)}else Object.assign(s,Qy(s)),s.isResolvedFromDuration=!0;(!zh(s.stiffness)||!zh(s.damping,!0))&&(s.stiffness=we.stiffness,s.damping=we.damping)}return s}function ei(n=we.visualDuration,t=we.bounce){let e=typeof n!="object"?{visualDuration:n,keyframes:[0,1],bounce:t}:n,i=e.keyframes[0],s=e.keyframes[e.keyframes.length-1],r={done:!1,value:i},{stiffness:o,damping:a,mass:l,duration:c,isResolvedFromDuration:h,isTimeDefined:f}=tv({...e}),u=T=>f?0:-Ee(T),m=a/(2*Math.sqrt(o*l)),_=Ee(Math.sqrt(o/l)),S=m*_,p={target:s,delta:s-i,velocity:u(e.velocity||0)||0,restSpeed:0,restDelta:0},d=()=>{let T=Math.abs(p.delta)<5;p.restSpeed=e.restSpeed||(T?we.restSpeed.granular:we.restSpeed.default),p.restDelta=e.restDelta||(T?we.restDelta.granular:we.restDelta.default)};d();let M,C,y;if(m<1){let T=Vh(_,m),g={A:0,sinC:0,cosC:0,t:-1,env:0,sin:0,cos:0};y=()=>{g.A=(p.velocity+S*p.delta)/T,g.sinC=S*g.A+p.delta*T,g.cosC=S*p.delta-g.A*T};let E=P=>{P!==g.t&&(g.t=P,g.env=Math.exp(-S*P),g.sin=Math.sin(T*P),g.cos=Math.cos(T*P))};M=P=>(E(P),p.target-g.env*(g.A*g.sin+p.delta*g.cos)),C=P=>(E(P),g.env*(g.sinC*g.sin+g.cosC*g.cos))}else if(m===1){M=g=>p.target-Math.exp(-_*g)*(p.delta+(p.velocity+_*p.delta)*g);let T={C:0};y=()=>{T.C=p.velocity+_*p.delta},C=g=>Math.exp(-_*g)*(_*T.C*g-p.velocity)}else{let T=_*Math.sqrt(m*m-1),g=S-T,E=S+T,P=f?1/0:300/T,R=(L,I)=>Math.exp(I>P?-L*P-S*(I-P):-L*I),D={S:0,F:0};y=()=>{let L=(p.velocity+S*p.delta)/T;D.S=(p.delta+L)/2,D.F=(p.delta-L)/2},M=L=>p.target-D.S*R(g,L)-D.F*R(E,L),C=L=>g*D.S*R(g,L)+E*D.F*R(E,L)}y();let A=h&&c||null,b={calculatedDuration:A,retarget:(T,g)=>{p.target=T[T.length-1],p.delta=p.target-T[0],p.velocity=u(g),e.restSpeed&&e.restDelta||d(),b.calculatedDuration=A,r.done=!1,y()},velocity:T=>De(C(T)),next:T=>{let g=M(T);if(h)r.done=T>=c;else{let E=De(C(T));r.done=Math.abs(E)<=p.restSpeed&&Math.abs(p.target-g)<=p.restDelta}return r.value=r.done?p.target:g,r},toString:()=>{let T=Math.min(Xs(b),2e4),g=Il(E=>b.next(T*E).value,T,30);return T+"ms "+g},toTransition:()=>{}};return b}ei.applyToOptions=n=>{let t=ao(n,100,ei);return n.ease=t.ease,n.duration=De(t.duration),n.type="keyframes",n};function qs({keyframes:n,velocity:t=0,power:e=.8,timeConstant:i=325,bounceDamping:s=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:l,restDelta:c=.5,restSpeed:h}){let f=n[0],u={done:!1,value:f},m=T=>T<a||T>l,_=T=>a===void 0?l:l===void 0||Math.abs(a-T)<Math.abs(l-T)?a:l,S=e*t,p=f+S,d=o===void 0?p:o(p);d!==p&&(S=d-f);let M=T=>-S*Math.exp(-T/i),C=T=>{let g=M(T);u.done=Math.abs(g)<=c,u.value=u.done?d:d+g},y,A,b=T=>{m(u.value)&&(y=T,A=ei({keyframes:[u.value,_(u.value)],velocity:-M(T)/i*1e3,damping:s,stiffness:r,restDelta:c,restSpeed:h}))};return b(0),{calculatedDuration:null,next:T=>{let g=!1;return!A&&y===void 0&&(g=!0,C(T),b(T)),y!==void 0&&T>=y?A.next(T-y):(!g&&C(T),u)}}}function ev(n,t,e){let i=[],s=e||Be.mix||Ws,r=n.length-1;for(let o=0;o<r;o++){let a=s(n[o],n[o+1]);if(t){let l=Array.isArray(t)?t[o]||vn:t;a=Wi(l,a)}i.push(a)}return i}function Xd(n,t,{clamp:e=!0,ease:i,mixer:s}={}){let r=n.length;if(He(r===t.length,"Both input and output ranges must be the same length","range-length"),r===1)return()=>t[0];if(r===2&&t[0]===t[1])return()=>t[1];let o=n[0]===n[1];n[0]>n[r-1]&&(n=[...n].reverse(),t=[...t].reverse());let a=ev(t,i,s),l=a.length,c=h=>{if(o&&h<n[0])return t[0];let f=0;if(l>1)for(;f<n.length-2&&!(h<n[f+1]);f++);let u=Bn(n[f],n[f+1],h);return a[f](u)};return e?h=>c(Pe(n[0],n[r-1],h)):c}function lo(n,t){let e=n[n.length-1];for(let i=1;i<=t;i++){let s=Bn(0,t,i);n.push($e(e,1,s))}}function Yi(n){let t=[0];return lo(t,n.length-1),t}function qd(n,t){return n.map(e=>e*t)}function nv(n,t){return n.map(()=>t||Os).splice(0,n.length-1)}function Mn({duration:n=300,keyframes:t,times:e,ease:i="easeInOut"}){let s=eo(i)?i.map(Bs):Bs(i)||Os,r={done:!1,value:t[0]};if(t.length===2&&!Array.isArray(s)&&(!e||e.length!==2||e[0]===0&&e[1]===1)){let[l,c]=t,h=l===c?void 0:(Be.mix||Ws)(l,c);return{calculatedDuration:n,next:f=>(r.value=h?h(s(n>0?Pe(0,1,f/n):1)):c,r.done=f>=n,r)}}let o=qd(e&&e.length===t.length?e:Yi(t),n),a=Xd(o,t,{ease:Array.isArray(s)?s:nv(t,s)});return{calculatedDuration:n,next:l=>(r.value=a(l),r.done=l>=n,r)}}var iv=5;function sv(n,t,e){let i=Math.max(t-iv,0);return Jr(e-n(i),t-i)}function Yd(n,t,e=0){return t<=0?e:n.velocity?n.velocity(t):sv(i=>n.next(i).value,t,n.next(t).value)}var rv=n=>n!==null;function ni(n,{repeat:t,repeatType:e="loop"},i,s=1){let r=n.filter(rv),a=s<0||t&&e!=="loop"&&t%2===1?0:r.length-1;return!a||i===void 0?r[a]:i}var ov={decay:qs,inertia:qs,tween:Mn,keyframes:Mn,spring:ei};function Pl(n){typeof n.type=="string"&&(n.type=ov[n.type])}var av=40,Dl=(n,t)=>t-n>av&&!Be.useManualTiming?t:n;function lv(n,t){return{kind:n,animation:t,timestamp:oe.now(),frameTimestamp:rn.timestamp,frameIsProcessing:rn.isProcessing}}function Ll(n,t,e){let i=globalThis.__MOTION_INSPECT__;if(i)try{i({...lv("animation-start",n),options:e?{...t,...e}:t})}catch{}}var Ai=class{constructor(){this.isResolved=!1}get finished(){return this._finished||(this._finished=this.isResolved?Promise.resolve():new Promise(t=>{this._resolve=t})),this._finished}updateFinished(){this._finished=this._resolve=void 0,this.isResolved=!1}notifyFinished(){this.isResolved=!0,this._resolve?.()}then(t,e){return this.finished.then(t,e)}};var cv=n=>n/100,Nl=n=>Math.round(n*1e4)/1e4,bn=class extends Ai{constructor(t){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{let{motionValue:e}=this.options;e&&e.updatedAt!==oe.now()&&this.tick(oe.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),this.options.onStop?.())},this.options=t,this.initAnimation(),this.play(),t.autoplay===!1&&this.pause(),Ll(this,this.options)}initAnimation(){let{options:t}=this;Pl(t);let{type:e=Mn,repeat:i=0,repeatDelay:s=0,repeatType:r,velocity:o=0}=t,{keyframes:a}=t,l=e||Mn;l!==Mn&&typeof a[0]!="number"&&(this.mixKeyframes=Wi(cv,Ws(a[0],a[1])),a=[0,100]);let c=l(a===t.keyframes?t:{...t,keyframes:a});r==="mirror"&&(this.mirroredGenerator=l({...t,keyframes:[...a].reverse(),velocity:-o})),c.calculatedDuration===null&&(c.calculatedDuration=Xs(c));let{calculatedDuration:h}=c;this.calculatedDuration=h,this.resolvedDuration=h+s,this.totalDuration=this.resolvedDuration*(i+1)-s,this.generator=c}updateTime(t){let e=Math.round(t-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=e}tick(t,e=!1){let{generator:i,totalDuration:s,calculatedDuration:r}=this;if(this.startTime===null)return i.next(0);let{delay:o=0,keyframes:a,type:l,onUpdate:c,finalKeyframe:h}=this.options;this.startTime===this.pendingStartTime&&(this.startTime=Dl(this.startTime,t)),this.pendingStartTime=void 0,this.speed>0?this.startTime=Math.min(this.startTime,t):this.speed<0&&(this.startTime=Math.min(t-s/this.speed,this.startTime)),e?this.currentTime=t:this.updateTime(t);let f=this.currentTime-o*(this.playbackSpeed>=0?1:-1),u=this.playbackSpeed>=0?f<0:f>s;this.currentTime=Math.max(f,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=s);let m=this.generate(this.currentTime,u),{done:_}=m;!u&&r!==null&&(_=this.playbackSpeed>=0?this.currentTime>=s:this.currentTime<=0);let S=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&_);return S&&l!==qs&&(m.value=ni(a,this.options,h,this.speed)),c&&c(m.value),S&&this.finish(),m}at(t){return this.holdTime??Nl((t-this.startTime)*this.playbackSpeed)}sampleAt(t,e){let{options:i,totalDuration:s}=this,r=this.at(t)-(i.delay||0);return r>=s&&i.type!==qs?ni(i.keyframes,i,e?void 0:i.finalKeyframe):this.generate(Math.max(r,0),r<0).value}generate(t,e){let{generator:i,totalDuration:s,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a}=this,{keyframes:l,repeat:c,repeatType:h,repeatDelay:f}=this.options,u=t,m=i;if(c){let S=Math.min(t,s)/a,p=Math.floor(S),d=S%1;!d&&S>=1&&(d=1),d===1&&p--,p=Math.min(p,c+1),p%2&&(h==="reverse"?(d=1-d,f&&(d-=f/a)):h==="mirror"&&(m=o)),u=Pe(0,1,d)*a}let _;return e?(this.delayState.value=l[0],_=this.delayState):_=m.next(u),r&&!e&&(_.value=r(_.value)),_}then(t,e){return this.finished.then(t,e)}get duration(){return Ee(this.calculatedDuration)}get iterationDuration(){let{delay:t=0}=this.options||{};return this.duration+Ee(t)}get time(){return Ee(this.currentTime)}set time(t){t=De(t),this.currentTime=t,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=t:this.driver&&(this.startTime=this.driver.now()-t/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=t,this.tick(t))}getGeneratorVelocity(){return Yd(this.generator,this.currentTime,this.options.velocity)}get speed(){return this.playbackSpeed}set speed(t){let e=this.playbackSpeed!==t;e&&this.driver&&this.updateTime(oe.now()),this.playbackSpeed=t,e&&this.driver&&(this.time=Ee(this.currentTime))}play(){if(this.isStopped)return;let{driver:t=Rl,startTime:e}=this.options;this.driver||(this.driver=t(s=>this.tick(s))),this.options.onPlay?.();let i=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=i):this.holdTime!==null?this.startTime=i-this.holdTime/(this.playbackSpeed||1):this.startTime||(this.startTime=e??(this.pendingStartTime=i)),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(oe.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){this.notifyFinished(),this.teardown(),this.state="finished",this.options.onComplete?.()}cancel(){this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),this.options.onCancel?.()}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(t){return this.startTime=0,this.tick(t,!0)}attachTimeline(t){return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),this.driver?.stop(),t.observe(this)}};var hv=new Set(["brightness","contrast","saturate","opacity"]);function uv(n){let[t,e]=n.slice(0,-1).split("(");if(t==="drop-shadow")return n;let[i]=e.match(zs)||[];if(!i)return n;let s=e.replace(i,""),r=hv.has(t)?1:0;return i!==e&&(r*=100),t+"("+r+s+")"}var fv=/\b([a-z-]*)\(.*?\)/gu,co={...We,getAnimatableNone:n=>{let t=n.match(fv);return t?t.map(uv).join(" "):n}};var ho={...We,getAnimatableNone:n=>{let t=We.parse(n);return We.createTransformer(n)(t.map(i=>typeof i=="number"?0:typeof i=="object"?{...i,alpha:1}:i))}};var kh={...zn,transform:Math.round};var uo={rotate:Sn,pathRotation:Sn,rotateX:Sn,rotateY:Sn,rotateZ:Sn,scale:io,scaleX:io,scaleY:io,scaleZ:io,skew:Sn,skewX:Sn,skewY:Sn,distance:vt,translateX:vt,translateY:vt,translateZ:vt,x:vt,y:vt,z:vt,perspective:vt,transformPerspective:vt,opacity:ti,originX:Dh,originY:Dh,originZ:vt};var Ve={borderWidth:vt,borderTopWidth:vt,borderRightWidth:vt,borderBottomWidth:vt,borderLeftWidth:vt,borderRadius:vt,borderTopLeftRadius:vt,borderTopRightRadius:vt,borderBottomRightRadius:vt,borderBottomLeftRadius:vt,width:vt,maxWidth:vt,height:vt,maxHeight:vt,top:vt,right:vt,bottom:vt,left:vt,inset:vt,insetBlock:vt,insetBlockStart:vt,insetBlockEnd:vt,insetInline:vt,insetInlineStart:vt,insetInlineEnd:vt,padding:vt,paddingTop:vt,paddingRight:vt,paddingBottom:vt,paddingLeft:vt,paddingBlock:vt,paddingBlockStart:vt,paddingBlockEnd:vt,paddingInline:vt,paddingInlineStart:vt,paddingInlineEnd:vt,margin:vt,marginTop:vt,marginRight:vt,marginBottom:vt,marginLeft:vt,marginBlock:vt,marginBlockStart:vt,marginBlockEnd:vt,marginInline:vt,marginInlineStart:vt,marginInlineEnd:vt,fontSize:vt,backgroundPositionX:vt,backgroundPositionY:vt,...uo,zIndex:kh,fillOpacity:ti,strokeOpacity:ti,numOctaves:kh};var dv={...Ve,color:de,backgroundColor:de,outlineColor:de,fill:de,stroke:de,borderColor:de,borderTopColor:de,borderRightColor:de,borderBottomColor:de,borderLeftColor:de,filter:co,WebkitFilter:co,mask:ho,WebkitMask:ho},Zd=n=>dv[n];var pv=new Set([co,ho]);function Ul(n,t){let e=Zd(n);return pv.has(e)||(e=We),e.getAnimatableNone?e.getAnimatableNone(t):void 0}function Kd(n){for(let t=1;t<n.length;t++)n[t]??(n[t]=n[t-1])}var Zi=n=>n*180/Math.PI,Gh=n=>{let t=Zi(Math.atan2(n[1],n[0]));return Hh(t)},mv={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scaleZ:()=>1,scale:n=>(Math.abs(n[0])+Math.abs(n[3]))/2,rotate:Gh,rotateZ:Gh,skewX:n=>Zi(Math.atan(n[1])),skewY:n=>Zi(Math.atan(n[2])),skew:n=>(Math.abs(n[1])+Math.abs(n[2]))/2},Hh=n=>(n=n%360,n<0&&(n+=360),n),Jd=Gh,$d=n=>Math.hypot(n[0],n[1]),jd=n=>Math.hypot(n[4],n[5]),gv={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:$d,scaleY:jd,scaleZ:n=>Math.hypot(n[8],n[9],n[10]),scale:n=>($d(n)+jd(n))/2,rotateX:n=>Hh(Zi(Math.atan2(n[6],n[5]))),rotateY:n=>Hh(Zi(Math.atan2(-n[2],n[0]))),rotateZ:Jd,rotate:Jd,skewX:n=>Zi(Math.atan(n[4])),skewY:n=>Zi(Math.atan(n[1])),skew:n=>(Math.abs(n[1])+Math.abs(n[4]))/2};function Qd(n){return n.includes("scale")?1:0}function Fl(n,t){if(!n||n==="none")return Qd(t);let e=n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u),i,s;if(e)i=gv,s=e;else{let a=n.match(/^matrix\(([-\d.e\s,]+)\)$/u);i=mv,s=a}if(!s)return Qd(t);let r=i[t],o=s[1].split(",").map(xv);return typeof r=="function"?r(o):o[r]}var tp=(n,t)=>{let{transform:e="none"}=getComputedStyle(n);return Fl(e,t)};function xv(n){return parseFloat(n.trim())}var Xe=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","scaleZ","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],wi=new Set([...Xe,"pathRotation"]);var Wh=n=>n===zn||n===vt,_v=new Set(["x","y","z"]),yv=Xe.filter(n=>!_v.has(n));function np(n){let t=[];return yv.forEach(e=>{let i=n.getValue(e);if(i!==void 0){let s=i.get(),r=e.startsWith("scale")?1:0;if(s===r)return;t.push([e,s]),i.set(r)}}),t}var ip=new Set(["bottom","right"]);function ep(n,t,e,i,s,r){let o=parseFloat(n);if(!isNaN(o))return o;let{min:a,max:l}=t()[e],c=l-a;return r==="border-box"?c:c-parseFloat(i)-parseFloat(s)}var Ci={width:({width:n,paddingLeft:t="0",paddingRight:e="0",boxSizing:i},s)=>ep(n,s,"x",t,e,i),height:({height:n,paddingTop:t="0",paddingBottom:e="0",boxSizing:i},s)=>ep(n,s,"y",t,e,i),top:({top:n})=>parseFloat(n),left:({left:n})=>parseFloat(n),bottom:({top:n},t)=>{let{y:e}=t();return parseFloat(n)+(e.max-e.min)},right:({left:n},t)=>{let{x:e}=t();return parseFloat(n)+(e.max-e.min)},x:({transform:n})=>Fl(n,"x"),y:({transform:n})=>Fl(n,"y")};Ci.translateX=Ci.x;Ci.translateY=Ci.y;var Ki=new Set,Xh=!1,qh=!1,Yh=!1;function sp(){if(qh){let n=[],t=new Set,e=new Set;Ki.forEach(s=>{s.needsMeasurement&&(n.push(s),t.add(s.element),ip.has(s.name)&&e.add(s.element))});let i=new Map;e.forEach(s=>{let r=np(s);r.length&&(i.set(s,r),s.render())}),n.forEach(s=>s.measureInitialState()),t.forEach(s=>{s.render();let r=i.get(s);r&&r.forEach(([o,a])=>{s.getValue(o)?.set(a)})}),n.forEach(s=>s.measureEndState()),n.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}qh=!1,Xh=!1,Ki.forEach(n=>n.complete(Yh)),Ki.clear()}function rp(){Ki.forEach(n=>{n.readKeyframes(),n.needsMeasurement&&(qh=!0)})}function op(){Yh=!0,rp(),sp(),Yh=!1}function vv(n,t,e){if(typeof n=="string"){if(Yr(n)||Zr(n))return parseFloat(n);if(!We.test(n)&&We.test(e))return Ul(t,e)}return n??void 0}var Ys=class{constructor(t,e,i,s,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...t],this.onComplete=e,this.name=i,this.motionValue=s,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(Ki.add(this),Xh||(Xh=!0,Ae.read(rp),Ae.resolveKeyframes(sp))):(this.readKeyframes(),this.complete())}readKeyframes(){let{unresolvedKeyframes:t,name:e,element:i,motionValue:s}=this;if(t[0]===null){let r=s?.get(),o=t[t.length-1];if(r!==void 0)t[0]=r;else if(i&&e){let a=vv(i.readValue(e,o),e,o);a!==void 0&&(t[0]=a)}t[0]===void 0&&(t[0]=o),s&&r===void 0&&s.set(t[0])}Kd(t)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(t=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,t),Ki.delete(this)}cancel(){this.state==="scheduled"&&(Ki.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}};var Ri=n=>n.startsWith("--");function Ol(n,t,e){Ri(t)?n.style.setProperty(t,e):n.style[t]=e}var ap={};function Bl(n,t){let e=Kr(n);return()=>ap[t]??e()}var lp=Bl(()=>window.ScrollTimeline!==void 0,"scrollTimeline");var Zs=Bl(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing");var ii=([n,t,e,i])=>`cubic-bezier(${n}, ${t}, ${e}, ${i})`;var fo={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:ii([0,.65,.55,1]),circOut:ii([.55,0,1,.45]),backIn:ii([.31,.01,.66,-.59]),backOut:ii([.33,1.53,.69,.99])};function Zh(n,t){if(n)return typeof n=="function"?Zs()?Il(n,t):"ease-out":qi(n)?ii(n):Array.isArray(n)?n.map(e=>Zh(e,t)||fo.easeOut):fo[n]}function cp(n,t,e,{delay:i=0,duration:s=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:l}={},c=void 0){let h={[t]:e};l&&(h.offset=l);let f=Zh(a,s);Array.isArray(f)&&(h.easing=f);let u={delay:i,duration:s,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return c&&(u.pseudoElement=c),n.animate(h,u)}function Ji(n){return typeof n=="function"&&"applyToOptions"in n}function hp({type:n,...t}){return Ji(n)&&Zs()?n.applyToOptions(t):(t.duration??(t.duration=300),t.ease??(t.ease="easeOut"),t)}var Vl=class extends Ai{constructor(t){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!t)return;let{element:e,name:i,keyframes:s,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:l}=t;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=t,He(typeof t.type!="string",`Mini animate() doesn't support "type" as a string.`,"mini-spring");let c=hp(t);this.animation=cp(e,i,s,c,r),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){let h=ni(s,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(h),Ol(e,i,h),this.animation.cancel()}l?.(),this.notifyFinished()},Ll(this,t,c)}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){this.animation.finish?.()}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;let{state:t}=this;t==="idle"||t==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){let t=this.options?.element;!this.isPseudoElement&&t?.isConnected&&this.animation.commitStyles?.()}get duration(){let t=this.animation.effect?.getComputedTiming?.().duration||0;return Ee(Number(t))}get iterationDuration(){let{delay:t=0}=this.options||{};return this.duration+Ee(t)}get time(){return Ee(Number(this.animation.currentTime)||0)}set time(t){let e=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=De(t),e&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(t){t<0&&(this.finishedTime=null),this.animation.playbackRate=t}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(t){this.manualStartTime=this.animation.startTime=t}attachTimeline({timeline:t,onAttach:e,observe:i}){return this.allowFlatten&&this.animation.effect?.updateTiming({easing:"linear"}),this.animation.onfinish=null,t&&lp()?(this.animation.timeline=t,e?.(this.animation),vn):i(this)}};var up={anticipate:jr,backInOut:$r,circInOut:to};function Sv(n){return n in up}function fp(n){typeof n.ease=="string"&&Sv(n.ease)&&(n.ease=up[n.ease])}var po=10,zl=class extends Vl{constructor(t){fp(t),Pl(t),super(t),t.startTime!==void 0&&t.autoplay!==!1&&(this.startTime=t.startTime),this.options=t}elapsed(){return this.state==="running"?(oe.now()-this.startTime)*this.speed:this.time*1e3}sample(t){if(!this.sampler){let{motionValue:e,onUpdate:i,onComplete:s,onPlay:r,onStop:o,element:a,...l}=this.options;this.sampler=new bn({...l,autoplay:!1}),this.sampler.stop()}return this.sampler.sample(Math.max(0,t)).value}liveValue(){let{state:t}=this;if(t==="running"||t==="paused")return this.sample(this.elapsed())}updateMotionValue(t){let{motionValue:e,element:i,name:s}=this.options;if(!e)return;if(t!==void 0){e.set(t);return}let{speed:r}=this,o=this.elapsed(),a=this.state==="running"&&r?Pe(0,po,o):0,l=this.sample(o);i&&s&&Ol(i,s,l),e.setWithVelocity(this.sample(o-a*Math.sign(r)),l,a/Math.abs(r||1))}};var Kh=(n,t)=>t==="zIndex"?!1:!!(typeof n=="number"||Array.isArray(n)||typeof n=="string"&&(We.test(n)||n==="0")&&!n.startsWith("url("));function Mv(n){let t=n[0];if(n.length===1)return!0;for(let e=0;e<n.length;e++)if(n[e]!==t)return!0}function dp(n,t,e,i){let s=n[0];if(s===null)return!1;if(t==="display"||t==="visibility")return!0;let r=n[n.length-1],o=Kh(s,t),a=Kh(r,t);return!o||!a?(o!==a&&yn(!1,`You are trying to animate ${t} from "${s}" to "${r}". "${o?r:s}" is not an animatable value.`,"value-not-animatable"),!1):Mv(n)||(e==="spring"||Ji(e))&&i}function mo(n){n.duration=0,n.type="keyframes"}var Jh=new Set(["opacity","clipPath","filter","transform","backgroundColor"]);var bv=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function pp(n){for(let t=0;t<n.length;t++)if(typeof n[t]=="string"&&bv.test(n[t]))return!0;return!1}var mp=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),$h=Kr(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function gp(n){let{motionValue:t,name:e,repeatDelay:i,repeatType:s,damping:r,type:o,keyframes:a}=n;if(!e||!(Jh.has(e)||mp.has(e)))return!1;let l=t?.owner?.current;if(!(l instanceof HTMLElement)&&!(l instanceof SVGElement))return!1;let{onUpdate:c,transformTemplate:h}=t.owner.getProps();return $h()&&(Jh.has(e)||mp.has(e)&&pp(a))&&(e!=="transform"||!h)&&!c&&!i&&s!=="mirror"&&r!==0&&o!=="inertia"}var je=(n,t)=>t&&typeof n=="number"?t.transform(n):n;var go={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Tv=Xe.length;function xp(n,t,e){let i="",s=!0;for(let o=0;o<Tv;o++){let a=Xe[o],l=n[a];if(l===void 0)continue;let c=!0;if(typeof l=="number")c=l===(a.startsWith("scale")?1:0);else{let h=parseFloat(l);c=a.startsWith("scale")?h===1:h===0}if(!c||e){let h=je(l,Ve[a]);if(!c){s=!1;let f=go[a]||a;i+=`${f}(${h}) `}e&&(t[a]=h)}}let r=n.pathRotation;return r&&(s=!1,i+=`rotate(${je(r,Ve.pathRotation)}) `),i=i.trim(),e?i=e(t,s?"":i):s&&(i="none"),i}var Ks=new WeakMap;var Ev=200,jh=.001,Av=.1,wv=.001,Cv=100,Rv=n=>/^(linear|ease(In|Out|InOut))$/.test(n),Qh=(n,t)=>n-t,_p=(n,t,e)=>{let i=[];for(let s=0;s<=e;s++)i.push($e(n,t,s/e));return i},kl=n=>n.motionValue.owner,tu=n=>Ks.get(n),Js=(n,t)=>n.latestValues?n.latestValues[t]:n.getValue(t)?.get(),yp=({name:n,motionValue:t})=>n&&Xe.includes(n)&&t?.owner?.current instanceof HTMLElement&&$h()&&Zs();function Iv(n){let t=kl(n),{onUpdate:e,transformTemplate:i}=t.getProps();return!n.isHandoff&&!e&&!n.hasOnUpdate&&!i&&n.type!=="inertia"&&(Js(t,"transform")||"none")==="none"&&!Js(t,"pathRotation")&&!t.projection?.isProjecting()}var Gl=class extends bn{constructor(t){let e=kl(t).current,{driver:i=Rl}=t,s=Iv(t);t.driver=o=>{let a=i(o);return{js:a,now:a.now,start:(l=!0)=>{let c=tu(e);!c||c.isJS?a.start(l):c.schedule(!1,!l)},stop:()=>{a.stop();let l=tu(e);l?.schedule(!l.isFinishing)}}},super(t),this.canAccelerate=s;let{stop:r}=this;this.stop=()=>{this.isAccelerated()&&this.sync(),r()}}get group(){return tu(kl(this.options).current)}get js(){return this.driver?.js}get name(){return this.options.name}timing(){let{startTime:t,speed:e,totalDuration:i}=this,{delay:s=0,repeatType:r}=this.options;return this.holdTime!==null?[1/0,0]:i===1/0?[t+s/e,this.resolvedDuration*(r==="loop"?1:2)/e||1]:[t+(s+i)/e,0]}isAccelerated(){let{group:t,state:e}=this;return t?.tracks.has(this)&&!t.isJS&&this.canAccelerate&&(e==="running"||e==="paused")}liveValue(){return this.isAccelerated()?this.sampleAt(oe.now()):void 0}tween(){let{keyframes:t,type:e,ease:i,times:s,repeat:r,delay:o=0}=this.options,a=qi(i)?ii(i):Rv(i)&&fo[i];if(a&&!r&&!s&&t.length===2&&e===Mn&&this.holdTime===null){let l=this.startTime+o/this.speed;return[l,l+this.resolvedDuration/this.speed,a]}}boundaries(t,e){let{startTime:i,speed:s,resolvedDuration:r,options:o}=this,{delay:a=0,repeat:l=0,repeatDelay:c=0,repeatType:h,times:f,keyframes:u,type:m}=o,_=(m||Mn)===Mn?f||Yi(u):[0,1],S=i+a/s,p=[];if(this.holdTime!==null||!(r>0))return p;for(let d=Math.max(0,Math.floor((t-S)*s/r));d<=l;d++){let M=S+d*r/s;if(M>e)break;for(let C of _){let y=M+(d%2&&h&&h!=="loop"?1-C:C)*(r-c)/s;y>t&&y<e&&p.push(y)}}return p}numberAt(t){return parseFloat(this.sampleAt(t,!0))}sync(){let t=oe.now();this.options.motionValue.setWithVelocity(this.sampleAt(t-po,!0),this.sampleAt(t,!0),po)}play(){this.isStopped||((this.group||Pv(kl(this.options))).tracks.add(this),super.play())}pause(){super.pause(),this.isAccelerated()&&(this.sync(),this.group.schedule(!1))}complete(){super.complete();let{group:t}=this;t&&!t.isJS&&this.canAccelerate&&this.tick(oe.now())}get time(){return this.isAccelerated()?Ee(Pe(0,this.totalDuration,this.at(oe.now())-(this.options.delay||0))):super.time}set time(t){super.time=t}attachTimeline(t){return this.canAccelerate=!1,this.group?.demote(!0),super.attachTimeline(t)}};function Pv(n){let t=n.current,e=new Set,i=new Map,s={},r=[],o=new Map,a=[],l=!1,c=!1,h=!1,f=-1/0,u=R=>{for(let D of e)if(D.name===R)return!0},m=(R,D)=>{let L={};for(let I of R===void 0?Xe:r){let U=i.get(I),W=R===void 0?Js(n,I):U?U.sampleAt(D>R&&!U.timing()[1]?D:R):s[I];W!==void 0&&(L[I]=W)}return L},_=(R,D)=>{let L="",I=m(R,D);for(let U in I)L+=(go[U]||U)+"("+je(I[U],Ve[U])+") ";return L||"none"},S=(R=m())=>{t.style.transform=xp(R,{})},p=(R=!0)=>{R&&S(),a.forEach(({animation:D})=>D.cancel()),a=[]},d=(R,D,L=1/0)=>{let I={animation:R,offset:D,end:L};R.startTime=oe.now()+D,L<1/0&&(R.onfinish=()=>{I.isDone=!0,a.some(U=>U.end===1/0)&&(R.cancel(),a=a.filter(U=>U!==I)),P.schedule(!1)}),R.oncancel=()=>a.includes(I)&&P.demote(),a.push(I)},M=(R,D,L)=>{let I=(W,k)=>Math.abs(R(k)-R(W)),U=I(D,L);for(;L-D>.01;){let W=(D+L)/2;I(D,W)>I(W,L)?L=W:D=W}return I(D,L)>U/2?[D,L]:[]},C=(R,D,L,I)=>{let U=Math.min(Ev,Math.max(2,Math.ceil((L-D)/po)));if(I.length*4>U)return;let W=_p(D,L,U).concat(I).sort(Qh),k=it=>Bn(D,L,it),J,B;for(let it of R){let rt=W.map(Z=>it.numberAt(Z)),[Ht]=rt,Lt=rt[rt.length-1]-Ht,Ut=rt.map(Z=>Lt?(Z-Ht)/Lt:Z-Ht);if(Lt){if(!J)J=Ut,B=Z=>(it.numberAt(Z)-Ht)/Lt;else if(Ut.some((Z,Q)=>!(Math.abs(Z-J[Q])<=jh)))return}else if(Ut.some(Z=>!(Math.abs(Z)<=jh)))return}if(!J||J.every((it,rt)=>Math.abs(it-k(W[rt]))<=jh))return"linear";let X=[],K=(it,rt=B(it))=>X.push(Nl(rt)+" "+Nl(k(it)*100)+"%");return J.forEach((it,rt)=>{rt&&Math.abs(it-J[rt-1])>.2&&M(B,W[rt-1],W[rt]).forEach(Ht=>K(Ht)),K(W[rt],it)}),"linear("+X+")"},y=(R,D,L,I)=>{let U=[D],W=(X,K)=>R.every(it=>!(Math.abs(it.numberAt((X+K)/2)-(it.numberAt(X)+it.numberAt(K))/2)>(it.name.startsWith("scale")?wv:Av))),k=(X,K,it)=>{if(K-X<1||W(X,K))U.push(K);else if(it<4)k(X,(X+K)/2,it+1),k((X+K)/2,K,it+1);else{for(let rt of R)U.push(...M(Ht=>rt.numberAt(Ht),X,K));U.push(K)}},J=_p(D,L,Math.ceil((L-D)/100));for(let X of I)J.push(X,Math.min(X+.01,L));let B=D;for(let X of J.sort(Qh))X>B&&k(B,X,0),B=X;return U.sort(Qh)},A=R=>{let D;for(let L of R){let I=L.tween();if(!I||D?.some((U,W)=>W<2?Math.abs(I[W]-U)>1:I[W]!==U))return;D=I}return D},b=(R,D,L,I={fill:"both"},U,W)=>{let k=R.flatMap(it=>it.boundaries(D,L)),J=W||C(R,D,L,k),B=J?[D,L]:y(R,D,L,k),X=B.map(it=>_(it,U)),K={transform:X};return J||(K.offset=B.map(it=>Bn(D,L,it))),X.every(it=>it===X[0])&&(S(m(D,U)),K=null),t.animate(K,{...I,duration:L-D,easing:J||"linear"})},T=R=>{let D=R,L=0,I=0,U=[],W=[],k=new Set;i.clear(),o=new Map;for(let B of e){i.set(B.name,B);let[X,K]=B.timing(),it=X===1/0;if(o.set(B,[B.at(R),B.speed,it]),it){B.sync();continue}if(B.speed<0)return;if(K){if(L){let rt=(X-I)/K;if(Math.abs(K-L)>1||Math.abs(rt-Math.round(rt))*L>1)return}else L=K,I=X;W.push(B)}else k.add(X);U.push(B),D=Math.max(D,X)}s={},r=Xe.filter(B=>{if(i.has(B))return!0;let X=s[B]=Js(n,B);return X!==void 0&&parseFloat(X)!==(B.startsWith("scale")?1:0)}),p(!1);let J=!L&&A(U);try{if(J&&J[1]>R){let[B,X,K]=J;d(b(U,B,X,void 0,void 0,K),B-R,X-B)}else D>R&&(d(b(U,R,D),0,D-R),k.forEach(B=>B<D-1&&d(t.animate(null,{duration:B-R}),0,B-R)));if(L){let B=I+Math.floor((D-I)/L)*L;d(b(W,B,B+L,{iterations:1/0,iterationStart:(D-B)/L,fill:"forwards"},D),D-R)}}catch{return}return a.length||p(),!0},g=R=>{let D,L=0;for(let I of e){let U=o.get(I);if(!U)return!1;let[W,k,J]=U,B=I.at(R),X=I.timing()[0]===1/0;if(J){if(X&&B===W)continue;return!1}let K=(B-W)/k,it=X?0:I.speed/k;if(D===void 0)D=K,L=it;else if(Math.abs(K-D)>1||it!==L)return!1}if(D===void 0)return!0;if(!a.length)return!1;for(let{offset:I,end:U,isDone:W}of a){let k=D-I;if(U<1/0&&(W?k<U-1:k<0||k>=U))return!1}for(let{animation:I,offset:U,isDone:W}of a){if(W)continue;let k=D-U;L?(I.playbackRate=L,I.startTime=R-k/L):(I.pause(),I.currentTime=k)}return!0},E=()=>{let R=oe.now();if(P.isJS||(P.isFinishing=!0,e.forEach(I=>{let[U,W]=I.timing();I.state==="running"&&I.speed>0&&!W&&U<=R+1&&(I.complete(),s[I.name]=Js(n,I.name),o.has(I)||(l=!0))}),P.isFinishing=!1),c=!1,e.forEach(({state:I},U)=>{(I==="idle"||I==="finished")&&e.delete(U)}),!e.size){Ks.delete(t),P.isJS||p();return}for(let I of e)if(!I.canAccelerate)return P.demote(!0);P.isJS&&(P.isJS=!1,l=!0,e.forEach(I=>I.js?.stop()));let D=l,L=h;if(l=h=!1,D||!g(R)){if(L){if(R-f<Cv)return P.demote();f=R}if(!T(R))return P.demote()}},P={tracks:e,isJS:!1,isFinishing:!1,schedule(R,D){l||(l=R),h||(h=!!D),c||(c=!0,rn.isProcessing?Ae.render(E,!1,!0):queueMicrotask(E))},check(){if(!P.isJS){for(let R in s)if(Js(n,R)!==s[R]&&!u(R))return P.schedule(!0,!0)}},demote(R){P.isJS||(e.forEach(D=>{D.isAccelerated()&&D.sync(),R||(D.canAccelerate=!1)}),P.isJS=!0,o=new Map,p(),e.forEach(D=>D.state==="running"&&D.js?.start()))}};return Ks.set(t,P),P}var Hl=class extends Ai{constructor(t){super(),this.stop=()=>{this._animation&&(this._animation.stop(),this.stopTimeline?.()),this.keyframeResolver?.cancel()},this.createdAt=oe.now();let{keyframes:e,name:i,motionValue:s,element:r}=t,o=t;o.autoplay??(o.autoplay=!0),o.delay??(o.delay=0),o.type??(o.type="keyframes"),o.repeat??(o.repeat=0),o.repeatDelay??(o.repeatDelay=0),o.repeatType??(o.repeatType="loop");let a=r?.KeyframeResolver||Ys;this.keyframeResolver=new a(e,(l,c,h)=>this.onKeyframesResolved(l,c,o,!h),i,s,r),this.keyframeResolver?.scheduleResolve()}onKeyframesResolved(t,e,i,s){this.keyframeResolver=void 0;let{name:r,type:o,velocity:a,delay:l,isHandoff:c,onUpdate:h}=i;this.resolvedAt=oe.now();let f=!0;dp(t,r,o,a)||(f=!1,(Be.instantAnimations||!l)&&h?.(ni(t,i,e)),t[0]=t[t.length-1],mo(i),i.repeat=0);let{onComplete:u}=i;i.finalKeyframe=e,i.keyframes=t,i.onComplete=()=>{u?.(),this.notifyFinished()};let m=f&&!c&&gp(i),_=!m&&yp(i);s&&(m||_||this.resolvedAt!==this.createdAt)&&(i.startTime??(i.startTime=Dl(this.createdAt,this.resolvedAt)));let S;if(m){i.element=i.motionValue?.owner?.current;try{S=new zl(i)}catch{S=new bn(i)}}else _?S=new Gl(i):S=new bn(i);this.pendingTimeline&&(this.stopTimeline=S.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=S}get finished(){return this._animation?this._animation.finished:super.finished}then(t,e){return this.finished.finally(t).then(()=>{})}liveValue(){return this._animation?.liveValue?.()}get animation(){return this._animation||(this.keyframeResolver?.resume(),op()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(t){this.animation.time=t}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(t){this.animation.speed=t}get startTime(){return this.animation.startTime}attachTimeline(t){return this._animation?this.stopTimeline=this.animation.attachTimeline(t):this.pendingTimeline=t,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){this._animation&&this.animation.cancel(),this.keyframeResolver?.cancel()}};var Wl=class{constructor(t){this.stop=()=>this.runAll("stop"),this.animations=t.filter(Boolean)}get finished(){return Promise.all(this.animations.map(t=>t.finished))}getAll(t){return this.animations[0][t]}setAll(t,e){for(let i=0;i<this.animations.length;i++)this.animations[i][t]=e}attachTimeline(t){let e=this.animations.map(i=>i.attachTimeline(t));return()=>{e.forEach((i,s)=>{i&&i(),this.animations[s].stop()})}}get time(){return this.getAll("time")}set time(t){this.setAll("time",t)}get speed(){return this.getAll("speed")}set speed(t){this.setAll("speed",t)}get state(){return this.getAll("state")}get startTime(){return this.getAll("startTime")}get duration(){return vp(this.animations,"duration")}get iterationDuration(){return vp(this.animations,"iterationDuration")}runAll(t){this.animations.forEach(e=>e[t]())}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}};function vp(n,t){let e=0;for(let i=0;i<n.length;i++){let s=n[i][t];s!==null&&s>e&&(e=s)}return e}var xo=class extends Wl{then(t,e){return this.finished.finally(t).then(()=>{})}};var Sp=30,Dv=n=>!isNaN(parseFloat(n)),eu={current:void 0},Gn=class{constructor(t,e={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=i=>{let s=oe.now();if(this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&(this.notifyChange(),this.dependents))for(let r of this.dependents)r.dirty()},this.hasAnimated=!1,this.setCurrent(t),this.owner=e.owner}setCurrent(t){this.current=t,this.updatedAt=oe.now(),this.canTrackVelocity===null&&t!==void 0&&(this.canTrackVelocity=Dv(this.current))}setPrevFrameValue(t=this.current){this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt}onChange(t){return this.on("change",t)}on(t,e){var i;return t==="change"?this.onChangeSubscribe(e):((i=this.events)[t]||(i[t]=new Us)).add(e)}onChangeSubscribe(t){let{events:e}=this;return!e.change&&!this.changeSubscriber?this.changeSubscriber=t:(e.change||(e.change=new Us,e.change.add(this.changeSubscriber),this.changeSubscriber=void 0),e.change.add(t)),()=>{this.changeSubscriber===t?this.changeSubscriber=void 0:e.change?.remove(t),this.stopIfUnobserved()}}stopIfUnobserved(){Ae.read(()=>{!this.changeSubscriber&&!this.events.change?.getSize()&&this.stop()})}clearListeners(){this.changeSubscriber=void 0;for(let t in this.events)this.events[t].clear()}attach(t,e){this.passiveEffect=t,this.stopPassiveEffect=e}set(t){this.passiveEffect?this.passiveEffect(t,this.updateAndNotify):this.updateAndNotify(t)}setWithVelocity(t,e,i){this.set(e),this.prev=void 0,this.prevFrameValue=t,this.prevUpdatedAt=this.updatedAt-i}jump(t,e=!0){this.updateAndNotify(t),this.prev=t,this.prevUpdatedAt=this.prevFrameValue=void 0,e&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){this.notifyChange()}notifyChange(){let{current:t,changeSubscriber:e}=this;e?e(t):this.events.change?.notify(t)}addDependent(t){this.dependents||(this.dependents=new Set),this.dependents.add(t)}removeDependent(t){this.dependents&&this.dependents.delete(t)}get(){eu.current&&eu.current.push(this);let t=this.animation?.liveValue?.();return t===void 0?this.current:t}getCurrent(){return this.current}getPrevious(){return this.prev}getVelocity(){let t=oe.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||t-this.updatedAt>Sp)return 0;let e=Math.min(this.updatedAt-this.prevUpdatedAt,Sp);return Jr(parseFloat(this.current)-parseFloat(this.prevFrameValue),e)}start(t){return this.stop(),new Promise(e=>{this.hasAnimated=!0;let i=!1,s;s=t(()=>{i=!0,this.events.animationComplete?.notify(),this.animation===s&&this.clearAnimation(),e()}),i||(this.animation=s),this.events.animationStart?.notify()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){this.animation=void 0}destroy(){this.dependents?.clear(),this.events.destroy?.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}};function $i(n,t){return new Gn(n,t)}function Mp(n,t){if(n?.inherit&&t){let{inherit:e,...i}=n;return{...t,...i}}return n}function bp(n,t){let e=n?.[t]??n?.default??n;return e!==n?Mp(e,n):e}var Lv={type:"spring",stiffness:500,damping:25,restSpeed:10},Nv=n=>({type:"spring",stiffness:550,damping:n===0?2*Math.sqrt(550):30,restSpeed:10}),Uv={type:"keyframes",duration:.8},Fv={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Tp=(n,{keyframes:t})=>t.length>2?Uv:wi.has(n)?n.startsWith("scale")?Nv(t[1]):Lv:Fv;var Ov=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function Ep(n){for(let t in n)if(!Ov.has(t))return!0;return!1}var Xl=(n,t,e,i={},s,r)=>o=>{let a=bp(i,n)||{},l=a.delay||i.delay||0,{elapsed:c=0}=i;c=c-De(l);let h={keyframes:Array.isArray(e)?e:[null,e],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-c,onUpdate:u=>{t.set(u),a.onUpdate&&a.onUpdate(u)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:n,motionValue:t,element:r?void 0:s,hasOnUpdate:!!a.onUpdate};Ep(a)||Object.assign(h,Tp(n,h)),h.duration&&(h.duration=De(h.duration)),h.repeatDelay&&(h.repeatDelay=De(h.repeatDelay)),h.from!==void 0&&(h.keyframes[0]=h.from);let f=!1;if((h.type===!1||h.duration===0&&!h.repeatDelay)&&(mo(h),h.delay===0&&(f=!0)),(Be.instantAnimations||Be.skipAnimations||s?.shouldSkipAnimations||a.skipAnimations)&&(f=!0,mo(h),h.delay=0),h.allowFlatten=!a.type&&!a.ease,f&&!r&&t.get()!==void 0){let u=ni(h.keyframes,a);if(u!==void 0){Ae.update(()=>{h.onUpdate(u),h.onComplete()});return}}return a.isSync?new bn(h):new Hl(h)};var Bv=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function Vv(n){let t=Bv.exec(n);if(!t)return[,];let[,e,i,s]=t;return[`--${e??i}`,s]}var zv=4;function nu(n,t,e=1){He(e<=zv,`Max CSS variable fallback depth detected in property "${n}". This may indicate a circular fallback dependency.`,"max-css-var-depth");let[i,s]=Vv(n);if(!i)return;let r=window.getComputedStyle(t).getPropertyValue(i);if(r){let o=r.trim();return Yr(o)?parseFloat(o):o}return Vs(s)?nu(s,t,e+1):s}var ql=new Set(["width","height","top","left","right","bottom",...Xe]);var ji=n=>!!(n&&n.getVelocity);function _o(n){return n.replace(/([A-Z])/g,t=>`-${t.toLowerCase()}`)}var Ap={test:n=>n==="auto",parse:n=>n};var wp=n=>t=>t.test(n);var kv=[zn,vt,Ti,Sn,Ed,Td,Ap],iu=n=>kv.find(wp(n));function Cp(n){return typeof n=="number"?n===0:n!==null?n==="none"||n==="0"||Zr(n):!0}var Gv=new Set(["auto","none","0"]);function Rp(n,t,e){let i=0,s;for(;i<n.length&&!s;){let r=n[i];typeof r=="string"&&!Gv.has(r)&&Dd(r)&&(s=n[i]),i++}if(s&&e)for(let r of t)n[r]!==s&&(n[r]=Ul(e,s))}var Yl=class extends Ys{constructor(t,e,i,s,r){super(t,e,i,s,r,!0)}scheduleResolve(){if(this.canReadNow()&&(this.readKeyframes(),!this.needsMeasurement))return this.complete();super.scheduleResolve()}canReadNow(){let{unresolvedKeyframes:t,element:e,motionValue:i}=this,s=t[0]??i?.get();if(!e?.current||s===void 0)return!1;for(let r=0;r<t.length;r++)if(El(r?t[r]:s))return!1;return!0}readKeyframes(){let{unresolvedKeyframes:t,element:e,name:i}=this;if(!e||!e.current)return;super.readKeyframes();for(let h=0;h<t.length;h++){let f=t[h];if(typeof f=="string"&&(f=f.trim(),Vs(f))){let u=nu(f,e.current);u!==void 0&&(t[h]=u),h===t.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!ql.has(i)||t.length!==2)return;let[s,r]=t;if(typeof s=="number"&&typeof r=="number")return;let o=iu(s),a=iu(r),l=El(s),c=El(r);if(l!==c&&Ci[i]){this.needsMeasurement=!0;return}if(o!==a)if(Wh(o)&&Wh(a))for(let h=0;h<t.length;h++){let f=t[h];typeof f=="string"&&(t[h]=parseFloat(f))}else Ci[i]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){let{unresolvedKeyframes:t,name:e}=this,i=[];for(let s=0;s<t.length;s++)(t[s]===null||Cp(t[s]))&&i.push(s);i.length&&Rp(t,i,e)}measure(){let{element:t,name:e}=this;return Ci[e](window.getComputedStyle(t.current),()=>t.measureViewportBox())}measureInitialState(){let{element:t,unresolvedKeyframes:e,name:i}=this;if(!t||!t.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=this.measure(),e[0]=this.measuredOrigin;let s=e[e.length-1];s!==void 0&&this.motionValue?.jump(s,!1)}measureEndState(){let{element:t,unresolvedKeyframes:e}=this;if(!t||!t.current)return;this.motionValue?.jump(this.measuredOrigin,!1);let i=e.length-1,s=e[i];e[i]=this.measure(),s!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=s),this.removedTransforms?.length&&this.removedTransforms.forEach(([r,o])=>{t.getValue(r).set(o)}),this.resolveNoneKeyframes()}};var su=[];function ru(n){He(typeof n.test=="function"&&typeof n.read=="function","Effects passed to animate.addEffect() need test() and read().","effect-missing-test"),Zl(n),su.unshift(n)}function Zl(n){Qn(su,n)}function ou(n){return su.find(t=>t.test(n))}function Kl(n,t,e={},i){let s=[],{velocity:r}=e,o=e.reduceMotion??i?.shouldReduceMotion;for(let l in t){if(l==="transition"||l==="transitionEnd")continue;let c=t[l];if(c===void 0)continue;let h=n(l),f=h.get();if(f!==void 0&&!h.isAnimating()&&!Array.isArray(c)&&c===f&&!r){Ae.update(()=>h.set(c));continue}h.start(Xl(l,h,c,o&&ql.has(l)?{type:!1}:e,i)),h.animation&&s.push(h.animation)}let{transitionEnd:a}=t;if(a){let l=()=>Ae.update(()=>{for(let c in a)n(c).set(a[c])});s.length?Promise.all(s).then(l):l()}return s}function yo(n,t,e,i,s){return Kl(r=>{let o=n.get(t,r);if(!o){let a;if(!s){let l=e[r];a=Hv(l)??n.read(t,r,l),He(a!==void 0,`"${r}" can't be read from the animated subject. Provide [from, to] keyframes.`,"effect-unreadable-value")}o=$i(a,{owner:s}),n(t,{[r]:o})}return o},e,i,s)}function Hv(n){let t=Array.isArray(n)?n[0]:void 0;return t===null?void 0:t}function au(n){return Hi(n)&&"offsetHeight"in n&&!("ownerSVGElement"in n)}function $s(n){return Hi(n)&&"ownerSVGElement"in n}function vo(n,t,e){if(n==null)return[];if(n instanceof EventTarget)return[n];if(typeof n=="string"){let i=document;t&&(i=t.current);let s=e?.[n]??i.querySelectorAll(n);return s?Array.from(s):[]}return Array.from(n).filter(i=>i!=null)}var Jl=class{constructor(t=Ae.render){this.step=t,this.values=new Map,this.pending=[],this.numPending=0,this.flush=()=>{let{pending:e,numPending:i}=this;this.numPending=0;for(let s=0;s<i;s++)e[s]()}}set(t,e,i,s){if(this.values.get(t)?.onRemove(),s)for(let l of this.values.values())l.value===s&&(i=l.render);let r=()=>i&&this.schedule(i);e.get()!==void 0&&r();let o=e.on("change",r),a=()=>{o(),i&&!s&&this.cancel(i),this.values.get(t)?.onRemove===a&&this.values.delete(t)};return this.values.set(t,{value:e,render:s?void 0:i,onRemove:a}),a}get(t){return this.values.get(t)?.value}release(){let t=new Map;return this.values.forEach((e,i)=>{t.set(i,e.value),e.onRemove()}),this.transformKeys=this.transformValues=void 0,t}schedule(t){let{pending:e,numPending:i}=this;for(let s=0;s<i;s++)if(e[s]===t)return;i||this.step(this.flush),e[this.numPending++]=t}cancel(t){let{pending:e}=this;for(let i=0;i<this.numPending;i++)if(e[i]===t){e[i]=e[--this.numPending];return}}};function js(n,{step:t,...e}={}){let i=new WeakMap;return Object.assign((r,o)=>{let a=i.get(r)??new Jl(t);i.set(r,a);let l=[];for(let c in o){let h=o[c],f=n(r,a,c,h);l.push(f)}return()=>{for(let c of l)c()}},e,{get:(r,o)=>i.get(r)?.get(o),flush:r=>i.get(r)?.flush(),state:r=>i.get(r)})}var Ip={};function Pp(n){let t="",{transformKeys:e=[],transformValues:i={}}=n;for(let r=0;r<e.length;r++){let o=e[r],a=i[o].getCurrent();if(a===void 0)continue;(typeof a=="number"?a:parseFloat(a))!==(o.startsWith("scale")?1:0)&&(t+=(t&&" ")+(Ip[o]||(Ip[o]=(go[o]||o)+"("))+je(a,uo[o])+")")}let s=n.get("pathRotation")?.get();return s&&(t+=(t&&" ")+"rotate("+je(s,uo.pathRotation)+")"),t||"none"}var cu=new Set(["originX","originY","originZ"]),lu=(n,t)=>je(n.get(t)?.get(),Ve[t]),$l=(n,t,e,i)=>{let s,r;if(wi.has(e)){if(e!=="pathRotation"){let o=t.transformKeys??(t.transformKeys=[]);(t.transformValues??(t.transformValues={}))[e]=i,o.includes(e)||(o.push(e),o.sort((a,l)=>Xe.indexOf(a)-Xe.indexOf(l)))}t.get("transform")||(!au(n)&&!t.get("transformBox")&&$l(n,t,"transformBox",new Gn("fill-box")),t.set("transform",new Gn("none"),()=>{Ks.get(n)?.check(),n.style.transform=Pp(t)})),r=t.get("transform")}else cu.has(e)?(t.get("transformOrigin")||t.set("transformOrigin",new Gn(""),()=>{let o=lu(t,"originX")??"50%",a=lu(t,"originY")??"50%",l=lu(t,"originZ")??0;n.style.transformOrigin=`${o} ${a} ${l}`}),r=t.get("transformOrigin")):Ri(e)?s=()=>{n.style.setProperty(e,i.getCurrent())}:s=()=>{n.style[e]=je(i.getCurrent(),Ve[e])};return t.set(e,i,s,r)},Wv=n=>au(n)||$s(n),hu=(n,t)=>{if(wi.has(t))return tp(n,t);let e=getComputedStyle(n),i=Ri(t)?e.getPropertyValue(t):e[t];return typeof i=="string"&&i.trim()||0},Dp=js($l,{test:Wv,read:hu});var Lp=["transform","opacity","clipPath","filter","offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Xv(n,t){if(!(t in n))return!1;let e=Object.getOwnPropertyDescriptor(Object.getPrototypeOf(n),t)||Object.getOwnPropertyDescriptor(n,t);return e&&typeof e.set=="function"}var uu=(n,t,e,i,s=e)=>{let r=Xv(n,s);!r&&(s.startsWith("data")||s.startsWith("aria"))&&(s=_o(s));let o=Ve[e]||Ve[s],a=r?()=>{n[s]=je(i.get(),Ve[e])}:()=>{let l=je(i.get(),o);l==null?n.removeAttribute(s):n.setAttribute(s,String(l))};return t.set(e,i,a)};function qv(n,t,e,i){return Ae.render(()=>n.setAttribute("pathLength","1")),e==="pathOffset"?t.set(e,i,()=>{let s=i.get();n.setAttribute("stroke-dashoffset",`${-s}`)}):(t.get("stroke-dasharray")||t.set("stroke-dasharray",new Gn("1 1"),()=>{let s=t.get("pathLength")?.get()??1,r=t.get("pathSpacing")?.get();n.setAttribute("stroke-dasharray",`${s} ${r??1-Number(s)}`)}),t.set(e,i,void 0,t.get("stroke-dasharray")))}var Yv=(n,t,e,i)=>e.startsWith("path")?qv(n,t,e,i):e.startsWith("attr")?uu(n,t,e,i,Up(e)):(wi.has(e)||cu.has(e)||Ri(e)||e in n.style?$l:uu)(n,t,e,i),Zv=(n,t)=>wi.has(t)?Ve[t]?.default||0:Ri(t)||Lp.includes(t)?hu(n,t)||n.getAttribute(_o(t))||0:(t=Up(t),n.getAttribute(_o(t))??n.getAttribute(t)??void 0),Np=js(Yv,{test:$s,read:Zv});function Up(n){return n.replace(/^attr([A-Z])/,(t,e)=>e.toLowerCase())}function Fp({top:n,left:t,right:e,bottom:i}){return{x:{min:t,max:e},y:{min:n,max:i}}}function Op(n,t){if(!t)return n;let e=t({x:n.left,y:n.top}),i=t({x:n.right,y:n.bottom});return{top:e.y,left:e.x,bottom:i.y,right:i.x}}function Bp(n,t){return Fp(Op(n.getBoundingClientRect(),t))}var Kv={},Jv=n=>$s(n)?Np:Dp,fu=class{constructor(t,e){this.effect=t,this.current=e,this.KeyframeResolver=Yl}getValue(t){return this.effect.get(this.current,t)}readValue(t,e){return this.effect.read(this.current,t,e)}render(){this.effect.flush(this.current)}measureViewportBox(){return Bp(this.current)}getProps(){return Kv}};function du(n,t,e,i){if(i)return Kl(r=>i.getValue(r,null),t,e,i);let s=Jv(n);return yo(s,n,t,e,new fu(s,n))}var pu=js((n,t,e,i)=>t.set(e,i,()=>{n[e]=i.get()}),{test:n=>Hi(n),read:(n,t)=>{let e=n[t];return typeof e=="string"||typeof e=="number"?e:void 0}});function mu(n=.1,{startDelay:t=0,from:e=0,ease:i,grid:s}={}){let r={};return(o,a)=>{let l=r[a];if(!l){let[f,u]=s||[1/0,1],m=Math.min(f,a)-1,_=Math.max(u,Math.ceil(a/f))-1,S=typeof e=="number",p=e==="first"?0:e==="last"?1:.5,d=S?e%f:m*p,M=S?Math.floor(e/f):_*p;l=r[a]=[];for(let C=0;C<a;C++){let y=C%f,A=Math.floor(C/f),b=Math.min(y,m-y),T=Math.min(A,_-A);if(e==="random"){let g=Math.random()*(C+1)|0;l[C]=l[g],l[g]=C}else l[C]=e==="edges"?Math.min(m?b:T,_?T:b):Math.hypot(y-d,A-M)}l.push(s?Math.max(...l):a)}let c=n*l[o],h=n*l[a];return i&&h&&(c=Bs(i)(c/h)*h),t+c}}var gu=new WeakMap;function xu(n,t,e){let i=ji(n)?n:$i(n);return i.start(Xl("",i,t,e)),i.animation}function So(n){return typeof n=="object"&&!Array.isArray(n)}function jl(n,t,e,i){return n==null?[]:typeof n=="string"&&So(t)?vo(n,e,i):n instanceof NodeList?Array.from(n):Array.isArray(n)?n.filter(s=>s!=null):[n]}function Vp(n,t,e){return n*(t+1)+e*t}function _u(n,t,e,i){return typeof t=="number"?t:t.startsWith("-")||t.startsWith("+")?Math.max(0,n+parseFloat(t)):t==="<"?e:t.startsWith("<")?Math.max(0,e+parseFloat(t.slice(1))):i.get(t)??n}function $v(n,t,e){for(let i=0;i<n.length;i++){let s=n[i];s.at>t&&s.at<e&&(Qn(n,s),i--)}}function zp(n,t,e,i,s,r){$v(n,s,r);for(let o=0;o<t.length;o++)n.push({value:t[o],at:$e(s,r,i[o]),easing:no(e,o)})}function kp(n,t,e=0){let i=t+1+t*e;for(let s=0;s<n.length;s++)n[s]=n[s]/i}function Gp(n,t){return n.at===t.at?n.value===null?1:t.value===null?-1:0:n.at-t.at}var jv="easeInOut",yu=20;function Xp(n,{defaultTransition:t={},...e}={},i,s){let r=t.duration||.3,o=new Map,a=new Map,l={},c=new Map,h=0,f=0,u=0;for(let m=0;m<n.length;m++){let _=n[m];if(typeof _=="string"){c.set(_,f);continue}else if(!Array.isArray(_)){c.set(_.name,_u(f,_.at,h,c));continue}let[S,p,d={}]=_;d.at!==void 0&&(f=_u(f,d.at,h,c));let M=0,C=(y,A,b,T=0,g=0)=>{let E=Qv(y),{delay:P=0,times:R=Yi(E),type:D=t.type||"keyframes",repeat:L,repeatType:I,repeatDelay:U=0,...W}=A,{ease:k=t.ease||"easeOut",duration:J}=A,B=typeof P=="function"?P(T,g):P,X=E.length,K=Ji(D)?D:s?.[D||"keyframes"];if(X<=2&&K){let Lt=100;if(X===2&&nS(E)){let Q=E[1]-E[0];Lt=Math.abs(Q)}let Ut={...t,...W};J!==void 0&&(Ut.duration=De(J));let Z=ao(Ut,Lt,K);k=Z.ease,J=Z.duration}J??(J=r);let it=f+B;R.length===1&&R[0]===0&&(R[1]=1);let rt=R.length-E.length;if(rt>0&&lo(R,rt),E.length===1&&E.unshift(null),L&&yn(L<yu,`Sequence segments can't repeat ${L} times \u2014 ignoring repeat option. Use a value below ${yu} or apply repeat at the sequence level instead.`),L&&L<yu){let Lt=J>0?U/J:0;J=Vp(J,L,U);let Ut=[...E],Z=[...R];k=Array.isArray(k)?[...k]:[k];let Q=[...k],xt=I==="reverse"||I==="mirror",Pt=Ut,gt=Q;xt&&(Pt=[...Ut].reverse(),I==="reverse"&&(gt=[...Q].reverse().map(Dt=>typeof Dt=="function"?Xi(Dt):Dt)));for(let Dt=0;Dt<L;Dt++){let fe=xt&&Dt%2===0,Bt=fe?Pt:Ut,Yt=fe?gt:Q,jt=(Dt+1)*(1+Lt);Lt>0&&(E.push(E[E.length-1]),R.push(jt),k.push("linear")),E.push(...Bt);for(let Ft=0;Ft<Bt.length;Ft++)R.push(Z[Ft]+jt),k.push(Ft===0?"linear":no(Yt,Ft-1))}kp(R,L,Lt)}let Ht=it+J;zp(b,E,k,R,it,Ht),M=Math.max(B+J,M),u=Math.max(Ht,u)};if(ji(S)){let y=Hp(S,a);C(p,d,Wp("default",y))}else{let y=jl(S,p,i,l),A=y.length;for(let b=0;b<A;b++){p=p,d=d;let T=y[b],g=Hp(T,a);for(let E in p)C(p[E],tS(d,E),Wp(E,g),b,A)}}h=f,f+=M}return a.forEach((m,_)=>{for(let S in m){let p=m[S];p.sort(Gp);let d=[],M=[],C=[];for(let T=0;T<p.length;T++){let{at:g,value:E,easing:P}=p[T];d.push(E),M.push(Bn(0,u,g)),C.push(P||"easeOut")}M[0]!==0&&(M.unshift(0),d.unshift(d[0]),C.unshift(jv)),M[M.length-1]!==1&&(M.push(1),d.push(null)),o.has(_)||o.set(_,{keyframes:{},transition:{}});let y=o.get(_);y.keyframes[S]=d;let{type:A,...b}=t;y.transition[S]={...b,duration:u,ease:C,times:M,...e}}}),o}function Hp(n,t){return!t.has(n)&&t.set(n,{}),t.get(n)}function Wp(n,t){return t[n]||(t[n]=[]),t[n]}function Qv(n){return Array.isArray(n)?n:[n]}function tS(n,t){return n&&n[t]?{...n,...n[t]}:{...n}}var eS=n=>typeof n=="number",nS=n=>n.every(eS);function iS(n,t){return ji(n)||typeof n=="number"||typeof n=="string"&&!So(t)}function Ql(n,t,e,i){let s=[];if(iS(n,t))s.push(xu(n,So(t)&&t.default||t,e&&(e.default||e)));else{if(n==null)return s;let r=jl(n,t,i),o=r.length;He(!!o,"No valid elements provided.","no-valid-elements");for(let a=0;a<o;a++){let l=r[a],c={...e};"delay"in c&&typeof c.delay=="function"&&(c.delay=c.delay(a,o)),l instanceof Element?s.push(...du(l,t,c,gu.get(l))):s.push(...yo(ou(l)??pu,l,t,c))}}return s}function qp(n,t,e){let i=[],s=n.map(o=>{if(Array.isArray(o)&&typeof o[0]=="function"){let a=o[0],l=$i(0);return l.on("change",a),o.length===1?[l,[0,1]]:o.length===2?[l,[0,1],o[1]]:[l,o[1],o[2]]}return o});return Xp(s,t,e,{spring:ei}).forEach(({keyframes:o,transition:a},l)=>{i.push(...Ql(l,o,a))}),i}function sS(n){return Array.isArray(n)&&n.some(Array.isArray)}function Yp(n={}){let{scope:t,reduceMotion:e,skipAnimations:i}=n;function s(r,o,a){let l=[],c,h={};if(e!==void 0&&(h.reduceMotion=e),i!==void 0&&(h.skipAnimations=i),sS(r)){let{onComplete:u,...m}=o||{};typeof u=="function"&&(c=u),l=qp(r,{...h,...m},t)}else{let{onComplete:u,...m}=a||{};typeof u=="function"&&(c=u),l=Ql(r,o,{...h,...m},t)}let f=new xo(l);return c&&f.finished.then(c),t&&(t.animations.push(f),f.finished.then(()=>{Qn(t.animations,f)})),f}return s}var Qs=Object.assign(Yp(),{addEffect:ru,removeEffect:Zl});var rS={some:0,all:1};function vu(n,t,{root:e,margin:i,amount:s="some"}={}){let r=vo(n),o=new WeakMap,a=c=>{c.forEach(h=>{let f=o.get(h.target);if(h.isIntersecting!==!!f)if(h.isIntersecting){let u=t(h.target,h);typeof u=="function"?o.set(h.target,u):l.unobserve(h.target)}else typeof f=="function"&&(f(h),o.delete(h.target))})},l=new IntersectionObserver(a,{root:e,rootMargin:i,threshold:typeof s=="number"?s:rS[s]});return r.forEach(c=>l.observe(c)),()=>l.disconnect()}var Su=matchMedia("(prefers-reduced-motion: reduce)").matches,tc=document.querySelector(".cinematic-hero");Su||(Qs(".hero-copy h1 span,.hero-copy h1 em,.hero-copy>p,.hero-copy .actions",{opacity:[0,1],y:[28,0]},{duration:1.1,delay:mu(.12),ease:[.16,1,.3,1]}),vu(".product-copy,.product-art,.community-section h2",n=>{Qs(n,{opacity:[.25,1],y:[35,0]},{duration:1.1,ease:[.16,1,.3,1]})},{amount:.15}),document.querySelectorAll(".primary").forEach(n=>{n.addEventListener("pointerenter",()=>Qs(n,{scale:1.035},{duration:.25})),n.addEventListener("pointerleave",()=>Qs(n,{scale:1},{duration:.25}))}));var tr=document.getElementById("brand-scene");try{let b=function(){let T=tr.clientWidth,g=tr.clientHeight;n.setSize(T,g),e.aspect=T/g,e.updateProjectionMatrix()},n=new _l({alpha:!0,antialias:!0,powerPreference:"low-power"});n.setPixelRatio(Math.min(devicePixelRatio,1.5)),n.setClearColor(0,0),n.toneMapping=Lr,n.toneMappingExposure=1.3,tr.appendChild(n.domElement);let t=new Fi,e=new Ce(34,1,.1,50);e.position.z=7.6;let i=new Ds(n),s=new Sl,r=i.fromScene(s,.03);t.environment=r.texture,s.dispose(),i.dispose(),t.add(new Pr(16777215,.5));let o=new Ir(16777215,3);o.position.set(2,4,5),t.add(o);let a=new Bi(6352827,28);a.position.set(-3,-1,2),t.add(a);let l=new $n({color:14213602,metalness:1,roughness:.17}),c=new $n({color:9563326,metalness:.8,roughness:.25,emissive:1523246,emissiveIntensity:.4}),h=new Zn;t.add(h);let f=new ie(new Oi(1.75,.065,16,160),l);f.rotation.set(.32,-.38,.25),h.add(f);let u=new ie(new Oi(2,.035,12,160),c);u.rotation.set(.7,.6,-.55),h.add(u);let m=new ie(new Oi(2.24,.021,12,120,Math.PI*1.4),l);m.rotation.set(-.45,.35,.7),h.add(m);let _=new ie(new Tr(.12,2),l);t.add(_);let S=new Float32Array(540);for(let T=0;T<180;T++){let g=T*2.3999632,E=2.5+T%11*.08;S[T*3]=Math.cos(g)*E,S[T*3+1]=Math.sin(g)*E,S[T*3+2]=Math.sin(T)*.7}let p=new Ge;p.setAttribute("position",new ke(S,3));let d=new Sr(p,new Ms({color:12638417,size:.016,transparent:!0,opacity:.4}));t.add(d);let M=!0,C=0,y=0,A=0;new IntersectionObserver(T=>{M=T[0].isIntersecting},{rootMargin:"100px"}).observe(tc),tc.addEventListener("pointermove",T=>{let g=tc.getBoundingClientRect();y=(T.clientX-g.left)/g.width-.5,A=(T.clientY-g.top)/g.height-.5},{passive:!0}),tc.addEventListener("pointerleave",()=>{y=0,A=0},{passive:!0}),new ResizeObserver(b).observe(tr),b(),n.setAnimationLoop(T=>{if(!M||document.hidden||!Su&&T-C<32)return;C=T;let g=Su?0:T*12e-5;f.rotation.z=.25+g,u.rotation.z=-.55-g*.55,m.rotation.z=.7+g*.8,h.rotation.y+=(y*.16-h.rotation.y)*.035,h.rotation.x+=(-A*.1-h.rotation.x)*.035,_.position.set(Math.cos(g*2)*2.15,Math.sin(g*2)*2.15,.3),d.rotation.z=g*.06,n.render(t,e)}),tr.classList.add("scene-ready"),document.querySelector(".orbital-visual").classList.add("has-webgl")}catch{tr.classList.add("scene-fallback")}document.getElementById("chart-center").addEventListener("click",()=>centerPublicChart());})();
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
