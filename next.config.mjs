import fs from 'fs';
import path from 'path';

// Copy user-uploaded photos to both local project images directories on startup
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
      console.log(`Successfully copied avatar.png to ${destDir}`);
    }
    if (fs.existsSync(profileSrc)) {
      fs.copyFileSync(profileSrc, path.join(destDir, 'profile-new.png'));
      console.log(`Successfully copied profile-new.png to ${destDir}`);
    }
  });
} catch (err) {
  console.error('Error copying profile images:', err);
}

/** @type {import('next').NextConfig} */
const nextConfig = {};

export default nextConfig;

