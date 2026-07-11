# Jurassic Journey (integration-dev)

### Setup

1. **Backend**:
   ```bash
   cd backend
   python3 -m pip install -r requirements.txt
   python3 -m uvicorn main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd frontends/my-app
   npm install
   npm run dev -- --port 3000
   ```

### Verify Integration
* Test preview endpoint: `curl http://localhost:8000/timeline/preview`
* Open **http://localhost:3000/** and view the "Meet The Giants" component.