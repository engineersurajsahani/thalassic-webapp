"use client";
import React, { useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { Users, TrendingUp, TrendingDown, MoreHorizontal, ShieldCheck, Anchor, GraduationCap, Globe, BookOpen, ArrowUpRight, Info, X, AlertCircle, CheckCircle2, Building2, UserCog, Handshake, GitMerge, Wallet, Receipt, Clock, IndianRupee, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const RD: Record<string,{month:string;revenue:number}[]> = {
  "2025":[{month:"Jan",revenue:180000},{month:"Feb",revenue:210000},{month:"Mar",revenue:195000},{month:"Apr",revenue:240000},{month:"May",revenue:220000},{month:"Jun",revenue:280000},{month:"Jul",revenue:310000},{month:"Aug",revenue:295000},{month:"Sep",revenue:340000},{month:"Oct",revenue:320000}],
  "2024":[{month:"Jan",revenue:140000},{month:"Feb",revenue:165000},{month:"Mar",revenue:155000},{month:"Apr",revenue:190000},{month:"May",revenue:175000},{month:"Jun",revenue:210000},{month:"Jul",revenue:240000},{month:"Aug",revenue:225000},{month:"Sep",revenue:265000},{month:"Oct",revenue:250000}],
  "2023":[{month:"Jan",revenue:100000},{month:"Feb",revenue:120000},{month:"Mar",revenue:110000},{month:"Apr",revenue:145000},{month:"May",revenue:130000},{month:"Jun",revenue:160000},{month:"Jul",revenue:185000},{month:"Aug",revenue:170000},{month:"Sep",revenue:200000},{month:"Oct",revenue:190000}],
};
const ET=[{month:"Feb",e:320,c:210},{month:"Mar",e:410,c:290},{month:"Apr",e:380,c:260},{month:"May",e:510,c:380},{month:"Jun",e:490,c:340},{month:"Jul",e:620,c:440},{month:"Aug",e:700,c:520},{month:"Sep",e:660,c:490},{month:"Oct",e:810,c:600}];
const OD=[{id:"INV-1042",name:"Raj Kumar",course:"STCW Basic Safety",amount:"5000",due:"Jul 20",status:"Overdue"},{id:"INV-1039",name:"Priya Singh",course:"Basic Safety Training",amount:"3500",due:"Jul 22",status:"Due Soon"},{id:"INV-1035",name:"Deepa Nair",course:"Advanced Fire Fighting",amount:"7200",due:"Jul 25",status:"Due Soon"},{id:"INV-1031",name:"Karan Mehta",course:"Ship Navigation",amount:"6800",due:"Jul 28",status:"Pending"},{id:"INV-1028",name:"Suresh Verma",course:"Tanker Cargo Ops",amount:"9400",due:"Jul 30",status:"Pending"}];
const PD=[{id:"TXN-9921",name:"Amit Patel",course:"STCW Basic Safety",amount:"5000",date:"Jul 14",method:"UPI"},{id:"TXN-9920",name:"Vikram Das",course:"Ship Navigation",amount:"6800",date:"Jul 13",method:"Card"},{id:"TXN-9919",name:"Sunita Rajan",course:"Medical First Aid",amount:"4500",date:"Jul 12",method:"Net Banking"},{id:"TXN-9918",name:"Rohit Sharma",course:"Tanker Cargo Ops",amount:"9400",date:"Jul 11",method:"UPI"},{id:"TXN-9917",name:"Meena Iyer",course:"Maritime Law",amount:"3200",date:"Jul 10",method:"Card"}];
const DIV=[{name:"Safety Training",icon:ShieldCheck,color:"#6366f1",count:412},{name:"Navigation",icon:Anchor,color:"#10b981",count:289},{name:"Technical Ops",icon:GraduationCap,color:"#f59e0b",count:194},{name:"Maritime Law",icon:Globe,color:"#ef4444",count:137},{name:"Deck Operations",icon:BookOpen,color:"#8b5cf6",count:98}];
const REG=[{id:"SEA-4821",name:"Raj Kumar",rank:"Chief Officer",date:"Today, 9:14 AM",status:"Active"},{id:"SEA-4820",name:"Priya Singh",rank:"Deck Cadet",date:"Today, 7:02 AM",status:"Pending"},{id:"SEA-4819",name:"Amit Patel",rank:"Second Engineer",date:"Yesterday",status:"Active"},{id:"SEA-4818",name:"Suresh Verma",rank:"AB Seaman",date:"Yesterday",status:"Active"},{id:"SEA-4817",name:"Deepa Nair",rank:"Bosun",date:"2 days ago",status:"Inactive"}];
const PUR=[{user:"Raj Kumar",course:"STCW Basic Safety",amount:"5000",date:"Today",method:"UPI"},{user:"Priya Singh",course:"Basic Safety Training",amount:"3500",date:"Today",method:"Card"},{user:"Amit Patel",course:"Advanced Fire Fighting",amount:"7200",date:"Yesterday",method:"Net Banking"},{user:"Karan Mehta",course:"Ship Navigation",amount:"6800",date:"Yesterday",method:"UPI"},{user:"Suresh Verma",course:"Tanker Cargo Ops",amount:"9400",date:"2 days ago",method:"Card"}];
const SL:Record<string,string>={Active:"bg-emerald-100 text-emerald-700",Pending:"bg-amber-100 text-amber-700",Inactive:"bg-slate-100 text-slate-500",Overdue:"bg-red-100 text-red-700","Due Soon":"bg-orange-100 text-orange-700"};
const SD:Record<string,string>={Active:"bg-emerald-500/10 text-emerald-400",Pending:"bg-amber-500/10 text-amber-400",Inactive:"bg-white/5 text-white/30",Overdue:"bg-red-500/10 text-red-400","Due Soon":"bg-orange-500/10 text-orange-400"};
const AB=["bg-indigo-500","bg-sky-500","bg-amber-500","bg-emerald-500","bg-violet-500"];
const YC:Record<string,string>={"2025":"#6366f1","2024":"#10b981","2023":"#f59e0b"};
const fmt=(n:number)=>`\u20B9${n.toLocaleString("en-IN")}`;

function DonutRing({v,t,color,label,dk}:{v:number;t:number;color:string;label:string;dk:boolean}){
  const r=34,ci=2*Math.PI*r,da=(v/t)*ci;
  return(<div className="flex flex-col items-center gap-2"><div className="relative w-[88px] h-[88px]"><svg viewBox="0 0 88 88" className="w-full h-full -rotate-90"><circle cx="44" cy="44" r={r} fill="none" stroke={dk?"rgba(255,255,255,0.06)":"#f1f5f9"} strokeWidth="9"/><circle cx="44" cy="44" r={r} fill="none" stroke={color} strokeWidth="9" strokeDasharray={`${da} ${ci}`} strokeLinecap="round"/></svg><span className="absolute inset-0 flex items-center justify-center text-xl font-bold" style={{color}}>{v}</span></div><p className={`text-[11px] font-semibold text-center ${dk?"text-white/40":"text-slate-500"}`}>{label}</p></div>);
}

function CH({title,dk,action}:{title:string;dk:boolean;action?:React.ReactNode}){
  return(<div className={`flex items-center justify-between px-6 py-4 border-b ${dk?"border-white/5":"border-slate-100"}`}><p className={`text-sm font-semibold ${dk?"text-white/80":"text-slate-800"}`}>{title}</p>{action??<MoreHorizontal className={`w-4 h-4 ${dk?"text-white/20":"text-slate-300"}`}/>}</div>);
}

function Modal({type,dk,onClose}:{type:"outstanding"|"done";dk:boolean;onClose:()=>void}){
  const rows=type==="outstanding"?OD:PD;
  const bg=dk?"bg-[#0d1f35] border border-white/10":"bg-white border border-slate-200";
  const ht=dk?"text-white/80":"text-slate-800";
  const mt=dk?"text-white/35":"text-slate-400";
  const dv=dk?"divide-white/5":"divide-slate-100";
  const total=rows.reduce((s,r)=>s+Number(r.amount),0);
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>
      <div className={`relative w-full max-w-lg rounded-2xl shadow-2xl ${bg} z-10`} onClick={e=>e.stopPropagation()}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${dk?"border-white/8":"border-slate-100"}`}>
          <p className={`text-sm font-semibold ${ht}`}>{type==="outstanding"?"Outstanding Payments":"Payments Received"}</p>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${dk?"hover:bg-white/8 text-white/40":"hover:bg-slate-100 text-slate-400"}`}><X className="w-4 h-4"/></button>
        </div>
        <div className={`divide-y ${dv} max-h-96 overflow-y-auto`}>
          {rows.map((r:any,i:number)=>(
            <div key={i} className="flex items-center justify-between px-6 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AB[i%AB.length]}`}>{r.name.split(" ").map((n:string)=>n[0]).join("")}</div>
                <div className="min-w-0">
                  <p className={`text-[13px] font-medium truncate ${ht}`}>{r.name}</p>
                  <p className={`text-[11px] truncate ${mt}`}>{r.course}</p>
                  <p className={`text-[10px] font-mono ${mt} opacity-70`}>{r.id}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className={`text-[13px] font-bold ${type==="outstanding"?(dk?"text-red-400":"text-red-600"):(dk?"text-emerald-400":"text-emerald-600")}`}>{fmt(Number(r.amount))}</p>
                <p className={`text-[10px] mt-0.5 ${mt}`}>{type==="outstanding"?`Due ${r.due}`:r.date}</p>
                {type==="outstanding"&&<span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 inline-block ${dk?SD[r.status]:SL[r.status]}`}>{r.status}</span>}
                {type==="done"&&<p className={`text-[10px] ${mt}`}>{r.method}</p>}
              </div>
            </div>
          ))}
        </div>
        <div className={`px-6 py-3 border-t ${dk?"border-white/8":"border-slate-100"}`}>
          <p className={`text-xs font-medium ${mt}`}>{type==="outstanding"?"Total outstanding":"Total received"}: {fmt(total)}</p>
        </div>
      </div>
    </div>
  );
}

export default function MasterDashboard(){
  const {theme}=useTheme();
  const dk=theme==="dark";
  const [er,setEr]=useState<"monthly"|"weekly">("monthly");
  const [cy,setCy]=useState<string[]>(["2025"]);
  const [modal,setModal]=useState<"outstanding"|"done"|null>(null);
  const card=`rounded-2xl overflow-hidden ${dk?"bg-[#0d1f35] border border-white/[0.06]":"bg-white border border-slate-200 shadow-sm"}`;
  const ht=dk?"text-white/80":"text-slate-800";
  const mt=dk?"text-white/35":"text-slate-400";
  const gl=dk?"#1a3352":"#e2e8f0";
  const ax=dk?"#3d6080":"#94a3b8";
  const dv=dk?"divide-white/[0.05]":"divide-slate-100";
  const rh=dk?"hover:bg-white/[0.03]":"hover:bg-slate-50";
  const chartData=RD["2025"].map((row,i)=>{const pt:any={month:row.month};cy.forEach(y=>{pt[y]=RD[y][i]?.revenue??0;});return pt;});
  const toggleY=(y:string)=>setCy(prev=>prev.includes(y)?(prev.length>1?prev.filter(x=>x!==y):prev):[...prev,y]);
  const kpis=[
    {label:"Registered Seafarers",value:"2,847",Icon:Users,ib:dk?"bg-indigo-500/15":"bg-indigo-50",ic:"#6366f1",info:null as null,up:true,delta:"+12%"},
    {label:"Outstanding Amount",value:fmt(OD.reduce((s,r)=>s+Number(r.amount),0)),Icon:AlertCircle,ib:dk?"bg-red-500/15":"bg-red-50",ic:"#ef4444",info:"outstanding" as const,up:false,delta:"+5%"},
    {label:"Payment Done",value:fmt(PD.reduce((s,r)=>s+Number(r.amount),0)),Icon:CheckCircle2,ib:dk?"bg-emerald-500/15":"bg-emerald-50",ic:"#10b981",info:"done" as const,up:true,delta:"+18%"},
    {label:"Total Revenue",value:"\u20B924.5L",Icon:TrendingUp,ib:dk?"bg-amber-500/15":"bg-amber-50",ic:"#f59e0b",info:null as null,up:true,delta:"+9%"},
  ];
  return(
    <div className="space-y-5">
      {modal&&<Modal type={modal} dk={dk} onClose={()=>setModal(null)}/>}
      <div className={card}>
        <div className={`grid grid-cols-2 xl:grid-cols-4 divide-x divide-y xl:divide-y-0 ${dk?"divide-white/[0.05]":"divide-slate-100"}`}>
          {kpis.map((s,i)=>{const D=s.up?TrendingUp:TrendingDown;return(
            <div key={i} className="flex items-center gap-4 px-6 py-5">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.ib}`}><s.Icon className="w-5 h-5" style={{color:s.ic}}/></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className={`text-[22px] font-bold leading-tight tracking-tight ${ht}`}>{s.value}</p>
                  {s.info&&<button onClick={()=>setModal(s.info)} className={`p-0.5 rounded ${dk?"text-white/25 hover:text-white/60":"text-slate-300 hover:text-slate-600"}`}><Info className="w-3.5 h-3.5"/></button>}
                </div>
                <p className={`text-xs mt-0.5 truncate ${mt}`}>{s.label}</p>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${s.up?"text-emerald-500":"text-red-500"}`}><D className="w-3 h-3"/>{s.delta}</span>
                <p className={`text-[10px] mt-0.5 ${mt}`}>vs last month</p>
              </div>
            </div>
          );})}
        </div>
      </div>

      {/* ── 10 Additional KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
        {[
          { label: "Company Admins",         value: "8",       sub: "Registered",         Icon: Building2,     ib: dk?"bg-sky-500/15":"bg-sky-50",       ic: "#0ea5e9" },
          { label: "Agent Admins",           value: "7",       sub: "Registered",         Icon: UserCog,       ib: dk?"bg-violet-500/15":"bg-violet-50",  ic: "#8b5cf6" },
          { label: "Registered Agents",      value: "41",      sub: "Under agent admins", Icon: Handshake,     ib: dk?"bg-indigo-500/15":"bg-indigo-50",  ic: "#6366f1" },
          { label: "Referral Leads",         value: "128",     sub: "All time",           Icon: GitMerge,      ib: dk?"bg-amber-500/15":"bg-amber-50",    ic: "#f59e0b" },
          { label: "Referral Conversions",   value: "74",      sub: "57.8% rate",         Icon: TrendingUp,    ib: dk?"bg-emerald-500/15":"bg-emerald-50", ic: "#10b981" },
          { label: "Commissions Payable",    value: "₹1.24L",  sub: "Awaiting payout",    Icon: Wallet,        ib: dk?"bg-orange-500/15":"bg-orange-50",   ic: "#f97316" },
          { label: "Commissions Paid",       value: "₹4.87L",  sub: "All time",           Icon: CheckCircle2,  ib: dk?"bg-teal-500/15":"bg-teal-50",      ic: "#14b8a6" },
          { label: "Platform Invoices",      value: "312",     sub: "Total raised",       Icon: Receipt,       ib: dk?"bg-rose-500/15":"bg-rose-50",      ic: "#f43f5e" },
          { label: "Pending Settlements",    value: "₹38.4K",  sub: "Unresolved",         Icon: Clock,         ib: dk?"bg-red-500/15":"bg-red-50",        ic: "#ef4444" },
          { label: "Monthly Revenue",        value: "₹3.88L",  sub: "Current month",      Icon: BarChart3,     ib: dk?"bg-purple-500/15":"bg-purple-50",   ic: "#a855f7" },
        ].map((k) => (
          <div key={k.label} className={`${card} flex items-center gap-3 px-5 py-4`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${k.ib}`}>
              <k.Icon className="w-5 h-5" style={{ color: k.ic }} />
            </div>
            <div className="min-w-0">
              <p className={`text-[19px] font-bold leading-tight tracking-tight ${ht}`}>{k.value}</p>
              <p className={`text-[11px] font-semibold truncate mt-0.5 ${ht} opacity-75`}>{k.label}</p>
              <p className={`text-[10px] truncate mt-0.5 ${mt}`}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className={`${card} xl:col-span-2`}>
          <CH title="Revenue Over Time" dk={dk} action={
            <div className="flex items-center gap-2">
              <span className={`text-[11px] ${mt}`}>Compare:</span>
              {["2023","2024","2025"].map(y=>(
                <button key={y} onClick={()=>toggleY(y)} className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${cy.includes(y)?"text-white border-transparent":dk?"border-white/10 text-white/30 hover:text-white/60":"border-slate-200 text-slate-400 hover:text-slate-600"}`} style={cy.includes(y)?{background:YC[y],borderColor:YC[y]}:{}}>{y}</button>
              ))}
            </div>
          }/>
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-5 mb-3">{cy.map(y=>(<span key={y} className="flex items-center gap-1.5 text-[11px]" style={{color:dk?"#6b7f93":"#94a3b8"}}><span className="w-5 h-0.5 rounded-full inline-block" style={{background:YC[y]}}/>{y}</span>))}</div>
            <ResponsiveContainer width="100%" height={230}><LineChart data={chartData}><CartesianGrid vertical={false} stroke={gl}/><XAxis dataKey="month" tick={{fontSize:11,fill:ax}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:ax}} axisLine={false} tickLine={false} width={46} tickFormatter={(v:number)=>`${(v/1000).toFixed(0)}K`}/><Tooltip formatter={(v:any,name:string)=>[`\u20B9${(Number(v)/1000).toFixed(0)}K`,name]} contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #e2e8f0"}}/>{cy.map(y=><Line key={y} type="monotone" dataKey={y} stroke={YC[y]} strokeWidth={2} dot={false} activeDot={{r:4}}/>)}</LineChart></ResponsiveContainer>
          </div>
        </div>
        <div className={card}>
          <CH title="Courses by Category" dk={dk}/>
          <div className="px-6 pt-5 pb-6"><div className="grid grid-cols-2 gap-6"><DonutRing v={117} t={200} color="#8b5cf6" label="Safety" dk={dk}/><DonutRing v={86} t={160} color="#ef4444" label="Navigation" dk={dk}/><DonutRing v={70} t={140} color="#f59e0b" label="Technical" dk={dk}/><DonutRing v={38} t={80} color="#10b981" label="Compliance" dk={dk}/></div></div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className={`${card} xl:col-span-3`}>
          <CH title="Enrolments vs. Completions" dk={dk} action={
            <div className={`flex rounded-lg overflow-hidden border text-[11px] font-medium ${dk?"border-white/10":"border-slate-200"}`}>
              {(["monthly","weekly"] as const).map(r=>(<button key={r} onClick={()=>setEr(r)} className={`px-3 py-1 transition-colors capitalize ${er===r?"bg-indigo-500 text-white":dk?"text-white/35 hover:text-white/60":"text-slate-400 hover:text-slate-600"}`}>{r}</button>))}
            </div>
          }/>
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center gap-5 mb-3">{[["#6366f1","Enrolments"],["#34d399","Completions"]].map(([c,l])=>(<span key={l} className="flex items-center gap-1.5 text-[11px]" style={{color:dk?"#6b7f93":"#94a3b8"}}><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{background:c}}/>{l}</span>))}</div>
            <ResponsiveContainer width="100%" height={210}><BarChart data={ET} barSize={11} barGap={4} barCategoryGap="30%"><CartesianGrid vertical={false} stroke={gl}/><XAxis dataKey="month" tick={{fontSize:11,fill:ax}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:11,fill:ax}} axisLine={false} tickLine={false} width={34}/><Tooltip cursor={{fill:dk?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.03)"}} contentStyle={{fontSize:12,borderRadius:8,border:"1px solid #e2e8f0"}}/><Bar dataKey="e" name="Enrolments" fill="#6366f1" radius={[3,3,0,0]}/><Bar dataKey="c" name="Completions" fill="#34d399" radius={[3,3,0,0]}/></BarChart></ResponsiveContainer>
          </div>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <CH title="Enrolments by Division" dk={dk}/>
          <div className="px-2 py-2">
            <div className={`grid grid-cols-[1fr_auto] px-4 pb-2 mb-1 border-b text-[10px] font-semibold uppercase tracking-wider ${dk?"border-white/5 text-white/20":"border-slate-100 text-slate-400"}`}><span>Division</span><span>Enrolled</span></div>
            <div className={`divide-y ${dv}`}>{DIV.map(d=>{const Icon=d.icon;const max=DIV[0].count;return(<div key={d.name} className={`grid grid-cols-[1fr_auto] items-center px-4 py-3 gap-3 ${rh} transition-colors`}><div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{background:`${d.color}18`}}><Icon className="w-3.5 h-3.5" style={{color:d.color}}/></div><div className="min-w-0"><p className={`text-[13px] font-medium truncate ${dk?"text-white/70":"text-slate-700"}`}>{d.name}</p><div className={`mt-1.5 h-1 rounded-full overflow-hidden w-16 ${dk?"bg-white/8":"bg-slate-100"}`}><div className="h-full rounded-full" style={{width:`${(d.count/max)*100}%`,background:d.color}}/></div></div></div><span className="text-sm font-bold tabular-nums" style={{color:d.color}}>{d.count}</span></div>);})}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className={`${card} xl:col-span-3`}>
          <CH title="Recent Registrations" dk={dk} action={<button className={`flex items-center gap-1 text-xs font-medium ${dk?"text-indigo-400 hover:text-indigo-300":"text-indigo-600 hover:text-indigo-700"}`}>View all <ArrowUpRight className="w-3 h-3"/></button>}/>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className={dk?"border-b border-white/5":"border-b border-slate-100"}>{["Name","Rank","Registered","Status"].map(h=>(<th key={h} className={`text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider ${mt}`}>{h}</th>))}</tr></thead><tbody className={`divide-y ${dv}`}>{REG.map((r,i)=>(<tr key={r.id} className={`${rh} transition-colors`}><td className="px-5 py-3"><div className="flex items-center gap-2.5"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 ${AB[i%AB.length]}`}>{r.name.split(" ").map(n=>n[0]).join("")}</div><div><p className={`text-[13px] font-medium ${ht}`}>{r.name}</p><p className={`text-[10px] font-mono ${mt}`}>{r.id}</p></div></div></td><td className={`px-5 py-3 text-[12px] ${dk?"text-white/55":"text-slate-500"}`}>{r.rank}</td><td className={`px-5 py-3 text-[12px] ${mt}`}>{r.date}</td><td className="px-5 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${dk?SD[r.status]:SL[r.status]}`}>{r.status}</span></td></tr>))}</tbody></table></div>
        </div>
        <div className={`${card} xl:col-span-2`}>
          <CH title="Recent Purchases" dk={dk} action={<button className={`flex items-center gap-1 text-xs font-medium ${dk?"text-indigo-400 hover:text-indigo-300":"text-indigo-600 hover:text-indigo-700"}`}>View all <ArrowUpRight className="w-3 h-3"/></button>}/>
          <div className={`divide-y ${dv}`}>{PUR.map((p,i)=>(<div key={i} className={`flex items-start justify-between px-5 py-3.5 ${rh} transition-colors`}><div className="flex items-start gap-2.5 min-w-0"><div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0 mt-0.5 ${AB[i%AB.length]}`}>{p.user.split(" ").map(n=>n[0]).join("")}</div><div className="min-w-0"><p className={`text-[13px] font-medium truncate ${ht}`}>{p.course}</p><p className={`text-[11px] mt-0.5 ${mt}`}>{p.user} · {p.date}</p><p className={`text-[10px] mt-0.5 ${mt} opacity-60`}>{p.method}</p></div></div><span className={`text-[13px] font-bold shrink-0 ml-2 ${dk?"text-emerald-400":"text-emerald-600"}`}>{fmt(Number(p.amount))}</span></div>))}</div>
        </div>
      </div>
    </div>
  );
}