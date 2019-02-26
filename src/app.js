import 'babel-polyfill';
import React, { Fragment, createRef, useState } from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import domToImage from 'dom-to-image';
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import './theme.scss';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

const DEFAULT_CODE = `const pluckDeep = key => obj => key.split('.').reduce((accum, key) => accum[key], obj)

const compose = (...fns) => res => fns.reduce((accum, next) => next(accum), res)

const unfold = (f, seed) => {
  const go = (f, seed, acc) => {
    const res = f(seed)
    return res ? go(f, res[1], acc.concat([res[0]])) : acc
  }
  return go(f, seed, [])
}`;

const BG_COLORS = {
  xml: '#D8E2DC',
  css: '#FFCAD4',
  javascript: '#A899D8',
};

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
    const detectedLanguage = hljs.highlightAuto(value).language;
    setMode(detectedLanguage);
  }

  const bgColor = BG_COLORS[mode];

  return (
    <Fragment>
      <div ref={carbonNode}>
        <div
          style={{
            padding: '40px',
            backgroundColor: bgColor,
          }}
        >
          <CodeMirror
            className="CodeMirror__container"
            options={{ mode, viewportMargin: Infinity, lineWrapping: true }}
            value={DEFAULT_CODE}
            onChange={handleCodeChange}
          />
        </div>
      </div>
      <button onClick={handleButtonClick}>Export</button>
      <img style={{ maxWidth: '100vw' }} src={imgSrc} />
    </Fragment>
  );
}
