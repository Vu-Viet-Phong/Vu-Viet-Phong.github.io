# VuAnalytics — AI Research & Engineering Portfolio

Welcome to the interactive portfolio and research studio of **Vu Viet Phong**. This frontend application showcases conceptual pipelines and algorithms in Recommendation Systems, Graph Neural Networks, and GraphRAG.

🔗 **Live Domain:** [https://vuanalytics.me](https://vuanalytics.me)

## Features

- **Interactive Neural Graph:** A force-directed visualization of AI research concepts using Cytoscape.js.
- **MMRec Architecture Explorer:** Interactive blocks illustrating how models like MF, NGCF, LightGCN, and VBPR process multimodal features.
- **GraphRAG Simulator:** Step-by-step interactive query traversal showing Dense Vector retrieval and Knowledge Graph entity relationships.
- **Recommendation Arena:** Dynamically switch between algorithms (LightGCN vs NGCF) and Top-K thresholds.
- **Fashion Intelligence Copilot:** AI chatbot simulation with attribute-based evaluation (matches vs. mismatches) for fashion items.

> **Note:** The current implementations serve as highly-polished frontend conceptual demonstrations (simulation mode) based on deterministic datasets.

## Technology Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Graph Visualization:** Cytoscape.js
- **Testing:** Vitest

## Local Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Run Tests:**
   ```bash
   npm run test
   ```

4. **Production Build:**
   ```bash
   npm run build
   ```

## Deployment

The site is automatically deployed to GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`).
When a commit is pushed to the `main` branch, it builds the project via Vite and serves the `/dist` directory. The custom domain `vuanalytics.me` is persisted via `public/CNAME`.

## Future Work

- **Backend Integration:** Replace deterministic mock datasets with a real-time FastAPI + Neo4j Sandbox integration for genuine LLM querying and Matrix Factorization inferences.

---

© 2026 Vu Viet Phong. All rights reserved.