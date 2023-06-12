import React from "react";
import { Image as AtomImage } from "../atom";
import imagePlaceholder from "@beacas-editor/assets/images/image-placeholder.png";

import { NodeUtils, BlockManager, ElementType } from "beacas-core";

const block = BlockManager.getBlockByType(ElementType.IMAGE);

export class Image extends AtomImage {
  static defaultAttributes = {
    ...block.defaultData.attributes,
  };

  getAttribute(name: string): string {
    if (name === "src") {
      const url = this.attributes["src"]?.trim();
      if (!url) {
        return imagePlaceholder;
      }
      if (NodeUtils.isMergeTag(url)) {
        return imagePlaceholder;
      }
    }
    return (this.attributes as any)[name];
  }

  renderElement() {
    return this.renderWithColumn(
      <table
        {...this.htmlAttributes({
          border: "0",
          cellpadding: "0",
          cellspacing: "0",
          role: "presentation",
          style: "table",
          class: this.getAttribute("fluid-on-mobile")
            ? "mj-full-width-mobile"
            : null,
        })}
      >
        <tbody>
          <tr>
            <td
              {...this.htmlAttributes({
                style: "td",
                class: this.getAttribute("fluid-on-mobile")
                  ? "mj-full-width-mobile"
                  : null,
              })}
            >
              {this.renderImage()}
            </td>
          </tr>
        </tbody>
        <style>{this.headStyle}</style>
      </table>
    );
  }
}

// const ImagePlaceholderContent = (
//   props: BaseElementProps<StandardImageElement>
// ) => {
//   const [isLoading, setIsUploading] = useState(false);
//   const [inputImage, setInputImage] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [position, setPosition] = useState({ left: 0, top: 0 });
//   const placeholderRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!visible) return;

//     const onKeydown = (ev: KeyboardEvent) => {
//       if (ev.code === "Escape") {
//         setVisible(false);
//       }
//     };

//     const onBlur = () => {
//       setVisible(false);
//     };

//     const root = ReactEditor.getWindow(props.editor);
//     root.addEventListener("mousedown", onBlur);
//     root.addEventListener("keydown", onKeydown);
//     return () => {
//       root.removeEventListener("mousedown", onBlur);
//       root.removeEventListener("keydown", onKeydown);
//     };
//   }, [props.editor, visible]);

//   const onUpload = () => {
//     const uploader = new Uploader(services.upload, {
//       limit: 1,
//       accept: "image/*",
//     });

//     uploader.on("start", (photos) => {
//       setIsUploading(true);

//       uploader.on("end", (data) => {
//         const url = data[0]?.url;
//         if (url) {
//           setVisible(false);
//           Transforms.setNodes(
//             props.editor,
//             {
//               attributes: { ...props.element.attributes, src: url },
//             },
//             {
//               at: ReactEditor.findPath(props.editor, props.element),
//             }
//           );
//         }
//         setIsUploading(false);
//       });
//     });

//     uploader.chooseFile();
//   };

//   const onEmbedImage = () => {
//     setVisible(false);
//     Transforms.setNodes(
//       props.editor,
//       {
//         attributes: { ...props.element.attributes, src: inputImage },
//       },
//       {
//         at: ReactEditor.findPath(props.editor, props.element),
//       }
//     );
//   };

//   const onToggle: React.DOMAttributes<HTMLDivElement>["onClick"] = (ev) => {
//     ev.stopPropagation();

//     if (!placeholderRef.current) return;
//     if (visible) {
//       setVisible(false);
//       return;
//     }
//     const domNode = placeholderRef.current;

//     const rect = domNode.getBoundingClientRect();

//     if (rect) {
//       setPosition({
//         top: rect.top + rect.height + 10,
//         left: rect.left,
//       });
//       setVisible(true);
//     }
//   };

//   const noSrc = !props.element.attributes.src;
//   const popoverContent = (
//     <>
//       {createPortal(
//         <div
//           className="beacas-overlay"
//           style={{
//             width: 500,
//             display: visible ? undefined : "none",
//             left: position.left,
//             top: position.top,
//           }}
//         >
//           <Tabs className="standard-image-Popover-tabs">
//             <Tabs.TabPane title="Upload" key="Upload">
//               <div style={{ padding: 15 }}>
//                 <Button
//                   style={{ width: "100%" }}
//                   type="outline"
//                   onClick={onUpload}
//                   loading={isLoading}
//                 >
//                   Upload file
//                 </Button>
//               </div>
//             </Tabs.TabPane>
//             <Tabs.TabPane title="Embed link" key="Embed link">
//               <div style={{ padding: 15 }}>
//                 <Space direction="vertical" style={{ width: "100%" }}>
//                   <Input
//                     placeholder="Paste the image link…"
//                     value={inputImage}
//                     onChange={setInputImage}
//                   />
//                   <Button type="primary" onClick={onEmbedImage}>
//                     Embed image
//                   </Button>
//                 </Space>
//               </div>
//             </Tabs.TabPane>
//           </Tabs>
//         </div>,
//         document.body
//       )}
//       <div
//         ref={placeholderRef}
//         onClick={onToggle}
//         onMouseDown={(e) => e.stopPropagation()}
//         contentEditable={false}
//         className="standard-image"
//         style={{
//           padding: noSrc ? "12px 36px 12px 12px" : undefined,
//           display: "flex",
//           alignItems: "center",
//           textAlign: "left",
//           width: noSrc ? "100%" : 0,
//           height: noSrc ? undefined : 0,
//           overflow: "hidden",
//           backgroundColor: "rgb(242, 241, 238)",
//           transition: "background 100ms ease-in",
//           boxSizing: "border-box",
//           position: noSrc ? "relative" : "absolute",
//           top: 0,
//           left: 0,
//           zIndex: 10,
//         }}
//       >
//         <svg
//           viewBox="0 0 30 30"
//           style={{
//             width: "25px",
//             height: "25px",
//             display: "block",
//             fill: "rgba(55, 53, 47, 0.45)",
//             flexShrink: "0",
//             backfaceVisibility: "hidden",
//             marginRight: "12px",
//           }}
//         >
//           <path d="M1,4v22h28V4H1z M27,24H3V6h24V24z M18,10l-5,6l-2-2l-6,8h20L18,10z M11.216,17.045l1.918,1.918l4.576-5.491L21.518,20H9 L11.216,17.045z M7,12c1.104,0,2-0.896,2-2S8.104,8,7,8s-2,0.896-2,2S5.896,12,7,12z" />
//         </svg>
//         <div
//           style={{
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//             textOverflow: "ellipsis",
//             color: "rgba(55, 53, 47, 0.65)",
//             fontSize: 14,
//           }}
//         >
//           Add an image
//         </div>
//       </div>
//     </>
//   );

//   return <>{popoverContent}</>;
// };
