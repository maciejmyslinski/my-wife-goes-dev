import 'babel-polyfill';
import React, { Fragment, createRef, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import domToImage from 'dom-to-image';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/xml/xml';

const DEFAULT_CODE = `<html>
  <body>
    <div id="root"></div>
    <script src="./index.js"></script>
  </body>
</html>`;

export function App() {
  const carbonNode = createRef();
  const [imgSrc, setImgSrc] = useState('');

  async function generateImage() {
    const node = carbonNode.current;
    const width = node.offsetWidth * 2;
    const height = node.offsetHeight * 2;
    const options = {
      width,
      height,
      style: {
        transform: `scale(2)translate(${node.offsetWidth /
          2}px, ${node.offsetHeight / 2}px)`,
        'transform-origin': 'center',
      },
    };
    const dataUrl = await domToImage.toBlob(carbonNode.current, options);
    return window.URL.createObjectURL(dataUrl);
  }

  async function exportImage() {
    const link = document.createElement('a');
    const url = await generateImage();
    link.href = url;
    link.download = `woah.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  async function handleButtonClick() {
    exportImage();
    const url = await generateImage();
    setImgSrc(url);
  }

  return (
    <Fragment>
      <div
        ref={carbonNode}
        style={{
          position: 'relative',
        }}
      >
        <CodeMirror
          className="CodeMirror__container"
          options={{ theme: 'material', mode: 'xml' }}
          value={DEFAULT_CODE}
        />
      </div>
      <button onClick={handleButtonClick}>Export</button>
      <img style={{ maxWidth: '100vw' }} src={imgSrc} />
    </Fragment>
  );
}
