import React, { useState, useEffect } from "react";
import axios_client from "../config/axios_client";
const popup = require("../lib/popup");
interface Tag {
  tags_id: number;
  tags_slug: string;
  tags_name: string;
}

interface SearchTagsProps {
  onSelectedTagsChange: (tags: Tag[]) => void;
  edit_value: Tag[];
}

function MySearchSelect({ onSelectedTagsChange, edit_value }: SearchTagsProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // setTags(edit_value);
    setSelectedTags(edit_value || []);
  }, [edit_value]);

  const fetchData = async () => {
    try {
      const response = await axios_client.post<Tag[]>(`tags/`);
      setTags(response.data);
      setFilteredTags(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchValue(value);

    const filtered = tags.filter((tag) =>
      tag.tags_name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTags(filtered);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && searchValue.trim() !== "") {
      const tagToAdd = filteredTags.find(
        (tag) => tag.tags_name.toLowerCase() === searchValue.toLowerCase()
      );
      if (tagToAdd && !selectedTags.includes(tagToAdd)) {
        setSelectedTags([...selectedTags, tagToAdd]);
      }
      setSearchValue("");
      setFilteredTags(tags);
    }
  };

  const handleTagSelect = (tag: Tag) => {
    if (selectedTags.map((t) => t.tags_id).includes(tag.tags_id)) {
      popup.warning("Tag already selected");
    } else {
      const updatedTags = [...selectedTags, tag];
      setSelectedTags(updatedTags);
      onSelectedTagsChange(updatedTags);
    }
    setSearchValue("");
  };

  const handleTagRemove = (tag: Tag) => {
    const updatedTags = selectedTags.filter((t) => t.tags_id !== tag.tags_id);
    setSelectedTags(updatedTags);
    onSelectedTagsChange(updatedTags);
  };

  return (
    <div>
      <p className="text-xl">Tags:</p>
      <ul className="flex">
        {selectedTags.map((tag) => (
          <li
            className="m-1 p-1 cursor-pointer text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
            key={tag.tags_id} // Use the `tags_id` property as the key
            onClick={() => handleTagRemove(tag)}
          >
            {tag.tags_name}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Search tags"
        className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
        value={searchValue}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
      />

      <ul className="flex my-3">
        {filteredTags.slice(0,5).map((tag) => (
          <li
            className="m-1 p-1 cursor-pointer text-sm font-medium leading-5 text-white transition-colors duration-150 bg-gray-600 border border-transparent rounded-lg active:bg-gray-600 hover:bg-gray-700 focus:outline-none focus:shadow-outline-purple"
            key={tag.tags_id} // Use the `tags_id` property as the key
            onClick={() => handleTagSelect(tag)}
          >
            {tag.tags_name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MySearchSelect;
