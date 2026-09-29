import json

notebook_path = "model_training.ipynb"

with open(notebook_path, "r") as f:
    nb = json.load(f)

# Cell to print markdown table of model comparison metrics
metrics_cell = {
   "cell_type": "code",
   "execution_count": None,
   "metadata": {},
   "outputs": [],
   "source": [
    "# 9. Model Performance Accuracy Comparison Table\n",
    "from IPython.display import display, Markdown\n",
    "\n",
    "metrics_data = [\n",
    "    {\"Model\": \"Linear Regression\", \"R² Score\": f\"{r2:.4f}\", \"MAE (Units)\": f\"{mae:.2f}\", \"RMSE\": f\"{rmse:.2f}\"},\n",
    "    {\"Model\": \"Decision Tree (depth=5)\", \"R² Score\": f\"{dt_r2:.4f}\", \"MAE (Units)\": f\"{mean_absolute_error(y_test, dt_model.predict(X_test)):.2f}\", \"RMSE\": f\"{np.sqrt(mean_squared_error(y_test, dt_model.predict(X_test))):.2f}\"},\n",
    "    {\"Model\": \"Random Forest (100 trees)\", \"R² Score\": f\"{rf_r2:.4f}\", \"MAE (Units)\": f\"{mean_absolute_error(y_test, rf_model.predict(X_test)):.2f}\", \"RMSE\": f\"{np.sqrt(mean_squared_error(y_test, rf_model.predict(X_test))):.2f}\"}\n",
    "]\n",
    "\n",
    "md_table = \"\"\"### Model Accuracy Metrics Comparison\n",
    "| Model | R² Score | MAE (Mean Absolute Error) | RMSE (Root Mean Squared Error) |\n",
    "| :--- | :---: | :---: | :---: |\n",
    "\"\"\"\n",
    "for row in metrics_data:\n",
    "    md_table += f\"| **{row['Model']}** | `{row['R² Score']}` | `{row['MAE (Units)']} units` | `{row['RMSE']} units` |\\n\"\n",
    "\n",
    "display(Markdown(md_table))"
   ]
}

nb["cells"].append({
   "cell_type": "markdown",
   "metadata": {},
   "source": [
    "## 9. Model Accuracy Metrics Summary\n",
    "Comparing $R^2$ Score, MAE, and RMSE metrics across Linear Regression, Decision Tree, and Random Forest models."
   ]
})
nb["cells"].append(metrics_cell)

with open(notebook_path, "w") as f:
    json.dump(nb, f, indent=2)

print("Added accuracy metrics comparison table to model_training.ipynb")
