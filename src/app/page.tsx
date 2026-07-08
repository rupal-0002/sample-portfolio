import fs from 'fs';
import path from 'path';

// Copy user-uploaded photos to both local project images directories on page reload
const brainDir = 'C:/Users/HP/.gemini/antigravity-ide/brain/ee410527-337e-468b-b679-0d9d2128b8dc';
const destDirs = ['./public/images', './public/portfolio/images'];

try {
  const avatarSrc = path.join(brainDir, 'media__1783450607523.png');
  const profileSrc = path.join(brainDir, 'media__1783450745351.jpg');

  destDirs.forEach((destDir) => {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    if (fs.existsSync(avatarSrc)) {
      fs.copyFileSync(avatarSrc, path.join(destDir, 'avatar.png'));
    }
    if (fs.existsSync(profileSrc)) {
      fs.copyFileSync(profileSrc, path.join(destDir, 'profile-new.png'));
    }
  });
} catch (err) {
  // Silent error in server component
}

import { SmoothScroll } from "@/components/SmoothScroll";
import { Hero } from "@/components/Hero";
import { Outro } from "@/components/Outro";

export default function Home() {
  return (
    <SmoothScroll>
      <main className="min-h-screen bg-zinc-950 overflow-x-hidden selection:bg-purple-500/30">
        <Hero />
        <Outro />
      </main>
    </SmoothScroll>
  );
}

