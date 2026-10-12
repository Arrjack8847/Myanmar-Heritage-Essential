import { chromium, webkit } from "playwright";
const base=process.env.QA_BASE_URL ?? "http://127.0.0.1:3000";
const browser=await (process.env.QA_BROWSER==="webkit"?webkit:chromium).launch({headless:true});
try {
  for(const [w,h] of [[1653,770],[390,844],[375,667]]){
    const context=await browser.newContext({viewport:{width:w,height:h},deviceScaleFactor:1,reducedMotion:"no-preference"});
    const page=await context.newPage();
    await page.goto(base,{waitUntil:"domcontentloaded",timeout:60000});
    await page.locator(".royal-heirloom").waitFor({state:"attached"});
    await page.waitForTimeout(2900);
    const runway=await page.evaluate(()=>{
      const i=document.querySelector(".heritage-story__intro");
      return {top:i.getBoundingClientRect().top+window.scrollY,scroll:i.getBoundingClientRect().height-window.innerHeight};
    });
    for(const progress of [0,.24,.38,.49,.6,.7,.78,.87,.94]){
      await page.evaluate(y=>window.scrollTo(0,y),runway.top+progress*runway.scroll);
      await page.waitForTimeout(800);
      const metrics=await page.evaluate(()=>{
        const get=(q)=>{
          const el=document.querySelector(q);
          if(!el)return null;
          const r=el.getBoundingClientRect(),s=getComputedStyle(el);
          return {top:Math.round(r.top),bottom:Math.round(r.bottom),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),height:Math.round(r.height),opacity:s.opacity,visibility:s.visibility,transform:s.transform,topStyle:s.top};
        };
        return {hero:get(".heritage-scene"),heirloom:get(".royal-heirloom"),inner:get(".royal-heirloom__card"),original:get(".heritage-scene__card"),pagodas:get(".heritage-scene__pagodas")};
      });
      console.log("HERO_DIAG "+JSON.stringify({viewport:w+"x"+h,progress,...metrics}));
      if(w===1653 && progress===.7)await page.screenshot({path:"device-qa-screenshots/hero-composition-1653.png",animations:"disabled"});
    }
    await context.close();
  }
}finally{await browser.close();}
