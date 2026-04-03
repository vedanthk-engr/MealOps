from bs4 import BeautifulSoup
from typing import List

# Read your VTOP debug HTML
with open('vtop_student_debug.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'lxml')

def find_field(possible_labels: List[str]) -> str:
    for label in possible_labels:
        target = label.lower().strip()
        # Search all table cells for the label
        for cell in soup.find_all(['td', 'th', 'label']):
            text = cell.get_text().lower().strip()
            if target in text:
                # Found label cell, get next cell
                val_cell = cell.find_next_sibling(['td', 'th'])
                if val_cell:
                    val = val_cell.get_text().strip()
                    if val:
                        return val
    return ""

print("--- STARTING SCRAPER TEST ---")
results = {
    "Name": find_field(["Name", "Student Name"]),
    "Programme": find_field(["Programme", "Course", "Degree"]),
    "Branch": find_field(["Branch", "Major"]),
    "Hostel": find_field(["Hostel Block", "Block"]),
    "Room": find_field(["Room No", "Room Number"]),
    "Mess": find_field(["Mess", "Mess Type"])
}
print("--- TEST SUMMARY ---")
for k, v in results.items():
    print(f"{k}: {v or 'MISSING'}")
