import os
import random
import numpy as np
import pandas as pd
from datetime import date, timedelta

def generate_and_save_dataset(filename="synthetic_sales_data.csv", num_days=180, num_products=5):
    """
    Generates a multi-product synthetic sales dataset with seasonality, trend,
    noise, and promo spikes, and saves it to a CSV file.
    """
    random.seed(42)
    np.random.seed(42)
    
    start_date = date.today() - timedelta(days=num_days)
    records = []
    
    products = [
        {"product_id": 1, "base_demand": 15.0, "trend": 0.08},
        {"product_id": 2, "base_demand": 8.0,  "trend": 0.02},
        {"product_id": 3, "base_demand": 25.0, "trend": -0.05},
        {"product_id": 4, "base_demand": 12.0, "trend": 0.04},
        {"product_id": 5, "base_demand": 30.0, "trend": 0.10},
    ][:num_products]
    
    for prod in products:
        p_id = prod["product_id"]
        base_demand = prod["base_demand"]
        trend_slope = prod["trend"]
        
        for i in range(num_days):
            d = start_date + timedelta(days=i)
            day_of_week = d.weekday()
            seasonality = 1.4 if day_of_week in [4, 5, 6] else 0.9
            
            is_promo = random.random() < 0.05
            promo_factor = 2.2 if is_promo else 1.0
            
            noise = np.random.normal(0, 1.5)
            demand = max(0, (base_demand + (i * trend_slope)) * seasonality * promo_factor + noise)
            qty_sold = int(round(demand))
            
            records.append({
                "product_id": p_id,
                "sale_date": d.isoformat(),
                "quantity_sold": qty_sold,
                "is_promo": 1 if is_promo else 0
            })
            
    df = pd.DataFrame(records)
    file_path = os.path.join(os.path.dirname(__file__), filename)
    df.to_csv(file_path, index=False)
    print(f"Dataset generated with {len(df)} rows and saved to: {file_path}")
    return file_path

if __name__ == "__main__":
    generate_and_save_dataset()
