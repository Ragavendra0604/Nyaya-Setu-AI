import os
import chromadb
from chromadb.utils import embedding_functions
from pypdf import PdfReader
from typing import List, Dict

class RagService:
    def __init__(self):
        # Use a local directory for ChromaDB persistence
        self.db_path = os.path.join(os.path.dirname(__file__), "..", "chroma_db")
        os.makedirs(self.db_path, exist_ok=True)
        
        self.client = chromadb.PersistentClient(path=self.db_path)
        
        # Using a simple sentence transformer model for embeddings
        # This runs locally and doesn't require an API key
        self.embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        self.collection = self.client.get_or_create_collection(
            name="indian_laws",
            embedding_function=self.embedding_fn
        )

    def add_documents(self, file_paths: List[str], metadata_override: Dict = None):
        """Index PDF or text documents into the vector store."""
        for path in file_paths:
            if not os.path.exists(path):
                print(f"Skipping missing file: {path}")
                continue
                
            if path.endswith(".pdf"):
                try:
                    text = self._extract_text_from_pdf(path)
                except Exception as e:
                    print(f"Error reading PDF {path}: {e}")
                    continue
            else:
                with open(path, "r", encoding="utf-8") as f:
                    text = f.read()
            
            chunks = self._chunk_text(text)
            ids = [f"{os.path.basename(path)}_{i}" for i in range(len(chunks))]
            
            # Combine override metadata with default source metadata
            base_metadata = {"source": os.path.basename(path)}
            if metadata_override:
                base_metadata.update(metadata_override)
            
            metadatas = [base_metadata.copy() for _ in chunks]
            
            self.collection.upsert(
                documents=chunks,
                ids=ids,
                metadatas=metadatas
            )
            print(f"Indexed {len(chunks)} chunks from {path} with metadata {metadata_override}")

    def query(self, user_query: str, n_results: int = 3) -> str:
        """Retrieve relevant context for a query."""
        results = self.collection.query(
            query_texts=[user_query],
            n_results=n_results
        )
        
        if not results["documents"] or not results["documents"][0]:
            return ""
            
        context = "\n\n".join(results["documents"][0])
        return context

    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text

    def _chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Smarter chunking that tries to preserve paragraphs/sentences."""
        paragraphs = text.split('\n\n')
        chunks = []
        current_chunk = ""

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue
            
            # If paragraph itself is too large, split by sentence or characters
            if len(para) > chunk_size:
                if current_chunk:
                    chunks.append(current_chunk)
                    current_chunk = ""
                
                # Split large paragraph into sentences or smaller bits
                sub_parts = para.split('. ')
                for part in sub_parts:
                    if len(current_chunk) + len(part) < chunk_size:
                        current_chunk += part + ". "
                    else:
                        if current_chunk:
                            chunks.append(current_chunk.strip())
                        current_chunk = part + ". "
            else:
                if len(current_chunk) + len(para) < chunk_size:
                    current_chunk += para + "\n\n"
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                    current_chunk = para + "\n\n"
        
        if current_chunk:
            chunks.append(current_chunk.strip())
            
        return chunks
