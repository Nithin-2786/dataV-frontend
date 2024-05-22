import random
from datetime import datetime, timedelta

# Generate random air pollution data for Hyderabad, India
def generate_pollution_data():
    pollution_data = {}
    for _ in range(20):  # Generate data for 20 locations within Hyderabad
        lat = 17.36 + random.uniform(-0.05, 0.05)
        lon = 78.45 + random.uniform(-0.05, 0.05)
        aqi_values = [random.randint(0, 200) for _ in range(7)]  # Random AQI values for 7 days
        pollution_data[(lat, lon)] = aqi_values
    return pollution_data

# Generate air pollution data for a week at multiple locations
def generate_weekly_data(start_date):
    pollution_data = generate_pollution_data()
    with open('pollution_data.txt', 'w') as file:
        for i in range(7):  # Data for each day of the week
            date = start_date + timedelta(days=i)
            for (lat, lon), aqi_values in pollution_data.items():
                aqi = aqi_values[i]
                file.write(f"{date.strftime('%Y-%m-%d')},{lat},{lon},{aqi}\n")

# Start date for generating data
start_date = datetime(2024, 4, 1)
generate_weekly_data(start_date)
