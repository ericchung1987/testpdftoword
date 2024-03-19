import sys
from pdf2image import convert_from_path
import pytesseract
from docx import Document

def pdf_to_images(pdf_path):
    return convert_from_path(pdf_path)

def images_to_text(images):
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    text = ""
    for i, img in enumerate(images):
        text += pytesseract.image_to_string(img)
        print(f"{(i + 1) / len(images) * 100}%")  # print progress
    return text

def text_to_word(text, doc_path):
    doc = Document()
    doc.add_paragraph(text)
    doc.save(doc_path)


pdf_path = sys.argv[1]
doc_path = sys.argv[2]

images = pdf_to_images(pdf_path)
text = images_to_text(images)
text_to_word(text, doc_path)