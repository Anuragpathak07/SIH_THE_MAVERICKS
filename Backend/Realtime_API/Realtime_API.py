# Realtime_API.py
import requests
import os
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables from .env
load_dotenv()

API_KEY = os.getenv("OWM_API_KEY")
if not API_KEY:
    raise ValueError("❌ Missing OWM_API_KEY in .env file")

# --- Mine Data (with Geotechnical Parameters) ---
MINE_DATA = [
    {
        "id": 1, "latitude": 18.7100, "longitude": 81.0500,
        "area_acres": 400, "sensors": 315, "active_sensors": 315,
        "sync_accuracy": "97.8%", "update_rate": "2.4 ms",
        "vertices": "1.9M", "triangles": "1.4M", "resolution": "1.1 cm³",
        "last_update": "2 min ago", "render_time": "15.9 ms",
        "memory_usage": "720 MB", "gpu_load": "31%",
        "height_m": 42, "cohesion_kpa": 23, "friction_angle_deg": 31,
        "unit_weight_kn_m3": 21, "slope_angle_deg": 37,
        "water_depth_ratio": 0.14, "fos": 1.45
    },
    {
        "id": 2, "latitude": 20.5610, "longitude": 81.0700,
        "area_acres": 250, "sensors": 240, "active_sensors": 237,
        "sync_accuracy": "96.3%", "update_rate": "3.2 ms",
        "vertices": "1.4M", "triangles": "1.1M", "resolution": "1.3 cm³",
        "last_update": "5 min ago", "render_time": "14.8 ms",
        "memory_usage": "640 MB", "gpu_load": "27%",
        "height_m": 35, "cohesion_kpa": 22, "friction_angle_deg": 30,
        "unit_weight_kn_m3": 20, "slope_angle_deg": 36,
        "water_depth_ratio": 0.13, "fos": 1.38
    },
    {
        "id": 3, "latitude": 20.6697, "longitude": 79.2964,
        "area_acres": 1000, "sensors": 480, "active_sensors": 472,
        "sync_accuracy": "98.6%", "update_rate": "2.1 ms",
        "vertices": "3.2M", "triangles": "2.5M", "resolution": "0.9 cm³",
        "last_update": "1 min ago", "render_time": "18.2 ms",
        "memory_usage": "980 MB", "gpu_load": "41%",
        "height_m": 55, "cohesion_kpa": 28, "friction_angle_deg": 33,
        "unit_weight_kn_m3": 22, "slope_angle_deg": 39,
        "water_depth_ratio": 0.16, "fos": 1.62
    },
    {
        "id": 4, "latitude": 16.1972, "longitude": 76.6602,
        "area_acres": 460, "sensors": 350, "active_sensors": 345,
        "sync_accuracy": "95.9%", "update_rate": "3.9 ms",
        "vertices": "2.0M", "triangles": "1.5M", "resolution": "1.2 cm³",
        "last_update": "7 min ago", "render_time": "16.3 ms",
        "memory_usage": "760 MB", "gpu_load": "32%",
        "height_m": 44, "cohesion_kpa": 24, "friction_angle_deg": 32,
        "unit_weight_kn_m3": 21, "slope_angle_deg": 38,
        "water_depth_ratio": 0.15, "fos": 1.49
    },
    {
        "id": 5, "latitude": 22.6500, "longitude": 86.3500,
        "area_acres": 950, "sensors": 470, "active_sensors": 466,
        "sync_accuracy": "98.1%", "update_rate": "1.8 ms",
        "vertices": "3.1M", "triangles": "2.4M", "resolution": "1.0 cm³",
        "last_update": "3 min ago", "render_time": "17.1 ms",
        "memory_usage": "940 MB", "gpu_load": "39%",
        "height_m": 53, "cohesion_kpa": 27, "friction_angle_deg": 33,
        "unit_weight_kn_m3": 22, "slope_angle_deg": 39,
        "water_depth_ratio": 0.15, "fos": 1.58
    },
    {
        "id": 6, "latitude": 23.7406, "longitude": 86.4146,
        "area_acres": 390, "sensors": 300, "active_sensors": 296,
        "sync_accuracy": "96.7%", "update_rate": "2.9 ms",
        "vertices": "1.8M", "triangles": "1.3M", "resolution": "1.2 cm³",
        "last_update": "6 min ago", "render_time": "15.5 ms",
        "memory_usage": "710 MB", "gpu_load": "30%",
        "height_m": 41, "cohesion_kpa": 23, "friction_angle_deg": 31,
        "unit_weight_kn_m3": 21, "slope_angle_deg": 37,
        "water_depth_ratio": 0.14, "fos": 1.42
    },
    {
        "id": 7, "latitude": 27.9833, "longitude": 75.7833,
        "area_acres": 250, "sensors": 230, "active_sensors": 227,
        "sync_accuracy": "97.2%", "update_rate": "4.3 ms",
        "vertices": "1.5M", "triangles": "1.2M", "resolution": "1.3 cm³",
        "last_update": "8 min ago", "render_time": "14.9 ms",
        "memory_usage": "650 MB", "gpu_load": "28%",
        "height_m": 34, "cohesion_kpa": 21, "friction_angle_deg": 30,
        "unit_weight_kn_m3": 20, "slope_angle_deg": 36,
        "water_depth_ratio": 0.13, "fos": 1.36
    },
    {
        "id": 8, "latitude": 22.3545, "longitude": 82.6872,
        "area_acres": 700, "sensors": 420, "active_sensors": 415,
        "sync_accuracy": "99.1%", "update_rate": "1.6 ms",
        "vertices": "2.6M", "triangles": "2.0M", "resolution": "1.0 cm³",
        "last_update": "4 min ago", "render_time": "17.6 ms",
        "memory_usage": "880 MB", "gpu_load": "36%",
        "height_m": 49, "cohesion_kpa": 26, "friction_angle_deg": 32,
        "unit_weight_kn_m3": 22, "slope_angle_deg": 38,
        "water_depth_ratio": 0.15, "fos": 1.55
    },
    {
        "id": 9, "latitude": 20.0681, "longitude": 79.3583,
        "area_acres": 450, "sensors": 340, "active_sensors": 336,
        "sync_accuracy": "95.8%", "update_rate": "3.5 ms",
        "vertices": "2.0M", "triangles": "1.5M", "resolution": "1.2 cm³",
        "last_update": "9 min ago", "render_time": "16.1 ms",
        "memory_usage": "750 MB", "gpu_load": "33%",
        "height_m": 43, "cohesion_kpa": 24, "friction_angle_deg": 31,
        "unit_weight_kn_m3": 21, "slope_angle_deg": 37,
        "water_depth_ratio": 0.14, "fos": 1.47
    },
    {
        "id": 10, "latitude": 24.4766, "longitude": 74.8726,
        "area_acres": 400, "sensors": 310, "active_sensors": 307,
        "sync_accuracy": "96.9%", "update_rate": "2.7 ms",
        "vertices": "1.9M", "triangles": "1.4M", "resolution": "1.1 cm³",
        "last_update": "10 min ago", "render_time": "15.7 ms",
        "memory_usage": "725 MB", "gpu_load": "31%",
        "height_m": 42, "cohesion_kpa": 23, "friction_angle_deg": 31,
        "unit_weight_kn_m3": 21, "slope_angle_deg": 37,
        "water_depth_ratio": 0.14, "fos": 1.44
    }
]


def find_mine_data(lat: float, lon: float):
    """Return mine data if lat/lon matches, else placeholders."""
    for mine in MINE_DATA:
        if round(mine["latitude"], 4) == round(lat, 4) and round(mine["longitude"], 4) == round(lon, 4):
            return mine
    return {key: None for key in MINE_DATA[0].keys()}


def get_weather(lat: float = None, lon: float = None):
    # Default to Gokul Open Pit Mine, Nagpur
    default_lat, default_lon = 20.6697222, 79.2963889
    if lat is None or lon is None:
        lat, lon = default_lat, default_lon
        location_name = "Gokul Open Pit Mine, Nagpur"
    else:
        location_name = f"{lat}, {lon}"

    # --- OpenWeatherMap: Current Weather ---
    try:
        owm_url = "https://api.openweathermap.org/data/2.5/weather"
        owm_params = {
            "lat": lat,
            "lon": lon,
            "appid": API_KEY,
            "units": "metric"
        }
        owm_resp = requests.get(owm_url, params=owm_params, timeout=5)
        owm_resp.raise_for_status()
        owm_data = owm_resp.json()
    except Exception as e:
        raise RuntimeError(f"❌ Failed to fetch weather data from OpenWeatherMap: {e}")

    main = owm_data.get("main", {})
    wind = owm_data.get("wind", {})

    current_temp = main.get("temp")
    humidity = main.get("humidity")
    pressure = main.get("pressure")
    windspeed = wind.get("speed", 0.0)
    winddirection = wind.get("deg")
    current_time = datetime.utcfromtimestamp(owm_data.get("dt", 0)).isoformat() + "Z"

    # --- Open-Meteo: 7-day Rainfall Forecast ---
    total_rain_7d = 0.0
    try:
        om_url = "https://api.open-meteo.com/v1/forecast"
        om_params = {
            "latitude": lat,
            "longitude": lon,
            "daily": "precipitation_sum",
            "forecast_days": 7,
            "timezone": "auto"
        }
        om_resp = requests.get(om_url, params=om_params, timeout=5)
        om_resp.raise_for_status()
        om_data = om_resp.json()
        daily_rain = om_data.get("daily", {}).get("precipitation_sum", [])
        total_rain_7d = round(sum(daily_rain), 2) if daily_rain else 0.0
    except Exception as e:
        print(f"⚠️ Could not fetch rainfall data: {e}")

    # --- Open-Meteo: Earthquake Data ---
    vibration = 0.0
    try:
        eq_url = "https://earthquake-api.open-meteo.com/v1/earthquakes"
        eq_params = {
            "latitude": lat,
            "longitude": lon,
            "past_days": 1,
            "min_magnitude": 2
        }
        eq_resp = requests.get(eq_url, params=eq_params, timeout=5)
        eq_resp.raise_for_status()
        eq_data = eq_resp.json()
        earthquakes = eq_data.get("earthquakes", [])
        if earthquakes:
            nearest_eq = earthquakes[0]
            magnitude = nearest_eq.get("magnitude", 0)
            distance = nearest_eq.get("distance", 100)
            vibration = round(magnitude / (max(1, (distance + 1) ** 0.5)), 3)
    except Exception:
        vibration = round((windspeed * 0.05) + (total_rain_7d * 0.01), 2)

    # --- Merge Weather + Mine Data ---
    mine_data = find_mine_data(lat, lon)

    return {
        "location": owm_data.get("name") or location_name,
        "latitude": lat,
        "longitude": lon,
        "time": current_time,
        "temperature_C": current_temp,
        "humidity_percent": humidity,
        "pressure_hPa": pressure,
        "windspeed_m_s": windspeed,
        "winddirection_deg": winddirection,
        "vibration_mm_s": vibration,
        "rainfall_7d_mm": total_rain_7d,
        **mine_data
    }


def main():
    data = get_weather()
    print("\n📡 Realtime Weather + Mine Data:\n" + "-"*30)
    for key, value in data.items():
        print(f"{key}: {value}")


if __name__ == "__main__":
    main()
