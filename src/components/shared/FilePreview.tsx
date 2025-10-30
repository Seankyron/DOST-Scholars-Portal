import { File, FileText, Image as ImageIcon, X } from 'lucide-react';
import { formatFileSize } from '@/lib/utils/file';

interface FilePreviewProps {
  file: File;
  onRemove?: () => void;
  showPreview?: boolean;
}

export function FilePreview({ file, onRemove, showPreview = true }: FilePreviewProps) {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf';

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {showPreview && isImage ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="h-12 w-12 rounded object-cover"
        />
      ) : (
        <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center">
          {isPdf ? (
            <FileText className="h-6 w-6 text-red-600" />
          ) : (
            <File className="h-6 w-6 text-gray-600" />
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      )}
    </div>
  );
}