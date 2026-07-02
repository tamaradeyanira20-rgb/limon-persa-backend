<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CaféYield</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;700;900&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
<script>
const { createClient } = supabase;
const sb = createClient(
  'https://xwhvwoncnvbdtaztrgvl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3aHZ3b25jbnZiZHRhenRyZ3ZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3OTU0ODMsImV4cCI6MjA5NjM3MTQ4M30.ZN92gm_IBalT3MadPILMwLusUgSdZ6dlGfXc_cRxWsk'
);

// ══════════════════════════════════════════
//  CÓDIGO MAESTRO (puerta de entrada)
//  Cualquier usuario nuevo puede registrarse
//  con este código aunque no tenga un invitador
// ══════════════════════════════════════════
const MASTER_CODE = 'CAFEYIELD';
</script>
<style>
:root{
  --ink:#0d0500;--dark:#2a1200;--roast:#3a1600;
  --caramel:#c8762a;--gold:#e8a93c;
  --cream:#f4e4c4;--latte:#c9956a;
  --green:#3d6b4a;--glow:#5da06e;
  --shadow:rgba(13,5,0,.6);--bd:1px solid rgba(200,118,42,.2);--r:14px;
}
*{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{font-family:'Outfit',sans-serif;background:var(--ink);color:var(--cream);min-height:100vh;overflow-x:hidden}
.hide{display:none!important}
/* AUTH */
#authScreen{min-height:100vh;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse 120% 80% at 10% 95%,rgba(74,30,0,.9),transparent 55%),
  radial-gradient(ellipse 70% 60% at 90% 5%,rgba(200,118,42,.1),transparent 50%),var(--ink);padding:20px}
.auth-wrap{width:100%;max-width:440px}
.auth-logo{text-align:center;margin-bottom:24px}
.auth-logo h1{font-family:'Cormorant Garamond',serif;font-size:52px;font-weight:900;color:var(--gold);letter-spacing:-1px;line-height:1}
.auth-logo p{font-size:11px;color:var(--latte);letter-spacing:4px;text-transform:uppercase;margin-top:4px}
.auth-card{background:var(--dark);border:var(--bd);border-radius:22px;padding:28px 30px;
  box-shadow:0 28px 64px var(--shadow),inset 0 1px 0 rgba(200,118,42,.2)}
.atabs{display:flex;background:rgba(255,255,255,.05);border-radius:10px;padding:4px;margin-bottom:20px;gap:3px}
.atab{flex:1;padding:10px;background:transparent;border:none;color:var(--latte);font-family:'Outfit',sans-serif;font-size:14px;font-weight:600;cursor:pointer;border-radius:8px;transition:.2s}
.atab.on{background:var(--caramel);color:var(--ink)}
.fi{margin-bottom:13px}
.fi label{display:block;font-size:11px;font-weight:600;color:var(--latte);letter-spacing:1px;text-transform:uppercase;margin-bottom:5px}
.fi input,.fi select{width:100%;padding:12px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(200,118,42,.22);border-radius:10px;color:var(--cream);font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:.2s}
.fi input:focus,.fi select:focus{border-color:var(--caramel);background:rgba(200,118,42,.07)}
.fi input::placeholder{color:rgba(201,149,106,.35)}
.fi select{background:#2a1200}
.fi2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.cap-row{display:flex;align-items:center;gap:12px;padding:12px 14px;background:rgba(255,255,255,.05);border:1px solid rgba(200,118,42,.22);border-radius:10px;margin-bottom:13px}
.cap{width:22px;height:22px;border:2px solid var(--caramel);border-radius:4px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:.2s;flex-shrink:0}
.cap.on{background:var(--green);border-color:var(--green)}
.cap.on::after{content:'✓';color:#fff;font-size:13px;font-weight:700}
.ref-hint{background:rgba(200,118,42,.09);border:1px solid rgba(200,118,42,.25);border-radius:10px;padding:10px 13px;font-size:12px;color:var(--latte);margin-bottom:13px}
.ref-hint b{color:var(--gold)}
/* Nota del código maestro */
.master-hint{background:rgba(61,107,74,.12);border:1px solid rgba(93,160,110,.3);border-radius:10px;padding:11px 13px;font-size:12px;color:var(--latte);margin-bottom:13px;display:flex;align-items:center;gap:8px}
.master-hint b{color:var(--glow)}
.btn{width:100%;padding:13px;border:none;border-radius:10px;font-family:'Outfit',sans-serif;font-size:15px;font-weight:700;cursor:pointer;transition:.25s}
.btn-gold{background:linear-gradient(135deg,var(--caramel),var(--gold));color:var(--ink)}
.btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(200,118,42,.4)}
.btn-green{background:linear-gradient(135deg,var(--green),var(--glow));color:#fff}
.btn-green:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(61,107,74,.35)}
.btn-sm{padding:7px 14px;font-size:12px;width:auto;border-radius:8px}
.btn-outline{background:transparent;border:1px solid rgba(200,118,42,.35);color:var(--latte)}
/* APP */
#appScreen{display:none;flex-direction:column;min-height:100vh}
#appScreen.on{display:flex}
.topbar{background:var(--dark);border-bottom:var(--bd);display:flex;align-items:center;justify-content:space-between;padding:0 18px;height:58px;flex-shrink:0;position:sticky;top:0;z-index:50;box-shadow:0 3px 16px rgba(0,0,0,.4)}
.tb-brand{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:900;color:var(--gold)}
.tb-brand span{color:var(--latte);font-weight:400}
.tb-right{display:flex;align-items:center;gap:8px}
.tb-bal{background:rgba(200,118,42,.15);border:var(--bd);border-radius:8px;padding:5px 12px;color:var(--gold);font-weight:700;font-size:13px}
.tb-user{font-size:12px;color:var(--latte)}
.tb-gear{background:transparent;border:1px solid rgba(200,118,42,.3);border-radius:7px;padding:5px 9px;font-size:17px;cursor:pointer;transition:.2s;display:flex;align-items:center}
.tb-gear:hover{background:rgba(200,118,42,.12);border-color:var(--caramel)}
.tb-out{background:transparent;border:1px solid rgba(200,118,42,.3);border-radius:7px;padding:5px 10px;color:var(--latte);cursor:pointer;font-size:12px;transition:.2s}
.tb-out:hover{border-color:var(--caramel);color:var(--caramel)}
.scroll-area{flex:1;overflow-y:auto;padding-bottom:20px}
.bottom-nav{display:none}
.bn-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;background:transparent;border:none;color:var(--latte);font-family:'Outfit',sans-serif;font-size:11px;font-weight:500;transition:.2s;padding:0;height:72px;min-width:0;touch-action:manipulation;position:relative;}
.bn-item:hover{color:var(--cream);background:rgba(200,118,42,.06)}
.bn-item.on{color:var(--gold);background:rgba(200,118,42,.1)}
.bn-item .ico{font-size:22px;line-height:1}
.bn-item .lbl{font-size:10px;font-weight:600}
.bn-item.on .lbl{color:var(--gold)}
/* SIDEBAR */
.sidebar-toggle{background:transparent;border:none;color:var(--cream);font-size:26px;cursor:pointer;padding:6px;line-height:1;display:flex;align-items:center;touch-action:manipulation}
.sidebar-overlay{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100;display:none;backdrop-filter:blur(3px)}
.sidebar-overlay.on{display:block}
.sidebar{position:fixed;left:0;top:0;bottom:0;width:260px;background:var(--dark);border-right:var(--bd);z-index:101;transform:translateX(-100%);transition:transform .28s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:6px 0 32px rgba(0,0,0,.5)}
.sidebar.on{transform:translateX(0)}
.sb-head{padding:24px 20px 18px;border-bottom:var(--bd)}
.sb-brand{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:900;color:var(--gold);line-height:1}
.sb-user{font-size:12px;color:var(--latte);margin-top:4px}
.sb-bal{display:inline-flex;align-items:center;gap:5px;background:rgba(200,118,42,.15);border:var(--bd);border-radius:8px;padding:5px 11px;color:var(--gold);font-weight:700;font-size:13px;margin-top:10px}
.sb-nav{flex:1;padding:14px 10px;display:flex;flex-direction:column;gap:4px}
.sb-item{display:flex;align-items:center;gap:14px;padding:13px 14px;border-radius:11px;cursor:pointer;transition:.18s;border:none;background:transparent;color:var(--latte);font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;width:100%;text-align:left;touch-action:manipulation}
.sb-item:active{background:rgba(200,118,42,.15)}
.sb-item.on{background:rgba(200,118,42,.12);color:var(--gold);font-weight:700}
.sb-item .si{font-size:20px;width:28px;text-align:center;flex-shrink:0}
.sb-foot{padding:14px 10px;border-top:var(--bd)}
.sb-logout{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:11px;cursor:pointer;background:transparent;border:none;color:#e07060;font-family:'Outfit',sans-serif;font-size:14px;font-weight:500;width:100%;touch-action:manipulation}
.sb-logout:active{background:rgba(192,58,43,.1)}
.page{display:none;padding:20px 18px}.page.on{display:block}
.ph{margin-bottom:20px}
.ph h2{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:900;color:var(--gold);line-height:1}
.ph p{font-size:13px;color:var(--latte);margin-top:4px}
.card{background:var(--dark);border:var(--bd);border-radius:var(--r);padding:18px;margin-bottom:14px}
.card h3{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:700;color:var(--cream);margin-bottom:14px}
.stats-row{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:14px}
.stats-row.s3{grid-template-columns:repeat(3,1fr)}
.stat{text-align:center;padding:13px 8px;background:rgba(255,255,255,.04);border:var(--bd);border-radius:11px}
.stat .v{font-family:'Cormorant Garamond',serif;font-size:19px;font-weight:700;color:var(--gold)}
.stat .l{font-size:10px;color:var(--latte);margin-top:2px;text-transform:uppercase;letter-spacing:.7px}
.w-hero{background:linear-gradient(120deg,#3d1800,#1a0800 55%,#2a1200);border:var(--bd);border-radius:var(--r);padding:22px 20px;margin-bottom:14px;position:relative;overflow:hidden}
.w-hero-beans{position:absolute;inset:0;display:grid;grid-template-columns:repeat(16,1fr);grid-template-rows:repeat(5,1fr);gap:3px;padding:4px;opacity:.1;pointer-events:none}
.hb{background:#4a1e00;border-radius:50%;transform:rotate(calc(var(--r)*1deg))}
.w-hero h2{position:relative;font-family:'Cormorant Garamond',serif;font-size:30px;font-weight:900;color:var(--gold);line-height:1.05}
.w-hero p{position:relative;font-size:12px;color:var(--latte);margin-top:5px;line-height:1.5}
.acard{background:rgba(255,255,255,.03);border:var(--bd);border-radius:12px;padding:14px;margin-bottom:10px}
.acard-top{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.acard-icon{font-size:28px;flex-shrink:0}
.acard-info{flex:1}
.acard-name{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:var(--gold)}
.acard-sub{font-size:12px;color:var(--latte);margin-top:2px}
.acard-timer{font-size:12px;margin-top:6px;padding:8px 12px;background:rgba(255,255,255,.03);border-radius:9px;border:var(--bd)}
.yield-btn{width:100%;padding:11px;border:none;border-radius:9px;font-family:'Outfit',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:.2s;margin-top:8px}
.yb-ready{background:linear-gradient(135deg,var(--green),var(--glow));color:#fff;animation:gp 2s infinite}
.yb-wait{background:rgba(255,255,255,.06);color:var(--latte);cursor:not-allowed;border:var(--bd)}
.yb-done{background:rgba(255,255,255,.03);color:rgba(201,149,106,.4);cursor:default;border:var(--bd)}
@keyframes gp{0%,100%{box-shadow:0 0 0 0 rgba(93,160,110,.4)}50%{box-shadow:0 0 0 8px transparent}}
.pgrid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pcard{background:var(--dark);border:var(--bd);border-radius:var(--r);overflow:hidden;transition:.25s}
.pcard:hover{transform:translateY(-3px);box-shadow:0 12px 36px var(--shadow)}
.pimg{height:110px;position:relative;background:linear-gradient(135deg,#3d1800,#1a0800);display:flex;align-items:center;justify-content:center;overflow:hidden}
.pbeans{position:absolute;inset:0;display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(4,1fr);gap:2px;padding:4px;opacity:.45}
.pb{border-radius:50%;transform:rotate(calc(var(--r)*1deg));box-shadow:inset 0 1px 3px rgba(0,0,0,.5)}
.pbadge{position:absolute;top:7px;right:7px;background:var(--gold);color:var(--ink);font-size:9px;font-weight:700;padding:2px 8px;border-radius:20px}
.pico{position:relative;font-size:30px;filter:drop-shadow(0 3px 6px rgba(0,0,0,.6))}
.pbody{padding:12px}
.pname{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:700;color:var(--cream);margin-bottom:2px}
.pdesc{font-size:10px;color:var(--latte);margin-bottom:7px;line-height:1.4}
.ybadge{display:inline-block;background:linear-gradient(135deg,var(--green),var(--glow));color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:6px;margin-bottom:6px}
.pprice{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:700;color:var(--gold)}
.pprice span{font-size:10px;font-weight:400;color:var(--latte)}
.pinvest{width:100%;padding:9px;background:linear-gradient(135deg,var(--caramel),var(--gold));border:none;border-radius:8px;color:var(--ink);font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;cursor:pointer;margin-top:8px;transition:.2s}
.pinvest:hover{transform:translateY(-1px);box-shadow:0 4px 14px rgba(200,118,42,.4)}
.ref-link-box{background:rgba(255,255,255,.04);border:var(--bd);border-radius:11px;padding:12px 14px;margin-bottom:12px}
.ref-link-row{display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap}
.ref-link-inp{flex:1;min-width:140px;padding:9px 12px;background:rgba(255,255,255,.05);border:var(--bd);border-radius:8px;color:var(--latte);font-size:11px;font-family:monospace;outline:none}
.btn-copy{padding:9px 14px;background:var(--caramel);border:none;border-radius:8px;color:var(--ink);font-weight:700;cursor:pointer;font-size:12px;transition:.2s;white-space:nowrap}
.btn-copy:hover{background:var(--gold)}
.code-pill{display:inline-flex;align-items:center;gap:6px;background:rgba(232,169,60,.12);border:1px solid rgba(232,169,60,.25);border-radius:8px;padding:6px 12px;font-size:13px;color:var(--gold);font-weight:700}
.qr-section{display:flex;gap:16px;align-items:flex-start}
.qr-box{background:#fff;border-radius:9px;padding:9px;flex-shrink:0}
.qr-side h4{font-size:13px;font-weight:600;color:var(--cream);margin-bottom:5px}
.qr-side p{font-size:11px;color:var(--latte);line-height:1.6}
.lv-list{display:flex;flex-direction:column;gap:9px}
.lv{display:flex;align-items:center;gap:11px;padding:12px 13px;background:rgba(255,255,255,.03);border:var(--bd);border-radius:11px}
.lv-num{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;flex-shrink:0}
.n1{background:linear-gradient(135deg,var(--gold),var(--caramel));color:var(--ink)}
.n2{background:linear-gradient(135deg,var(--latte),#9a6840);color:var(--ink)}
.n3{background:linear-gradient(135deg,#7a5830,#5a3818);color:var(--cream)}
.lv-txt{flex:1}.lv-txt h4{font-size:12px;color:var(--cream);font-weight:600;margin-bottom:2px}
.lv-txt p{font-size:11px;color:var(--latte);line-height:1.4}
.lv-pct{font-family:'Cormorant Garamond',serif;font-size:22px;font-weight:700}
.g25{color:var(--gold)}.g5{color:var(--latte)}.g1{color:#9a7850}
.tree-item{display:flex;align-items:center;gap:8px;padding:11px 13px;border:var(--bd);border-radius:11px;font-size:12px;cursor:pointer;transition:.2s;margin-bottom:6px}
.tree-item:hover{background:rgba(200,118,42,.08)}
.tree-item.active-node{border-color:rgba(93,160,110,.35);background:rgba(61,107,74,.07)}
.tree-item.inactive-node{opacity:.7;background:rgba(255,255,255,.02)}
.tree-ch{padding-left:14px;border-left:2px solid rgba(200,118,42,.18);margin-left:11px;display:none}
.tree-ch.on{display:block;margin-top:4px}
.ntag{display:inline-block;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:700}
.nt1{background:rgba(232,169,60,.15);color:var(--gold)}.nt2{background:rgba(201,149,106,.15);color:var(--latte)}.nt3{background:rgba(90,56,24,.4);color:#9a7850}
.etxt{font-weight:600;font-size:11px;color:var(--glow);white-space:nowrap}
.sbadge{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:20px;font-size:10px;font-weight:700;white-space:nowrap}
.sb-active{background:rgba(61,107,74,.25);color:var(--glow);border:1px solid rgba(93,160,110,.3)}
.sb-inactive{background:rgba(255,255,255,.06);color:var(--latte);border:1px solid rgba(201,149,106,.2)}
.uico{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.ico-on{background:rgba(61,107,74,.2)}.ico-off{background:rgba(255,255,255,.06)}
.comm-detail{font-size:11px;color:var(--latte);margin-top:3px}
.bank-tabs{display:flex;gap:3px;background:rgba(255,255,255,.04);border-radius:10px;padding:4px;margin-bottom:18px;overflow-x:auto}
.btab{flex-shrink:0;padding:9px 16px;background:transparent;border:none;color:var(--latte);font-family:'Outfit',sans-serif;font-size:13px;font-weight:500;cursor:pointer;border-radius:8px;transition:.2s;white-space:nowrap}
.btab.on{background:var(--caramel);color:var(--ink);font-weight:700}
.bpanel{display:none}.bpanel.on{display:block}
.bal-hero{background:linear-gradient(135deg,#3d1800,#1a0800);border:var(--bd);border-radius:13px;padding:20px;text-align:center;margin-bottom:14px}
.bal-hero .lbl{font-size:11px;color:var(--latte);text-transform:uppercase;letter-spacing:1.5px}
.bal-hero .amt{font-family:'Cormorant Garamond',serif;font-size:44px;font-weight:900;color:var(--gold);line-height:1.1;margin:5px 0}
.bal-hero .sub{font-size:12px;color:var(--latte)}.bal-hero .sub b{color:var(--glow)}
.tx{display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid rgba(200,118,42,.08)}
.tx:last-child{border-bottom:none}
.tx-ic{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.tx-in{background:rgba(61,107,74,.2)}.tx-out{background:rgba(192,58,43,.2)}
.tx-i{flex:1}.tx-i .t{font-size:12px;color:var(--cream);font-weight:500}.tx-i .d{font-size:10px;color:var(--latte);margin-top:1px}
.tx-a{font-weight:700;font-size:12px;white-space:nowrap}.pos{color:var(--glow)}.neg{color:#e07060}
.bsaved{background:rgba(200,118,42,.07);border:1px solid rgba(200,118,42,.2);border-radius:11px;padding:13px;margin-bottom:14px}
.bsaved-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:9px}
.bsaved-head h4{font-size:11px;font-weight:600;color:var(--latte);text-transform:uppercase;letter-spacing:.8px}
.brow{display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid rgba(200,118,42,.08);font-size:12px}
.brow:last-child{border-bottom:none}.brow .k{color:var(--latte)}.brow .v{color:var(--cream);font-weight:500}
.info-note{background:rgba(232,169,60,.07);border:1px solid rgba(232,169,60,.18);border-radius:9px;padding:11px 13px;font-size:11px;color:var(--latte);line-height:1.6;margin-top:11px}
.info-note b{color:var(--cream)}
.dest-info{background:rgba(255,255,255,.04);border:var(--bd);border-radius:12px;padding:14px;margin-bottom:11px}
.dest-info h4{font-size:11px;font-weight:600;color:var(--latte);text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px}
.stabs{display:flex;background:rgba(255,255,255,.05);border-radius:10px;padding:3px;gap:3px;margin-bottom:18px}
.stab{flex:1;padding:9px 4px;background:transparent;border:none;color:var(--latte);font-family:'Outfit',sans-serif;font-size:12px;font-weight:600;cursor:pointer;border-radius:8px;transition:.2s;text-align:center;white-space:nowrap}
.stab.on{background:var(--caramel);color:var(--ink)}
.spanel{display:none}.spanel.on{display:block}
.sfield{margin-bottom:13px}
.sfield label{display:block;font-size:11px;font-weight:600;color:var(--latte);letter-spacing:1px;text-transform:uppercase;margin-bottom:5px}
.sfield input,.sfield select{width:100%;padding:11px 13px;background:rgba(255,255,255,.05);border:1px solid rgba(200,118,42,.22);border-radius:10px;color:var(--cream);font-family:'Outfit',sans-serif;font-size:14px;outline:none;transition:.2s}
.sfield input:focus,.sfield select:focus{border-color:var(--caramel);background:rgba(200,118,42,.07)}
.sfield input::placeholder{color:rgba(201,149,106,.35)}
.sfield select{background:#2a1200}
.pavatar{width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,var(--caramel),var(--gold));display:flex;align-items:center;justify-content:center;font-size:26px;margin:0 auto 14px;box-shadow:0 4px 16px rgba(200,118,42,.3)}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(5px);z-index:200;display:none;align-items:flex-end;justify-content:center;padding:0}
.overlay.on{display:flex}
.modal{background:var(--dark);border:var(--bd);border-radius:22px 22px 0 0;padding:28px 24px 36px;width:100%;max-width:480px;box-shadow:0 -24px 60px var(--shadow);position:relative}
.mx{position:absolute;top:13px;right:16px;background:transparent;border:none;color:var(--latte);font-size:22px;cursor:pointer;line-height:1}
.mx:hover{color:var(--cream)}
.modal h3{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:700;color:var(--gold);margin-bottom:16px}
.est-box{background:rgba(61,107,74,.1);border:1px solid rgba(93,160,110,.2);border-radius:9px;padding:10px 13px;margin:10px 0;font-size:13px;color:var(--latte)}
.est-box b{color:var(--glow)}
.load-wrap{position:fixed;inset:0;background:rgba(13,5,0,.85);z-index:400;display:none;align-items:center;justify-content:center;flex-direction:column;gap:14px}
.load-wrap.on{display:flex}
.spinner{width:40px;height:40px;border:3px solid rgba(200,118,42,.2);border-top-color:var(--caramel);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(60px);background:var(--dark);border:var(--bd);border-radius:11px;padding:11px 20px;color:var(--cream);font-size:13px;box-shadow:0 8px 30px var(--shadow);opacity:0;transition:.3s cubic-bezier(.34,1.56,.64,1);z-index:999;white-space:nowrap;max-width:90vw}
.toast.on{transform:translateX(-50%) translateY(0);opacity:1}
.empty{text-align:center;padding:24px 16px;color:var(--latte);font-size:13px;line-height:1.6}
@media(min-width:600px){.pgrid{grid-template-columns:repeat(3,1fr)}.page{padding:24px}.overlay{align-items:center;padding:20px}.modal{border-radius:22px;max-width:420px}}
</style>
</head>
<body>

<div class="load-wrap on" id="loader">
  <div class="spinner"></div>
  <div style="font-size:13px;color:var(--latte)">Cargando...</div>
</div>

<!-- AUTH -->
<div id="authScreen" style="display:none">
<div class="auth-wrap">
  <div class="auth-logo"><img src="https://i.imgur.com/05LrBMO.png" alt="CaféYield" style="width:100%;border-radius:14px;margin-bottom:4px;box-shadow:0 8px 28px rgba(0,0,0,.55);display:block"></div>
  <div class="auth-card">
    <div class="atabs">
      <button class="atab on" onclick="switchAuth('login')">Iniciar Sesión</button>
      <button class="atab" onclick="switchAuth('register')">Registrarse</button>
    </div>
    <div id="loginF">
      <div class="fi"><label>Teléfono</label><input type="tel" id="lPhone" placeholder="+52 55 0000 0000"></div>
      <div class="fi"><label>Contraseña</label><input type="password" id="lPass" placeholder="••••••••"></div>
      <div class="cap-row"><div class="cap" id="lCap" onclick="toggleCap('lCap')"></div><span style="font-size:13px;color:var(--latte)">No soy un robot</span><span style="margin-left:auto;font-size:20px">🔐</span></div>
      <button class="btn btn-gold" onclick="doLogin()">Iniciar Sesión</button>
    </div>
    <div id="registerF" class="hide">
      <!-- Banner: invitado por usuario real -->
      <div id="refBanner" class="ref-hint hide">Invitado por: <b id="refByName">—</b> · Código: <b id="refByCode">—</b></div>
      <!-- Banner: código maestro -->
      <div id="masterBanner" class="master-hint hide">☕ <span>Usando código oficial <b>CaféYield</b> — válido para primeros registros</span></div>
      <div class="fi2">
        <div class="fi"><label>Nombre</label><input type="text" id="rName" placeholder="Nombre"></div>
        <div class="fi"><label>Apellido</label><input type="text" id="rLast" placeholder="Apellido"></div>
      </div>
      <div class="fi"><label>Teléfono</label><input type="tel" id="rPhone" placeholder="+52 55 0000 0000"></div>
      <div class="fi"><label>Contraseña</label><input type="password" id="rPass" placeholder="Mínimo 8 caracteres"></div>
      <div class="fi">
        <label>Código de Referido <span style="color:var(--glow);font-size:10px">· Usa <b>CAFEYIELD</b> si no tienes uno</span></label>
        <input type="text" id="rRef" placeholder="Código de quien te invitó (ej. CAFEYIELD)" oninput="checkRef()">
      </div>
      <div class="cap-row"><div class="cap" id="rCap" onclick="toggleCap('rCap')"></div><span style="font-size:13px;color:var(--latte)">No soy un robot</span><span style="margin-left:auto;font-size:20px">🔐</span></div>
      <button class="btn btn-green" onclick="doRegister()">Crear Cuenta</button>
    </div>
  </div>
</div>
</div>

<!-- SIDEBAR OVERLAY -->
<div class="sidebar-overlay" id="sbOverlay" onclick="closeSidebar()"></div>
<!-- SIDEBAR -->
<div class="sidebar" id="sidebar">
  <div class="sb-head">
    <div class="sb-brand">☕ CaféYield</div>
    <div class="sb-user" id="sbUser">—</div>
    <div class="sb-bal">MX$<span id="sbBal">0.00</span></div>
  </div>
  <div class="sb-nav">
    <div class="sb-item on" id="sbn-inicio" onclick="goPage('inicio');closeSidebar()"><span class="si"><img src="https://i.imgur.com/9wOiP9k.png" style="width:22px;height:22px;object-fit:contain;vertical-align:middle"></span>Inicio</div>
    <div class="sb-item" id="sbn-cafe" onclick="goPage('cafe');closeSidebar()"><span class="si"><img src="https://i.imgur.com/wqxEsmC.png" style="width:22px;height:22px;object-fit:contain;vertical-align:middle"></span>Café</div>
    <div class="sb-item" id="sbn-referidos" onclick="goPage('referidos');closeSidebar()"><span class="si"><img src="https://i.imgur.com/ZhcXhKM.png" style="width:22px;height:22px;object-fit:contain;vertical-align:middle"></span>Referidos</div>
    <div class="sb-item" id="sbn-banco" onclick="goPage('banco');closeSidebar()"><span class="si"><img src="https://i.imgur.com/9wTfGmS.png" style="width:22px;height:22px;object-fit:contain;vertical-align:middle"></span>Banco</div>
  </div>
  <div class="sb-foot">
    <div class="sb-item" onclick="openSettings();closeSidebar()"><span class="si">⚙️</span>Configuración</div>
    <div class="sb-logout" onclick="doLogout()"><span class="si">🚪</span>Cerrar Sesión</div>
  </div>
</div>

<div id="appScreen">
  <div class="topbar">
    <button class="sidebar-toggle" onclick="openSidebar()">☰</button>
    <div class="tb-brand">☕ Café<span>Yield</span></div>
    <div class="tb-right">
      <div class="tb-bal">MX$<span id="tbBal">0.00</span></div>
      <span class="tb-user" id="tbUser">—</span>
      <button class="tb-gear" onclick="openSettings()">⚙️</button>
    </div>
  </div>

  <div class="scroll-area">
    <!-- INICIO -->
    <div class="page on" id="page-inicio">
      <img src="https://i.imgur.com/05LrBMO.png" alt="CaféYield" style="width:100%;border-radius:14px;margin-bottom:14px;box-shadow:0 6px 24px rgba(0,0,0,.5);display:block;max-height:160px;object-fit:cover;object-position:center 35%">
      <div class="w-hero"><div class="w-hero-beans" id="heroBeans"></div>
        <h2>Hola, <span id="heroName" style="color:var(--latte)">Inversionista</span> ☕</h2>
        <p>Tu rendimiento se cobra cada 24 horas desde tu primera compra</p>
      </div>
      <div class="stats-row">
        <div class="stat"><div class="v" id="hsBal">$0</div><div class="l">Balance</div></div>
        <div class="stat"><div class="v" id="hsInv">$0</div><div class="l">Invertido</div></div>
        <div class="stat"><div class="v" id="hsRef">0</div><div class="l">Referidos</div></div>
        <div class="stat"><div class="v" id="hsEarn">$0</div><div class="l">Ganado</div></div>
      </div>
      <div class="card"><h3>📦 Productos Activos</h3><div id="activeCards"><div class="empty">Ve a 🫘 Café e invierte para empezar.</div></div></div>
    </div>

    <!-- CAFÉ -->
    <div class="page" id="page-cafe">
      <img src="https://i.imgur.com/05LrBMO.png" alt="CaféYield" style="width:100%;border-radius:14px;margin-bottom:14px;box-shadow:0 6px 24px rgba(0,0,0,.5);display:block;max-height:140px;object-fit:cover;object-position:center 40%">
      <div class="ph"><h2>🫘 Café</h2><p>5 productos · rendimiento diario cobrable cada 24h</p></div>
      <div class="pgrid" id="prodGrid"><div class="empty">Cargando...</div></div>
    </div>

    <!-- REFERIDOS -->
    <div class="page" id="page-referidos">
      <div class="ph"><h2>🤝 Referidos</h2><p>Gana comisiones cuando tu red invierte</p></div>
      <div class="card"><h3>🔗 Mi Enlace y QR</h3>
        <div class="ref-link-box">
          <div class="ref-link-row"><input class="ref-link-inp" id="refLinkInp" readonly><button class="btn-copy" onclick="copyLink()">Copiar</button></div>
          <div style="display:flex;align-items:center;gap:8px"><span style="font-size:12px;color:var(--latte)">Tu código:</span><span class="code-pill" id="refCode">—</span></div>
        </div>
        <div class="qr-section">
          <div class="qr-box"><div id="qrDiv" style="width:100px;height:100px"></div></div>
          <div class="qr-side" style="flex:1"><h4>Comparte y gana automáticamente</h4><p>Cuando alguien se registre con tu código e invierta, recibirás la comisión al instante.</p></div>
        </div>
      </div>
      <div class="card"><h3>💰 Cómo Funciona</h3>
        <div class="lv-list">
          <div class="lv"><div class="lv-num n1">N1</div><div class="lv-txt"><h4>Tú invitas a A</h4><p>A compra → tú recibes <b>25%</b> de esa compra</p></div><div class="lv-pct g25">25%</div></div>
          <div class="lv"><div class="lv-num n2">N2</div><div class="lv-txt"><h4>A invita a B</h4><p>B compra → tú recibes <b>5%</b> de esa compra</p></div><div class="lv-pct g5">5%</div></div>
          <div class="lv"><div class="lv-num n3">N3</div><div class="lv-txt"><h4>B invita a C</h4><p>C compra → tú recibes <b>1%</b> de esa compra</p></div><div class="lv-pct g1">1%</div></div>
        </div>
      </div>
      <div class="card"><h3>🌳 Mi Red</h3>
        <div class="stats-row s3" style="margin-bottom:12px">
          <div class="stat"><div class="v" id="t1">0</div><div class="l">Nivel 1</div></div>
          <div class="stat"><div class="v" id="t2">0</div><div class="l">Nivel 2</div></div>
          <div class="stat"><div class="v" id="t3">0</div><div class="l">Nivel 3</div></div>
        </div>
        <div class="stat" style="margin-bottom:14px"><div class="v" id="tEarn">$0.00</div><div class="l">Total ganado en referidos</div></div>
        <div id="refTree"><div class="empty" style="font-size:12px">Comparte tu enlace para ver tu red</div></div>
      </div>
    </div>

    <!-- BANCO -->
    <div class="page" id="page-banco">
      <div class="ph"><h2>🏦 Banco</h2><p>Deposita, retira y consulta tu historial</p></div>
      <div class="bank-tabs">
        <button class="btab on" onclick="showBank('saldo',this)">💵 Saldo</button>
        <button class="btab" onclick="showBank('depositar',this)">⬆️ Depositar</button>
        <button class="btab" onclick="showBank('retirar',this)">⬇️ Retirar</button>
        <button class="btab" onclick="showBank('historial',this)">📋 Historial</button>
      </div>
      <div class="bpanel on" id="bp-saldo">
        <div class="bal-hero"><div class="lbl">Saldo Disponible</div><div class="amt">MX$<span id="wBal">0.00</span></div><div class="sub">Rendimientos: <b id="wEarned">$0.00</b></div></div>
        <div class="stats-row"><div class="stat"><div class="v" id="wInv">$0</div><div class="l">Invertido</div></div><div class="stat"><div class="v" id="wRef">$0</div><div class="l">Com. Referidos</div></div></div>
      </div>
      <div class="bpanel" id="bp-depositar">
        <div class="dest-info"><h4>📨 Deposita a esta cuenta CaféYield</h4>
          <div class="brow"><span class="k">Banco</span><span class="v">Banorte</span></div>
          <div class="brow"><span class="k">Beneficiario</span><span class="v">CaféYield S.A. de C.V.</span></div>
          <div class="brow"><span class="k">CLABE</span><span class="v" style="font-family:monospace;font-size:11px">072691004567891234</span></div>
          <div class="brow"><span class="k">Cuenta</span><span class="v" style="font-family:monospace">1045678912</span></div>
          <div class="brow"><span class="k">Concepto</span><span class="v">Tu número de teléfono</span></div>
        </div>
        <div class="card" style="margin-bottom:0"><h3>📝 Registrar Depósito</h3>
          <div class="fi"><label>Monto (MXN)</label><input type="number" id="dAmt" placeholder="Ej. 500.00"></div>
          <div class="fi"><label>Banco de Origen</label><select id="dBank"><option value="">Seleccionar...</option><option>BBVA México</option><option>Santander</option><option>Banamex / Citibanamex</option><option>Banorte</option><option>HSBC</option><option>Scotiabank</option><option>Otro</option></select></div>
          <div class="fi"><label>Nombre del Titular</label><input type="text" id="dName" placeholder="Nombre completo"></div>
          <div class="fi"><label>CLABE / Número de Cuenta</label><input type="text" id="dClabe" placeholder="18 dígitos CLABE"></div>
          <div class="fi"><label>Folio / Referencia</label><input type="text" id="dFolio" placeholder="Número de folio"></div>
          <button class="btn btn-green" onclick="doDeposit()">✅ Confirmar Depósito</button>
          <div class="info-note">⚠️ Registra el folio después de transferir. Acreditado en <b>máx. 30 min</b> días hábiles.</div>
        </div>
      </div>
      <div class="bpanel" id="bp-retirar">
        <div class="card" style="margin-bottom:0"><h3>⬇️ Solicitar Retiro</h3>
          <div class="bsaved hide" id="savedBankBox"><div class="bsaved-head"><h4>🏦 Cuenta Guardada</h4><button class="btn btn-sm btn-outline" onclick="editBank()">Editar</button></div><div id="savedRows"></div></div>
          <div id="bankFormBox">
            <div class="fi"><label>Banco Destino</label><select id="wBank"><option value="">Seleccionar...</option><option>BBVA México</option><option>Santander</option><option>Banamex / Citibanamex</option><option>Banorte</option><option>HSBC</option><option>Scotiabank</option><option>Otro</option></select></div>
            <div class="fi"><label>Nombre del Titular</label><input type="text" id="wName" placeholder="Nombre completo"></div>
            <div class="fi"><label>CLABE Interbancaria</label><input type="text" id="wClabe" placeholder="18 dígitos" maxlength="18"></div>
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:13px"><input type="checkbox" id="saveBank" style="accent-color:var(--caramel);width:16px;height:16px"><label for="saveBank" style="font-size:12px;color:var(--latte);cursor:pointer">Guardar cuenta para próximos retiros</label></div>
          </div>
          <div class="bal-hero" style="padding:14px;margin-bottom:14px"><div class="lbl">Disponible</div><div class="amt" style="font-size:34px">MX$<span id="wAvail">0.00</span></div></div>
          <div class="fi"><label>Monto (mín. MX$500)</label><input type="number" id="wAmt" placeholder="50.00"></div>
          <button class="btn btn-gold" onclick="doWithdraw()">💸 Solicitar Retiro</button>
          <div id="wdrWindowBanner" style="margin-top:12px"></div>
          <div class="info-note" style="margin-top:8px">⏰ Procesado en <b>24–48h hábiles</b>. Mínimo <b>MX$500</b>.<br>⏱ Ventana de retiros: <b>11:00 AM – 6:00 PM hora CDMX</b>.</div>
        </div>
      </div>
      <div class="bpanel" id="bp-historial">
        <div class="card" style="margin-bottom:14px"><h3>⬆️ Depósitos</h3><div id="depList"><div class="empty" style="font-size:12px">Sin depósitos aún</div></div></div>
        <div class="card"><h3>⬇️ Retiros</h3><div id="wdrList"><div class="empty" style="font-size:12px">Sin retiros aún</div></div></div>
      </div>
    </div>
  </div>
</div>

<!-- INVEST MODAL -->
<div class="overlay" id="mInvest">
  <div class="modal">
    <button class="mx" onclick="closeM('mInvest')">✕</button>
    <h3>☕ <span id="mName" style="color:var(--latte)"></span></h3>
    <div class="fi"><label>Monto a Invertir (MXN)</label><input type="number" id="mAmt" placeholder="Mínimo..." oninput="calcEst()"></div>
    <div class="est-box">Con <b id="eAmt">$0</b> ganarás <b id="eYield">$0</b> a las 24h exactas</div>
    <p style="font-size:11px;color:var(--latte);line-height:1.5;margin-bottom:14px">El botón de cobro aparece exactamente <b style="color:var(--gold)">24 horas</b> después de tu compra. Rendimiento: <b id="mYieldPct" style="color:var(--glow)">5%</b> diario.</p>
    <button class="btn btn-green" onclick="confirmInvest()">✅ Confirmar Inversión</button>
  </div>
</div>

<!-- SETTINGS MODAL -->
<div class="overlay" id="mSettings">
  <div class="modal">
    <button class="mx" onclick="closeM('mSettings')">✕</button>
    <h3>⚙️ Configuración</h3>
    <div class="stabs">
      <button class="stab on" onclick="showStab('perfil',this)">👤 Perfil</button>
      <button class="stab" onclick="showStab('password',this)">🔒 Contraseña</button>
      <button class="stab" onclick="showStab('banco',this)">🏦 Banco</button>
    </div>
    <div class="spanel on" id="sp-perfil">
      <div class="pavatar">👤</div>
      <div class="sfield"><label>Nombre completo</label><input type="text" id="sName" placeholder="Tu nombre"></div>
      <div class="sfield"><label>Teléfono</label><input type="tel" id="sPhone" readonly style="opacity:.5;cursor:not-allowed"></div>
      <div class="sfield"><label>Código de Referido</label><input type="text" id="sCode" readonly style="opacity:.5;cursor:not-allowed;font-family:monospace;color:var(--gold)"></div>
      <button class="btn btn-gold" onclick="saveProfile()">💾 Guardar Nombre</button>
    </div>
    <div class="spanel" id="sp-password">
      <div class="sfield"><label>Contraseña Actual</label><input type="password" id="sPwOld" placeholder="••••••••"></div>
      <div class="sfield"><label>Nueva Contraseña</label><input type="password" id="sPwNew" placeholder="Mínimo 8 caracteres"></div>
      <div class="sfield"><label>Confirmar Nueva</label><input type="password" id="sPwConfirm" placeholder="Repite la nueva"></div>
      <button class="btn btn-green" onclick="savePassword()">🔒 Cambiar Contraseña</button>
    </div>
    <div class="spanel" id="sp-banco">
      <div id="sBankCurrent" style="margin-bottom:14px"></div>
      <div class="sfield"><label>Banco</label><select id="sBankName"><option value="">Seleccionar...</option><option>BBVA México</option><option>Santander</option><option>Banamex / Citibanamex</option><option>Banorte</option><option>HSBC</option><option>Scotiabank</option><option>Otro</option></select></div>
      <div class="sfield"><label>Nombre del Titular</label><input type="text" id="sBankHolder" placeholder="Nombre completo"></div>
      <div class="sfield"><label>CLABE (18 dígitos)</label><input type="text" id="sBankClabe" placeholder="000000000000000000" maxlength="18"></div>
      <button class="btn btn-gold" onclick="saveBank()">💾 Guardar Cuenta</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>

<script>
/* ═══ STATE ═══ */
let CUR=null,PRODS=[],INVS=[],CAP={lCap:false,rCap:false},curProd=null,ticker=null;

/* ═══ BOOT ═══ */
document.addEventListener('DOMContentLoaded',async()=>{
  buildBeans();
  const ref=new URLSearchParams(window.location.search).get('ref');
  if(ref){switchAuth('register');document.getElementById('rRef').value=ref;checkRef();}
  const {data:{session}}=await sb.auth.getSession();
  if(session) await loadAndEnter(session.user.id);
  else{hide('loader');show('authScreen');}
  await loadProds();
});
function show(id){document.getElementById(id).style.display='flex';}
function hide(id){document.getElementById(id).classList.remove('on');document.getElementById(id).style.display='none';}
function load(on){document.getElementById('loader').classList.toggle('on',on);}

async function loadProds(){
  const {data}=await sb.from('products').select('*').eq('active',true).order('min_invest');
  if(data){PRODS=data;renderProdGrid();}
}
async function loadAndEnter(uid){
  const {data:u}=await sb.from('users').select('*').eq('id',uid).single();
  if(!u){document.getElementById('loader').classList.remove('on');show('authScreen');return;}
  CUR=u;
  const {data:invs}=await sb.from('investments').select('*,products(name,icon,color)').eq('user_id',uid).order('bought_at',{ascending:false});
  INVS=invs||[];
  enterApp();
}
function enterApp(){
  document.getElementById('loader').classList.remove('on');
  document.getElementById('authScreen').style.display='none';
  document.getElementById('appScreen').classList.add('on');
  renderAll();
  if(ticker)clearInterval(ticker);
  ticker=setInterval(()=>{renderActiveCards();updateWdrBanner();},1000);
}

/* ═══ AUTH ═══ */
function switchAuth(m){
  document.getElementById('loginF').classList.toggle('hide',m!=='login');
  document.getElementById('registerF').classList.toggle('hide',m!=='register');
  document.querySelectorAll('.atab').forEach((t,i)=>t.classList.toggle('on',(m==='login'&&i===0)||(m==='register'&&i===1)));
}

/*
 * checkRef()
 * ──────────
 * 1. Si el código es CAFEYIELD (código maestro) → mostrar banner verde, permitir registro sin invitador real
 * 2. Si el código coincide con un usuario real → mostrar banner del invitador
 * 3. Otro valor → ocultar ambos banners
 */
async function checkRef(){
  const code=document.getElementById('rRef').value.trim().toUpperCase();
  const refBanner=document.getElementById('refBanner');
  const masterBanner=document.getElementById('masterBanner');

  refBanner.classList.add('hide');
  masterBanner.classList.add('hide');

  if(!code) return;

  // Código maestro: no busca en BD, siempre válido
  if(code===MASTER_CODE){
    masterBanner.classList.remove('hide');
    return;
  }

  // Código de usuario real
  const {data}=await sb.from('users').select('name').eq('ref_code',code).maybeSingle();
  if(data){
    document.getElementById('refByName').textContent=data.name;
    document.getElementById('refByCode').textContent=code;
    refBanner.classList.remove('hide');
  }
}

function toggleCap(id){CAP[id]=!CAP[id];document.getElementById(id).classList.toggle('on',CAP[id]);}

async function doLogin(){
  const ph=document.getElementById('lPhone').value.trim();
  const pw=document.getElementById('lPass').value;
  if(!ph||!pw){toast('⚠️ Ingresa teléfono y contraseña');return;}
  if(!CAP.lCap){toast('⚠️ Completa el captcha');return;}
  load(true);
  try{
    const email=ph.replace(/\D/g,'')+('@gmail.com');
    const {data,error}=await sb.auth.signInWithPassword({email,password:pw});
    if(error)throw error;
    await loadAndEnter(data.user.id);
  }catch(e){load(false);toast('❌ Teléfono o contraseña incorrectos');}
}

/*
 * doRegister()
 * ────────────
 * Acepta:
 *  • CAFEYIELD  → código maestro, ref_by = null (sin comisión a nadie)
 *  • Código de usuario real → ref_by = id del invitador (con comisiones)
 */
async function doRegister(){
  const name=document.getElementById('rName').value.trim();
  const last=document.getElementById('rLast').value.trim();
  const ph=document.getElementById('rPhone').value.trim();
  const pw=document.getElementById('rPass').value;
  const ref=document.getElementById('rRef').value.trim().toUpperCase();

  if(!name||!last||!ph||!pw){toast('⚠️ Completa todos los campos');return;}
  if(pw.length<8){toast('⚠️ Contraseña mínimo 8 caracteres');return;}
  if(!CAP.rCap){toast('⚠️ Completa el captcha');return;}
  if(!ref){toast('⚠️ Ingresa un código de referido (usa CAFEYIELD si no tienes uno)');return;}

  load(true);
  try{
    let refUserId=null;

    if(ref===MASTER_CODE){
      // Código maestro → sin invitador, sin comisión
      refUserId=null;
    } else {
      // Buscar usuario real con ese código
      const {data:refUser,error:re}=await sb.from('users').select('id,name').eq('ref_code',ref).maybeSingle();
      if(re||!refUser)throw new Error('Código de referido inválido. Usa CAFEYIELD si no tienes uno.');
      refUserId=refUser.id;
    }

    // Verificar que el teléfono no exista
    const {data:ex}=await sb.from('users').select('id').eq('phone',ph).maybeSingle();
    if(ex)throw new Error('Ese teléfono ya está registrado');

    // Crear cuenta en Supabase Auth
    const email=ph.replace(/\D/g,'')+('@gmail.com');
    const {data:auth,error:ae}=await sb.auth.signUp({email,password:pw});
    if(ae)throw ae;

    // Generar código único para este nuevo usuario
    const code=Math.random().toString(36).substr(2,6).toUpperCase();

    // Insertar en tabla users
    const {error:ie}=await sb.from('users').insert({
      id:auth.user.id,
      name:name+' '+last,
      phone:ph,
      password_hash:'**',
      ref_code:code,
      ref_by:refUserId   // null si usó CAFEYIELD, id real si usó código de usuario
    });
    if(ie)throw ie;

    await loadAndEnter(auth.user.id);
    toast('✅ ¡Cuenta creada! Bienvenido a CaféYield ☕');
  }catch(e){load(false);toast('❌ '+(e.message||'Error al registrar'));}
}

async function doLogout(){
  await sb.auth.signOut();
  CUR=null;INVS=[];
  if(ticker)clearInterval(ticker);
  document.getElementById('appScreen').classList.remove('on');
  show('authScreen');
  CAP={lCap:false,rCap:false};
  document.querySelectorAll('.cap').forEach(el=>el.classList.remove('on'));
}

/* ═══ RENDER ═══ */
function renderAll(){
  renderStats();renderActiveCards();renderProdGrid();updateWdrBanner();
}
function updateWdrBanner(){
  const b=document.getElementById('wdrWindowBanner');if(!b)return;
  const info=withdrawalTimeLeft();
  if(info.open){
    b.innerHTML=`<div style="background:rgba(61,107,74,.12);border:1px solid rgba(93,160,110,.25);border-radius:9px;padding:10px 13px;font-size:12px;color:var(--glow)">🟢 <b>Retiros abiertos</b> · Cierra en <b>${info.left}</b> (6:00 PM CDMX)</div>`;
  } else {
    b.innerHTML=`<div style="background:rgba(192,58,43,.1);border:1px solid rgba(192,58,43,.25);border-radius:9px;padding:10px 13px;font-size:12px;color:#e07060">🔴 <b>Retiros cerrados</b> · Abren en <b>${info.left}</b> (11:00 AM CDMX)</div>`;
  }
}
function renderStats(){
  if(!CUR)return;
  const b=fm(CUR.balance);
  document.getElementById('tbBal').textContent=b;
  document.getElementById('tbUser').textContent=CUR.name.split(' ')[0];
  document.getElementById('sbBal').textContent=b;
  document.getElementById('sbUser').textContent=CUR.name;
  document.getElementById('heroName').textContent=CUR.name.split(' ')[0];
  document.getElementById('hsBal').textContent='MX$'+b;
  document.getElementById('hsInv').textContent='MX$'+fm(CUR.invested);
  document.getElementById('hsEarn').textContent='MX$'+fm((CUR.earned||0)+(CUR.ref_earned||0));
  document.getElementById('wBal').textContent=b;
  document.getElementById('wAvail').textContent=b;
  document.getElementById('wEarned').textContent='MX$'+fm(CUR.earned||0);
  document.getElementById('wInv').textContent='MX$'+fm(CUR.invested);
  document.getElementById('wRef').textContent='MX$'+fm(CUR.ref_earned||0);
}

/* ═══ ACTIVE CARDS ═══ */
function renderActiveCards(){
  const c=document.getElementById('activeCards');if(!c)return;
  if(!INVS.length){c.innerHTML='<div class="empty">Ve a 🫘 Café e invierte para empezar.</div>';loadRefCounts();return;}
  c.innerHTML=INVS.map((p,i)=>{
    const prod=p.products||{};
    const colAt=new Date(p.collectable_at).getTime();
    // Con el nuevo SQL, collected siempre es false — el ciclo se reinicia solo
    // Un producto está listo si collectable_at ya pasó
    const ready=isYieldReady(p.collectable_at);
    const left=timeLeft(colAt);
    const y=p.amount*(p.yield_pct/100);
    const cycles=p.cycles_collected||0;
    const totalEarned=y*cycles;
    const timer=ready
      ?`<div class="acard-timer" style="border-color:rgba(93,160,110,.3);background:rgba(61,107,74,.1)">🟢 <b style="color:var(--glow)">¡Listo para cobrar!</b> · Próximo cobro disponible en 24h</div>`
      :`<div class="acard-timer">⏳ Próximo cobro en <b style="color:var(--gold);font-size:15px">${left}</b></div>`;
    const btn=ready
      ?`<button class="yield-btn yb-ready" onclick="collectYield('${p.id}',${i})">💰 Cobrar MX$${fm(y)}</button>`
      :`<button class="yield-btn yb-wait" disabled>Esperando próximo ciclo...</button>`;
    const aImg=PROD_IMGS[p.product_id]||null;
    return`<div class="acard"><div class="acard-top">
      ${aImg
        ?`<img src="${aImg}" style="width:52px;height:52px;border-radius:10px;object-fit:cover;flex-shrink:0">`
        :`<div class="acard-icon">${prod.icon||'☕'}</div>`}
      <div class="acard-info">
        <div class="acard-name">${prod.name||'Producto'}</div>
        <div class="acard-sub">Invertido: <b style="color:var(--gold)">MX$${fm(p.amount)}</b> · Rend. diario: <b style="color:var(--glow)">MX$${fm(y)}</b></div>
        ${cycles>0?`<div style="font-size:11px;color:var(--latte);margin-top:2px">Total cobrado: <b style="color:var(--glow)">MX$${fm(totalEarned)}</b> (${cycles} día${cycles===1?'':'s'})</div>`:''}
      </div></div>
      ${timer}${btn}
    </div>`;
  }).join('');
  loadRefCounts();
}

async function collectYield(id,idx){
  load(true);
  try{
    const {data,error}=await sb.rpc('collect_yield',{p_user_id:CUR.id,p_investment_id:id});
    if(error)throw error;
    // Reload investments from DB so collectable_at is updated to next cycle
    const {data:invs}=await sb.from('investments')
      .select('*,products(name,icon,color)')
      .eq('user_id',CUR.id)
      .order('bought_at',{ascending:false});
    INVS=invs||[];
    const {data:u}=await sb.from('users').select('*').eq('id',CUR.id).single();
    CUR=u;load(false);renderAll();
    toast(`💰 ¡MX$${fm(data)} cobrados! Próximo rendimiento mañana a las 12:00 PM CDMX`);
  }catch(e){load(false);toast('❌ '+(e.message||'Error'));}
}

/* ═══ PRODUCTS ═══ */

/* Product images by DB id (ordered by min_invest: id 1..5) */
const PROD_IMGS={
  1:'https://i.imgur.com/xSH3voX.jpeg',
  2:'https://i.imgur.com/0RzwFC6.jpeg',
  3:'https://i.imgur.com/SZXpYuD.jpeg',
  4:'https://i.imgur.com/Yky1eJe.jpeg',
  5:'https://i.imgur.com/TfGVYdZ.jpeg'
};
function renderProdGrid(){
  const c=document.getElementById('prodGrid');if(!c||!PRODS.length)return;
  c.innerHTML=PRODS.map(p=>{
    const b=Array.from({length:28},()=>`<div class="pb" style="--r:${Math.random()*360};background:${p.color}88"></div>`).join('');
    const imgUrl=PROD_IMGS[p.id]||null;
    return`<div class="pcard"><div class="pimg" style="${imgUrl?'padding:0;':''}">
        ${imgUrl
          ?`<img src="${imgUrl}" style="width:100%;height:100%;object-fit:cover;display:block"><div class="pbadge">${p.yield_pct}%/24h</div>`
          :`<div class="pbeans">${b}</div><div class="pbadge">${p.yield_pct}%/24h</div><div class="pico">${p.icon}</div>`}
      </div>
      <div class="pbody"><div class="pname">${p.name}</div><div class="pdesc">${p.description}</div>
      <span class="ybadge">${p.yield_pct}% a las 24h</span><div class="pprice">$${fm(p.min_invest)} <span>mín</span></div>
      <button class="pinvest" onclick="openInvest(${p.id})">Invertir Ahora</button></div></div>`;
  }).join('');
}

/* ═══ INVEST ═══ */
function openInvest(id){
  curProd=PRODS.find(p=>p.id===id);if(!curProd)return;
  document.getElementById('mName').textContent=curProd.name;
  document.getElementById('mAmt').value='';
  document.getElementById('eAmt').textContent='$0';
  document.getElementById('eYield').textContent='$0';
  const pctEl=document.getElementById('mYieldPct');
  if(pctEl) pctEl.textContent=curProd.yield_pct+'%';
  document.getElementById('mInvest').classList.add('on');
}
function calcEst(){
  const v=parseFloat(document.getElementById('mAmt').value)||0;
  document.getElementById('eAmt').textContent='$'+fm(v);
  document.getElementById('eYield').textContent='$'+fm(v*(curProd.yield_pct/100));
}
async function confirmInvest(){
  const amt=parseFloat(document.getElementById('mAmt').value);
  if(!amt||amt<curProd.min_invest){toast(`⚠️ Mínimo $${fm(curProd.min_invest)}`);return;}
  if(amt>curProd.max_invest){toast(`⚠️ Máximo $${fm(curProd.max_invest)}`);return;}
  if(CUR.balance<amt){toast('⚠️ Saldo insuficiente. Deposita primero.');return;}
  closeM('mInvest');load(true);
  try{
    const {error}=await sb.rpc('create_investment',{p_user_id:CUR.id,p_product_id:curProd.id,p_amount:amt});
    if(error)throw error;
    const {data:u}=await sb.from('users').select('*').eq('id',CUR.id).single();
    CUR=u;
    const {data:invs}=await sb.from('investments').select('*,products(name,icon,color)').eq('user_id',CUR.id).order('bought_at',{ascending:false});
    INVS=invs||[];
    load(false);renderAll();
    toast(`✅ ¡Inversión confirmada! Cobra $${fm(amt*curProd.yield_pct/100)} en 24h.`);
  }catch(e){load(false);toast('❌ '+(e.message||'Error'));}
}

/* ═══ REFERIDOS ═══ */
async function renderRefSection(){
  if(!CUR)return;
  const link=window.location.origin+window.location.pathname+'?ref='+CUR.ref_code;
  document.getElementById('refLinkInp').value=link;
  document.getElementById('refCode').textContent=CUR.ref_code;
  buildQR(link);
  await loadRefCounts();
}
async function loadRefCounts(){
  if(!CUR)return;
  const {data:all}=await sb.from('users').select('id,name,invested,ref_by').neq('id',CUR.id);
  const users=all||[];
  const l1=users.filter(u=>u.ref_by===CUR.id);
  const l1ids=l1.map(u=>u.id);
  const l2=users.filter(u=>l1ids.includes(u.ref_by));
  const l2ids=l2.map(u=>u.id);
  const l3=users.filter(u=>l2ids.includes(u.ref_by));
  const te=l1.reduce((s,u)=>s+(u.invested||0)*.25,0)+l2.reduce((s,u)=>s+(u.invested||0)*.05,0)+l3.reduce((s,u)=>s+(u.invested||0)*.01,0);
  document.getElementById('hsRef').textContent=l1.length+l2.length+l3.length;
  ['t1','t2','t3'].forEach((id,i)=>document.getElementById(id).textContent=[l1,l2,l3][i].length);
  document.getElementById('tEarn').textContent='$'+fm(te);
  renderTree(l1,l2,l3);
}

function treeNodeHTML(u,lvl,hasCh){
  const act=(u.invested||0)>0;
  const pct=lvl===1?25:lvl===2?5:1;
  const comm=(u.invested||0)*pct/100;
  const badge=act?`<span class="sbadge sb-active">🟢 Activo</span>`:`<span class="sbadge sb-inactive">⚪ Inactivo</span>`;
  const detail=act?`<div class="comm-detail">Compró <b style="color:var(--gold)">$${fm(u.invested)}</b> · te generó <b>$${fm(comm)}</b> (${pct}%)</div>`:`<div class="comm-detail" style="color:rgba(201,149,106,.45)">Sin compras aún</div>`;
  return`<div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap"><b style="font-size:13px;color:var(--cream)">${u.name}</b>${badge}<span class="ntag nt${lvl}">N${lvl}·${pct}%</span>${act?`<span class="etxt">+$${fm(comm)}</span>`:''}${hasCh?'<span style="font-size:10px;color:var(--latte)">▼</span>':''}</div>${detail}</div>`;
}
function renderTree(l1,l2,l3){
  const el=document.getElementById('refTree');if(!el)return;
  if(!l1.length){el.innerHTML='<div class="empty" style="font-size:12px">Comparte tu enlace para ver tu red aquí</div>';return;}
  let h='';
  l1.forEach(u1=>{
    const ch=l2.filter(u=>u.ref_by===u1.id);
    h+=`<div><div class="tree-item ${u1.invested>0?'active-node':'inactive-node'}" onclick="toggleCh('c${u1.id}')"><div class="uico ${u1.invested>0?'ico-on':'ico-off'}">${u1.invested>0?'👤':'👻'}</div>${treeNodeHTML(u1,1,ch.length>0)}</div>`;
    if(ch.length){h+=`<div class="tree-ch" id="c${u1.id}">`;
      ch.forEach(u2=>{
        const ch2=l3.filter(u=>u.ref_by===u2.id);
        h+=`<div><div class="tree-item ${u2.invested>0?'active-node':'inactive-node'}" onclick="toggleCh('c${u2.id}')"><div class="uico ${u2.invested>0?'ico-on':'ico-off'}">${u2.invested>0?'👤':'👻'}</div>${treeNodeHTML(u2,2,ch2.length>0)}</div>`;
        if(ch2.length){h+=`<div class="tree-ch" id="c${u2.id}">`;
          ch2.forEach(u3=>{h+=`<div class="tree-item ${u3.invested>0?'active-node':'inactive-node'}" style="cursor:default"><div class="uico ${u3.invested>0?'ico-on':'ico-off'}">${u3.invested>0?'👤':'👻'}</div>${treeNodeHTML(u3,3,false)}</div>`;});
          h+='</div>';}
        h+='</div>';});
      h+='</div>';}
    h+='</div>';
  });
  el.innerHTML=h;
}
function toggleCh(id){const el=document.getElementById(id);if(el)el.classList.toggle('on');}
function buildQR(link){const b=document.getElementById('qrDiv');if(!b)return;b.innerHTML='';try{new QRCode(b,{text:link,width:100,height:100,colorDark:'#1a0a00',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M});}catch(e){}}

/* ═══ BANCO ═══ */
async function renderBancoSection(){
  renderStats();
  await renderSavedBank();
  await renderDepList();
  await renderWdrList();
}
async function doDeposit(){
  const amt=parseFloat(document.getElementById('dAmt').value);
  const bank=document.getElementById('dBank').value;
  const name=document.getElementById('dName').value.trim();
  const clabe=document.getElementById('dClabe').value.trim();
  const folio=document.getElementById('dFolio').value.trim();
  if(!amt||!bank||!name||!clabe||!folio){toast('⚠️ Completa todos los campos');return;}
  load(true);
  try{
    const {error}=await sb.rpc('request_deposit',{p_user_id:CUR.id,p_amount:amt,p_bank_name:bank,p_holder:name,p_clabe:clabe,p_folio:folio});
    if(error)throw error;
    ['dAmt','dName','dClabe','dFolio'].forEach(id=>document.getElementById(id).value='');
    document.getElementById('dBank').value='';
    await renderDepList();load(false);
    toast('✅ Depósito registrado. Se acreditará en máx. 30 min.');
  }catch(e){load(false);toast('❌ '+(e.message||'Error'));}
}
async function doWithdraw(){
  // Check CDMX withdrawal window 11am–6pm
  if(!isWithdrawalOpen()){
    const info=withdrawalTimeLeft();
    toast(`🕐 Retiros solo de 11:00 AM a 6:00 PM hora CDMX. ${info.msg}`);return;
  }
  const amt=parseFloat(document.getElementById('wAmt').value);
  if(!amt||amt<500){toast('⚠️ Mínimo MX$500');return;}
  if(amt>CUR.balance){toast('⚠️ Saldo insuficiente');return;}
  const useSaved=CUR.bank&&!document.getElementById('savedBankBox').classList.contains('hide');
  let bank,name,clabe;
  if(useSaved){bank=CUR.bank.bank_name;name=CUR.bank.holder;clabe=CUR.bank.clabe;}
  else{
    bank=document.getElementById('wBank').value;name=document.getElementById('wName').value.trim();clabe=document.getElementById('wClabe').value.trim();
    if(!bank||!name||!clabe){toast('⚠️ Completa los datos bancarios');return;}
    if(document.getElementById('saveBank').checked){
      await sb.from('bank_accounts').upsert({user_id:CUR.id,bank_name:bank,holder:name,clabe},{onConflict:'user_id'});
      CUR.bank={bank_name:bank,holder:name,clabe};toast('🏦 Cuenta guardada');
    }
  }
  load(true);
  try{
    const {error}=await sb.rpc('request_withdrawal',{p_user_id:CUR.id,p_amount:amt,p_bank_name:bank,p_holder:name,p_clabe:clabe});
    if(error)throw error;
    const {data:u}=await sb.from('users').select('*').eq('id',CUR.id).single();
    CUR=u;document.getElementById('wAmt').value='';
    await renderWdrList();load(false);renderStats();
    toast(`✅ Retiro de $${fm(amt)} solicitado · 24–48h hábiles`);
  }catch(e){load(false);toast('❌ '+(e.message||'Error'));}
}
async function renderSavedBank(){
  const {data}=await sb.from('bank_accounts').select('*').eq('user_id',CUR.id).maybeSingle();
  CUR.bank=data;
  const box=document.getElementById('savedBankBox'),form=document.getElementById('bankFormBox');
  if(data){box.classList.remove('hide');form.classList.add('hide');
    document.getElementById('savedRows').innerHTML=`<div class="brow"><span class="k">Banco</span><span class="v">${data.bank_name}</span></div><div class="brow"><span class="k">Titular</span><span class="v">${data.holder}</span></div><div class="brow"><span class="k">CLABE</span><span class="v" style="font-family:monospace;font-size:11px">${data.clabe}</span></div>`;}
  else{box.classList.add('hide');form.classList.remove('hide');}
}
function editBank(){
  document.getElementById('savedBankBox').classList.add('hide');document.getElementById('bankFormBox').classList.remove('hide');
  if(CUR.bank){document.getElementById('wBank').value=CUR.bank.bank_name;document.getElementById('wName').value=CUR.bank.holder;document.getElementById('wClabe').value=CUR.bank.clabe;document.getElementById('saveBank').checked=true;}
}
async function renderDepList(){
  const {data}=await sb.from('deposits').select('*').eq('user_id',CUR.id).order('created_at',{ascending:false});
  const c=document.getElementById('depList');if(!c)return;
  const SL={pending:'⏳ Pendiente',approved:'✅ Aprobado',rejected:'❌ Rechazado'};
  const SC={pending:'color:var(--latte)',approved:'color:var(--glow)',rejected:'color:#e07060'};
  const list=data||[];
  c.innerHTML=list.length?list.map(d=>`<div class="tx"><div class="tx-ic tx-in">⬆️</div><div class="tx-i"><div class="t">${d.bank_name} · Folio: ${d.folio}</div><div class="d">${fmtD(d.created_at)} · <span style="${SC[d.status]||''}">${SL[d.status]||d.status}</span></div></div><div class="tx-a pos">+$${fm(d.amount)}</div></div>`).join(''):'<div class="empty" style="font-size:12px">Sin depósitos aún</div>';
}
async function renderWdrList(){
  const {data}=await sb.from('withdrawals').select('*').eq('user_id',CUR.id).order('created_at',{ascending:false});
  const c=document.getElementById('wdrList');if(!c)return;
  const SL={pending:'⏳ Pendiente',processing:'🔄 Procesando',completed:'✅ Completado',rejected:'❌ Rechazado'};
  const list=data||[];
  c.innerHTML=list.length?list.map(w=>`<div class="tx"><div class="tx-ic tx-out">⬇️</div><div class="tx-i"><div class="t">${w.bank_name} · ${w.holder}</div><div class="d">${fmtD(w.created_at)} · ${SL[w.status]||w.status}</div></div><div class="tx-a neg">-$${fm(w.amount)}</div></div>`).join(''):'<div class="empty" style="font-size:12px">Sin retiros aún</div>';
}

/* ═══ SETTINGS ═══ */
async function openSettings(){
  document.getElementById('sName').value=CUR.name;
  document.getElementById('sPhone').value=CUR.phone;
  document.getElementById('sCode').value=CUR.ref_code;
  ['sPwOld','sPwNew','sPwConfirm'].forEach(id=>document.getElementById(id).value='');
  const {data:bank}=await sb.from('bank_accounts').select('*').eq('user_id',CUR.id).maybeSingle();
  const bc=document.getElementById('sBankCurrent');
  if(bank){
    document.getElementById('sBankName').value=bank.bank_name;
    document.getElementById('sBankHolder').value=bank.holder;
    document.getElementById('sBankClabe').value=bank.clabe;
    bc.innerHTML=`<div style="background:rgba(200,118,42,.08);border:var(--bd);border-radius:10px;padding:12px;font-size:12px;margin-bottom:4px"><div style="font-size:10px;color:var(--latte);text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px">Cuenta actual</div><div class="brow"><span class="k">Banco</span><span class="v">${bank.bank_name}</span></div><div class="brow"><span class="k">Titular</span><span class="v">${bank.holder}</span></div><div class="brow"><span class="k">CLABE</span><span class="v" style="font-family:monospace;font-size:11px">${bank.clabe}</span></div></div>`;
  }else{bc.innerHTML=`<div class="empty" style="font-size:12px;padding:12px;background:rgba(255,255,255,.03);border:var(--bd);border-radius:10px;margin-bottom:4px">Sin cuenta bancaria guardada</div>`;}
  showStab('perfil',document.querySelector('.stab'));
  document.getElementById('mSettings').classList.add('on');
}
function showStab(name,btn){
  document.querySelectorAll('.spanel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.stab').forEach(b=>b.classList.remove('on'));
  document.getElementById('sp-'+name).classList.add('on');
  if(btn)btn.classList.add('on');
}
async function saveProfile(){
  const name=document.getElementById('sName').value.trim();
  if(!name){toast('⚠️ El nombre no puede estar vacío');return;}
  load(true);
  const {error}=await sb.from('users').update({name}).eq('id',CUR.id);
  if(error){load(false);toast('❌ Error al guardar');return;}
  CUR.name=name;load(false);renderStats();toast('✅ Nombre actualizado');
}
async function savePassword(){
  const old=document.getElementById('sPwOld').value;
  const nw=document.getElementById('sPwNew').value;
  const conf=document.getElementById('sPwConfirm').value;
  if(!old||!nw||!conf){toast('⚠️ Completa todos los campos');return;}
  if(nw.length<8){toast('⚠️ Mínimo 8 caracteres');return;}
  if(nw!==conf){toast('⚠️ Las contraseñas no coinciden');return;}
  load(true);
  const email=CUR.phone.replace(/\D/g,'')+('@gmail.com');
  const {error:se}=await sb.auth.signInWithPassword({email,password:old});
  if(se){load(false);toast('❌ Contraseña actual incorrecta');return;}
  const {error}=await sb.auth.updateUser({password:nw});
  load(false);
  if(error){toast('❌ Error al cambiar contraseña');return;}
  ['sPwOld','sPwNew','sPwConfirm'].forEach(id=>document.getElementById(id).value='');
  toast('✅ Contraseña cambiada');
}
async function saveBank(){
  const bank=document.getElementById('sBankName').value;
  const holder=document.getElementById('sBankHolder').value.trim();
  const clabe=document.getElementById('sBankClabe').value.trim();
  if(!bank||!holder||!clabe){toast('⚠️ Completa todos los datos');return;}
  if(clabe.length<10){toast('⚠️ CLABE inválida');return;}
  load(true);
  const {error}=await sb.from('bank_accounts').upsert({user_id:CUR.id,bank_name:bank,holder,clabe},{onConflict:'user_id'});
  if(error){load(false);toast('❌ Error al guardar');return;}
  CUR.bank={bank_name:bank,holder,clabe};
  await renderSavedBank();load(false);openSettings();
  toast('✅ Cuenta bancaria guardada');
}

/* ═══ SIDEBAR ═══ */
function openSidebar(){
  document.getElementById('sidebar').classList.add('on');
  document.getElementById('sbOverlay').classList.add('on');
}
function closeSidebar(){
  document.getElementById('sidebar').classList.remove('on');
  document.getElementById('sbOverlay').classList.remove('on');
}

/* ═══ NAV ═══ */
function goPage(name){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.sb-item').forEach(b=>b.classList.remove('on'));
  document.getElementById('page-'+name).classList.add('on');
  const sbn=document.getElementById('sbn-'+name);
  if(sbn)sbn.classList.add('on');
  document.querySelector('.scroll-area').scrollTop=0;
  if(name==='referidos')renderRefSection();
  if(name==='banco')renderBancoSection();
}
function showBank(name,btn){
  document.querySelectorAll('.bpanel').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.btab').forEach(b=>b.classList.remove('on'));
  document.getElementById('bp-'+name).classList.add('on');
  if(btn)btn.classList.add('on');
}

/* ═══ HELPERS ═══ */
function copyLink(){navigator.clipboard.writeText(document.getElementById('refLinkInp').value).catch(()=>{});toast('✅ Enlace copiado');}
function closeM(id){document.getElementById(id).classList.remove('on');}
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('on');setTimeout(()=>el.classList.remove('on'),3400);}
function fm(n){return(Math.round((n||0)*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});}
function fmtD(iso){try{return new Date(iso).toLocaleString('es-MX',{timeZone:'America/Mexico_City',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
function timeLeft(ms){const d=ms-Date.now();if(d<=0)return null;const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

/* ══ CDMX TIME HELPERS ══ */
function cdmxNow(){
  // Returns current time as a Date object in America/Mexico_City
  return new Date(new Date().toLocaleString('en-US',{timeZone:'America/Mexico_City'}));
}
function cdmxHour(){return cdmxNow().getHours();}
function cdmxMinutes(){return cdmxNow().getMinutes();}

// Withdrawal window: 11:00 AM – 6:00 PM CDMX
function isWithdrawalOpen(){
  const h=cdmxHour();
  return h>=11 && h<18;
}
function withdrawalTimeLeft(){
  const now=cdmxNow();
  const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
  if(h<11){
    // Time until 11am
    const secs=(11-h-1)*3600+(60-m-1)*60+(60-s);
    return{open:false,msg:`Abre a las 11:00 AM hora CDMX`,left:fmtSecs(secs)};
  }
  if(h>=18){
    // Time until tomorrow 11am
    const secs=(24-h-1+11)*3600+(60-m-1)*60+(60-s);
    return{open:false,msg:`Abre mañana a las 11:00 AM hora CDMX`,left:fmtSecs(secs)};
  }
  // Open — time until 6pm
  const secs=(18-h-1)*3600+(60-m-1)*60+(60-s);
  return{open:true,msg:`Cierra a las 6:00 PM hora CDMX`,left:fmtSecs(secs)};
}
function fmtSecs(s){
  const h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// Next yield window: every day at 12:00 PM CDMX (noon)
// collectable_at is set to next noon CDMX after purchase
function nextNoonCDMX(){
  const now=cdmxNow();
  const h=now.getHours();
  // If before noon, next noon is today; if after noon, next noon is tomorrow
  const nextNoon=new Date(now);
  nextNoon.setSeconds(0);nextNoon.setMinutes(0);
  if(h<12){nextNoon.setHours(12);}
  else{nextNoon.setHours(12);nextNoon.setDate(nextNoon.getDate()+1);}
  // Convert back to UTC ms
  // We'll compute offset: CDMX is UTC-6 (CDT) or UTC-7 (CST)
  // Simple approach: get the UTC equivalent
  const localStr=nextNoon.toLocaleString('en-US',{timeZone:'America/Mexico_City'});
  // Actually we already have CDMX time in nextNoon as a local-ish date
  // The safest way: use the offset
  const utcStr=nextNoon.getTime()+(now.getTimezoneOffset()*60000);
  // Let's just return the CDMX Date and compute diff from now
  return nextNoon;
}
function timeUntilNoon(){
  const now=cdmxNow();
  const h=now.getHours(),m=now.getMinutes(),s=now.getSeconds();
  let secsLeft;
  if(h<12){secsLeft=(12-h-1)*3600+(60-m-1)*60+(60-s);}
  else{secsLeft=(24-h+12-1)*3600+(60-m-1)*60+(60-s);}
  return fmtSecs(secsLeft);
}
function isYieldReady(collectable_at){
  // collectable_at is stored in DB as UTC ISO string
  // We compare with current UTC time — this is timezone-independent
  return Date.now() >= new Date(collectable_at).getTime();
}
function buildBeans(){const c=document.getElementById('heroBeans');if(!c)return;c.innerHTML='';for(let i=0;i<80;i++){const b=document.createElement('div');b.className='hb';b.style.setProperty('--r',Math.random()*360);c.appendChild(b);}}
</script>
</body>
</html>
