import tkinter as tk
from tkinter import filedialog, messagebox
import os
import fitz  # PyMuPDF for PDF handling
from PIL import Image
import io

class PDFCompressorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("PDF Compressor")
        self.root.geometry("600x400")

        # Variables
        self.folder_path = tk.StringVar()
        self.status = tk.StringVar(value="Select a folder to start")

        # GUI Elements
        tk.Label(root, text="PDF Compressor", font=("Arial", 16)).pack(pady=10)
        tk.Button(root, text="Select Folder", command=self.select_folder).pack(pady=10)
        tk.Label(root, text="Selected Folder:").pack()
        tk.Entry(root, textvariable=self.folder_path, width=50, state='readonly').pack(pady=5)
        tk.Button(root, text="Compress PDFs", command=self.compress_pdfs).pack(pady=10)
        tk.Label(root, text="Status:").pack()
        tk.Label(root, textvariable=self.status, wraplength=500).pack(pady=5)

    def select_folder(self):
        folder = filedialog.askdirectory()
        if folder:
            self.folder_path.set(folder)
            self.status.set("Folder selected. Click 'Compress PDFs' to start.")

    def compress_pdf(self, input_path, output_path, target_size_kb=1000):
        try:
            # Open PDF with PyMuPDF
            pdf_document = fitz.open(input_path)
            output_pdf = fitz.open()

            # Process each page
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                new_page = output_pdf.new_page(width=page.rect.width, height=page.rect.height)

                # Transfer content (text, vectors) without images
                new_page.show_pdf_page(new_page.rect, pdf_document, page_num)

                # Handle images separately
                for img_index, img in enumerate(page.get_images(full=True)):
                    xref = img[0]
                    base_image = pdf_document.extract_image(xref)
                    image_bytes = base_image["image"]
                    img_ext = base_image["ext"]

                    # Convert to PIL Image for compression
                    pil_image = Image.open(io.BytesIO(image_bytes))
                    if pil_image.mode != 'RGB':
                        pil_image = pil_image.convert('RGB')

                    # Downsample and compress image with lower resolution
                    output_io = io.BytesIO()
                    quality = 40  # Start with even lower quality
                    max_size = (300, 300)  # Further reduced resolution
                    pil_image.thumbnail(max_size, Image.Resampling.LANCZOS)

                    # Adjust quality to meet size target
                    while True:
                        output_io.seek(0)
                        output_io.truncate()
                        pil_image.save(output_io, format='JPEG', quality=quality, optimize=True)
                        size_kb = output_io.getbuffer().nbytes / 1024
                        if size_kb <= target_size_kb * 0.03 or quality <= 5:  # Very strict size reserve
                            break
                        quality -= 5

                    # Insert compressed image
                    img_rect = page.get_image_rects(xref)[0]
                    new_page.insert_image(img_rect, stream=output_io.getvalue())

            # Save with maximum compression options
            output_pdf.save(
                output_path,
                garbage=4,  # Remove duplicate objects
                deflate=True,  # Compress streams
                clean=True,  # Clean content streams
                ascii=True  # Convert to ASCII for smaller size
            )

            # Check final size and adjust if necessary
            final_size_kb = os.path.getsize(output_path) / 1024
            if final_size_kb > target_size_kb:
                # Re-compress with minimal quality
                quality = max(5, quality - 10)
                output_pdf.close()
                output_pdf = fitz.open()
                for page_num in range(pdf_document.page_count):
                    page = pdf_document[page_num]
                    new_page = output_pdf.new_page(width=page.rect.width, height=page.rect.height)
                    new_page.show_pdf_page(new_page.rect, pdf_document, page_num)
                    for img_index, img in enumerate(page.get_images(full=True)):
                        xref = img[0]
                        base_image = pdf_document.extract_image(xref)
                        pil_image = Image.open(io.BytesIO(base_image["image"]))
                        if pil_image.mode != 'RGB':
                            pil_image = pil_image.convert('RGB')
                        pil_image.thumbnail(max_size, Image.Resampling.LANCZOS)
                        output_io = io.BytesIO()
                        pil_image.save(output_io, format='JPEG', quality=quality, optimize=True)
                        img_rect = page.get_image_rects(xref)[0]
                        new_page.insert_image(img_rect, stream=output_io.getvalue())
                output_pdf.save(
                    output_path,
                    garbage=4,
                    deflate=True,
                    clean=True,
                    ascii=True
                )

            pdf_document.close()
            output_pdf.close()
            final_size_kb = os.path.getsize(output_path) / 1024
            if final_size_kb > target_size_kb:
                self.status.set(f"Warning: {os.path.basename(input_path)} is {final_size_kb:.2f} KB, could not compress below 1000 KB.")
            return True
        except Exception as e:
            self.status.set(f"Error compressing {os.path.basename(input_path)}: {str(e)}")
            return False

    def compress_pdfs(self):
        folder = self.folder_path.get()
        if not folder:
            messagebox.showerror("Error", "Please select a folder first!")
            return

        output_folder = os.path.join(folder, "Compressed PDFs")
        os.makedirs(output_folder, exist_ok=True)

        pdf_files = [f for f in os.listdir(folder) if f.lower().endswith('.pdf')]
        if not pdf_files:
            messagebox.showinfo("Info", "No PDF files found in the selected folder!")
            return

        self.status.set("Compressing PDFs... Please wait.")
        self.root.update()

        for pdf_file in pdf_files:
            input_path = os.path.join(folder, pdf_file)
            output_path = os.path.join(output_folder, pdf_file)
            success = self.compress_pdf(input_path, output_path)
            if success:
                final_size_kb = os.path.getsize(output_path) / 1024
                self.status.set(f"Compressed {pdf_file} to {final_size_kb:.2f} KB.")
            self.root.update()

        messagebox.showinfo("Completed", "PDF compression process finished! Check the 'Compressed PDFs' folder.")
        self.status.set("Compression complete.")

if __name__ == "__main__":
    root = tk.Tk()
    app = PDFCompressorApp(root)
    root.mainloop()