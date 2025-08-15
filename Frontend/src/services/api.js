const API_BASE_URL = "http://localhost:3000";

export const blogAPI = {
  createBlog: async (blogData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(blogData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  },

  getBlogById: async (blogId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/getblog/${blogId}`);

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        return;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error fetching blog:", error);
      throw error;
    }
  },
};
