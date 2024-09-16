import axios from "axios";


export const getTab = async () => {
  try {
    const response = await axios.get('https://tabs-53ac1-default-rtdb.firebaseio.com/tab.json');
    return response.data;
  } catch (error) {
    console.log(error);
  }
};


export const getTabId = async (id: string) => {
  try {
    const response = await axios.get(`https://tabs-53ac1-default-rtdb.firebaseio.com/tab/${id}.json`);
	 console.log(response.data)
    return response.data;

  } catch (error) {
    console.log(error);
  }
};
