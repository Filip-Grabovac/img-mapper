import { editor } from '@overlapmedia/imagemapper';
import React from 'react';

function ImageMapperEditor({
  options = {},
  style = {},
  cb,
  mode,
  handleShapeClick,
  preDrawnShapes,
}) {
  const elementRef = React.useRef(null);
  const editorRef = React.useRef(null);

  React.useEffect(() => {
    if (!editorRef.current) {
      const editorInstance = editor(elementRef.current, options, style);
      editorRef.current = editorInstance;
      cb && cb(editorInstance);
    }
  }, [options, style, cb]);

  // Listening to property "mode"
  React.useEffect(() => {
    if (mode) {
      switch (mode) {
        case Mode.RECT:
          editorRef.current.rect();
          break;
        case Mode.CIRCLE:
          editorRef.current.circle();
          break;
        case Mode.ELLIPSE:
          editorRef.current.ellipse();
          break;
        case Mode.POLYGON:
          editorRef.current.polygon();
          break;
        case Mode.SELECT:
          editorRef.current.selectMode();
          break;
        default:
      }
    }
  }, [mode]);

  const [width = 750, height = 600] = [options.width, options.height];

  return (
    <svg
      ref={elementRef}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0, 0, ${width}, ${height}`}
      preserveAspectRatio="xMinYMin"
      onClick={(e) => {
        handleShapeClick(e);
      }}
    >
      {preDrawnShapes &&
        preDrawnShapes.map((shape, index) => {
          if (shape.type === 'rectangle') {
            return (
              <rect
                key={`rect_${index}`}
                fill="rgb(102, 102, 102)"
                stroke="rgb(51, 51, 51)"
                cursor="pointer"
                strokeWidth="1"
                opacity="0.5"
                strokeDasharray="none"
                strokeLinejoin="miter"
                id="rect_1"
                width={shape.data.width}
                x={shape.data.x}
                height={shape.data.height}
                y={shape.data.y}
              ></rect>
            );
          } else if (shape.type === 'polygon') {
            return (
              <polygon
                key={`pol_${index}`}
                points={shape.data.points}
                fill="rgb(102, 102, 102)"
                stroke="rgb(51, 51, 51)"
                cursor="pointer"
                strokeWidth="1"
                opacity="0.5"
                strokeDasharray="4 3"
                strokeLinejoin="round"
                id="polygon_3"
              ></polygon>
            );
          }
          return null;
        })}
    </svg>
  );
}

export const Mode = Object.freeze({
  RECT: 'rect',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  POLYGON: 'polygon',
  SELECT: 'selectMode',
});

export default ImageMapperEditor;
