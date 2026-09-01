import React from "react";
import { LucideIcon } from "lucide-react";

interface AboutCardProps {
  title: string;
  icon: LucideIcon;
  desc?: string | React.ReactNode;
  descParts?: Array<{ text: string; bold?: boolean }>;
  leftColor?: string;
  iconColor?: string;
  highlight?: boolean;
  isDark?: boolean;
  children?: React.ReactNode;
}

export const AboutCard: React.FC<AboutCardProps> = ({
  title,
  icon: Icon,
  desc,
  descParts,
  leftColor = "",
  iconColor = "",
  highlight = false,
  isDark = false,
  children,
}) => {
  // Determine accent colors dynamically based on leftColor or overrides
  let accentLight = "text-blue-600 bg-blue-50/50 ring-blue-100";
  let accentDark = "text-blue-400 bg-blue-950/30 ring-blue-900/30";

  const colorStr = (leftColor + " " + iconColor).toLowerCase();

  const isOrange = colorStr.includes("orange") || colorStr.includes("amber");
  const isEmerald = colorStr.includes("emerald") || colorStr.includes("green") || colorStr.includes("teal") || colorStr.includes("mint");
  const isPurple = colorStr.includes("purple") || colorStr.includes("violet");
  const isCyan = colorStr.includes("cyan") || colorStr.includes("sky");

  if (isOrange) {
    accentLight = "text-orange-600 bg-orange-50/70 ring-orange-100/60";
    accentDark = "text-orange-400 bg-orange-950/40 ring-orange-900/30";
  } else if (isEmerald) {
    accentLight = "text-emerald-600 bg-emerald-50/70 ring-emerald-100/60";
    accentDark = "text-emerald-400 bg-emerald-950/40 ring-emerald-900/30";
  } else if (isPurple) {
    accentLight = "text-purple-600 bg-purple-50/70 ring-purple-100/60";
    accentDark = "text-purple-400 bg-purple-950/40 ring-purple-900/30";
  } else if (isCyan) {
    accentLight = "text-cyan-600 bg-cyan-50/70 ring-cyan-100/60";
    accentDark = "text-cyan-400 bg-cyan-950/40 ring-cyan-900/30";
  }

  // Base card styling
  let cardBgStyle = "";
  if (highlight) {
    if (isEmerald) {
      cardBgStyle = isDark
        ? "bg-gradient-to-br from-emerald-950/20 to-slate-900/50 border-emerald-900/30 hover:border-emerald-800/40 hover:shadow-emerald-950/10"
        : "bg-gradient-to-br from-emerald-50/60 to-white border-emerald-100/80 hover:border-emerald-200/80 hover:shadow-emerald-100/40";
    } else {
      cardBgStyle = isDark
        ? "bg-gradient-to-br from-cyan-950/30 to-slate-900/50 border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-cyan-950/10"
        : "bg-gradient-to-br from-sky-50/50 to-white border-sky-100 hover:border-sky-300 hover:shadow-sky-100/40";
    }
  } else {
    cardBgStyle = isDark
      ? "bg-slate-900/40 border-slate-800 hover:border-slate-700/60 hover:shadow-black/25"
      : "bg-white border-slate-200/80 hover:border-slate-300/80 hover:shadow-slate-200/40";
  }

  const cardShadow = isDark
    ? "shadow-[0_1px_3px_rgba(0,0,0,0.1),_0_10px_30px_rgba(0,0,0,0.2)]"
    : "shadow-[0_1px_2px_rgba(0,0,0,0.02),_0_8px_24px_rgba(0,0,0,0.03)]";

  return (
    <div
      className={`group flex flex-col justify-start gap-5 p-8 md:p-9 rounded-2xl border transition-all duration-300 ease-out hover:-translate-y-1 h-full w-full ${cardBgStyle} ${cardShadow}`}
    >
      {/* Icon Treatment: premium badge */}
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ring-4 transition-transform duration-300 group-hover:scale-105 shrink-0 ${
            isDark ? accentDark : accentLight
          }`}
        >
          <Icon className="w-5 h-5 stroke-[2]" />
        </div>
        <h5
          className={`text-sm md:text-base font-black tracking-tight leading-snug transition-colors duration-200 ${
            isDark
              ? "text-white"
              : highlight
              ? isEmerald
                ? "text-emerald-950"
                : "text-sky-950"
              : "text-[#0F1B2D]"
          }`}
        >
          {title}
        </h5>
      </div>

      {/* Description: Warmer editorial slate/grey with generous line-height */}
      <div
        className={`text-[12.5px] leading-relaxed font-light flex-1 flex flex-col justify-start ${
          isDark
            ? "text-slate-400 group-hover:text-slate-300"
            : highlight
            ? isEmerald
              ? "text-emerald-900/90"
              : "text-sky-900/90"
            : "text-slate-600 group-hover:text-slate-700"
        } transition-colors duration-200`}
      >
        {children ? (
          children
        ) : descParts ? (
          <p className="leading-relaxed">
            {descParts.map((part, pIdx) =>
              part.bold ? (
                <strong
                  key={pIdx}
                  className={`font-black ${isDark ? "text-white" : "text-[#0F1B2D]"}`}
                >
                  {part.text}
                </strong>
              ) : (
                <span key={pIdx}>{part.text}</span>
              )
            )}
          </p>
        ) : typeof desc === "string" ? (
          <p className="leading-relaxed">{desc}</p>
        ) : (
          desc
        )}
      </div>
    </div>
  );
};
