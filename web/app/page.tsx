"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Camera, { CameraHandle } from "@/components/Camera";

type Preset = "subtle" | "balanced" | "creative";

const styles = [
  { id:"cartoon", title:"Cartoon", icon:"✦", prompt:"A colorful cartoon-style illustration of the original photo, highly stylized, bold outlines, flat colors, playful animation aesthetic." },
  { id:"gogh", title:"Van Gogh", icon:"◌", prompt:"An expressive post-impressionist painting of the original photo in the style of Vincent van Gogh, vibrant brush strokes, swirling textures, oil painting." },
  { id:"watercolor", title:"Watercolor", icon:"≈", prompt:"A soft watercolor painting version of the original photo, pastel tones, light brush strokes, expressive paper texture." },
  { id:"storybook", title:"Storybook", icon:"◇", prompt:"Transform the original photo into a whimsical fairytale storybook animated scene, magical lighting, expressive forms, vibrant colors. Keep people recognizable and poses intact." },
  { id:"anime", title:"Anime", icon:"☆", prompt:"Transform the original photo into a Japanese anime-style illustration, vibrant colors, clean lines, dynamic shading and cinematic background. Keep people recognizable and poses intact." },
  { id:"winter", title:"Winter", icon:"❄", prompt:"Transform the original photo into a magical winter scene, falling snow, frosty trees, cool color palette, soft lighting and peaceful winter atmosphere. Keep people recognizable and poses intact." },
];

const presets: Record<Preset,{strength:number; guidance:number; label:string; description:string}> = {
  subtle:{strength:.30,guidance:5.5,label:"Subtle",description:"Keeps the original photo recognizable"},
  balanced:{strength:.45,guidance:6.5,label:"Balanced",description:"A clear transformation with familiar composition"},
  creative:{strength:.60,guidance:7.5,label:"Creative",description:"Lets AI reinterpret more of the scene"},
};

const Arrow = ({back=false}:{back?:boolean}) => <span aria-hidden>{back ? "←" : "→"}</span>;

export default function Home() {
  const cameraRef=useRef<CameraHandle>(null);
  const [photo,setPhoto]=useState<string|null>(null);
  const [originalPhoto,setOriginalPhoto]=useState<string|null>(null);
  const [generatedPhoto,setGeneratedPhoto]=useState<string|null>(null);
  const [selectedId,setSelectedId]=useState("");
  const [strength,setStrength]=useState(.45);
  const [guidanceScale,setGuidanceScale]=useState(6.5);
  const [preset,setPresetState]=useState<Preset>("balanced");
  const [advanced,setAdvanced]=useState(false);
  const [step,setStep]=useState(1);
  const [stopCamera,setStopCamera]=useState(false);
  const [loading,setLoading]=useState(false);
  const [mounted,setMounted]=useState(false);
  const [fullscreenResult,setFullscreenResult]=useState(false);\n  const [aiStatus,setAiStatus]=useState<"checking"|"ready"|"offline">("checking");\n  const [generationError,setGenerationError]=useState("");
  const selected=useMemo(()=>styles.find(s=>s.id===selectedId),[selectedId]);

  useEffect(()=>{setMounted(true); fetch("http://127.0.0.1:5000/status").then(r=>{if(!r.ok) throw new Error(); return r.json()}).then(()=>setAiStatus("ready")).catch(()=>setAiStatus("offline"));},[]);

  const reset=()=>{
    setPhoto(null); setOriginalPhoto(null); setGeneratedPhoto(null); setSelectedId("");
    setStopCamera(false); setLoading(false); setFullscreenResult(false); setGenerationError(""); setPresetState("balanced");
    setStrength(.45); setGuidanceScale(6.5); setStep(1);
  };

  const getPhoto=()=>{
    const captured=cameraRef.current?.capture();
    if(!captured) return;
    setPhoto(captured); setOriginalPhoto(captured); setStopCamera(true); setStep(2);
  };

  const choosePreset=(key:Preset)=>{
    setPresetState(key); setStrength(presets[key].strength); setGuidanceScale(presets[key].guidance);
  };

  const generate=async()=>{
    if(!photo||!selected) return;
    setLoading(true); setGenerationError("");
    try{
      const blob=await fetch(photo).then(r=>r.blob());
      const formData=new FormData();
      formData.append("image",blob,"captured_image.jpg");
      formData.append("tags",selected.prompt);
      formData.append("strength",strength.toString());
      formData.append("guidance_scale",guidanceScale.toString());
      const response=await fetch("http://127.0.0.1:5000/generate_image",{method:"POST",body:formData});
      if(!response.ok){ const detail=await response.text(); throw new Error(detail||"Generation failed"); }
      const imageBlob=await response.blob();
      setGeneratedPhoto(URL.createObjectURL(imageBlob)); setAiStatus("ready"); setStep(4);
    }catch(error){
      console.error(error); setAiStatus("offline");
      setGenerationError("AI backend is not reachable. Start DataLab AI Artist locally and try again.");
    }finally{ setLoading(false); }
  };
