"""
Standalone script to test the StockWatch ML prediction model and dataset generation locally.
Run with: python test_model.py
"""

import random
import numpy as np
import pandas as pd
from datetime import datetime, date, timedelta
from sklearn.linear_model import LinearRegression

def generate_synthetic_sales(start_date: date, num_days: int = 90) -> pd.DataFrame:
    """
    Generates synthetic sales data per product with:
    - Weekly seasonality (higher demand on weekends)
    - Trend (slight growth over time)
    - Noise (Gaussian random variance)
    - Promotion spikes (random ~5% chance)
    """
    dates = [start_date + timedelta(days=i) for i in range(num_days)]
    base_demand = 10.0
    trend_slope = 0.05  # Slight upward demand trend over time
    
    data = []
    for i, d in enumerate(dates):
        # Seasonality: higher sales on weekends (Friday=4, Saturday=5, Sunday=6)
        day_of_week = d.weekday()
        seasonality = 1.4 if day_of_week in [4, 5, 6] else 0.9
        
        # Promotion spikes: ~5% chance of a promo doubling sales
        is_promo = random.random() < 0.05
        promo_factor = 2.2 if is_promo else 1.0
        
        # Noise component
        noise = np.random.normal(0, 1.5)
        
        # Combined demand calculation
        demand = (base_demand + (i * trend_slope)) * seasonality * promo_factor + noise
        qty_sold = max(0, int(round(demand)))
        
        data.append({
            "sale_date": d,
            "quantity_sold": qty_sold
        })
        
    return pd.DataFrame(data)

def test_prediction_pipeline(current_inventory_qty: float = 150.0):
    today = date.today()
    synthetic_start = today - timedelta(days=90)
    
    print("=== 1. Generating 90 Days of Synthetic Sales Data ===")
    synthetic_df = generate_synthetic_sales(synthetic_start, num_days=90)
    print(synthetic_df.head(10))
    print(f"Total synthetic data rows: {len(synthetic_df)}\n")
    
    # Optional mock actual sales data (e.g. 5 recent sales recorded by user)
    mock_actual_sales = pd.DataFrame([
        {"sale_date": today - timedelta(days=4), "quantity_sold": 18},
        {"sale_date": today - timedelta(days=3), "quantity_sold": 22},
        {"sale_date": today - timedelta(days=2), "quantity_sold": 15},
        {"sale_date": today - timedelta(days=1), "quantity_sold": 20},
    ])
    
    print("=== 2. Combining Synthetic & Actual Sales ===")
    combined_df = pd.concat([synthetic_df, mock_actual_sales]).drop_duplicates(subset=['sale_date'], keep='last')
    combined_df = combined_df.sort_values('sale_date').reset_index(drop=True)
    
    print("=== 3. Feature Engineering ===")
    combined_df['sale_date'] = pd.to_datetime(combined_df['sale_date'])
    combined_df['day_of_week'] = combined_df['sale_date'].dt.dayofweek
    min_date = combined_df['sale_date'].min()
    combined_df['day_index'] = (combined_df['sale_date'] - min_date).dt.days
    
    combined_df['rolling_7'] = combined_df['quantity_sold'].rolling(window=7, min_periods=1).mean()
    combined_df['rolling_14'] = combined_df['quantity_sold'].rolling(window=14, min_periods=1).mean()
    combined_df = combined_df.fillna(0)
    
    print(combined_df[['sale_date', 'quantity_sold', 'day_of_week', 'day_index', 'rolling_7', 'rolling_14']].tail(7))
    print()

    print("=== 4. Training Linear Regression Model ===")
    feature_cols = ['day_of_week', 'day_index', 'rolling_7', 'rolling_14']
    X_train = combined_df[feature_cols]
    y_train = combined_df['quantity_sold']
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    print(f"Model Coefficients: {dict(zip(feature_cols, model.coef_))}")
    print(f"Model Intercept: {model.intercept_:.4f}\n")

    print("=== 5. Forecasting Demand for Next 7 Days ===")
    future_rows = []
    last_day_index = combined_df['day_index'].max()
    last_rolling_7 = combined_df['rolling_7'].iloc[-1]
    last_rolling_14 = combined_df['rolling_14'].iloc[-1]
    
    for day_offset in range(1, 8):
        future_date = today + timedelta(days=day_offset)
        future_rows.append({
            'day_of_week': future_date.weekday(),
            'day_index': last_day_index + day_offset,
            'rolling_7': last_rolling_7,
            'rolling_14': last_rolling_14
        })
        
    X_future = pd.DataFrame(future_rows)
    future_predictions = model.predict(X_future)
    predicted_daily_demand = max(0.1, float(np.mean(future_predictions)))
    
    days_until_stockout = int(current_inventory_qty / predicted_daily_demand)
    predicted_stockout_date = today + timedelta(days=days_until_stockout)
    
    print(f"Current Inventory Quantity: {current_inventory_qty} units")
    print(f"Predicted Avg Daily Demand: {predicted_daily_demand:.2f} units/day")
    print(f"Days Until Stockout: {days_until_stockout} days")
    print(f"Predicted Stockout Date: {predicted_stockout_date.isoformat()}")

if __name__ == "__main__":
    test_prediction_pipeline()
