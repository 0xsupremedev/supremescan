'use client'

import { useState, useRef, DragEvent } from 'react'
import { UploadCloud } from 'lucide-react'
import type { FileUpload } from '@/lib/types/dashboard'

export default function UploadFilesCard() {
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files).filter((file) =>
      file.name.endsWith('.sol')
    )
    if (droppedFiles.length > 0) {
      setFiles((prev) => [...prev, ...droppedFiles])
    } else {
      alert('Please upload only Solidity (.sol) files')
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []).filter((file) =>
      file.name.endsWith('.sol')
    )
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles])
    } else {
      alert('Please select Solidity (.sol) files')
    }
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) {
      alert('Please select at least one Solidity file')
      return
    }
    const upload: FileUpload = { files }
    console.log('Uploading files:', upload)
    // In a real app, this would upload files and initiate scan
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full">
      {/* Title */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Add Project</h3>
        <h4 className="text-base font-medium text-gray-700">Upload Files</h4>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 mb-4">
        Directly scan your Solidity (.sol) files.
      </p>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <UploadCloud className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm text-gray-600 mb-1">Drag and drop or browse Solidity files</p>
        <p className="text-xs text-gray-500">Only .sol files are accepted</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".sol"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mb-4 space-y-2 max-h-32 overflow-y-auto">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-sm"
            >
              <span className="text-gray-700 truncate flex-1">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveFile(index)
                }}
                className="ml-2 text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload & Scan Button */}
      <button
        onClick={handleUpload}
        className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors mt-auto"
      >
        Upload & Scan
      </button>
    </div>
  )
}

