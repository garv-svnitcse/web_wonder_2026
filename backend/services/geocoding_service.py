import requests
from typing import Dict, Any, Optional

FALLBACK_LOCATIONS = {
    "morocco": {"latitude": 31.7917, "longitude": -7.0926, "display_name": "Kem Kem Beds, Morocco"},
    "montana": {"latitude": 46.8797, "longitude": -110.3626, "display_name": "Hell Creek Formation, Montana, USA"},
    "south dakota": {"latitude": 44.3683, "longitude": -100.3510, "display_name": "Faith, South Dakota, USA"},
    "argentina": {"latitude": -38.9516, "longitude": -68.0591, "display_name": "Neuquén Basin, Patagonia, Argentina"},
    "china": {"latitude": 41.5768, "longitude": 120.4485, "display_name": "Liaoning Province, China"},
    "alberta": {"latitude": 51.0447, "longitude": -114.0719, "display_name": "Dinosaur Provincial Park, Alberta, Canada"},
    "tokyo": {"latitude": 35.6762, "longitude": 139.6503, "display_name": "Tokyo, Japan"},
    "paris": {"latitude": 48.8566, "longitude": 2.3522, "display_name": "Paris, France"},
    "london": {"latitude": 51.5074, "longitude": -0.1278, "display_name": "London, UK"}
}

def geocode_city_name(city: str) -> Dict[str, Any]:
    if not city or not city.strip():
        return {
            "city": "",
            "latitude": 0.0,
            "longitude": 0.0,
            "display_name": "Unknown Site"
        }

    clean_city = city.strip()
    city_lower = clean_city.lower()

    # Attempt 1: Open-Meteo Geocoding API (Fast, Free, No API Key Required)
    try:
        url = f"https://geocoding-api.open-meteo.com/v1/search?name={requests.utils.quote(clean_city)}&count=1&language=en&format=json"
        headers = {"User-Agent": "JurrasiVersePaleoLab/1.0"}
        response = requests.get(url, headers=headers, timeout=4)
        if response.status_code == 200:
            data = response.json()
            if "results" in data and len(data["results"]) > 0:
                result = data["results"][0]
                lat = float(result.get("latitude", 0.0))
                lon = float(result.get("longitude", 0.0))
                name = result.get("name", clean_city)
                country = result.get("country", "")
                display = f"{name}, {country}" if country else name
                return {
                    "city": clean_city,
                    "latitude": lat,
                    "longitude": lon,
                    "display_name": display
                }
    except Exception as e:
        print(f"Open-Meteo Geocoding Warning for '{clean_city}': {e}")

    # Attempt 2: OpenStreetMap Nominatim Geocoding API
    try:
        url = f"https://nominatim.openstreetmap.org/search?q={requests.utils.quote(clean_city)}&format=json&limit=1"
        headers = {"User-Agent": "JurrasiVersePaleoLab/1.0"}
        response = requests.get(url, headers=headers, timeout=4)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                result = data[0]
                lat = float(result.get("lat", 0.0))
                lon = float(result.get("lon", 0.0))
                display = result.get("display_name", clean_city)
                return {
                    "city": clean_city,
                    "latitude": lat,
                    "longitude": lon,
                    "display_name": display
                }
    except Exception as e:
        print(f"Nominatim Geocoding Warning for '{clean_city}': {e}")

    # Attempt 3: Fallback location registry check
    for key, fb in FALLBACK_LOCATIONS.items():
        if key in city_lower:
            return {
                "city": clean_city,
                "latitude": fb["latitude"],
                "longitude": fb["longitude"],
                "display_name": fb["display_name"]
            }

    # Default fallback
    return {
        "city": clean_city,
        "latitude": 20.0,
        "longitude": 0.0,
        "display_name": f"{clean_city} Excavation Site"
    }
