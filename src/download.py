import os

from huggingface_hub import snapshot_download

SD15_CACHE = "./models/sd15"

SD15_PATTERNS = [
    "model_index.json",
    "scheduler/*",
    "tokenizer/*",
    "text_encoder/config.json",
    "text_encoder/model.safetensors",
    "text_encoder/model.fp16.safetensors",
    "unet/config.json",
    "unet/diffusion_pytorch_model.safetensors",
    "unet/diffusion_pytorch_model.fp16.safetensors",
    "vae/config.json",
    "vae/diffusion_pytorch_model.safetensors",
    "vae/diffusion_pytorch_model.fp16.safetensors",
    "feature_extractor/*",
]

print("Downloading Stable Diffusion 1.5 Diffusers files...")
snapshot_download(
    "stable-diffusion-v1-5/stable-diffusion-v1-5",
    cache_dir=SD15_CACHE,
    allow_patterns=SD15_PATTERNS,
)

os.makedirs(SD15_CACHE, exist_ok=True)
with open(os.path.join(SD15_CACHE, ".base-model-downloaded"), "w", encoding="utf-8") as marker:
    marker.write("Stable Diffusion 1.5 base model downloaded.\n")

print("Done. Stable Diffusion 1.5 is available locally.")
