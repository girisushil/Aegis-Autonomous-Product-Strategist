import os
from backend.database.supabase_client import fetch_high_risk_count

def calculate_net_strategic_value():
    """
    Calculates the ARR at risk and total financial impact.
    Formula (LaTeX): ARR_{Risk} = (\text{Total\_High\_Risk\_Users}) \times 50
    """
    high_risk_users = fetch_high_risk_count()
    # Mock Average Contract Value (ACV) or unit risk value
    unit_risk_value = 50 
    
    arr_risk = high_risk_users * unit_risk_value
    
    return {
        "high_risk_users": high_risk_users,
        "unit_risk_value": unit_risk_value,
        "arr_risk": arr_risk,
        "impact_table": [
            {"Scenario": "Status Quo", "Risk": f"${arr_risk:,.2f}", "Action": "None"},
            {"Scenario": "Strategic Pivot", "Risk": "$0.00", "Action": "Immediate Execution"},
        ]
    }

if __name__ == "__main__":
    impact = calculate_net_strategic_value()
    print("--- Financial Impact Analysis ---")
    print(f"High Risk Users: {impact['high_risk_users']}")
    print(f"ARR at Risk: ${impact['arr_risk']:,.2f}")
    print("\nImpact Table:")
    for row in impact['impact_table']:
        print(f"{row['Scenario']}: {row['Risk']} | {row['Action']}")
