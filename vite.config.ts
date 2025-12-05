import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // 1. 這裡先處理 loadEnv，這是必須在 return 之前完成的動作
    const env = loadEnv(mode, '.', '');
    
    // 2. return 語句必須返回一個單一的配置物件
    return {
        // 🌟 修正後的 base 屬性放在這裡 🌟
        base: './', 
        
        server: {
            port: 3000,
            host: '0.0.0.0',
        },
        // 確保 plugins 只出現一次
        plugins: [
            react({
              // 啟用 React 19 的新轉換
              jsxRuntime: 'classic',
            }),
        ],
        define: {
            'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
            'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, '.'),
            }
        }
    };
    // 3. 刪除所有重複的或錯誤位置的程式碼，如您先前嘗試添加的 plugins 區塊
});
