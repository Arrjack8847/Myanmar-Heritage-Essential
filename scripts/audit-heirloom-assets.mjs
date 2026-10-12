#!/usr/bin/env node
/**
 * JN-W01 heirloom artwork audit.
 * Inspect the REAL PNG channels in public/heritage/heirloom, not a flattened
 * labelled preview sheet. This script uses only built-in Node APIs.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

const root = path.resolve("public/heritage/heirloom");
const expected = [
  "heirloom-card-paper.png", "heirloom-card-frame.png",
  "heirloom-card-crown.png", "heirloom-card-corners.png",
  "portrait-frame-top.png", "portrait-frame-bottom.png",
  "rings-medallion.png", "name-divider-ornament.png",
  "lotus-name-accent-left.png", "lotus-name-accent-right.png",
];
const signature = Buffer.from([137,80,78,71,13,10,26,10]);
const channelsFor = {0:1,2:3,3:1,4:2,6:4};
const fail = [];

function inspect(file) {
  const data = fs.readFileSync(path.join(root, file));
  if (!data.subarray(0,8).equals(signature)) throw new Error("not PNG data");
  let ptr = 8, header, transparency, palette, idat = [];
  while (ptr + 12 <= data.length) {
    const length = data.readUInt32BE(ptr);
    const name = data.toString("ascii",ptr+4,ptr+8);
    const start = ptr+8, end = start+length;
    if (end+4 > data.length) throw new Error("invalid chunk length");
    const payload = data.subarray(start,end);
    if (name === "IHDR") header = {
      width:payload.readUInt32BE(0),height:payload.readUInt32BE(4),
      depth:payload[8],color:payload[9],compression:payload[10],
      filter:payload[11],interlace:payload[12],
    };
    if (name === "IDAT") idat.push(payload);
    if (name === "tRNS") transparency = payload;
    if (name === "PLTE") palette = payload;
    ptr = end+4;
    if (name === "IEND") break;
  }
  if (!header) throw new Error("missing IHDR");
  const {width:w,height:h,depth,color,interlace} = header;
  if (w<50 || h<50 || w>10000 || h>10000) throw new Error("unreasonable image dimensions");
  if (depth!==8 || interlace!==0 || !(color in channelsFor)) {
    throw new Error("unsupported PNG mode: depth "+depth+" color "+color+" interlace "+interlace);
  }
  if (![4,6].includes(color) && !transparency) throw new Error("no alpha channel or transparency table");
  const bpp = channelsFor[color], stride=w*bpp;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  if (raw.length !== h*(stride+1)) throw new Error("unexpected image scanline bytes");
  const previous = Buffer.alloc(stride), current = Buffer.alloc(stride);
  let offset=0, transparent=0, partial=0, opaque=0;
  let minX=w,minY=h,maxX=-1,maxY=-1;
  for (let y=0;y<h;y++) {
    const filter = raw[offset++];
    for (let i=0;i<stride;i++) {
      const value=raw[offset+i];
      const a=i>=bpp ? current[i-bpp] : 0;
      const b=previous[i];
      const c=i>=bpp ? previous[i-bpp] : 0;
      let predict=0;
      if(filter===1)predict=a;
      else if(filter===2)predict=b;
      else if(filter===3)predict=Math.floor((a+b)/2);
      else if(filter===4) {
        const p=a+b-c, da=Math.abs(p-a), db=Math.abs(p-b), dc=Math.abs(p-c);
        predict=da<=db&&da<=dc?a:db<=dc?b:c;
      } else if(filter!==0) throw new Error("invalid row filter "+filter);
      current[i]=(value+predict)&255;
    }
    offset+=stride;
    for(let x=0;x<w;x++){
      const pos=x*bpp;
      let alpha=255;
      if(color===6)alpha=current[pos+3];
      if(color===4)alpha=current[pos+1];
      if(color===3)alpha=transparency?.[current[pos]]??255;
      if(color===0 && transparency)alpha=current[pos]===transparency[1]?0:255;
      if(color===2 && transparency)alpha=(current[pos]===transparency[1]&&current[pos+1]===transparency[3]&&current[pos+2]===transparency[5])?0:255;
      if(alpha===0)transparent++;
      else if(alpha===255)opaque++;
      else partial++;
      if(alpha>10) {
        minX=Math.min(minX,x);maxX=Math.max(maxX,x);
        minY=Math.min(minY,y);maxY=Math.max(maxY,y);
      }
    }
    current.copy(previous);
  }
  const total=w*h, bbox=maxX<minX?null:[minX,minY,maxX,maxY];
  if(!transparent&&!partial)throw new Error("all pixels opaque (background is not transparent)");
  if(opaque+partial===0)throw new Error("image has no visible component");
  const margins=bbox?[minX,minY,w-1-maxX,h-1-maxY]:null;
  const note=(bbox && (
    (margins[0]+margins[2])/w>0.16||
    (margins[1]+margins[3])/h>0.16))?
      "REVIEW_CROP": "OK";
  return {name:file,dimensions:w+"x"+h,format:"PNG",colorType:color,
    transparentPct:+(100*transparent/total).toFixed(2),
    semitransparentPct:+(100*partial/total).toFixed(2),
    bounds:bbox,margins,note};
}
const audit=[];
for(const filename of expected){
  try {audit.push(inspect(filename));}
  catch(err){fail.push(filename+": "+err.message);}
}
console.log("JN-W01 10-ASSET HEIRLOOM PNG AUDIT");
for (const item of audit) console.log(JSON.stringify(item));
if(fail.length) {
  console.error("ASSET AUDIT FAILED:\n"+fail.map(x=>"- "+x).join("\n"));
  process.exitCode=1;
}else console.log("PASS: all ten independent files exist and contain genuine transparency.");
