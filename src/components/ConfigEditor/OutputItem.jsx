import { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";

export default function OutputItem({ index, data, onChange, remove }) {
  const [formData, setFormData] = useState(data);

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    
    // If type changes to/from image, handle conditional fields
    if (field === 'type') {
      if (value === 'image') {
        // Add image-specific fields with default values
        newData.image_subtype = newData.image_subtype || [];
        newData['3d'] = newData['3d'] !== undefined ? newData['3d'] : false;
        newData.timepoints = newData.timepoints !== undefined ? newData.timepoints : false;
        newData.tiled = newData.tiled !== undefined ? newData.tiled : false;
        newData.pyramidal = newData.pyramidal !== undefined ? newData.pyramidal : false;
      } else {
        // Remove image-specific fields
        delete newData.image_subtype;
        delete newData['3d'];
        delete newData.timepoints;
        delete newData.tiled;
        delete newData.pyramidal;
      }
    }
    
    setFormData(newData);
    onChange(index, newData);
  };

  const toggleSubtype = (subtypeValue) => {
    const currentSubtypes = formData.image_subtype || [];
    const newSubtypes = currentSubtypes.includes(subtypeValue)
      ? currentSubtypes.filter(s => s !== subtypeValue)
      : [...currentSubtypes, subtypeValue];
    handleChange('image_subtype', newSubtypes);
  };

  const addFormat = () => {
    const currentFormats = formData.file_format || [];
    handleChange('file_format', [...currentFormats, '']);
  };

  const updateFormat = (formatIndex, value) => {
    const currentFormats = [...(formData.file_format || [])];
    currentFormats[formatIndex] = value;
    handleChange('file_format', currentFormats);
  };

  const removeFormat = (formatIndex) => {
    const currentFormats = formData.file_format || [];
    const newFormats = currentFormats.filter((_, i) => i !== formatIndex);
    handleChange('file_format', newFormats);
  };

  const typeOptions = ['image', 'measurement', 'array', 'executable', 'file'];
  const fileCountOptions = ['single', 'multiple'];
  const subtypeOptions = ['grayscale', 'color', 'binary', 'labeled'];

  return (
    <div className="bg-white/10 p-4 rounded-lg mb-3 backdrop-blur-sm border border-white/20">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-medium text-white/80">Output #{index + 1}</h3>
        <button
          onClick={() => remove(index)}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Basic Fields */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. output_dir"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Type</label>
          <select
            value={formData.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select type</option>
            {typeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Conditional Subtype Field - Only for image type */}
        {formData.type === 'image' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium text-white/70 mb-2">Image Subtype</label>
            <div className="grid grid-cols-2 gap-2">
              {subtypeOptions.map(subtype => (
                <label key={subtype} className="flex items-center text-sm text-white/70">
                  <input
                    type="checkbox"
                    checked={(formData.image_subtype || []).includes(subtype)}
                    onChange={() => toggleSubtype(subtype)}
                    className="mr-2 rounded"
                  />
                  {subtype}
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">CLI Parameter</label>
          <input
            type="text"
            value={formData.cli_parameter || ''}
            onChange={(e) => handleChange('cli_parameter', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. output_image_folder"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Optional</label>
          <select
            value={formData.optional}
            onChange={(e) => handleChange('optional', e.target.value === 'true')}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value={false}>False</option>
            <option value={true}>True</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Default</label>
          <select
            value={formData.default || ''}
            onChange={(e) => handleChange('default', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select default</option>
            <option value="single">Single</option>
            <option value="directory">Directory</option>
          </select>
        </div>

        {formData.default === 'directory' && (
          <div>
            <label className="block text-sm font-medium text-white/70 mb-1">Folder Name</label>
            <input
              type="text"
              value={formData.folder_name || ''}
              onChange={(e) => handleChange('folder_name', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. /bilayers/output_images"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">File Count</label>
          <select
            value={formData.file_count || ''}
            onChange={(e) => handleChange('file_count', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select count</option>
            {fileCountOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* File Format Field - Multiple values */}
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-white/70">File Format</label>
            <button
              onClick={addFormat}
              className="flex items-center gap-1 px-2 py-1 bg-indigo-600/20 text-indigo-300 rounded-md hover:bg-indigo-600/30 transition-colors text-xs"
            >
              <Plus size={12} />
              Add File Format
            </button>
          </div>
          {formData.file_format && formData.file_format.length > 0 ? (
            <div className="space-y-2">
              {formData.file_format.map((fmt, fmtIndex) => (
                <div key={fmtIndex} className="flex gap-2">
                  <input
                    type="text"
                    value={fmt}
                    onChange={(e) => updateFormat(fmtIndex, e.target.value)}
                    className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. tiff, png, jpg"
                  />
                  <button
                    onClick={() => removeFormat(fmtIndex)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50 italic">No file formats configured. Click "Add File Format" to add one.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Section ID</label>
          <input
            type="text"
            value={formData.section_id || ''}
            onChange={(e) => handleChange('section_id', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. outputs"
          />
        </div>

        {/* Conditional Boolean Fields - Only for image type */}
        {formData.type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">3D</label>
              <select
                value={formData['3d']}
                onChange={(e) => handleChange('3d', e.target.value === 'true')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={false}>False</option>
                <option value={true}>True</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Timepoints</label>
              <select
                value={formData.timepoints}
                onChange={(e) => handleChange('timepoints', e.target.value === 'true')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={false}>False</option>
                <option value={true}>True</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Tiled</label>
              <select
                value={formData.tiled}
                onChange={(e) => handleChange('tiled', e.target.value === 'true')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={false}>False</option>
                <option value={true}>True</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Pyramidal</label>
              <select
                value={formData.pyramidal}
                onChange={(e) => handleChange('pyramidal', e.target.value === 'true')}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={false}>False</option>
                <option value={true}>True</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
