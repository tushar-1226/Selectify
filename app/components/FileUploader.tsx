import {useState, useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;

        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const {getRootProps, getInputProps, isDragActive, acceptedFiles} = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf']},
        maxSize: maxFileSize,
    })

    const file = acceptedFiles[0] || null;



    return (
        <div className="w-full">
            <div {...getRootProps()} className={`relative p-12 text-center transition-all duration-300 cursor-pointer bg-slate-900/30 border-2 border-dashed border-slate-700/50 hover:border-sky-500/50 hover:bg-sky-500/5 rounded-2xl min-h-[220px] flex flex-col items-center justify-center gap-4 group ${isDragActive ? 'border-sky-500 bg-sky-500/10 scale-[1.02]' : ''}`}>
                <input {...getInputProps()} />

                <div className="w-full">
                    {file ? (
                        <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"/>
                                    </svg>
                                </div>
                                <div className="flex flex-col items-start text-left">
                                    <p className="text-sm font-semibold text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2.5 cursor-pointer text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors" onClick={(e) => {
                                e.stopPropagation();
                                onFileSelect?.(null)
                            }}>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ): (
                        <div className={`flex flex-col items-center justify-center transition-transform duration-500 ${isDragActive ? 'scale-105' : ''}`}>
                            <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 transition-transform duration-500 group-hover:text-sky-400 group-hover:bg-sky-500/10">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <p className="text-lg text-slate-300 font-medium mb-1">
                                <span className="text-sky-400 font-semibold">
                                    {isDragActive ? 'Drop your PDF here' : 'Click to upload'}
                                </span> {!isDragActive && 'or drag and drop'}
                            </p>
                            <p className="text-sm text-slate-500">PDF documents only (max {formatSize(maxFileSize)})</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
export default FileUploader