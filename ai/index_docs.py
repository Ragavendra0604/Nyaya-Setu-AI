import os
import sys
import tempfile
from services.rag_service import RagService
from services.scraper_service import ScraperService

def main():
    if len(sys.argv) < 2:
        print("Usage: python index_docs.py <path_to_directory_or_file>")
        return

    path = sys.argv[1]
    rag = RagService()

    if path.startswith(("http://", "https://")):
        print(f"Scraping URL: {path}")
        text = ScraperService.scrape_url(path)
        
        # Save to a temporary file to use existing add_documents logic
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8') as tf:
            tf.write(text)
            temp_path = tf.name
            
        # Add to RAG with a custom ID/Metadata based on URL
        rag.add_documents([temp_path])
        os.unlink(temp_path)
        print(f"Successfully indexed content from {path}")
        
    elif os.path.isfile(path):
        rag.add_documents([path])
    elif os.path.isdir(path):
        for root, dirs, files in os.walk(path):
            pdf_files = [os.path.join(root, f) for f in files if f.endswith((".pdf", ".txt"))]
            if not pdf_files:
                continue
                
            # Try to determine language from directory name
            lang = "english" # default
            if "hindi" in root.lower():
                lang = "hindi"
            elif "tamil" in root.lower():
                lang = "tamil"
            
            print(f"Indexing {len(pdf_files)} files from {root} with language: {lang}")
            rag.add_documents(pdf_files, metadata_override={"language": lang})
    else:
        print(f"Path not found: {path}")

if __name__ == "__main__":
    # Add parent directory to path to allow importing from services
    sys.path.append(os.path.dirname(os.path.abspath(__file__)))
    main()
