import os
from datetime import datetime
from bs4 import BeautifulSoup
import requests
from tkinter import Tk, filedialog

def save_txt_and_images(file_path):
    current_path = os.path.dirname(os.path.abspath(__file__))
    today_str = datetime.now().strftime('%Y%m%d')
    text_dir = os.path.join(current_path, today_str, 'content.txt')
    img_dir = os.path.join(current_path, today_str, 'imgs')
    os.makedirs(img_dir, exist_ok=True)

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    soup = BeautifulSoup(content, 'html.parser')

    text_content = soup.stripped_strings
    p_tags = soup.find_all('p')

    with open(text_dir, 'w', encoding='utf-8') as f:
        for tag in p_tags:
            f.write(f"{tag.text}\n")

    img_tags = soup.find_all('img')
    for i, img_tag in enumerate(img_tags):
        img_url = img_tag.get('src', '')
        if img_url:
            img_data = requests.get(img_url).content
            with open(os.path.join(img_dir, f'14&{i+10086}&{i}.jpg'), 'wb') as img_f:
                img_f.write(img_data)

if __name__ == '__main__':
    root = Tk()
    root.withdraw()  # Hide the main window
    txt_file_path = filedialog.askopenfilename(title="Select a txt file", filetypes=[("Text files", "*.txt")])
    if txt_file_path:
        save_txt_and_images(txt_file_path)
