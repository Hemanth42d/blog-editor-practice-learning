import EditorJsHtml from "editorjs-html";
import { useEffect, useState } from "react";
import { blogAPI } from "../services/api";

const ViewBlog = () => {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await blogAPI.getBlogById("689f2d96fd449a58208dae45");

        if (response.success && response.data) {
          const edjsParser = EditorJsHtml();
          let allHtml = "";
          if (response.data.content && response.data.content.blocks) {
            response.data.content.blocks.forEach((block) => {
              const parsed = edjsParser.parseBlock(block);
              allHtml += parsed;
            });
          }

          setHtmlContent(allHtml);
        } else {
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      }
    };

    fetchBlogData();
  }, []);

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Your Blog</h1>

        <div
          className="prose-blog"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </>
  );
};

export default ViewBlog;
