import numpy as np
import json

# Function to generate random lat, long within India's geographical boundaries and random AQI
def generate_data_points(num_points):
    # Latitude range for India (approx.)
    lat_min, lat_max = 8.4, 37.6
    # Longitude range for India (approx.)
    long_min, long_max = 68.7, 97.25
    
    data = []
    for _ in range(num_points):
        lat = np.random.uniform(lat_min, lat_max)
        lng = np.random.uniform(long_min, long_max)
        aqi = np.random.randint(0, 500)  # AQI ranges from 0 to 500
        data.append({'lat': lat, 'lng': lng, 'aqi': aqi})
    
    return data

# Number of data points to generate
num_points = 500

# Generate the data points
data_points = generate_data_points(num_points)

# Convert the data points to JSON
data_points_json = json.dumps(data_points, indent=4)

# Print the JSON data
print(data_points_json)

# Optionally, save the JSON data to a file
with open('india_aqi_data.json', 'w') as f:
    f.write(data_points_json)
