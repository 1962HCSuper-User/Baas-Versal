import fitz  # PyMuPDF
import tkinter as tk
from tkinter import filedialog, simpledialog, messagebox, scrolledtext
from PIL import Image, ImageTk, ImageDraw, ImageFont
import pyperclip  # For copying text to clipboard


class PDFCoordinateSelector:
    def __init__(self):
        self.root = tk.Tk()
        self.root.withdraw()  # Hide the main window initially
        self.tk_image = None  # To keep a reference to the image
        self.page_width = None  # PDF page width in points
        self.page_height = None  # PDF page height in points
        self.canvas_width = 800  # Canvas width for display
        self.canvas_height = None  # Canvas height for display
        self.zoom = 2  # Zoom factor for higher resolution
        self.text_to_display = "Sample Text"  # Default text
        self.font_size = 16  # Default font size
        self.font_style = "Helvetica"  # Default font style
        self.char_spacing = 20.75  # Default character spacing
        self.word_spacing = 0  # Default word spacing
        self.text_position = (100, 100)  # Initial text position (x, y)
        self.dragging = False  # Track if text is being dragged
        self.text_objects = []  # List to store individual character text objects
        self.coordinates_list = []  # Store confirmed coordinates
        self.text_entry = None  # Initialize text_entry attribute
        self.canvas = None  # Initialize canvas attribute
        self.x_offset = 0  # Calibration offset for X coordinate
        self.y_offset = 0  # Calibration offset for Y coordinate
        self.added_texts = []  # Store added texts

    def select_pdf(self):
        """Open a file dialog to select a PDF file."""
        file_path = filedialog.askopenfilename(
            filetypes=[("PDF Files", "*.pdf")],
            title="Select a PDF File"
        )
        if file_path:
            page_number = simpledialog.askinteger(
                "Page Selection",
                "Enter the page number to analyze (starting from 1):"
            )
            if page_number:
                self.process_pdf(file_path, page_number - 1)

    def process_pdf(self, file_path, page_index):
        """Display the PDF page and allow interactive text placement."""
        try:
            # Open the PDF
            doc = fitz.open(file_path)

            # Validate page index
            if page_index < 0 or page_index >= len(doc):
                print("Invalid page number!")
                return

            # Select the specific page
            page = doc[page_index]

            # Get page dimensions
            self.page_width, self.page_height = page.rect.width, page.rect.height
            print(f"Page Dimensions (in points): {self.page_width} x {self.page_height}")

            # Render the page as an image
            mat = fitz.Matrix(self.zoom, self.zoom)  # Apply zoom
            pix = page.get_pixmap(matrix=mat)
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

            # Save the image temporarily for redrawing
            img.save("temp_page_image.png")

            # Resize the image to fit in the canvas while maintaining aspect ratio
            aspect_ratio = self.page_height / self.page_width
            self.canvas_height = int(self.canvas_width * aspect_ratio)
            resized_img = img.resize((self.canvas_width, self.canvas_height), Image.Resampling.LANCZOS)

            # Setup the Tkinter window
            self.root = tk.Toplevel()  # Create a new window
            self.root.title(f"PDF Coordinate Selector - Page {page_index + 1}")

            # Create a scrollable canvas
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

            # Convert the resized image for Tkinter
            self.tk_image = ImageTk.PhotoImage(resized_img)  # Keep a reference in the class
            self.canvas.create_image(0, 0, anchor="nw", image=self.tk_image)

            # Add a side window to store coordinates
            self.side_window = tk.Frame(self.root, width=300, bg="lightgray")
            self.side_window.pack(side=tk.RIGHT, fill=tk.Y, padx=10, pady=10)

            tk.Label(self.side_window, text="Confirmed Coordinates", font=("Helvetica", 12, "bold")).pack(pady=10)

            # Add a scrollable text area for coordinates
            self.coord_text = scrolledtext.ScrolledText(self.side_window, width=40, height=10, wrap=tk.WORD)
            self.coord_text.pack(pady=10)

            # Add a display area for added texts
            tk.Label(self.side_window, text="Added Texts", font=("Helvetica", 12, "bold")).pack(pady=10)
            self.added_texts_display = scrolledtext.ScrolledText(self.side_window, width=40, height=5, wrap=tk.WORD)
            self.added_texts_display.pack(pady=10)

            # Add a button to copy added texts
            copy_button = tk.Button(self.side_window, text="Copy Added Texts", command=self.copy_added_texts)
            copy_button.pack(pady=10)

            # Add a control panel for text input and sliders
            control_panel = tk.Frame(self.root)
            control_panel.pack(pady=10)

            # Add a text input field
            text_frame = tk.Frame(control_panel)
            text_frame.pack(pady=5)

            tk.Label(text_frame, text="Enter Text:").pack(side=tk.LEFT)
            self.text_entry = tk.Entry(text_frame, width=30)
            self.text_entry.insert(0, self.text_to_display)
            self.text_entry.pack(side=tk.LEFT, padx=5)

            # Add font size slider
            font_size_frame = tk.Frame(control_panel)
            font_size_frame.pack(pady=5)

            tk.Label(font_size_frame, text="Font Size:").pack(side=tk.LEFT)
            self.font_size_slider = tk.Scale(font_size_frame, from_=10, to=50, orient="horizontal")
            self.font_size_slider.set(self.font_size)
            self.font_size_slider.pack(side=tk.LEFT, padx=5)

            # Add character spacing slider
            char_spacing_frame = tk.Frame(control_panel)
            char_spacing_frame.pack(pady=5)

            tk.Label(char_spacing_frame, text="Char Spacing:").pack(side=tk.LEFT)
            self.char_spacing_slider = tk.Scale(char_spacing_frame, from_=0, to=50, orient="horizontal")
            self.char_spacing_slider.set(self.char_spacing)
            self.char_spacing_slider.pack(side=tk.LEFT, padx=5)

            # Add word spacing slider
            word_spacing_frame = tk.Frame(control_panel)
            word_spacing_frame.pack(pady=5)

            tk.Label(word_spacing_frame, text="Word Spacing:").pack(side=tk.LEFT)
            self.word_spacing_slider = tk.Scale(word_spacing_frame, from_=0, to=100, orient="horizontal")
            self.word_spacing_slider.set(self.word_spacing)
            self.word_spacing_slider.pack(side=tk.LEFT, padx=5)

            # Add calibration sliders
            calibration_frame = tk.Frame(control_panel)
            calibration_frame.pack(pady=5)

            # X Offset Slider
            x_offset_frame = tk.Frame(calibration_frame)
            x_offset_frame.pack(pady=5)

            tk.Label(x_offset_frame, text="X Offset:").pack(side=tk.LEFT)
            self.x_offset_slider = tk.Scale(
                x_offset_frame, from_=-200, to=200, orient="horizontal", length=400, resolution=0.1
            )
            self.x_offset_slider.set(self.x_offset)
            self.x_offset_slider.pack(side=tk.LEFT, padx=5)

            # X Offset Value Display
            x_counter_frame = tk.Frame(control_panel)
            x_counter_frame.pack(pady=5)

            tk.Label(x_counter_frame, text="X Offset Value:").pack(side=tk.LEFT)
            self.x_offset_value = tk.Label(x_counter_frame, text="0.0")
            self.x_offset_value.pack(side=tk.LEFT, padx=5)

            # Y Offset Slider
            y_offset_frame = tk.Frame(calibration_frame)
            y_offset_frame.pack(pady=5)

            tk.Label(y_offset_frame, text="Y Offset:").pack(side=tk.LEFT)
            self.y_offset_slider = tk.Scale(
                y_offset_frame, from_=-200, to=200, orient="horizontal", length=400, resolution=0.1
            )
            self.y_offset_slider.set(self.y_offset)
            self.y_offset_slider.pack(side=tk.LEFT, padx=5)

            # Y Offset Value Display
            y_counter_frame = tk.Frame(control_panel)
            y_counter_frame.pack(pady=5)

            tk.Label(y_counter_frame, text="Y Offset Value:").pack(side=tk.LEFT)
            self.y_offset_value = tk.Label(y_counter_frame, text="0.0")
            self.y_offset_value.pack(side=tk.LEFT, padx=5)

            # Add a button to confirm text placement
            confirm_button = tk.Button(control_panel, text="Confirm Placement", command=self.confirm_placement)
            confirm_button.pack(pady=10)

            # Add page dimensions input field
            dimensions_frame = tk.Frame(control_panel)
            dimensions_frame.pack(pady=10)

            tk.Label(dimensions_frame, text="Page Dimensions (width×height):").pack(side=tk.LEFT)
            self.dimensions_entry = tk.Entry(dimensions_frame, width=20)
            self.dimensions_entry.insert(0, f"{self.page_width}×{self.page_height}")
            self.dimensions_entry.pack(side=tk.LEFT, padx=5)

            apply_button = tk.Button(dimensions_frame, text="Apply Dimensions", command=self.apply_dimensions)
            apply_button.pack(side=tk.LEFT)

            # Bind events for dragging and resizing
            self.canvas.bind("<Button-1>", self.start_drag)
            self.canvas.bind("<B1-Motion>", self.drag_text)
            self.canvas.bind("<ButtonRelease-1>", self.stop_drag)
            self.font_size_slider.bind("<Motion>", self.update_font_size)
            self.char_spacing_slider.bind("<Motion>", self.update_char_spacing)
            self.word_spacing_slider.bind("<Motion>", self.update_word_spacing)
            self.x_offset_slider.bind("<Motion>", self.update_calibration)
            self.y_offset_slider.bind("<Motion>", self.update_calibration)

            # Draw the initial text
            self.draw_text()

            self.root.mainloop()
            doc.close()

        except Exception as e:
            print(f"An error occurred: {e}")

    def draw_text(self):
        """Draw the text on the canvas with character and word spacing."""
        # Clear previous text objects
        for obj in self.text_objects:
            self.canvas.delete(obj)
        self.text_objects.clear()

        # Get the text, font size, character spacing, and word spacing
        self.text_to_display = self.text_entry.get()
        self.font_size = int(self.font_size_slider.get())
        self.char_spacing = int(self.char_spacing_slider.get())
        self.word_spacing = int(self.word_spacing_slider.get())

        # Draw each character with spacing
        x, y = self.text_position
        for word in self.text_to_display.split():
            for char in word:
                text_obj = self.canvas.create_text(
                    x, y,
                    text=char,
                    font=("Helvetica", self.font_size),
                    fill="red",
                    anchor="nw"
                )
                self.text_objects.append(text_obj)
                # Update x position for the next character
                x += self.font_size + self.char_spacing
            # Update x position for the next word
            x += self.word_spacing

    def start_drag(self, event):
        """Start dragging the text."""
        if self.text_objects:
            self.dragging = True

    def drag_text(self, event):
     """Drag the text to a new position."""
     if self.dragging and self.text_objects:
        # Get the actual canvas coordinates (especially important if scrolled)
        new_x = self.canvas.canvasx(event.x)
        new_y = self.canvas.canvasy(event.y)
        
        # Allow dragging so that the text's bottom (approx. font_size height) can reach the bottom
        # If the new_y would put the text’s bottom off-canvas, adjust it:
        if new_y > self.canvas_height - self.font_size:
            new_y = self.canvas_height - self.font_size

        offset_x = new_x - self.text_position[0]
        offset_y = new_y - self.text_position[1]
        self.text_position = (new_x, new_y)

        for obj in self.text_objects:
            self.canvas.move(obj, offset_x, offset_y)


    def stop_drag(self, event):
        """Stop dragging the text."""
        self.dragging = False

    def update_font_size(self, event):
        """Update the font size dynamically."""
        self.font_size = int(self.font_size_slider.get())
        self.draw_text()

    def update_char_spacing(self, event):
        """Update the character spacing dynamically."""
        self.char_spacing = int(self.char_spacing_slider.get())
        self.draw_text()

    def update_word_spacing(self, event):
        """Update the word spacing dynamically."""
        self.word_spacing = int(self.word_spacing_slider.get())
        self.draw_text()

    def update_calibration(self, event):
        """Update the calibration offsets."""
        self.x_offset = self.x_offset_slider.get()
        self.y_offset = self.y_offset_slider.get()
        self.x_offset_value.config(text=f"{self.x_offset:.1f}")
        self.y_offset_value.config(text=f"{self.y_offset:.1f}")
        self.draw_text()

    def confirm_placement(self):
     """Confirm the text placement and store the coordinates."""
     if self.text_position:
        # Approximate the bottom of the text by adding the font size
        text_bottom_y = self.text_position[1] + self.font_size
        pdf_x = (self.text_position[0] / self.canvas_width * self.page_width) + self.x_offset
        pdf_y = ((self.canvas_height - text_bottom_y) / self.canvas_height * self.page_height) + self.y_offset

        coord_info = (
            f'"{self.text_entry.get()}": {{"coords": [({pdf_x:.2f}, {pdf_y:.2f})], '
            f'"char_spacing": {self.char_spacing}, "font_size": {self.font_size}}}'
        )
        self.coordinates_list.append(coord_info)
        self.coord_text.insert(tk.END, coord_info + ",\n")

        self.added_texts.append(f'"{self.text_entry.get()}"')
        added_texts_str = f'({", ".join(self.added_texts)})'
        self.added_texts_display.delete('1.0', tk.END)
        self.added_texts_display.insert(tk.END, added_texts_str)
     else:
        messagebox.showwarning("Warning", "No coordinates selected!")


    def copy_added_texts(self):
        """Copy the added texts to the clipboard."""
        added_texts_str = f'({", ".join(self.added_texts)})'
        pyperclip.copy(added_texts_str)
        messagebox.showinfo("Copied", "Added texts copied to clipboard!")

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
    app.select_pdf()