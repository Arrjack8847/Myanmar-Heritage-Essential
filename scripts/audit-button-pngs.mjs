import { readFileSync } from "node:fs";
import { join } from "node:path";
import { inflateSync } from "node:zlib";

const names = [
  "add-to-calendar", "back-to-beginning", "contact-us", "gallery-close",
  "gallery-next", "gallery-previous", "learn-more", "save-our-date-default",
  "save-our-date-focus", "save-our-date-hover", "save-our-date-mobile",
  "save-our-date-press", "save-our-date-primary", "view-directions", "view-photos",
];
let errors = 0;
for (const name of names) {
  const path = join(process.cwd(), "public/heritage/buttons", name + ".png");
  try {
    const png = readFileSync(path);
    if (!png.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])))
      throw Error("invalid PNG signature");
    let pos = 8, ihdr, paletteAlpha, idat = [];
    while (pos + 12 <= png.length) {
      const n = png.readUInt32BE(pos), type = png.toString("ascii",pos+4,pos+8);
      const body = png.subarray(pos+8,pos+8+n);
      if (type === "IHDR") ihdr = body;
      if (type === "tRNS") paletteAlpha = body;
      if (type === "IDAT") idat.push(body);
      pos += n+12;
      if (type === "IEND") break;
    }
    if (!ihdr) throw Error("no IHDR");
    const w=ihdr.readUInt32BE(0),h=ihdr.readUInt32BE(4),depth=ihdr[8],color=ihdr[9],interlace=ihdr[12];
    const channels=({0:1,2:3,3:1,4:2,6:4})[color];
    let box=null,transparent=0;
    if (depth===8 && interlace===0 && channels) {
      const data=inflateSync(Buffer.concat(idat));
      const stride=w*channels;
      let prev=Buffer.alloc(stride),curr=Buffer.alloc(stride),off=0;
      let l=w,t=h,r=-1,b=-1;
      const paeth=(a,b,c)=>{let p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;};
      for(let y=0;y<h;y++) {
        const filter=data[off++];
        for(let i=0;i<stride;i++) {
          const raw=data[off++];
          const a=i>=channels?curr[i-channels]:0;
          const b0=prev[i],c=i>=channels?prev[i-channels]:0;
          const predictor=[0,a,b0,Math.floor((a+b0)/2),paeth(a,b0,c)][filter];
          if(predictor===undefined)throw Error("unknown PNG filter "+filter);
          curr[i]=(raw+predictor)&255;
        }
        for(let x=0;x<w;x++) {
          const alpha=color===6?curr[x*channels+3]:color===4?curr[x*channels+1]:color===3?(paletteAlpha?.[curr[x]]??255):255;
          if(alpha<255)transparent++;
          if(alpha>8){l=Math.min(l,x);r=Math.max(r,x);t=Math.min(t,y);b=Math.max(b,y);}
        }
        [curr,prev]=[prev,curr];
      }
      box=r>=0?`${l},${t} → ${r},${b}`:"empty";
    }
    console.log(`${name}.png | ${w}×${h} | colorType=${color}, bitDepth=${depth} | transparent=${(100*transparent/(w*h)).toFixed(1)}% | visibleBox=${box??"not measured"}`);
    if(!([4,6].includes(color)||paletteAlpha))console.warn("WARNING: no PNG alpha information:",name);
  } catch(e) {
    errors++;
    console.error("ERROR",name,e.message);
  }
}
if(errors)process.exitCode=1;
