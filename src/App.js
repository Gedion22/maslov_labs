import './App.css';
import React, {useEffect, useState} from 'react'
import bwipjs from "bwip-js";
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import Tesseract from 'tesseract.js';
import { Database } from './Database';
import { AlertDialog } from './Dialog';
import InputAdornment from '@material-ui/core/InputAdornment';
import {AddDialog} from "./AddDialog";

function App() {

  const [ text, setText] = useState('');
  const [ binary, setBinary] = useState([]);
  const [ hex, setHex] = useState(false);
  const [ product, setProduct] = useState(null);
  const [ findError, setFindError] = useState('');

  useEffect(()=>{
    let arr = [];
    try {
      for(let i = 0; i < text.length; i++){
        let str = '';
        let hexStr = parseInt(text[i], 16).toString(2);
        if(hexStr.length < 4){
          for(let i = 0; i < 4 - hexStr.length; i++){
            str += '0';
          }
        }
        arr.push(str + parseInt(text[i], 16).toString(2))
      }
      setBinary(arr)
      let canvas = bwipjs.toCanvas("mycanvas", {
        bcid: "plessey", // Barcode type
        text: text, // Text to encode
        scale: 3, // 3x scaling factor
        height: 10, // Bar height, in millimeters
        includetext: true, // Show human-readable text
        textxalign: "center" // Always good to set this
      });
    } catch (e) {
      console.log(e);
    }

  }, [product]);

  const download = () => {
    let canvas = document.getElementById("mycanvas");
    let image = canvas.toDataURL("image/png");
    let el = document.getElementById("download");
    el.href = image;
  };
  const onChangeTextInput = (event)=> {
    try {
      const re = /[0-9A-F]*/g;
      if (event.target.value.match(re).length === 2 && event.target.value.match(re)[0]) {
        setHex(true);
        setText(event.target.value);
        setFindError('')
      } else if (event.target.value){
        setHex(false);
        setFindError('Barcode not hex')
      }
    } catch (e) {
      console.log(e);
    }
  };
  const findClick = () => {
    try {
      setProduct(Database.findProduct(text));
      setFindError('')
    } catch (e) {
      setProduct(null);
      setFindError(e.message)
    }
  };

  const fileOnChange = async (event) => {
    setProduct(null);
    setFindError('');
    Tesseract.recognize(event.target.files[0], 'eng', {
      logger: data => console.log(data),
    }).then(({ data: {text }}) => {
      const barcode = text.replace(/\s/g, "")
      setText(barcode);
      try {
        setProduct(Database.findProduct(barcode));
        setFindError('')
      } catch (e) {
        setProduct(null);
        setFindError(e.message)
      }
    })
  };

  const deleteOnClick = () =>{
    try{
      Database.deleteProduct(text);
      setProduct(null);
      setFindError('')
    }catch (e) {
      setFindError(e.message)
    }
  };

  return (
      <div className="App">
        <body className="App-header">
        <p>Maslov KP-01mp</p>
        <p>Variant 14 - Plessey</p>
        <div>
          <AddDialog />
          <form className={'root'} noValidate autoComplete="off">
            <InputLabel htmlFor="standard-adornment-password">Find</InputLabel>
            <FilledInput onChange={(event)=> onChangeTextInput(event)} id="outlined-basic" label="Find" variant="outlined" endAdornment={
              <InputAdornment position="end">
                <Button onClick={findClick} disabled={!hex} variant="outlined" color="primary">
                  Find
                </Button>
                <AlertDialog />
              </InputAdornment>
            } />
          </form>
          {findError && <p>{findError}</p>}
          {product && <div>
            <p>{'Name: '+product.name}</p>
            <p>{'Price: '+product.price}</p>
            <p>{'Barcode: '+product.barcode}</p>
            {text && product && <canvas id="mycanvas"/>}
            {product && <p>{binary.join(' ')}</p>}
            {product && <a style={{ textDecoration: 'none', marginBottom: 20 }} id="download" download="barcode.png" href="" onClick={()=>download()}>
              <Button variant="contained" color="primary">
                Download
              </Button></a>}
            {product && <Button style={{marginLeft: 10}} onClick={deleteOnClick} variant="contained" color="primary">
              Delete
            </Button>}
          </div>}
        </div>
        <div>
          <p>Decode BarCode</p>
          <input type='file' id='multi' onChange={async (event)=>await fileOnChange(event)} />
        </div>
        </body>
      </div>
  );
}

export default App;
