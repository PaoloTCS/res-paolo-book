import os
import json
import fitz  # PyMuPDF for handling PDFs

# Define the path to the data folder (adjust if needed)
current_dir = os.path.dirname(os.path.abspath(__file__))
data_folder = os.path.join(current_dir, '../data')

# Function to extract text and create a data structure for the book
def process_pdf_to_slm(pdf_path):
    try:
        # Open the PDF file
        doc = fitz.open(pdf_path)
        book_data = {"title": "Extracted Book", "content": []}
        
        for i, page in enumerate(doc):
            text = page.get_text()
            book_data["content"].append({"page": i + 1, "text": text})
        
        return book_data
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return None

# Check the data folder for the object (PDF in this case)
pdf_files = [file for file in os.listdir(data_folder) if file.endswith('.pdf')]

# Process the first PDF found
if pdf_files:
    pdf_path = os.path.join(data_folder, pdf_files[0])
    slm_data = process_pdf_to_slm(pdf_path)
    
    # Save the structured data as JSON for querying
    slm_output_path = os.path.join(data_folder, 'processed_book_data.json')
    with open(slm_output_path, 'w') as json_file:
        json.dump(slm_data, json_file, indent=4)
    
    print(f"SLM data saved to {slm_output_path}")
else:
    print("No PDF files found in the data folder.")

