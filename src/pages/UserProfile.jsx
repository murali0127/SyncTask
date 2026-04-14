


// const GlowOrb = ({ className }) => (
//       <div className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`} />
// );

// const Tag = ({ children }) => (
//       <span className="px-2 py-0.5 text-xs font-mono tracking-widest uppercase rounded-full border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
//             {children}
//       </span>
// );

// const StatItem = ({ label, value, delta }) => (
//       <div className="flex flex-col gap-0.5">
//             <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{label}</span>
//             <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
//             {delta && (
//                   <span className={`text-xs font-mono ${delta > 0 ? "text-emerald-400" : "text-rose-400"}`}>
//                         {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%
//                   </span>
//             )}
//       </div>
// );

// const AvatarStack = ({ users }) => (
//       <div className="flex -space-x-2">
//             {users.map((u, i) => (
//                   <div
//                         key={i}
//                         className="w-7 h-7 rounded-full border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-white"
//                         style={{ background: u.color, zIndex: users.length - i }}
//                         title={u.name}
//                   >
//                         {u.name[0]}
//                   </div>
//             ))}
//             <div className="w-7 h-7 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center text-xs text-slate-400">
//                   +4
//             </div>
//       </div>
// );

// const ProgressBar = ({ label, value, color }) => (
//       <div className="space-y-1.5">
//             <div className="flex justify-between text-xs font-mono text-slate-400">
//                   <span>{label}</span>
//                   <span>{value}%</span>
//             </div>
//             <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
//                   <div
//                         className="h-full rounded-full transition-all duration-1000"
//                         style={{ width: `${value}%`, background: color }}
//                   />
//             </div>
//       </div>
// );


export default function UserProfile() {
      return (
            <>
                  <h1>Welcome to User profile........</h1>
            </>
      )
}