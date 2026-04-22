import requests

def get_fda_data(drug_name: str) -> dict:
    url = f'https://api.fda.gov/drug/event.json'
    params = {
        'search': f'patient.drug.medicinalproduct:{drug_name}',
        'count': 'patient.reaction.reactionmeddrapt.exact',
        'limit': 5
    }
    try:
        res = requests.get(url, params=params, timeout=5)
        data = res.json()
        top_reactions = [r['term'] for r in data.get('results', [])]
        return {'drug': drug_name, 'fda_common_reactions': top_reactions}
    except:
        return {'drug': drug_name, 'fda_common_reactions': []}