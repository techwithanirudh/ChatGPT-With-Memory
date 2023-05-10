"use client";
import useSWR from "swr";
import Select from "react-select";

const fetchModels = () => fetch("/api/getEngines").then((res) => res.json());

function ModelSelection() {
  const { data: models, isLoading } = useSWR("models", fetchModels);
  const { data: model, mutate: setModel } = useSWR("model", {
    fallbackData: "gpt-3.5-turbo",
  });

  return (
    <div className="w-full">
			<p className="text-gray-600 dark:text-gray-300 pb-1">Model</p>
      <Select
        options={models?.modelOptions}
        defaultValue={model}
        placeholder={model}
        isSearchable
        isLoading={isLoading}
        menuPosition="fixed"
        className="select-container"
        classNamePrefix="select"
        onChange={(e) => setModel(e.value)}
      />
    </div>
  );
}

export default ModelSelection;
