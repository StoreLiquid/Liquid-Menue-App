import React from 'react';

interface TagsFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagsFilter = ({ 
  availableTags, 
  selectedTags, 
  onTagsChange 
}: TagsFilterProps) => {
  
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-3 text-center text-gray-200">Geschmacksrichtungen</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {availableTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`px-3 py-1 rounded-full text-sm transition-all backdrop-blur-sm shadow-sm ${
              selectedTags.includes(tag)
                ? 'bg-black/30 text-white font-semibold border border-white/30'
                : 'bg-black/20 text-gray-200 hover:bg-black/25 border border-white/10 hover:border-white/20'
            }`}
            aria-pressed={selectedTags.includes(tag)}
            aria-label={`Geschmack ${tag}`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagsFilter; 