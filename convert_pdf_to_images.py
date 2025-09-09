#!/usr/bin/env python3
import os
import sys
from pdf2image import convert_from_path
from pdf2image.exceptions import (
    PDFInfoNotInstalledError,
    PDFPageCountError,
    PDFSyntaxError
)

def convert_pdf_to_images(pdf_path, output_dir):
    """Convert each page of a PDF to individual PNG images."""
    
    # Create output directory if it doesn't exist
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    try:
        # Convert PDF to images
        print(f"Converting PDF: {pdf_path}")
        print("This may take a moment...")
        
        # Try to convert with pdf2image
        # This will use poppler if available
        pages = convert_from_path(pdf_path, dpi=200)
        
        # Save each page as PNG
        for i, page in enumerate(pages):
            filename = f"{i+1}.png"  # Start from 1.png, 2.png, etc.
            filepath = os.path.join(output_dir, filename)
            page.save(filepath, 'PNG')
            print(f"Saved page {i+1} as {filename}")
        
        print(f"\nSuccessfully converted {len(pages)} pages to {output_dir}")
        return True
        
    except PDFInfoNotInstalledError:
        print("Error: poppler is not installed. Please install it first:")
        print("  brew install poppler")
        return False
    except Exception as e:
        print(f"Error converting PDF: {str(e)}")
        return False

if __name__ == "__main__":
    pdf_path = "/Users/webdev4life/Desktop/freelance/Valli/Mici_Lichtbildnerei_DRUCK copy.pdf"
    output_dir = "/Users/webdev4life/Desktop/freelance/Valli/portfolio-project/public/flipbook-images"
    
    # Clear existing images first (optional)
    response = input(f"This will replace all images in {output_dir}. Continue? (y/n): ")
    if response.lower() == 'y':
        # Remove existing PNG files
        for file in os.listdir(output_dir):
            if file.endswith('.png'):
                os.remove(os.path.join(output_dir, file))
        
        # Convert PDF
        convert_pdf_to_images(pdf_path, output_dir)
    else:
        print("Conversion cancelled.")