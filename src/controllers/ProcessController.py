from .BaseController import BaseController
from .ProjectController import ProjectController
import os
from models import ProcessingEnum
from typing import List
from dataclasses import dataclass


@dataclass
class Document:
    page_content: str
    metadata: dict


class ProcessController(BaseController):
    """
    This class handles all the file processing and chunking operations.
    """

    def __init__(self, project_id: str):
        super().__init__()
        self.project_id = project_id
        self.project_path = ProjectController().get_project_path(project_id=project_id)

    def get_file_extension(self, file_id: str):
        return os.path.splitext(file_id)[-1].lower()

    def get_file_content(self, file_id: str):
        file_ext = self.get_file_extension(file_id=file_id)
        file_path = os.path.join(self.project_path, file_id)

        if not os.path.exists(file_path):
            return None

        if file_ext == ProcessingEnum.TXT.value:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                return [Document(page_content=content, metadata={"source": file_path})]
            except Exception:
                return None

        if file_ext == ProcessingEnum.PDF.value:
            try:
                import fitz
                doc = fitz.open(file_path)
                pages = []
                for page_num, page in enumerate(doc):
                    text = page.get_text()
                    pages.append(Document(
                        page_content=text,
                        metadata={"source": file_path, "page": page_num}
                    ))
                doc.close()
                return pages
            except Exception:
                return None

        return None

    def process_file_content(
        self,
        file_content: list,
        file_id: str,
        chunk_size: int = 100,
        overlap_size: int = 20,
    ):
        file_content_texts = [rec.page_content for rec in file_content]
        file_content_metadata = [rec.metadata for rec in file_content]

        chunks = self.process_simpler_splitter(
            texts=file_content_texts,
            metadatas=file_content_metadata,
            chunk_size=chunk_size,
            splitter_tag="\n",
        )

        return chunks

    def process_simpler_splitter(
        self,
        texts: List[str],
        metadatas: List[dict],
        chunk_size: int,
        splitter_tag: str = "\n",
    ) -> List[str]:
        full_text = " ".join(texts)

        lines = [
            doc.strip() for doc in full_text.split(splitter_tag) if len(doc.strip()) > 1
        ]

        chunks = []
        current_chunk = ""

        for line in lines:
            current_chunk += line + splitter_tag
            if len(current_chunk) >= chunk_size:
                chunks.append(Document(page_content=current_chunk.strip(), metadata={}))
                current_chunk = ""

        if len(current_chunk) >= 0:
            chunks.append(Document(page_content=current_chunk.strip(), metadata={}))

        return chunks
