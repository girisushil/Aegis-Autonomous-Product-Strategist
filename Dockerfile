# Base: Official Python 3.11 Slim Image
FROM python:3.11-slim

# Working Dir: Production context
WORKDIR /app

# Dependency Layer: Optimization for build cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Source Code: Copy absolute project structure
COPY . .

# Expose: Standard FastAPI port
EXPOSE 8000

# Start Command: Point to absolute main.py location
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
