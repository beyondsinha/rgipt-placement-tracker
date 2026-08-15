import type { Config } from 'tailwindcss';
const config: Config = {content:['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./lib/**/*.{ts,tsx}'],theme:{extend:{colors:{ink:'#071426',panel:'#101f35',panel2:'#162844',line:'#2a3b55',muted:'#8fa4c1',brand:'#3578ff',accent:'#6454e8',success:'#16c784'}}},plugins:[]};
export default config;
