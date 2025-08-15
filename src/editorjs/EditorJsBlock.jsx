import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
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

const EditorJSBlock = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !editorInstanceRef.current) {
      editorInstanceRef.current = new EditorJS({
        holder: editorRef.current,
        placeholder: "write your blog",

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
              placeholder: "Enter Paragrap",
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
                coub: true, // Optional
              },
            },
          },
          Quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              placeholder: "Enter a Quote",
              captionPlaceholder: "Quote's author",
            },
          },
          Code: {
            class: Code,
            inlineToolbar: true,
            config: {
              placeholder: "Enter code",
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

        inlineToolbar: true,

        onReady: () => {
          console.log("Editor.js is ready");
        },
      });
    }
  }, []);

  return (
    <div className="p-5 m-2">
      <div className="my-5 text-2xl text-white">Create Your Blog Here</div>
      <div
        ref={editorRef}
        className="prose prose-invert border p-4 bg-white text-black max-w-[80vw] min-h-screen rounded-2xl"
        id="editorjs"
      />
    </div>
  );
};

export default EditorJSBlock;
