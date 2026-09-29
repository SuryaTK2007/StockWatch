import os
import random
import numpy as np
import pandas as pd
from datetime import datetime, date, timedelta
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sklearn.linear_model import LinearRegression

app = FastAPI(title="StockWatch ML Service")

# Database configuration
DB_URL = os.getenv("DATABASE_URL", "postgresql://surya:123456@localhost:5433/stockwatch")
engine = create_engine(DB_URL)

class PredictRequest(BaseModel):
    product_id: int
    owner_id: int

class PredictResponse(BaseModel):
    product_id: int
    predicted_daily_demand: float
    days_until_stockout: int
    predicted_stockout_date: str

def generate_synthetic_sales(start_date: date, num_days: int = 90) -> pd.DataFrame:
    """
    Generates synthetic sales data per product with weekly seasonality,
    upward/downward trend, Gaussian noise, and occasional promotion spikes.
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

@app.get("/health")
def health_check():
    return {"status": "UP", "service": "ML Stockout Prediction"}

@app.post("/predict", response_model=PredictResponse)
def predict_stockout(req: PredictRequest):
    with engine.connect() as conn:
        # 1. Fetch Product and Inventory details
        inv_query = text("""
            SELECT i.quantity, i.reorder_threshold
            FROM inventory i
            WHERE i.product_id = :product_id AND i.owner_id = :owner_id
        """)
        inv_res = conn.execute(inv_query, {"product_id": req.product_id, "owner_id": req.owner_id}).fetchone()
        
        if not inv_res:
            raise HTTPException(status_code=404, detail=f"Inventory record for product {req.product_id} and owner {req.owner_id} not found")
        
        current_quantity = float(inv_res[0])
        
        # 2. Fetch actual sales records from DB
        sales_query = text("""
            SELECT sale_date, quantity_sold
            FROM sale
            WHERE product_id = :product_id AND owner_id = :owner_id
            ORDER BY sale_date ASC
        """)
        actual_sales_df = pd.read_sql(sales_query, conn, params={"product_id": req.product_id, "owner_id": req.owner_id})
        
    today = date.today()
    
    # 3. Generate 90 days of synthetic sales ending yesterday
    synthetic_start = today - timedelta(days=90)
    synthetic_df = generate_synthetic_sales(synthetic_start, num_days=90)
    
    # 4. Process and combine synthetic + actual sales data
    if not actual_sales_df.empty:
        actual_sales_df['sale_date'] = pd.to_datetime(actual_sales_df['sale_date']).dt.date
        # Override synthetic data on dates where actual sales exist, or concatenate unique dates
        combined_df = pd.concat([synthetic_df, actual_sales_df]).drop_duplicates(subset=['sale_date'], keep='last')
    else:
        combined_df = synthetic_df
        
    combined_df = combined_df.sort_values('sale_date').reset_index(drop=True)
    
    # 5. Feature Engineering
    combined_df['sale_date'] = pd.to_datetime(combined_df['sale_date'])
    combined_df['day_of_week'] = combined_df['sale_date'].dt.dayofweek
    min_date = combined_df['sale_date'].min()
    combined_df['day_index'] = (combined_df['sale_date'] - min_date).dt.days
    
    # Calculate rolling averages (rolling_7, rolling_14)
    combined_df['rolling_7'] = combined_df['quantity_sold'].rolling(window=7, min_periods=1).mean()
    combined_df['rolling_14'] = combined_df['quantity_sold'].rolling(window=14, min_periods=1).mean()
    
    # Fill any missing values
    combined_df = combined_df.fillna(0)
    
    # 6. Train Linear Regression Model
    feature_cols = ['day_of_week', 'day_index', 'rolling_7', 'rolling_14']
    X_train = combined_df[feature_cols]
    y_train = combined_df['quantity_sold']
    
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    # 7. Predict average daily demand for next 7 days
    future_rows = []
    last_day_index = combined_df['day_index'].max()
    last_rolling_7 = combined_df['rolling_7'].iloc[-1]
    last_rolling_14 = combined_df['rolling_14'].iloc[-1]
    
    for day_offset in range(1, 8):
        future_date = today + timedelta(days=day_offset)
        future_day_of_week = future_date.weekday()
        future_day_index = last_day_index + day_offset
        
        future_rows.append({
            'day_of_week': future_day_of_week,
            'day_index': future_day_index,
            'rolling_7': last_rolling_7,
            'rolling_14': last_rolling_14
        })
        
    X_future = pd.DataFrame(future_rows)
    future_predictions = model.predict(X_future)
    
    # Average predicted daily demand (ensure non-negative)
    predicted_daily_demand = max(0.1, float(np.mean(future_predictions)))
    
    # 8. Calculate Stockout Metrics
    days_until_stockout = int(current_quantity / predicted_daily_demand) if predicted_daily_demand > 0 else 9999
    predicted_stockout_date = today + timedelta(days=days_until_stockout)
    
    return PredictResponse(
        product_id=req.product_id,
        predicted_daily_demand=round(predicted_daily_demand, 2),
        days_until_stockout=days_until_stockout,
        predicted_stockout_date=predicted_stockout_date.isoformat()
    )
