const createRequestBody = () => {
  const requestBody = {};

  if (sessionStorage.getItem("Lab Name") != null) {
    requestBody.lab_name = JSON.parse(sessionStorage.getItem("Lab Name"));
  }
  if (sessionStorage.getItem("Main Food Category") != null) {
    requestBody.main_food_category = JSON.parse(
      sessionStorage.getItem("Main Food Category")
    );
  }
  if (sessionStorage.getItem("Test Sub Category") != null) {
    requestBody.test_sub_category = JSON.parse(
      sessionStorage.getItem("Test Sub Category")
    );
  }

  return requestBody;
};

export default createRequestBody;
    