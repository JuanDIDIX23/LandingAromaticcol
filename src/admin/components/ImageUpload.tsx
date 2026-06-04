import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  currentUrl?: string | null;
  onUploaded: (url: string, path: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
}

export function ImageUpload({
  bucket, folder = '', currentUrl, onUploaded, onRemove,
  accept = 'image/*', maxSizeMB = 5,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`El archivo supera ${maxSizeMB}MB`);
      return;
    }
    if (!isSupabaseConfigured) {
      setError('Supabase no está configurado');
      return;
    }

    setUploading(true);
    const ext  = file.name.split('.').pop();
    const path = `${folder ? folder + '/' : ''}${Date.now()}.${ext}`;

    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });

    if (upErr) {
      setError(upErr.message);
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onUploaded(data.publicUrl, path);
    }
    setUploading(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {currentUrl ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={currentUrl} alt="Preview"
            style={{ width: '100%', maxWidth: 300, height: 180, objectFit: 'cover', borderRadius: 12, border: '1px solid #e8e2d9' }}
          />
          {onRemove && (
            <button onClick={onRemove} style={{
              position: 'absolute', top: 6, right: 6,
              background: 'rgba(30,29,27,0.8)', border: 'none', borderRadius: '50%',
              width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff',
            }}>
              <X size={14} />
            </button>
          )}
          <button onClick={() => inputRef.current?.click()} style={{
            marginTop: 8, padding: '6px 14px', borderRadius: 8, fontSize: 13,
            border: '1px solid #e8e2d9', background: '#f5f4f2', color: '#5a3e2b',
            cursor: 'pointer', display: 'block',
          }}>
            Cambiar imagen
          </button>
        </div>
      ) : (
        <div
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          style={{
            border: '2px dashed #c8bba8', borderRadius: 12, padding: '32px 24px',
            textAlign: 'center', cursor: 'pointer', background: '#faf9f7',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#4a5e40'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#c8bba8'; }}
        >
          {uploading ? (
            <p style={{ color: '#9e8e7e', fontSize: 14 }}>Subiendo imagen…</p>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <ImageIcon size={32} color="#c8bba8" />
              </div>
              <p style={{ fontSize: 14, color: '#5a3e2b', marginBottom: 4 }}>
                <Upload size={13} style={{ display: 'inline', marginRight: 4 }} />
                Arrastra una imagen o haz clic para seleccionar
              </p>
              <p style={{ fontSize: 12, color: '#9e8e7e' }}>PNG, JPG, WebP · máx {maxSizeMB}MB</p>
            </>
          )}
        </div>
      )}
      {error && <p style={{ fontSize: 12, color: '#b5614a', marginTop: 6 }}>{error}</p>}
      <input
        ref={inputRef} type="file" accept={accept} style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
