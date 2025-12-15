
import simplepyble
import time
import zlib
from PIL import Image, ImageDraw, ImageFont
import math
import colorsys
import io

SERVICE_UUID = "000000fa-0000-1000-8000-00805f9b34fb"
WRITE_CMD_UUID = "0000fa02-0000-1000-8000-00805f9b34fb"
NOTIFICATION_UUID = "0000fa03-0000-1000-8000-00805f9b34fb"
MIN_BYTE_VALUE = 0x80

class IDotMatrix:
    def __init__(self):
        self.peripheral = None
        self.adapter = self._get_adapter()
        self.is_connected = False

    def _get_adapter(self):
        adapters = simplepyble.Adapter.get_adapters()
        if not adapters:
            raise Exception("No Bluetooth adapters found")
        return adapters[0]

    def scan_devices(self, timeout=5000):
        print("Scanning for devices...")
        self.adapter.scan_for(timeout)
        peripherals = self.adapter.scan_get_results()
        devices = []
        for p in peripherals:
            if p.identifier().startswith("IDM-") or p.identifier().startswith("LEDnetWF"):
                devices.append({
                    "name": p.identifier(),
                    "address": p.address(),
                    "rssi": p.rssi()
                })
        return devices

    def connect(self, address):
        self.adapter.scan_for(2000) # Quick scan to refresh
        peripherals = self.adapter.scan_get_results()
        target = None
        for p in peripherals:
            if p.address() == address:
                target = p
                break
        
        if not target:
            raise Exception(f"Device {address} not found during connect scan.")

        print(f"Connecting to {target.identifier()}...")
        target.connect()
        self.peripheral = target
        self.is_connected = True
        
        try:
             # Setup notification if needed, usually just connecting is enough for write
             # self.peripheral.notify(SERVICE_UUID, NOTIFICATION_UUID, self._notification_handler)
             pass
        except Exception as e:
            print(f"Warning during notify setup: {e}")

        # Turn on and sync time
        self.switch_on(True)
        # self.sync_time() 
        return True

    def disconnect(self):
        if self.peripheral and self.is_connected:
            self.peripheral.disconnect()
            self.is_connected = False
            self.peripheral = None

    def _write_packet(self, packet):
        if not self.peripheral or not self.is_connected:
             raise Exception("Not connected")
        self.peripheral.write_request(SERVICE_UUID, WRITE_CMD_UUID, bytes(packet))

    def _notification_handler(self, response):
        print(f"Response: {response.hex()}")

    def switch_on(self, state):
        packet = bytearray.fromhex("05 00 07 01 01")
        packet[4] = 1 if state else 0
        self._write_packet(packet)

    def sync_time(self):
        current_time = time.localtime(time.time())
        year = current_time.tm_year & 0xff
        month = current_time.tm_mon
        day = current_time.tm_mday
        dow = current_time.tm_wday + 1
        hour = current_time.tm_hour
        minute = current_time.tm_min
        seconds = current_time.tm_sec
        packet = bytearray.fromhex("0b 00 01 80 e7 0c 12 01 0a 26 10")
        packet[3] = MIN_BYTE_VALUE
        packet[4] = year
        packet[5] = month
        packet[6] = day
        packet[7] = dow
        packet[8] = hour
        packet[9] = minute
        packet[10] = seconds
        self._write_packet(packet)

    def send_image(self, image_data: bytes):
        """
        Expects a 32x32 GIF or Image bytes. 
        If it's a static image, we might need to convert it to a single frame GIF or handled differently.
        The original code treats GIFs specially with chunking.
        """
        # Calculate CRC
        crc = zlib.crc32(image_data)
        
        # Build Header
        header = bytearray.fromhex("FF FF 01 00 00 FF FF FF FF FF FF FF FF 05 00 0d")
        header[9]  = crc.to_bytes(4, byteorder='little')[0]
        header[10] = crc.to_bytes(4, byteorder='little')[1]
        header[11] = crc.to_bytes(4, byteorder='little')[2]
        header[12] = crc.to_bytes(4, byteorder='little')[3]

        l = len(image_data)
        total_len = l + (len(header) * 2) 
        # Note: Original code logic for total_len might be specific to their protocol interpretation
        
        header[5] = total_len.to_bytes(4, byteorder='little')[0]
        header[6] = total_len.to_bytes(4, byteorder='little')[1]
        header[7] = total_len.to_bytes(4, byteorder='little')[2]
        header[8] = total_len.to_bytes(4, byteorder='little')[3]

        chunks = []
        for i in range(0, len(image_data), 4096):
            chunk = image_data[i:i+4096]
            chunks.append(chunk)

        for i in range(len(chunks)):
            if i > 0: header[4] = 2
            else: header[4] = 0
            
            chunk_len = len(chunks[i]) + len(header)
            header[0] = chunk_len.to_bytes(2, byteorder='little')[0]
            header[1] = chunk_len.to_bytes(2, byteorder='little')[1]

            self._write_packet(header + chunks[i])
            time.sleep(0.5) # Wait between chunks
        
        # Original code had a reset or something at the end?
        # send_reset_command() was called in main
        # self.send_reset_command()

    def send_reset_command(self):
        packet = bytearray.fromhex("04 00 03 80")
        self._write_packet(packet)
        packet = bytearray.fromhex("05 00 04 80 50")
        self._write_packet(packet)

    def convert_image_to_32x32(self, image_path_or_file):
        from PIL import ImageSequence, ImageOps
        with Image.open(image_path_or_file) as img:
            out_io = io.BytesIO()
            
            if getattr(img, "is_animated", False):
                frames = []
                durations = []
                # Loop through frames
                for frame in ImageSequence.Iterator(img):
                    # Restore duration to default if likely invalid (0)
                    d = frame.info.get('duration', 100)
                    if d < 20: d = 100 # Sanity check for extremely fast/broken durations
                    durations.append(d)
                    
                    # Convert to RGBA to handle transparency correctly during resize
                    current_frame = frame.convert('RGBA')
                    
                    # High quality resize
                    current_frame = current_frame.resize((32, 32), Image.Resampling.LANCZOS)
                    
                    # Create a black background to merge transparency (device might not support transparency well)
                    # or just keep it. Let's try to keep it but convert to P mode properly.
                    # Best practice for pixel art LED displays: Avoid partial transparency.
                    # Start with a black canvas
                    new_frame = Image.new('RGB', (32, 32), (0, 0, 0))
                    new_frame.paste(current_frame, (0, 0), mask=current_frame.split()[3]) # Use alpha channel as mask
                    
                    # Convert to P mode for GIF compatibility (256 colors max)
                    # Using ADAPTIVE palette for better colors
                    frames.append(new_frame.convert('P', palette=Image.Palette.ADAPTIVE, colors=255))

                # Save as GIF
                # duration takes a list of integers for each frame
                # disposal=2 forces background clear before next frame (helps with ghosting)
                frames[0].save(
                    out_io, 
                    format='GIF', 
                    save_all=True, 
                    append_images=frames[1:], 
                    loop=0, 
                    duration=durations, 
                    disposal=2,
                    optimize=False
                )
            else:
                # Static image
                img = img.convert('RGBA')
                img = img.resize((32, 32), Image.Resampling.LANCZOS)
                new_img = Image.new('RGB', (32, 32), (0, 0, 0))
                new_img.paste(img, (0, 0), mask=img.split()[3])
                
                new_img.save(out_io, format='GIF')
            
            return out_io.getvalue()

controller = IDotMatrix()
