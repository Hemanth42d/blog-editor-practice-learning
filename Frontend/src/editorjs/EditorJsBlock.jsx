import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef, useState } from "react";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import TextVariantTune from "@editorjs/text-variant-tune";
import EditorjsList from "@editorjs/list";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Code from "@editorjs/code";
import Table from "@editorjs/table";
import ImageTool from "@editorjs/image";
import { debounce } from "lodash";
import { blogAPI } from "../services/api";

const EditorJSBlock = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [fetchedBlog, setFetchedBlog] = useState(null);

  useEffect(() => {
    let storedData = null;
    try {
      const raw = localStorage.getItem("blogContent");
      storedData = raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.error("Invalid JSON in localStorage", err);
      localStorage.removeItem("blogContent");
    }

    if (editorRef.current && !editorInstanceRef.current) {
      editorInstanceRef.current = new EditorJS({
        holder: editorRef.current,
        placeholder: "Write your blog...",
        data: storedData || {},

        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            tunes: ["textVariant"],
            config: {
              placeholder: "Enter a header",
              levels: [1, 2, 3, 4, 5, 6],
              defaultLevel: 2,
            },
          },
          paragraph: {
            inlineToolbar: true,
            tunes: ["textVariant"],
            config: {
              placeholder: "Write a paragraph...",
            },
          },
          List: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
              default: "unordered",
            },
          },
          Checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          embed: {
            class: Embed,
            inlineToolbar: false,
            config: {
              services: {
                youtube: {
                  regex:
                    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([\w-]+)/,
                  embedUrl: "https://www.youtube.com/embed/<%= remote_id %>",
                  html: '<iframe width="560" height="315" src="<%= embedUrl %>" frameborder="0" allowfullscreen></iframe>',
                  height: 315,
                  width: 560,
                  id: (groups) => groups[1],
                },
                coub: true,
              },
            },
          },
          Quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a quote",
              captionPlaceholder: "Quote's author",
            },
          },
          Code: {
            class: Code,
            inlineToolbar: true,
            config: {
              placeholder: "Enter code here",
            },
          },
          Table: {
            class: Table,
            inlineToolbar: true,
            config: {
              rows: 2,
              cols: 3,
              maxRows: 5,
              maxCols: 5,
            },
          },
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: "http://localhost:8008/uploadFile",
                byUrl: "http://localhost:8008/fetchUrl",
              },
            },
          },
          link: LinkTool,
          marker: Marker,
          inlineCode: InlineCode,
          textVariant: TextVariantTune,
        },

        autofocus: true,
        inlineToolbar: true,

        onChange: () => {
          debouncedSave();
        },

        onReady: () => {
          console.log("Editor.js is ready!");
        },
      });
    }
  }, []);

  const saveToLocalStorage = async () => {
    if (editorInstanceRef.current) {
      const data = await editorInstanceRef.current.save();
      localStorage.setItem("blogContent", JSON.stringify(data));
      console.log("Auto-saved to localStorage");
    }
  };

  const debouncedSave = useRef(debounce(saveToLocalStorage, 5000)).current;

  const handleSave = async () => {
    if (editorInstanceRef.current) {
      try {
        const savedData = await editorInstanceRef.current.save();
        localStorage.setItem("blogContent", JSON.stringify(savedData));
        console.log("Saved to localStorage:", savedData);

        //basically i craeted a new blog on every save ideally it not the case like if id is their in db then update it if not then create new one

        const response = await blogAPI.createBlog({
          title: "My First Blog",
          author: "Hemanth",
          content: savedData,
        });

        if (response.success) {
          console.log("Blog saved to database:", response.data);
        } else {
          console.log("Failed to save blog");
        }
      } catch (error) {
        console.error("Error saving blog:", error);
      }
    }
  };

  const handleFetchBlog = async () => {
    try {
      const response = await blogAPI.getBlogById("689f280ffecb629e05b594d7");

      if (response.success && response.data) {
        console.log("Fetched blog:", response.data);

        // Optionally load the fetched content into the editor
        if (editorInstanceRef.current && response.data.content) {
          await editorInstanceRef.current.render(response.data.content);
        }
      } else {
        setFetchedBlog(null);
      }
    } catch (error) {
      console.error("Error fetching blog:", error);
      setFetchedBlog(null);
    }
  };

  const testConnection = async () => {
    try {
      const result = await blogAPI.testConnection();
      console.log("API connection test:", result);
    } catch (error) {
      console.error("API connection failed:", error);
    }
  };

  return (
    <div className="p-5 m-2">
      <div className="my-5 text-2xl text-white">Create Your Blog Here</div>

      <div
        ref={editorRef}
        className="prose prose-invert border p-4 bg-white text-black max-w-[80vw] min-h-[80vh] rounded-2xl"
        id="editorjs"
      />

      <div className="mt-4 flex gap-4 items-center flex-wrap">
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="px-4 py-2 text-white rounded cursor-pointer transition-colors bg-blue-600 hover:bg-blue-700"
        >
          Save Blog to Database
        </button>

        <button
          onClick={handleFetchBlog}
          disabled={isLoading}
          className="px-4 py-2 text-white rounded cursor-pointer transition-colors bg-green-600 hover:bg-green-700"
        >
          Fetch Blog from DB
        </button>
      </div>

      {/* Display fetched blog information */}
      {fetchedBlog && (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold text-white mb-2">
            Fetched Blog Details:
          </h3>
          <div className="text-gray-300 space-y-2">
            <p>
              <strong>Title:</strong> {fetchedBlog.title}
            </p>
            <p>
              <strong>Author:</strong> {fetchedBlog.author}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(fetchedBlog.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>ID:</strong> {fetchedBlog._id}
            </p>
            <p>
              <strong>Content Blocks:</strong>{" "}
              {fetchedBlog.content?.blocks?.length || 0}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorJSBlock;
