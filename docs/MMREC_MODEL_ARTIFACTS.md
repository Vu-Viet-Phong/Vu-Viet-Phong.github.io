# MMRec Model Artifacts Manifest

To transition the Recommendation Arena from **Demo Mode** to **Live Inference Mode**, the following model artifacts must be provided in the `backend/app/models/` directory.

## 1. Required Directory Structure

```text
backend/app/models/
├── mf.pt
├── ngcf.pt
├── lightgcn.pt
├── vbpr.pt
├── user_mapping.json
├── item_mapping.json
└── visual_embeddings.npy (Required for VBPR only)
```

## 2. Artifact Details

### Checkpoint Files (`*.pt`)
- **Format:** PyTorch `state_dict` or full model exports.
- **Requirement:** Models must accept a batched `user_id` tensor and return scores for all items, or support standard `forward()` for user-item pairs.

### Mappings (`*_mapping.json`)
- **Format:** JSON key-value pairs mapping external String IDs to internal Tensor indices.
- **Example:** `{"u1": 0, "u2": 1}`

### Visual Embeddings (`visual_embeddings.npy`)
- **Format:** NumPy array.
- **Shape:** `[num_items, embedding_dim]` (e.g., extracted from ResNet50 for Clothing_5core).

## 3. How to Enable Live Inference

Once the files are placed in the directory:
1. Open `backend/app/services/inference.py`.
2. Change `MMRecAdapter(use_mock=True)` to `use_mock=False`.
3. Restart the FastAPI server.
4. The system will automatically detect the artifacts and the frontend will switch to **LIVE INFERENCE** mode.
