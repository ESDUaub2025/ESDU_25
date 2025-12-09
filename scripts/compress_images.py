import os
from PIL import Image
import shutil

def compress_images(directory, backup_dir, max_width=2000, quality=85):
    # Create backup directory if it doesn't exist
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
        print(f"Created backup directory: {backup_dir}")

    # Supported extensions
    extensions = ['.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG']
    
    total_saved = 0

    for filename in os.listdir(directory):
        file_path = os.path.join(directory, filename)
        
        # Skip directories
        if os.path.isdir(file_path):
            continue
            
        # Check extension
        ext = os.path.splitext(filename)[1]
        if ext not in extensions:
            continue

        # Calculate original size
        original_size = os.path.getsize(file_path)
        
        # Backup the file
        backup_path = os.path.join(backup_dir, filename)
        if not os.path.exists(backup_path):
            shutil.copy2(file_path, backup_path)
        
        try:
            with Image.open(file_path) as img:
                # Convert RGBA to RGB if saving as JPEG (PNG handles RGBA)
                if ext.lower() in ['.jpg', '.jpeg'] and img.mode == 'RGBA':
                    img = img.convert('RGB')
                
                # Resize if too large
                width, height = img.size
                if width > max_width:
                    ratio = max_width / width
                    new_height = int(height * ratio)
                    img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
                    print(f"Resized {filename}: {width}x{height} -> {max_width}x{new_height}")
                
                # Save compressed
                # For PNG, quality param is different or not used the same way in save(), 
                # but optimize=True helps. For JPEG, quality is key.
                if ext.lower() == '.png':
                    img.save(file_path, optimize=True)
                else:
                    img.save(file_path, optimize=True, quality=quality)
                
                new_size = os.path.getsize(file_path)
                saved = original_size - new_size
                total_saved += saved
                
                print(f"Compressed {filename}: {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB (Saved {saved/1024:.1f}KB)")

        except Exception as e:
            print(f"Error processing {filename}: {e}")

    print(f"\nTotal space saved: {total_saved / (1024*1024):.2f} MB")
    print(f"Originals backed up to: {backup_dir}")

if __name__ == "__main__":
    # Adjust paths relative to where the script is run
    # Assuming script is in ROOT/scripts/ and images in ROOT/assets/images/
    # But we will run it from ROOT usually.
    
    base_dir = os.getcwd()
    images_dir = os.path.join(base_dir, 'assets', 'images')
    backup_dir = os.path.join(images_dir, 'backup')
    
    print(f"Processing images in: {images_dir}")
    compress_images(images_dir, backup_dir)
