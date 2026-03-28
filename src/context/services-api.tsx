import axios from 'axios';



export const fetchAppleModels = async (brandName: string) => {
    const options = {
  method: 'GET',
  url: `https://mobile-phone-specs-database.p.rapidapi.com/gsm/get-models-by-brandname/${brandName}`,
  headers: {
    'x-rapidapi-key': '31c31d98a4mshb0cf61bc4f9883ep152430jsn8868bd89f53d',
    'x-rapidapi-host': 'mobile-phone-specs-database.p.rapidapi.com'
  }
};
  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.error('Error fetching Apple models:', error);
    throw error;
  }
}
export const fetchAppleModelDetails = async (brandName: string) => {

try {

    const brandModels = (await fetchAppleModels(brandName)).map((model: any) =>  {return model.modelValue});
    const res = await axios.patch("/api/add-accessories",  {models : brandModels , brand : brandName}); // Adjust the endpoint as needed

  return res.data;
} catch (error) {
	console.error(error);
}
}