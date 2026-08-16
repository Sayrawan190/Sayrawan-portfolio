import {
  Code, Puzzle, Handshake, Globe, Zap, Briefcase, Bot, Palette,
  BarChart3, Lock, Cloud, Smartphone, Database, FlaskConical, Wrench,
  TrendingUp, Target, Rocket, Brain, BookOpen, PenTool, GraduationCap,
  Settings, Radio, Monitor, Cog, Calculator, Microscope, Star, Lightbulb,
  Package, KeyRound, Gamepad2, Camera, Music, Building2, Terminal, Server,
  Cpu, Shield, Layers, Sparkles,
} from "lucide-react";

// A skill category's `icon` field stores either one of these keys (rendered
// as a real icon) or a plain emoji character the admin typed themselves —
// Skills.jsx (public site) and IconPicker.jsx (dashboard) both need the same
// key->component lookup, so it's shared here instead of duplicated.
export const SKILL_ICONS = [
  ["code", Code], ["puzzle", Puzzle], ["handshake", Handshake], ["globe", Globe],
  ["zap", Zap], ["briefcase", Briefcase], ["bot", Bot], ["palette", Palette],
  ["barchart", BarChart3], ["lock", Lock], ["cloud", Cloud], ["smartphone", Smartphone],
  ["database", Database], ["flask", FlaskConical], ["wrench", Wrench], ["trendingup", TrendingUp],
  ["target", Target], ["rocket", Rocket], ["brain", Brain], ["bookopen", BookOpen],
  ["pentool", PenTool], ["graduationcap", GraduationCap], ["settings", Settings], ["radio", Radio],
  ["monitor", Monitor], ["cog", Cog], ["calculator", Calculator], ["microscope", Microscope],
  ["star", Star], ["lightbulb", Lightbulb], ["package", Package], ["key", KeyRound],
  ["gamepad", Gamepad2], ["camera", Camera], ["music", Music], ["building", Building2],
  ["terminal", Terminal], ["server", Server], ["cpu", Cpu], ["shield", Shield],
  ["layers", Layers], ["sparkles", Sparkles],
];

export const SKILL_ICON_MAP = Object.fromEntries(SKILL_ICONS);
