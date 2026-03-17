"use client";

import { useEffect, useState } from "react";
import { getFiles } from "./queries";
import { Eye, Clock, FileText, Image as ImageIcon } from "lucide-react";

export default function FileStorageList({ userId }: { userId: string }) {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    
    if (selectedFile && selectedFile.base64.includes('application/pdf')) {
      setIsPdfLoading(true);
      fetch(selectedFile.base64)
        .then(res => res.blob())
        .then(blob => {
          objectUrl = URL.createObjectURL(blob);
          setPdfUrl(objectUrl);
          setIsPdfLoading(false);
        }).catch(err => {
          console.error("Error creating blob URL", err);
          setIsPdfLoading(false);
        });
    } else {
      setPdfUrl(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [selectedFile]);

  useEffect(() => {
    async function fetchData() {
      const data = await getFiles(userId);
      setResult(data);
      setLoading(false);
    }
    fetchData();
  }, [userId]);

  if (loading) {
    return (
      <div className="mt-8 p-8 flex justify-center items-center bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading files...</span>
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="mt-8 p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 shadow-sm flex items-center">
        <div className="bg-red-100 p-2 rounded-full mr-3">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <span className="font-medium">Error loading your files. Please try again.</span>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Your Uploaded Files
        </h3>
        <div className="text-sm font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
          {result.data.length} {result.data.length === 1 ? 'file' : 'files'}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">Type</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">File Name</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Uploaded On</th>
              <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {result.data.map((file: any) => {
              const isPdf = file.base64.includes('application/pdf');
              return (
                <tr key={file.id} className="hover:bg-blue-50/30 transition-colors duration-200 group">
                  <td className="p-4 text-center">
                    <div className="inline-flex p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-100/50 transition-colors w-10 h-10 items-center justify-center">
                      {isPdf ? <FileText className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-gray-700">{file.name}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1.5 opacity-70" />
                      {new Date(file.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedFile(file)}
                      className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      title="Preview File"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {result.data.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
              <FileText className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No files have been uploaded yet.</p>
            <p className="text-gray-400 text-sm mt-1">Files you upload will appear here.</p>
          </div>
        )}
      </div>

      {/* PDF/Image Preview Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6" onClick={() => setSelectedFile(null)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-white">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                {selectedFile.base64.includes('application/pdf') ? <FileText className="w-5 h-5 text-red-500" /> : <ImageIcon className="w-5 h-5 text-blue-500" />}
                {selectedFile.name}
              </h3>
              <button 
                onClick={() => setSelectedFile(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close Preview"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 bg-gray-100 p-2 sm:p-4 overflow-hidden flex justify-center h-full">
              {selectedFile.base64.includes('application/pdf') ? (
                isPdfLoading ? (
                  <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mb-4"></div>
                    <p className="font-medium">Loading PDF viewer...</p>
                  </div>
                ) : pdfUrl ? (
                  <iframe 
                    src={pdfUrl} 
                    className="w-full h-full rounded shadow-sm bg-white border-0" 
                    title={selectedFile.name}
                  />
                ) : null
              ) : (
                <div className="flex items-center justify-center w-full h-full">
                  <img 
                    src={selectedFile.base64} 
                    alt={selectedFile.name}
                    className="max-w-full max-h-full object-contain rounded shadow-sm bg-white"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
