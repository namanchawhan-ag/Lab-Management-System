export const getUniqueValues = (labData) => {
  if (!labData) return [];
  if (!Array.isArray(labData)) {
    return [];
  }

  return {
    lab_names: [...new Set(labData.map((item) => item.lab_name))],
    main_food_category: [
      ...new Set(labData.map((item) => item.main_food_category)),
    ],
    test_sub_category: [
      ...new Set(labData.map((item) => item.test_sub_category)),
    ],
  };
};

export const getDropdowns = (uniqueValues) => {
  if (!uniqueValues?.lab_names) return [];
  return [
    {
      name: "Lab Name",
      options: uniqueValues.lab_names || [],
    },
    {
      name: "Main Food Category",
      options: uniqueValues.main_food_category || [],
    },
    {
      name: "Test Sub Category",
      options: uniqueValues.test_sub_category || [],
    },
  ];
};

export const getGridItems = (uniqueValues, labData) => {
  if (!uniqueValues?.lab_names) return [];
  if (!Array.isArray(labData)) return [];

  return [
    { id: 1, name: "Total Labs", value: uniqueValues.lab_names.length },
    { id: 2, name: "Unique Parameters", value: labData.length },
    {
      id: 3,
      name: "Food Categories",
      value: uniqueValues.main_food_category.length,
    },
    {
      id: 4,
      name: "Test Categories",
      value: uniqueValues.test_sub_category.length,
    },
  ];
};
