from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
from dotenv import load_dotenv
import os
import traceback
import csv
from datetime import datetime

load_dotenv()  # încarcă variabilele din .env


app = Flask(__name__)
CORS(app)

# Endpoint pentru vreme
@app.route('/api/weather', methods=['GET'])
def get_weather():
    # Verifică dacă s-au trimis coordonate (folosit de hartă)
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    city = request.args.get('city')
    
    api_key = os.getenv('API_KEY')
    if not api_key:
        return jsonify({"error": "Cheia API nu este configurată"}), 500
    
    # Construiește URL-ul în funcție de ce s-a primit (coordonate sau oraș)
    if lat and lon:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=ro"
    elif city:
        url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=ro"
    else:
        return jsonify({"error": "Furnizează 'city' sau 'lat' și 'lon'"}), 400
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        weather_info = {
            "city": data["name"],
            "lat": data["coord"]["lat"],
            "lon": data["coord"]["lon"],
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],
            "wind_speed": data["wind"]["speed"]
        }
        return jsonify(weather_info)
    except requests.exceptions.RequestException as e:
        return jsonify({"error": f"Eroare la cererea meteo: {str(e)}"}), 500

@app.route('/api/forecast', methods=['GET'])
def get_forecast():
    city = request.args.get('city', 'Bucharest')
    api_key = os.getenv('API_KEY')
    
    # Verificare cheie API
    if not api_key:
        return jsonify({"error": "Cheia API nu este configurată în .env"}), 500
    
    # Debug: printează primele caractere ale cheii (nu toată)
    print(f"API_KEY începe cu: {api_key[:5]}...")
    
    url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={api_key}&units=metric&lang=ro"
    
    try:
        print(f"Trimit cerere către: {url}")  # atenție – va afișa cheia completă în log; poți șterge după debug
        response = requests.get(url)
        print(f"Status cod: {response.status_code}")
        
        # Dacă statusul nu este 200, aruncă excepție cu textul răspunsului
        if response.status_code != 200:
            return jsonify({"error": f"API a returnat {response.status_code}: {response.text}"}), 500
        
        data = response.json()
        
        # Extragem prognoza pe zile (o singură valoare pe zi, la prânz)
        forecast_by_day = []
        seen_dates = set()
        
        # Verifică dacă există cheia 'list' în răspuns
        if 'list' not in data:
            return jsonify({"error": "Răspuns invalid de la API (lipsește 'list')"}), 500
        
        for item in data['list']:
            date = item['dt_txt'].split(' ')[0]
            if date not in seen_dates:
                seen_dates.add(date)
                forecast_by_day.append({
                    "date": date,
                    "temperature": item['main']['temp'],
                    "humidity": item['main']['humidity'],
                    "description": item['weather'][0]['description'],
                    "icon": item['weather'][0]['icon'],
                    "wind_speed": item['wind']['speed']
                })
            if len(forecast_by_day) == 5:
                break
        
        return jsonify({
    "city": data['city']['name'],
    "lat": data['city']['coord']['lat'],
    "lon": data['city']['coord']['lon'],
    "forecast": forecast_by_day
})
        
    except Exception as e:
        # Printează eroarea completă în terminal
        traceback.print_exc()
        return jsonify({"error": f"Eroare internă: {str(e)}"}), 500

@app.route('/api/save_history', methods=['POST'])
def save_history():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Nu s-au primit date"}), 400
    
    city = data.get('city')
    temperature = data.get('temperature')
    humidity = data.get('humidity')
    description = data.get('description')
    
    if not all([city, temperature, humidity, description]):
        return jsonify({"error": "Lipsesc câmpuri necesare"}), 400
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    csv_file = 'history.csv'
    file_exists = False
    
    # Verifică dacă fișierul există deja
    try:
        with open(csv_file, 'r', encoding='utf-8'):
            file_exists = True
    except FileNotFoundError:
        pass
    
    # Scrie în CSV
    with open(csv_file, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(['Timestamp', 'City', 'Temperature_C', 'Humidity', 'Description'])
        writer.writerow([timestamp, city, temperature, humidity, description])
    
    return jsonify({"message": "Istoric salvat cu succes"}), 200

@app.route('/api/get_history', methods=['GET'])
def get_history():
    csv_file = 'history.csv'
    try:
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            rows = list(reader)
        return jsonify({"history": rows}), 200
    except FileNotFoundError:
        return jsonify({"history": []}), 200

@app.route('/api/clear_history', methods=['DELETE'])
def clear_history():
    csv_file = 'history.csv'
    try:
        # Șterge fișierul dacă există
        if os.path.exists(csv_file):
            os.remove(csv_file)
        # Creează un fișier nou doar cu antetul (header)
        with open(csv_file, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(['Timestamp', 'City', 'Temperature_C', 'Humidity', 'Description'])
        return jsonify({"message": "Istoric șters cu succes"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)