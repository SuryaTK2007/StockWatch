# StockWatch — Inventory Stockout Prediction System

## Overview
StockWatch is an intelligent inventory management and demand forecasting platform designed to prevent stockouts for businesses. By combining past sales data with machine learning algorithms, StockWatch accurately predicts when product inventory will be exhausted and automatically issues reorder alerts categorized by severity.

---

## Architecture Overview

The system architecture follows a microservice-oriented design:

```
+------------------------------------+
|   Frontend (React 19 + Vite + TS)  |
+------------------------------------+
                 |
                 | REST API (JWT Authenticated)
                 v
+------------------------------------+
|  Backend (Spring Boot + Security)  |
+------------------------------------+
                 |
                 | REST / HTTP
                 v
+------------------------------------+       SQLAlchemy       +----------------------+
| ML Service (FastAPI + scikit-learn)| ---------------------> | PostgreSQL (Docker)  |
+------------------------------------+                        +----------------------+
```

---

## Technology Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, TypeScript, Plain CSS, React Router DOM |
| **Backend** | Spring Boot 4, Spring Security, Spring Data JPA, JWT Authentication |
| **ML Microservice** | FastAPI, scikit-learn, pandas, numpy, SQLAlchemy |
| **Database** | PostgreSQL (Dockerized, Port 5433) |

---

## Key Features

- **Multi-Tenant Data Isolation**: All database tables (`User`, `Product`, `Supplier`, `Inventory`, `Sale`, `Prediction`, `Alert`) are linked to an authenticated user (`owner_id`), ensuring complete data privacy across tenants.
- **Automated Reorder Alerts**: Automatically evaluates predicted stockout dates and classifies alerts into `HIGH` ($\le 3$ days), `MEDIUM` ($\le 7$ days), and `LOW` ($\le 14$ days) severity.
- **Machine Learning Demand Forecasting**: Features 90-day baseline synthetic generation combined with actual historical sales records to train machine learning models per tenant.
- **Auto-Decremented Inventory**: Recording a new sale automatically reduces inventory levels and triggers background prediction updates.

---

## Machine Learning Pipeline

### Models Evaluated & Supported
The platform evaluates multiple machine learning models within the training pipeline:
1. **Random Forest Regressor** (Default in ML Service): Delivers the lowest Mean Absolute Error (`4.23 units`), excelling at non-linear demand trend fitting.
2. **Linear Regression**: Provides baseline linear trend fitting with high transparency.
3. **Decision Tree Regressor**: Captures step-wise decision boundaries.

### Feature Engineering
For each product, the pipeline extracts:
- `day_of_week`: Captures weekly sales seasonality (e.g., weekend spikes).
- `day_index`: Tracks sequential days elapsed to model long-term growth or decline trends.
- `rolling_7`: 7-day rolling average of daily sales velocity.
- `rolling_14`: 14-day rolling average of daily sales baseline.

---

## Database Schema

- **User**: Registered business user (`id`, `username`, `password` hashed via BCrypt).
- **Product**: Products sold by the business (`id`, `name`, `category`, `unit`, `owner_id`).
- **Supplier**: Supplier contact and lead time information (`id`, `name`, `email`, `lead_time`, `owner_id`).
- **Inventory**: Current stock counts and reorder thresholds (`id`, `product_id`, `quantity`, `reorder_threshold`, `owner_id`).
- **Sale**: Historical sales records (`id`, `product_id`, `quantity_sold`, `sale_date`, `owner_id`).
- **Prediction**: Model forecast outputs (`id`, `product_id`, `predicted_daily_demand`, `days_until_stockout`, `predicted_stockout_date`, `owner_id`).
- **Alert**: Generated stockout warnings (`id`, `product_id`, `severity`, `message`, `is_resolved`, `owner_id`).

---

## Directory Structure

```
StockWatch/
├── backend/                  # Spring Boot application
│   ├── src/main/java/        # Controllers, Services, Entities, Repositories
│   ├── compose.yaml          # PostgreSQL Docker Compose configuration
│   └── pom.xml               # Maven configuration
├── frontend/                 # React 19 + TypeScript frontend application
│   ├── src/                  # React components, pages, context, and styles
│   └── package.json
└── ml-service/               # FastAPI ML Service
    ├── main.py               # FastAPI server and prediction endpoints
    ├── generate_dataset.py   # Dataset generator script
    ├── synthetic_sales_data.csv # Synthetic sales dataset
    ├── model_training.ipynb  # Interactive Jupyter notebook for model training & evaluation
    └── test_model.py         # Standalone test script for prediction pipeline
```

---

## Prerequisites

- **Java JDK 17+**
- **Node.js 18+ & npm**
- **Python 3.10+**
- **Docker & Docker Compose**

---

## Running the Application Locally

### 1. Start PostgreSQL Database
```bash
cd backend
docker compose up -d
```

### 2. Start Spring Boot Backend
```bash
cd backend
./mvnw spring-boot:run
```
*Backend runs on `http://localhost:8080`.*

### 3. Start ML Service
```bash
cd ml-service
./venv/bin/uvicorn main:app --port 8000 --reload
```
*ML Service runs on `http://localhost:8000`.*

### 4. Start Frontend
```bash
cd frontend
npm run dev
```
*Frontend UI runs on `http://localhost:5173`.*

---

## Testing & Jupyter Notebook

- **Run Standalone ML Pipeline Test**:
  ```bash
  cd ml-service
  ./venv/bin/python test_model.py
  ```

- **Open Training & Evaluation Notebook**:
  ```bash
  cd ml-service
  ./venv/bin/jupyter notebook model_training.ipynb
  ```