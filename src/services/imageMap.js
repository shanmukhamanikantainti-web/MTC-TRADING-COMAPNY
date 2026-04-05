import tamarindImg from '../assets/tamarind.png';
import chilliImg from '../assets/chillies.png';
import cowpeasImg from '../assets/cowpeas.png';
import horsegramImg from '../assets/horse_gram.png';
import logoImg from '../assets/logo.png';
import heroImg from '../assets/hero_bg.png';

const imageMap = {
  'tamarind.png': tamarindImg,
  'chillies.png': chilliImg,
  'cowpeas.png': cowpeasImg,
  'horse_gram.png': horsegramImg,
  'logo.png': logoImg,
  'hero_bg.png': heroImg,
};

export const getProductImage = (imagePath) => {
  if (!imagePath) return tamarindImg;
  
  // If it's a full URL (Supabase Storage), return it directly
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, look it up in our local asset map
  return imageMap[imagePath] || tamarindImg;
};

export default imageMap;
