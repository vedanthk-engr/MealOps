import json
import math
import os
from PIL import Image
import io
import base64

# Configuration
LABEL_TEXT = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'captcha_model.json')

_weights = None
_biases = None

def load_model():
    global _weights, _biases
    if _weights is not None:
        return
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Captcha model data not found at {MODEL_PATH}")
        
    with open(MODEL_PATH, 'r') as f:
        data = json.load(f)
        _weights = data['weights']
        _biases = data['biases']

def get_image_blocks(img_pil: Image.Image):
    # Ensure image is exactly 200x40 (the size used by the neural network training)
    # The original implementation assumes 200x40 and calculates saturated image first.
    img_pil = img_pil.convert('RGB')
    if img_pil.size != (200, 40):
        img_pil = img_pil.resize((200, 40))
    
    pix = img_pil.load()
    width, height = img_pil.size
    
    # Calculate saturation matrix
    saturate = [[0 for _ in range(width)] for _ in range(height)]
    for y in range(height):
        for x in range(width):
            r, g, b = pix[x, y]
            mx = max(r, g, b)
            mn = min(r, g, b)
            if mx == 0:
                saturate[y][x] = 0
            else:
                saturate[y][x] = round(((mx - mn) * 255) / mx)
    
    blocks = []
    for i in range(6):
        # Calculation from index.js
        x1 = (i + 1) * 25 + 2
        y1 = 7 + 5 * (i % 2) + 1
        x2 = (i + 2) * 25 + 1
        y2 = 35 - 5 * ((i + 1) % 2)
        
        # Slice saturate matrix
        # slice in JS is end-exclusive, so x2 and y2 in index.js are exclusive
        # blocks[i] = img.slice(y1, y2).map(row => row.slice(x1, x2));
        
        block = []
        for y_idx in range(y1, y2):
            block.append(saturate[y_idx][x1:x2])
        blocks.append(block)
        
    return blocks

def binarize_image(char_img):
    total = 0
    rows = len(char_img)
    cols = len(char_img[0])
    for r in char_img:
        for p in r:
            total += p
    
    avg = total / (rows * cols)
    
    bits = []
    for r in char_img:
        bits_row = []
        for p in r:
            bits_row.append(1 if p > avg else 0)
        bits.append(bits_row)
    return bits

def flatten(matrix):
    # Flatten 2D to 1D
    return [item for sublist in matrix for item in sublist]

def mat_mul_vec(vec, weights):
    # vec is 1D: size N (e.g. 528)
    # weights is 2D: [N][M] (e.g. [528][32])
    # Returns 1D vector of size M
    M = len(weights[0])
    N = len(vec)
    result = [0] * M
    for j in range(M):
        s = 0
        for i in range(N):
            s += vec[i] * weights[i][j]
        result[j] = s
    return result

def mat_add(vec1, vec2):
    return [x + y for x, y in zip(vec1, vec2)]

def softmax(vec):
    exps = [math.exp(x) for x in vec]
    sum_exps = sum(exps)
    return [e / sum_exps for e in exps]

def solve_captcha(image_data: bytes) -> str:
    """
    Solves a VTOP captcha from bytes (could be base64 or raw).
    """
    load_model()
    
    try:
        if image_data.startswith(b'data:image'):
            # It's a data URL, get the base64 part
            _, base64_data = image_data.decode('utf-8').split(',', 1)
            image_bytes = base64.b64decode(base64_data)
        else:
            image_bytes = image_data
            
        img = Image.open(io.BytesIO(image_bytes))
        char_blocks = get_image_blocks(img)
        
        result = ""
        for block in char_blocks:
            bits = binarize_image(block)
            input_vector = flatten(bits) # size 528
            
            # Layer 1: Matrix Multiplication and Addition
            output = mat_mul_vec(input_vector, _weights)
            output = mat_add(output, _biases)
            
            # Softmax to get probabilities
            probs = softmax(output)
            
            # Find index of max probability
            max_prob = -1
            max_index = 0
            for idx, p in enumerate(probs):
                if p > max_prob:
                    max_prob = p
                    max_index = idx
            
            result += LABEL_TEXT[max_index]
            
        return result
    except Exception as e:
        print(f"Error solving captcha: {e}")
        # Return fallback or re-raise
        return ""

if __name__ == "__main__":
    # Test with a local file if exists
    pass
