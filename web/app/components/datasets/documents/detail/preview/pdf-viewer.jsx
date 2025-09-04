'use client'
import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ binaryData }) => {
  const [numPages, setNumPages] = useState(null);

  return (
    <div>
      <Document
        file={{ data: binaryData }}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <Page 
            key={`page_${index + 1}`} 
            pageNumber={index + 1} 
            width={800}
          />
        ))}
      </Document>
    </div>
  );
};

export default PdfViewer;