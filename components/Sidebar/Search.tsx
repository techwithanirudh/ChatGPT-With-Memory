import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { FC } from "react";

interface Props {
  placeholder: string;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
}

const Search: FC<Props> = ({ placeholder, searchTerm, onSearch }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch("");
  };

  return (
    <div className="relative flex items-center">
      <input
        className="w-full flex-1 rounded-md border border-white/20 bg-gray-900 px-4 py-3 pr-10 text-[14px] leading-3 text-white"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
      />

      {searchTerm && (
        <XMarkIcon
          className="absolute right-4 cursor-pointer text-neutral-300 hover:text-neutral-400 w-6 h-6"
          onClick={clearSearch}
        />
      )}
    </div>
  );
};

export default Search;
