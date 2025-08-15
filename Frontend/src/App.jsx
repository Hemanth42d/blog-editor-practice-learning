import EditorJSBlock from "./editorjs/EditorJsBlock";
import ViewBlog from "./editorjs/ViewBlog";

function App() {
  return (
    <div className="w-full h-full">
      <EditorJSBlock />

      <div className="text-white max-w-[80vw] m-auto">
        <p className="text-4xl">view the Blog</p>
        <ViewBlog />
      </div>
    </div>
  );
}

export default App;
