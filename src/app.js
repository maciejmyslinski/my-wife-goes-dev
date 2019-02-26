import 'babel-polyfill';
import React, { Fragment, createRef, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import domToImage from 'dom-to-image';
import { highlightAuto } from 'highlight.js';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import './theme.scss';

const DEFAULT_CODE = `const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)

const compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)

const unfold = (f, seed) => {
  const go = (f, seed, acc) => {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
}`;

export function App() {
  const carbonNode = createRef();
  const [imgSrc, setImgSrc] = useState('');
  const [mode, setMode] = useState('javascript');

  async function generateImage() {
    const node = carbonNode.current;
    const width = node.offsetWidth * 2;
    const height = node.offsetHeight * 2;
    const options = {
      width,
      height,
      style: {
        transform: `scale(2) translate(${node.offsetWidth /
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

  function handleCodeChange(editor, data, value) {
    const detectedLanguage = highlightAuto(value).language;
    setMode(detectedLanguage);
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
          options={{ mode, viewportMargin: Infinity, lineWrapping: true }}
          value={DEFAULT_CODE}
          onChange={handleCodeChange}
        />
      </div>
      <button onClick={handleButtonClick}>Export</button>
      <img style={{ maxWidth: '100vw' }} src={imgSrc} />
    </Fragment>
  );
}
