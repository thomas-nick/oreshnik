import { Resvg, type ResvgRenderOptions } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { html as toReactElement } from 'satori-html';

const fontFile = await fetch(
  'https://og-playground.vercel.app/inter-latin-ext-700-normal.woff',
);
const fontData: ArrayBuffer = await fontFile.arrayBuffer();

const height = 630;
const width = 1200;

const NAVY = '#0a0a1f';
const PURPLE = '#3d1a5c';
const RED = '#d4202d';
const TEAL = '#3fa3a0';
const CREAM = '#f4e8c8';

export const GET: APIRoute = async () => {
  const html = toReactElement(`
  <div style="display: flex; height: 100%; width: 100%; background: linear-gradient(180deg, ${NAVY} 0%, ${PURPLE} 70%, ${RED} 100%); padding: 60px;">
    <div style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; width: 100%; background-color: ${CREAM}; border: 8px solid black; border-radius: 16px; padding: 60px; filter: drop-shadow(10px 10px 0 rgb(0 0 0 / 1));">
      <div style="display: flex; align-items: center; gap: 20px;">
        <div style="width: 80px; height: 80px; background-color: ${TEAL}; clip-path: polygon(50% 0%, 60% 35%, 100% 50%, 60% 65%, 50% 100%, 40% 65%, 0% 50%, 40% 35%); display: flex;"></div>
        <p style="font-size: 36px; color: ${RED}; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">Oreshnik</p>
      </div>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <p style="font-size: 80px; color: black; font-weight: 700; line-height: 0.95;">Design, UX, UI &mdash;<br/>and the occasional dispatch.</p>
        <p style="font-size: 28px; color: ${RED}; font-weight: 700; letter-spacing: 4px; text-transform: uppercase;">★ mahoot.xyz</p>
      </div>
    </div>
  </div>
  `);

  const svg = await satori(html, {
    fonts: [
      { name: 'Inter Latin', data: fontData, style: 'normal' },
    ],
    height,
    width,
  });

  const opts: ResvgRenderOptions = {
    fitTo: { mode: 'width', value: width },
  };
  const resvg = new Resvg(svg, opts);
  const pngBuffer = resvg.render().asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: { 'content-type': 'image/png' },
  });
};
