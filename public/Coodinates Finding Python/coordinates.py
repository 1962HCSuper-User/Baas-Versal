import fitz  # PyMuPDF
import tkinter as tk
from tkinter import filedialog, simpledialog, messagebox, scrolledtext, ttk
from PIL import Image, ImageTk, ImageDraw, ImageFont
import pyperclip  # For copying text to clipboard
import json
import os
import re

class PDFCoordinateSelector:
    def __init__(self):
        self.root = tk.Tk()
        self.root.withdraw()  # Hide the main window initially
        self.tk_image = None
        self.page_width = None
        self.page_height = None
        self.canvas_width = 800
        self.canvas_height = None
        self.zoom = 2
        self.text_to_display = "Sample Text"
        self.font_size = 16
        self.font_style = "Helvetica"
        self.char_spacing = 18
        self.word_spacing = 0
        self.text_position = (100, 100)
        self.dragging = False
        self.text_objects = []
        self.coordinates_list = []
        self.text_entry = None
        self.canvas = None
        self.x_offset = 0
        self.y_offset = 0
        self.added_texts = []
        self.parsed_fields = {}  # Store parsed text file data
        self.field_mapping = {}  # Store field name mappings
        self.char_spaced_fields = []  # Store fields requiring character spacing
        self.photo_coords = {}  # Store photo coordinates
        self.signature_coords = {}  # Store signature coordinates
        self.stamps_coords = {}  # Store stamps coordinates
        self.current_field = None  # Track currently selected field
        self.current_element_type = "text"  # Track element type (text, photo, signature, stamp)
        self.element_index = 0  # For multiple signatures/stamps
        self.current_stamp_file = "Sahara.png"  # Default stamp file

    def select_files(self):
        """Open dialogs to select PDF and text files."""
        pdf_path = filedialog.askopenfilename(
            filetypes=[("PDF Files", "*.pdf")],
            title="Select a PDF File"
        )
        if pdf_path:
            text_path = filedialog.askopenfilename(
                filetypes=[("Text Files", "*.txt")],
                title="Select a Text File"
            )
            if text_path:
                page_number = simpledialog.askinteger(
                    "Page Selection",
                    "Enter the page number to analyze (starting from 1):"
                )
                if page_number:
                    self.parse_text_file(text_path)
                    self.process_pdf(pdf_path, page_number - 1)

    def parse_text_file(self, text_path):
        """Parse the text file to extract fields and values."""
        try:
            with open(text_path, 'r') as file:
                content = file.read()
                # Extract fields between === FORM 1 === delimiters
                form_data = re.search(r'=== FORM 1 ===\n([\s\S]*?)(?=\n===|\Z)', content)
                if form_data:
                    lines = form_data.group(1).strip().split('\n')
                    for line in lines:
                        if ':' in line:
                            key, value = line.split(':', 1)
                            self.parsed_fields[key.strip()] = value.strip()
                    # Generate field mapping
                    self.field_mapping = {key: key.replace(' ', '_').lower() for key in self.parsed_fields.keys()}
                    self.char_spaced_fields = [key for key in self.parsed_fields.keys() if key != "address"]
                    print("Parsed Fields:", self.parsed_fields)
                    print("Field Mapping:", self.field_mapping)
                else:
                    messagebox.showerror("Error", "Invalid text file format. Expected '=== FORM 1 ===' section.")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to parse text file: {e}")

    def process_pdf(self, file_path, page_index):
        """Display the PDF page and allow interactive element placement."""
        try:
            doc = fitz.open(file_path)
            if page_index < 0 or page_index >= len(doc):
                print("Invalid page number!")
                return
            page = doc[page_index]
            self.page_width, self.page_height = page.rect.width, page.rect.height
            print(f"Page Dimensions (in points): {self.page_width} x {self.page_height}")
            mat = fitz.Matrix(self.zoom, self.zoom)
            pix = page.get_pixmap(matrix=mat)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            img.save("temp_page_image.png")
            aspect_ratio = self.page_height / self.page_width
            self.canvas_height = int(self.canvas_width * aspect_ratio)
            resized_img = img.resize((self.canvas_width, self.canvas_height), Image.Resampling.LANCZOS)
            self.root = tk.Toplevel()
            self.root.title(f"PDF Coordinate Selector - Page {page_index + 1}")
            canvas_frame = tk.Frame(self.root)
            canvas_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
            self.canvas = tk.Canvas(canvas_frame, width=self.canvas_width, height=self.canvas_height, bg="white")
            scroll_y = tk.Scrollbar(canvas_frame, orient="vertical", command=self.canvas.yview)
            scroll_x = tk.Scrollbar(canvas_frame, orient="horizontal", command=self.canvas.xview)
            self.canvas.configure(yscrollcommand=scroll_y.set, xscrollcommand=scroll_x.set)
            self.canvas.bind("<Configure>", lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all")))
            scroll_y.pack(side=tk.RIGHT, fill=tk.Y)
            scroll_x.pack(side=tk.BOTTOM, fill=tk.X)
            self.canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
            self.tk_image = ImageTk.PhotoImage(resized_img)
            self.canvas.create_image(0, 0, anchor="nw", image=self.tk_image)
            self.side_window = tk.Frame(self.root, width=300, bg="lightgray")
            self.side_window.pack(side=tk.RIGHT, fill=tk.Y, padx=10, pady=10)
            tk.Label(self.side_window, text="Select Field/Element", font=("Helvetica", 12, "bold")).pack(pady=5)
            self.field_selector = ttk.Combobox(self.side_window, values=["Photo", "Signature", "Stamp"] + list(self.parsed_fields.keys()))
            self.field_selector.pack(pady=5)
            self.field_selector.bind("<<ComboboxSelected>>", self.on_field_select)
            tk.Label(self.side_window, text="Confirmed Coordinates", font=("Helvetica", 12, "bold")).pack(pady=10)
            self.coord_text = scrolledtext.ScrolledText(self.side_window, width=40, height=10, wrap=tk.WORD)
            self.coord_text.pack(pady=10)
            tk.Label(self.side_window, text="Added Elements", font=("Helvetica", 12, "bold")).pack(pady=10)
            self.added_texts_display = scrolledtext.ScrolledText(self.side_window, width=40, height=5, wrap=tk.WORD)
            self.added_texts_display.pack(pady=10)
            copy_button = tk.Button(self.side_window, text="Copy Added Elements", command=self.copy_added_texts)
            copy_button.pack(pady=5)
            preview_button = tk.Button(self.side_window, text="Preview Field Data", command=self.preview_field_data)
            preview_button.pack(pady=5)
            download_button = tk.Button(self.side_window, text="Download Coordinates JS", command=self.download_coordinates)
            download_button.pack(pady=5)
            control_panel = tk.Frame(self.root)
            control_panel.pack(pady=10)
            text_frame = tk.Frame(control_panel)
            text_frame.pack(pady=5)
            tk.Label(text_frame, text="Enter Text (for Text fields):").pack(side=tk.LEFT)
            self.text_entry = tk.Entry(text_frame, width=30)
            self.text_entry.insert(0, self.text_to_display)
            self.text_entry.pack(side=tk.LEFT, padx=5)
            font_size_frame = tk.Frame(control_panel)
            font_size_frame.pack(pady=5)
            tk.Label(font_size_frame, text="Font Size:").pack(side=tk.LEFT)
            self.font_size_slider = tk.Scale(font_size_frame, from_=10, to=50, orient="horizontal")
            self.font_size_slider.set(self.font_size)
            self.font_size_slider.pack(side=tk.LEFT, padx=5)
            char_spacing_frame = tk.Frame(control_panel)
            char_spacing_frame.pack(pady=5)
            tk.Label(char_spacing_frame, text="Char Spacing:").pack(side=tk.LEFT)
            self.char_spacing_slider = tk.Scale(char_spacing_frame, from_=0, to=50, orient="horizontal")
            self.char_spacing_slider.set(self.char_spacing)
            self.char_spacing_slider.pack(side=tk.LEFT, padx=5)
            dimension_frame = tk.Frame(control_panel)
            dimension_frame.pack(pady=5)
            tk.Label(dimension_frame, text="Element Dimensions (WxH):").pack(side=tk.LEFT)
            self.dimension_entry = tk.Entry(dimension_frame, width=15)
            self.dimension_entry.insert(0, "100x100")
            self.dimension_entry.pack(side=tk.LEFT, padx=5)
            tk.Label(dimension_frame, text="Stamp File:").pack(side=tk.LEFT)
            self.stamp_file_selector = ttk.Combobox(dimension_frame, values=["Sahara.png", "Msin.png", "Msing.png"])
            self.stamp_file_selector.set(self.current_stamp_file)
            self.stamp_file_selector.pack(side=tk.LEFT, padx=5)
            calibration_frame = tk.Frame(control_panel)
            calibration_frame.pack(pady=5)
            x_offset_frame = tk.Frame(calibration_frame)
            x_offset_frame.pack(pady=5)
            tk.Label(x_offset_frame, text="X Offset:").pack(side=tk.LEFT)
            self.x_offset_slider = tk.Scale(x_offset_frame, from_=-200, to=200, orient="horizontal", length=400, resolution=0.1)
            self.x_offset_slider.set(self.x_offset)
            self.x_offset_slider.pack(side=tk.LEFT, padx=5)
            x_counter_frame = tk.Frame(control_panel)
            x_counter_frame.pack(pady=5)
            tk.Label(x_counter_frame, text="X Offset Value:").pack(side=tk.LEFT)
            self.x_offset_value = tk.Label(x_counter_frame, text="0.0")
            self.x_offset_value.pack(side=tk.LEFT, padx=5)
            y_offset_frame = tk.Frame(calibration_frame)
            y_offset_frame.pack(pady=5)
            tk.Label(y_offset_frame, text="Y Offset:").pack(side=tk.LEFT)
            self.y_offset_slider = tk.Scale(y_offset_frame, from_=-200, to=200, orient="horizontal", length=400, resolution=0.1)
            self.y_offset_slider.set(self.y_offset)
            self.y_offset_slider.pack(side=tk.LEFT, padx=5)
            y_counter_frame = tk.Frame(control_panel)
            y_counter_frame.pack(pady=5)
            tk.Label(y_counter_frame, text="Y Offset Value:").pack(side=tk.LEFT)
            self.y_offset_value = tk.Label(y_counter_frame, text="0.0")
            self.y_offset_value.pack(side=tk.LEFT, padx=5)
            confirm_button = tk.Button(control_panel, text="Confirm Placement", command=self.confirm_placement)
            confirm_button.pack(pady=10)
            dimensions_frame = tk.Frame(control_panel)
            dimensions_frame.pack(pady=10)
            tk.Label(dimensions_frame, text="Page Dimensions (width×height):").pack(side=tk.LEFT)
            self.dimensions_entry = tk.Entry(dimensions_frame, width=20)
            self.dimensions_entry.insert(0, f"{self.page_width}×{self.page_height}")
            self.dimensions_entry.pack(side=tk.LEFT, padx=5)
            apply_button = tk.Button(dimensions_frame, text="Apply Dimensions", command=self.apply_dimensions)
            apply_button.pack(side=tk.LEFT)
            self.canvas.bind("<Button-1>", self.start_drag)
            self.canvas.bind("<B1-Motion>", self.drag_text)
            self.canvas.bind("<ButtonRelease-1>", self.stop_drag)
            self.font_size_slider.bind("<Motion>", self.update_font_size)
            self.char_spacing_slider.bind("<Motion>", self.update_char_spacing)
            self.x_offset_slider.bind("<Motion>", self.update_calibration)
            self.y_offset_slider.bind("<Motion>", self.update_calibration)
            self.draw_text()
            self.root.mainloop()
            doc.close()
        except Exception as e:
            print(f"An error occurred: {e}")

    def on_field_select(self, event):
        """Handle field selection from combobox."""
        selected = self.field_selector.get()
        self.current_field = selected
        if selected in ["Photo", "Signature", "Stamp"]:
            self.current_element_type = selected.lower()
            self.text_entry.config(state='disabled')
            self.font_size_slider.config(state='disabled')
            self.char_spacing_slider.config(state='disabled')
        else:
            self.current_element_type = "text"
            self.text_entry.config(state='normal')
            self.font_size_slider.config(state='normal')
            self.char_spacing_slider.config(state='normal')
            self.text_entry.delete(0, tk.END)
            self.text_entry.insert(0, self.parsed_fields.get(selected, "Sample Text"))
        self.draw_text()

    def draw_text(self):
        """Draw the selected element on the canvas."""
        for obj in self.text_objects:
            self.canvas.delete(obj)
        self.text_objects.clear()
        x, y = self.text_position
        if self.current_element_type == "text":
            self.text_to_display = self.text_entry.get()
            self.font_size = int(self.font_size_slider.get())
            self.char_spacing = int(self.char_spacing_slider.get())
            for word in self.text_to_display.split():
                for char in word:
                    text_obj = self.canvas.create_text(
                        x, y, text=char, font=("Helvetica", self.font_size), fill="red", anchor="nw"
                    )
                    self.text_objects.append(text_obj)
                    x += self.font_size + self.char_spacing
                x += self.word_spacing
        elif self.current_element_type in ["photo", "signature", "stamp"]:
            try:
                width, height = map(int, self.dimension_entry.get().split('x'))
                color = {"photo": "blue", "signature": "green", "stamp": "purple"}.get(self.current_element_type, "black")
                rect = self.canvas.create_rectangle(
                    x, y, x + width, y + height, outline=color, width=2
                )
                self.text_objects.append(rect)
            except:
                messagebox.showerror("Error", "Invalid dimension format. Use 'WxH' (e.g., 100x100).")

    def start_drag(self, event):
        """Start dragging the element."""
        if self.text_objects:
            self.dragging = True

    def drag_text(self, event):
        """Drag the element to a new position."""
        if self.dragging and self.text_objects:
            new_x = self.canvas.canvasx(event.x)
            new_y = self.canvas.canvasy(event.y)
            if self.current_element_type == "text":
                if new_y > self.canvas_height - self.font_size:
                    new_y = self.canvas_height - self.font_size
            else:
                try:
                    _, height = map(int, self.dimension_entry.get().split('x'))
                    if new_y > self.canvas_height - height:
                        new_y = self.canvas_height - height
                except:
                    pass
            offset_x = new_x - self.text_position[0]
            offset_y = new_y - self.text_position[1]
            self.text_position = (new_x, new_y)
            for obj in self.text_objects:
                self.canvas.move(obj, offset_x, offset_y)

    def stop_drag(self, event):
        """Stop dragging the element."""
        self.dragging = False

    def update_font_size(self, event):
        """Update the font size dynamically."""
        if self.current_element_type == "text":
            self.font_size = int(self.font_size_slider.get())
            self.draw_text()

    def update_char_spacing(self, event):
        """Update the character spacing dynamically."""
        if self.current_element_type == "text":
            self.char_spacing = int(self.char_spacing_slider.get())
            self.draw_text()

    def update_calibration(self, event):
        """Update the calibration offsets."""
        self.x_offset = self.x_offset_slider.get()
        self.y_offset = self.y_offset_slider.get()
        self.x_offset_value.config(text=f"{self.x_offset:.1f}")
        self.y_offset_value.config(text=f"{self.y_offset:.1f}")
        self.draw_text()

    def confirm_placement(self):
        """Confirm the element placement and store the coordinates."""
        if not self.current_field:
            messagebox.showwarning("Warning", "No field selected!")
            return
        pdf_x = (self.text_position[0] / self.canvas_width * self.page_width) + self.x_offset
        pdf_y = ((self.canvas_height - (self.text_position[1] + (self.font_size if self.current_element_type == "text" else 0))) / self.canvas_height * self.page_height) + self.y_offset
        if self.current_element_type == "text":
            coord_info = (
                f'"{self.current_field}": {{"coords": [{{"pos": [{pdf_x:.2f}, {pdf_y:.2f}], "char_spacing": {self.char_spacing}, "font_size": {self.font_size}}}]}}'
            )
            self.coordinates_list.append(coord_info)
            self.added_texts.append(f'"{self.current_field}"')
        elif self.current_element_type == "photo":
            try:
                width, height = map(int, self.dimension_entry.get().split('x'))
                self.photo_coords[0] = {"x": pdf_x, "y": pdf_y, "width": width, "height": height}
                self.added_texts.append(f"Photo_{0}")
            except:
                messagebox.showerror("Error", "Invalid dimension format.")
                return
        elif self.current_element_type == "signature":
            try:
                width, height = map(int, self.dimension_entry.get().split('x'))
                if 0 not in self.signature_coords:
                    self.signature_coords[0] = []
                self.signature_coords[0].append({"x": pdf_x, "y": pdf_y, "width": width, "height": height})
                self.added_texts.append(f"Signature_{0}_{len(self.signature_coords[0])-1}")
            except:
                messagebox.showerror("Error", "Invalid dimension format.")
                return
        elif self.current_element_type == "stamp":
            try:
                width, height = map(int, self.dimension_entry.get().split('x'))
                if 0 not in self.stamps_coords:
                    self.stamps_coords[0] = []
                self.stamps_coords[0].append({"file": self.stamp_file_selector.get(), "x": pdf_x, "y": pdf_y, "width": width, "height": height})
                self.added_texts.append(f"Stamp_{0}_{len(self.stamps_coords[0])-1}")
            except:
                messagebox.showerror("Error", "Invalid dimension format.")
                return
        self.coord_text.insert(tk.END, coord_info + ",\n" if self.current_element_type == "text" else f"{self.current_element_type.capitalize()}: ({pdf_x:.2f}, {pdf_y:.2f})\n")
        added_texts_str = f'({", ".join(self.added_texts)})'
        self.added_texts_display.delete('1.0', tk.END)
        self.added_texts_display.insert(tk.END, added_texts_str)

    def preview_field_data(self):
        """Show the data of the currently selected field."""
        if self.current_field and self.current_field in self.parsed_fields:
            messagebox.showinfo("Field Data", f"Field: {self.current_field}\nValue: {self.parsed_fields[self.current_field]}")
        else:
            messagebox.showwarning("Warning", "No valid field selected for preview!")

    def download_coordinates(self):
        """Generate and download the coordinates JavaScript file."""
        output_file = filedialog.asksaveasfilename(
            defaultextension=".js",
            filetypes=[("JavaScript Files", "*.js")],
            title="Save Coordinates File"
        )
        if output_file:
            coordinates_data = {
                "coordinates": {
                    0: {key: json.loads(f'{{{item}}}') for item in self.coordinates_list}
                },
                "field_mapping": self.field_mapping,
                "charSpacedFields": self.char_spaced_fields,
                "photo_signature": {
                    "photo": self.photo_coords,
                    "signature": self.signature_coords,
                    "stamps": self.stamps_coords
                }
            }
            js_content = f"window.dynamicCoordinates = {json.dumps(coordinates_data, indent=2)};"
            try:
                with open(output_file, 'w') as f:
                    f.write(js_content)
                messagebox.showinfo("Success", "Coordinates file saved successfully!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed to save coordinates file: {e}")

    def copy_added_texts(self):
        """Copy the added texts to the clipboard."""
        added_texts_str = f'({", ".join(self.added_texts)})'
        pyperclip.copy(added_texts_str)
        messagebox.showinfo("Copied", "Added elements copied to clipboard!")

    def apply_dimensions(self):
        """Apply custom page dimensions."""
        try:
            dimensions = self.dimensions_entry.get().strip()
            if "×" in dimensions:
                width, height = dimensions.split("×")
                self.page_width = float(width)
                self.page_height = float(height)
                print(f"Updated Page Dimensions: {self.page_width} x {self.page_height}")
                messagebox.showinfo("Success", "Page dimensions updated successfully!")
            else:
                messagebox.showerror("Error", "Invalid format! Use 'width×height' (e.g., 595.0×842.0).")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to update dimensions: {e}")

if __name__ == "__main__":
    app = PDFCoordinateSelector()
    app.select_files()