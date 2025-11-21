## Gourmet Chicken Hero Generator

Generate ultra-detailed gourmet fried chicken hero shots with cinematic sauce splashes.

### Setup

1) Install dependencies:
```bash
npm install
```

2) Dev server:
```bash
npm run dev
```

3) Build and run:
```bash
npm run build && npm start
```

### Image generation
- Set `OPENAI_API_KEY` in the environment to enable generation via OpenAI Images (gpt-image-1).
- Without the key, the app returns a high-quality placeholder image so the UI works end-to-end.

### Deploy (Vercel)
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-3a39685b
```