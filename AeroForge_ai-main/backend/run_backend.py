import uvicorn

if __name__ == "__main__":
    print("Starting AeroForge Physics AI Backend API on http://localhost:8000...")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
