from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ai_engine import analyze_text
from fda_fetcher import get_fda_data
from database import save_report, get_history

app = FastAPI(title='Drug Safety Signal Detector')

app.add_middleware(CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_methods=['*'], allow_headers=['*'])

class ReportInput(BaseModel):
    text: str

@app.post('/analyze')
async def analyze(input: ReportInput):
    analysis = analyze_text(input.text)
    fda_results = []
    for drug in analysis.get('drugs', []):
        fda_results.append(get_fda_data(drug))
    
    # This now saves to data.json instead of MongoDB
    report_id = save_report(input.text, analysis, fda_results)
    return {'id': report_id, 'analysis': analysis, 'fda_data': fda_results}

@app.get('/history')
async def history():
    return get_history()

@app.get('/')
async def root():
    return {'status': 'Drug Safety API is running'}