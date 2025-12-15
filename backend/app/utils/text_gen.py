
from PIL import Image, ImageDraw, ImageFont
import io

def create_scrolling_text_gif(text, text_color=(255, 255, 255), active: bool = True):
    """
    Generates a 32x32 scrolling text GIF.
    Returns bytes of the GIF.
    """
    # Constants
    WIDTH, HEIGHT = 32, 32
    FONT_SIZE = 16 # Fallback if font file issues, though we load default usually or specific
    SCROLL_SPEED = 2 # Pixels per frame
    
    # Create font
    try:
        # Try a blocky font if available, or default
        font = ImageFont.truetype("arial.ttf", 24) 
    except IOError:
        font = ImageFont.load_default()
        
    # Calculate text size
    # Create dummy image to measure
    dummy_img = Image.new('RGB', (1, 1))
    dummy_draw = ImageDraw.Draw(dummy_img)
    text_bbox = dummy_draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # If text fits, just center it static
    if text_width <= WIDTH:
        frames = []
        img = Image.new('RGB', (WIDTH, HEIGHT), (0, 0, 0))
        draw = ImageDraw.Draw(img)
        # Center
        x = (WIDTH - text_width) // 2
        y = (HEIGHT - text_height) // 2
        draw.text((x, y), text, font=font, fill=text_color)
        
        # Make it a 1-frame GIF
        out_io = io.BytesIO()
        img.save(out_io, format='GIF')
        return out_io.getvalue()
        
    # If text is larger, scroll it
    else:
        frames = []
        # Total movement: start off screen right, move all the way to off screen left?
        # Standard marquee: Start with text just appearing on right, scroll until it disappears on left
        # Or Just scroll content through
        
        # Let's do: Start at x=32, end at x=-text_width
        total_distance = WIDTH + text_width
        
        for x_offset in range(WIDTH, -text_width, -2): # Scroll step 2
             img = Image.new('RGB', (WIDTH, HEIGHT), (0, 0, 0))
             draw = ImageDraw.Draw(img)
             
             # Draw text at offset
             y_centered = (HEIGHT - text_height) // 2
             draw.text((x_offset, y_centered), text, font=font, fill=text_color)
             
             # Convert to P mode for GIF
             frames.append(img.convert('P', palette=Image.Palette.ADAPTIVE))
             
        out_io = io.BytesIO()
        if not frames: return b''
        
        frames[0].save(
            out_io, 
            format='GIF', 
            save_all=True, 
            append_images=frames[1:], 
            loop=0, 
            duration=100, # 100ms per frame
            disposal=2
        )
        return out_io.getvalue()
